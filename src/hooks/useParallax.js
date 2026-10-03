import { useEffect, useRef } from 'react'

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Вызывает onFrame(scrollY) не чаще одного раза за кадр.
export function useScrollFrame(onFrame) {
  const cb = useRef(onFrame)
  cb.current = onFrame

  useEffect(() => {
    if (reducedMotion()) return
    let ticking = false
    const update = () => {
      ticking = false
      cb.current(window.scrollY)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

// Смещает элемент по Y со скоростью speed относительно скролла
// (положительная — медленнее страницы, отрицательная — быстрее).
export function useParallax(speed = 0.2) {
  const ref = useRef(null)
  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const rect = el.parentElement.getBoundingClientRect()
    const center = rect.top + rect.height / 2 - window.innerHeight / 2
    el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`
  })
  return ref
}
