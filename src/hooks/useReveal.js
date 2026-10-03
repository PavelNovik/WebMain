import { useEffect } from 'react'

// Добавляет класс .is-visible элементам с [data-reveal], когда они попадают в экран.
// key — перезапуск после смены языка (появляются новые элементы).
export function useReveal(key) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-visible)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}
