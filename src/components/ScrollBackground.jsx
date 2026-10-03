import { useEffect, useRef, useState } from 'react'
import { video } from '../config.js'
import frames from '../generated/frames.json'

const clamp = (v) => Math.min(Math.max(v, 0), 1)
const pad = (n) => String(n).padStart(3, '0')

// Прогресс «истории» 0..1: от верха страницы до момента, когда раздел контактов
// поднимается к середине экрана — дерево к этому времени полностью в плодах.
function scrollProgress() {
  const end = document.getElementById(video.scrubUntil)
  const endY = end
    ? end.getBoundingClientRect().top + window.scrollY - window.innerHeight * video.scrubEndOffset
    : document.documentElement.scrollHeight - window.innerHeight
  return clamp(window.scrollY / Math.max(endY, 1))
}

const pickSet = () => (window.innerWidth / window.innerHeight < video.mobileMaxAspect ? 'mobile' : 'desktop')

// Порядок загрузки: первый и последний кадр, затем середина, четверти и т.д. —
// грубая версия «истории» доступна почти сразу, детали догружаются.
function loadOrder(n) {
  const order = [0, n - 1]
  const seen = new Set(order)
  for (let step = n - 1; step > 1; step = Math.ceil(step / 2)) {
    for (let i = 0; i < n; i += step / 2) {
      const k = Math.round(i)
      if (!seen.has(k) && k < n) {
        seen.add(k)
        order.push(k)
      }
    }
  }
  for (let k = 0; k < n; k++) if (!seen.has(k)) order.push(k)
  return order
}

export default function ScrollBackground() {
  const layer = useRef(null)
  const canvas = useRef(null)
  const [set, setSet] = useState(null) // 'desktop' | 'mobile' — выбирается на клиенте
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches
    if (mobile && !video.enableOnMobile) return
    const update = () => setSet(pickSet())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!set) return
    const cvs = canvas.current
    const ctx = cvs.getContext('2d')
    const { width, height } = frames[set]
    cvs.width = width
    cvs.height = height

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const n = frames.count
    const images = new Array(n) // загруженные и декодированные кадры
    let cancelled = false
    let current = null // текущая позиция (в кадрах), плавно догоняет целевую
    let drawn = null
    let raf = 0

    const nearest = (i, dir) => {
      for (let k = i; k >= 0 && k < n; k += dir) if (images[k]) return k
      return -1
    }

    const draw = (pos) => {
      const i = Math.floor(pos)
      const t = pos - i
      // ближайшие загруженные кадры слева и справа
      const a = nearest(i, -1) >= 0 ? nearest(i, -1) : nearest(i, 1)
      const b = nearest(Math.min(i + 1, n - 1), 1)
      if (a < 0) return false
      ctx.globalAlpha = 1
      ctx.drawImage(images[a], 0, 0, width, height)
      if (b > a) {
        // плавный переход между соседними кадрами
        const alpha = b === a + 1 ? t : clamp((pos - a) / (b - a))
        if (alpha > 0.004) {
          ctx.globalAlpha = alpha
          ctx.drawImage(images[b], 0, 0, width, height)
        }
      }
      return true
    }

    const tick = () => {
      raf = 0
      const p = scrollProgress()

      // Лёгкий параллакс слоя: фон отстаёт от контента и чуть приближается
      if (layer.current && !reduced) {
        layer.current.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}vh, 0) scale(${(1.12 + p * 0.06).toFixed(3)})`
      }

      const target = p * (n - 1)
      current = current === null || reduced ? target : current + (target - current) * video.scrubSmoothing
      if (Math.abs(target - current) < 0.002) current = target
      if (drawn === null || Math.abs(current - drawn) > 0.001) {
        if (draw(current)) drawn = current
      }
      if (current !== target) raf = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Загрузка кадров, не более 4 одновременно, в порядке приоритета
    const queue = loadOrder(n)
    const loadNext = () => {
      const k = queue.shift()
      if (k === undefined || cancelled) return
      const img = new Image()
      img.decoding = 'async'
      img.src = `${video.framesDir}/${set}/f${pad(k + 1)}.${frames.ext}`
      img
        .decode()
        .then(() => {
          if (cancelled) return
          images[k] = img
          if (k === 0) setReady(true)
          drawn = null // перерисовать с учётом нового кадра
          schedule()
        })
        .catch(() => {})
        .finally(loadNext)
    }
    for (let j = 0; j < 4; j++) loadNext()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [set])

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__layer" ref={layer}>
        <div className="bg__fallback" />
        <canvas ref={canvas} className={`bg__frames ${ready ? 'is-ready' : ''}`} />
      </div>
      <div className="bg__overlay" />
      <div className="bg__grain" />
    </div>
  )
}
