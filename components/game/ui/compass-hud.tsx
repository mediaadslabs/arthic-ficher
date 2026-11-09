'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { LOCATIONS } from '@/lib/game/world-data'
import type { Location } from '@/lib/game/types'

interface LocationDot {
  location: Location
  angle: number
  distance: number
  isNearby: boolean
}

export function CompassHUD() {
  const { player } = useGameStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  
  const playerPos = player?.position ?? { x: 0, y: 0, z: 0 }
  const playerRot = player?.rotation ?? { x: 0, y: 0, z: 0 }

  const locationDots = useMemo(() => {
    return LOCATIONS.map((loc) => {
      const dx = loc.position.x - playerPos.x
      const dz = loc.position.z - playerPos.z
      const distance = Math.sqrt(dx * dx + dz * dz)
      const angle = Math.atan2(dx, dz)
      const isNearby = distance < 10
      return { location: loc, angle, distance, isNearby }
    })
  }, [playerPos.x, playerPos.z])

  useEffect(() => {
    const draw = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const radius = 40
      const heading = playerRot.y

      // Clear
      ctx.clearRect(0, 0, w, h)

      // Background circle
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Inner ring
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Player heading indicator
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-heading)
      
      // North arrow
      ctx.beginPath()
      ctx.moveTo(0, -radius + 2)
      ctx.lineTo(-4, -radius + 10)
      ctx.lineTo(4, -radius + 10)
      ctx.closePath()
      ctx.fillStyle = '#ef4444'
      ctx.fill()

      // Player dot
      ctx.beginPath()
      ctx.arc(0, 0, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#06b6d4'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()

      // Direction markers
      const dirs = ['N', 'E', 'S', 'W']
      const dirColors = ['#ef4444', '#94a3b8', '#94a3b8', '#94a3b8']
      dirs.forEach((dir, i) => {
        const angle = (i * Math.PI) / 2 - Math.PI / 2
        const x = Math.sin(angle) * (radius - 5)
        const y = -Math.cos(angle) * (radius - 5)
        ctx.fillStyle = dirColors[i]
        ctx.font = 'bold 8px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(dir, x, y)
      })

      // Location dots
      const colorMap: Record<string, string> = {
        inn: '#f59e0b',
        marketplace: '#10b981',
        dock: '#6366f1',
        fishing_zone: '#06b6d4',
        garage: '#8b5cf6',
        treasure_hunt: '#f97316',
        repair: '#ef4444',
        crew: '#0ea5e9',
        challenges: '#eab308',
      }

      locationDots.forEach((dot) => {
        // Only show locations within 200 units
        if (dot.distance > 200) return

        // Calculate position on compass (clamped to edge)
        const relativeAngle = dot.angle - heading
        const clampedDist = Math.min(dot.distance / 200, 0.85)
        const x = Math.sin(relativeAngle) * radius * clampedDist
        const y = -Math.cos(relativeAngle) * radius * clampedDist

        // Dot
        ctx.beginPath()
        ctx.arc(x, y, dot.isNearby ? 4 : 2.5, 0, Math.PI * 2)
        ctx.fillStyle = colorMap[dot.location.type] ?? '#666'
        ctx.fill()

        if (dot.isNearby) {
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.strokeStyle = colorMap[dot.location.type] ?? '#666'
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.5
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })

      ctx.restore()

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [playerRot.y, locationDots])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        className="rounded-full"
      />
    </div>
  )
}
