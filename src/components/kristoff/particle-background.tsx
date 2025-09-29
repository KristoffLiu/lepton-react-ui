

import { useRef, useEffect } from "react"

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  size: number
}

interface ParticleBackgroundProps {
  // 粒子相关参数
  particleCount?: number
  particleSize?: number
  particleColor?: string
  particleOpacity?: number
  particleSpeed?: number

  // 连线相关参数
  lineColor?: string
  lineOpacity?: number
  lineWidth?: number
  connectionDistance?: number

  // 背景相关参数
  backgroundColor?: string

  // 交互相关参数
  mouseInteraction?: boolean
  mouseRadius?: number

  // 其他
  className?: string
}

export default function ParticleBackground({
  particleCount = 100,
  particleSize = 3,
  particleColor = "#6366f1",
  particleOpacity = 0.7,
  particleSpeed = 1,
  lineColor = "#6366f1",
  lineOpacity = 0.2,
  lineWidth = 1,
  connectionDistance = 150,
  backgroundColor = "transparent",
  mouseInteraction = true,
  mouseRadius = 150,
  className = "",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const animationFrameId = useRef<number>(0)

  // 初始化画布尺寸和粒子
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateDimensions = () => {
      if (canvas && canvas.parentElement) {
        const { width, height } = canvas.parentElement.getBoundingClientRect()
        dimensionsRef.current = { width, height }
        canvas.width = width
        canvas.height = height

        // 初始化粒子
        initParticles()
      }
    }

    const initParticles = () => {
      const { width, height } = dimensionsRef.current
      if (width === 0 || height === 0) return

      const newParticles: Particle[] = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          dx: (Math.random() - 0.5) * particleSpeed,
          dy: (Math.random() - 0.5) * particleSpeed,
          size: Math.random() * particleSize + 1,
        })
      }

      particlesRef.current = newParticles
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    // 鼠标交互
    const handleMouseMove = (e: MouseEvent) => {
      if (canvas && mouseInteraction) {
        const rect = canvas.getBoundingClientRect()
        mousePositionRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
    }

    const handleMouseLeave = () => {
      mousePositionRef.current = null
    }

    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseleave", handleMouseLeave)
    }

    // 动画循环
    const animate = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const { width, height } = dimensionsRef.current
      ctx.clearRect(0, 0, width, height)

      // 设置背景色
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
      }

      // 更新和绘制粒子
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // 更新位置
        particle.x += particle.dx
        particle.y += particle.dy

        // 边界检查
        if (particle.x < 0 || particle.x > width) {
          particle.dx = -particle.dx
        }

        if (particle.y < 0 || particle.y > height) {
          particle.dy = -particle.dy
        }

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particleColor}${Math.floor(particleOpacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()

        // 检查连接
        for (let j = i + 1; j < particles.length; j++) {
          const particle2 = particles[j]
          const dx = particle.x - particle2.x
          const dy = particle.y - particle2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            // 根据距离计算线条透明度
            const opacity = (1 - distance / connectionDistance) * lineOpacity

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particle2.x, particle2.y)
            ctx.strokeStyle = `${lineColor}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = lineWidth
            ctx.stroke()
          }
        }

        // 鼠标交互
        const mousePosition = mousePositionRef.current
        if (mousePosition && mouseInteraction) {
          const dx = particle.x - mousePosition.x
          const dy = particle.y - mousePosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            // 根据距离计算线条透明度
            const opacity = (1 - distance / mouseRadius) * lineOpacity * 1.5

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(mousePosition.x, mousePosition.y)
            ctx.strokeStyle = `${lineColor}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = lineWidth
            ctx.stroke()

            // 向鼠标方向轻微移动粒子
            const force = (mouseRadius - distance) / mouseRadius
            particle.x += dx * 0.02 * force
            particle.y += dy * 0.02 * force
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [
    particleCount,
    particleSize,
    particleColor,
    particleOpacity,
    particleSpeed,
    lineColor,
    lineOpacity,
    lineWidth,
    connectionDistance,
    backgroundColor,
    mouseInteraction,
    mouseRadius,
  ])

  return <canvas ref={canvasRef} className={`absolute inset-0 z-10 ${className}`} />
}

export { ParticleBackground }
