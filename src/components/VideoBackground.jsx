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

  const showVideo = allowed && !failed

  // Загрузка видео, в т.ч. на iPhone:
  // - Safari на iOS игнорирует preload и не грузит видео без воспроизведения, поэтому
  //   стоит muted autoplay, а при первом же 'playing' ставим паузу — кадрами управляет скролл;
  // - в режиме энергосбережения iOS автозапуск запрещён — грузим по первому касанию;
  // - HTML пререндерен, и события могли случиться до гидрации — проверяем readyState вручную.
  useEffect(() => {
    const v = videoEl.current
    if (!v) return
    if (v.error) {
      setFailed(true)
      return
    }
    const gestures = ['touchend', 'pointerup', 'click', 'keydown']

    const markReady = () => {
      if (v.readyState >= 2) setReady(true)
    }
    const stop = () => v.pause()
    const unlock = () => {
      if (v.readyState >= 2) return removeGestures()
      v.play().then(() => v.pause()).catch(() => {})
    }
    const removeGestures = () => gestures.forEach((g) => window.removeEventListener(g, unlock))

    ;['loadeddata', 'canplay', 'seeked'].forEach((e) => v.addEventListener(e, markReady))
    v.addEventListener('playing', stop)
    gestures.forEach((g) => window.addEventListener(g, unlock, { passive: true }))

    if (!v.paused && v.readyState >= 3) v.pause() // автозапуск успел начаться до гидрации
    if (v.readyState === 0 && v.networkState === v.NETWORK_IDLE) v.load()
    markReady()

    return () => {
      ;['loadeddata', 'canplay', 'seeked'].forEach((e) => v.removeEventListener(e, markReady))
      v.removeEventListener('playing', stop)
      removeGestures()
    }
  }, [showVideo])

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
            autoPlay
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="bg__overlay" />
      <div className="bg__grain" />
    </div>
  )
}
