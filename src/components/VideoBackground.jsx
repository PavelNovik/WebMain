import { useEffect, useRef, useState } from 'react'
import { video } from '../config.js'

const clamp = (v) => Math.min(Math.max(v, 0), 1)

// Прогресс «истории» 0..1: от верха страницы до момента, когда раздел контактов
// поднимается к середине экрана — дерево к этому времени полностью в плодах.
function scrollProgress() {
  const end = document.getElementById(video.scrubUntil)
  const endY = end
    ? end.getBoundingClientRect().top + window.scrollY - window.innerHeight * video.scrubEndOffset
    : document.documentElement.scrollHeight - window.innerHeight
  return clamp(window.scrollY / Math.max(endY, 1))
}

export default function VideoBackground() {
  const layer = useRef(null)
  const videoEl = useRef(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(true)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches
    if (mobile && !video.enableOnMobile) setAllowed(false)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = 0 // текущая позиция видео (сек), плавно догоняет целевую
    let raf = 0

    const tick = () => {
      raf = 0
      const p = scrollProgress()

      // Лёгкий параллакс слоя: видео отстаёт от контента и чуть приближается
      if (layer.current && !reduced) {
        layer.current.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}vh, 0) scale(${(1.12 + p * 0.06).toFixed(3)})`
      }

      const v = videoEl.current
      if (!v || !v.duration) return
      const target = p * (v.duration - 0.05)
      current = reduced ? target : current + (target - current) * video.scrubSmoothing
      const diff = Math.abs(target - current)

      // Не ставим новую перемотку, пока браузер не закончил предыдущую
      if (!v.seeking && Math.abs(v.currentTime - current) > 0.01) v.currentTime = current
      if (diff > 0.005 || v.seeking) raf = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    // при загрузке видео сразу выставить кадр под текущую позицию страницы
    const v = videoEl.current
    v?.addEventListener('loadedmetadata', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      v?.removeEventListener('loadedmetadata', schedule)
    }
  }, [allowed, failed, ready])

  const onLoaded = () => {
    const v = videoEl.current
    // iOS Safari показывает кадры при перемотке только после первого play()
    v.play().then(() => v.pause()).catch(() => {})
    setReady(true)
  }

  const showVideo = allowed && !failed

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__layer" ref={layer}>
        <div className="bg__fallback" />
        {showVideo && (
          <video
            ref={videoEl}
            className={`bg__video ${ready ? 'is-ready' : ''}`}
            src={video.src}
            poster={video.poster || undefined}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            onLoadedData={onLoaded}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="bg__overlay" />
      <div className="bg__grain" />
    </div>
  )
}
