'use client'
import { useEffect, useRef } from 'react'
export default function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`fade-in ${delay ? `fade-in-delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  )
}
