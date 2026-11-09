'use client'

import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/game/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Radar, MapPin, Waves, ArrowDown, Target, Compass } from 'lucide-react'

interface SonarPing {
  id: number
  x: number
  y: number
  strength: number
  type: 'fish' | 'wreck' | 'treasure' | 'artifact'
  depth: number
}

export function SonarUI() {
  const { player, getCurrentBoat } = useGameStore()
  const [active, setActive] = useState(false)
  const [pings, setPings] = useState<SonarPing[]>([])
  const [sweepAngle, setSweepAngle] = useState(0)
  const [depth, setDepth] = useState(0)
  const [signalStrength, setSignalStrength] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  const boat = getCurrentBoat()
  const hasSonar = boat ? boat.upgrades.radar > 0 : false

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) / 2 - 10

      // Clear
      ctx.fillStyle = '#0a0f1a'
      ctx.fillRect(0, 0, w, h)

      // Grid circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 + i * 0.05})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Cross lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, h)
      ctx.moveTo(0, cy)
      ctx.lineTo(w, cy)
      ctx.stroke()

      // Sweep line
      const sweepX = cx + Math.cos(sweepAngle) * radius
      const sweepY = cy + Math.sin(sweepAngle) * radius
      
      // Sweep gradient
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, sweepAngle - 0.5, sweepAngle)
      ctx.closePath()
      const sweepGrad = ctx.createLinearGradient(cx, cy, sweepX, sweepY)
      sweepGrad.addColorStop(0, 'rgba(0, 255, 136, 0)')
      sweepGrad.addColorStop(1, 'rgba(0, 255, 136, 0.15)')
      ctx.fillStyle = sweepGrad
      ctx.fill()

      // Sweep line
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(sweepX, sweepY)
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw pings
      pings.forEach((ping) => {
        const px = cx + (ping.x / 100) * radius
        const py = cy + (ping.y / 100) * radius
        const colors: Record<string, string> = {
          fish: '#06b6d4',
          wreck: '#8b5cf6',
          treasure: '#f59e0b',
          artifact: '#ef4444',
        }
        
        // Ping glow
        const pingGradient = ctx.createRadialGradient(px, py, 0, px, py, 8)
        pingGradient.addColorStop(0, colors[ping.type] + 'aa')
        pingGradient.addColorStop(1, colors[ping.type] + '00')
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fillStyle = pingGradient
        ctx.fill()

        // Ping dot
        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fillStyle = colors[ping.type]
        ctx.fill()

        // Pulse ring
        const pulseScale = 1 + Math.sin(Date.now() * 0.005 + ping.id) * 0.5
        ctx.beginPath()
        ctx.arc(px, py, 5 * pulseScale, 0, Math.PI * 2)
        ctx.strokeStyle = colors[ping.type] + '44'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#00ff88'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()

      // Depth scale
      ctx.fillStyle = 'rgba(0, 255, 136, 0.5)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      for (let i = 1; i <= 4; i++) {
        ctx.fillText(`${i * 50}m`, cx + (radius / 4) * i + 15, cy + 3)
      }

      // Direction labels
      ctx.fillStyle = 'rgba(0, 255, 136, 0.7)'
      ctx.font = 'bold 11px monospace'
      ctx.fillText('N', cx, 15)
      ctx.fillText('S', cx, h - 5)
      ctx.fillText('E', w - 10, cy + 4)
      ctx.fillText('W', 10, cy + 4)

      setSweepAngle((prev) => (prev + 0.03) % (Math.PI * 2))
      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [active, pings, sweepAngle])

  // Generate pings periodically
  useEffect(() => {
    if (!active) return

    const interval = setInterval(() => {
      const newPings: SonarPing[] = []
      const count = 2 + Math.floor(Math.random() * 4)
      
      for (let i = 0; i < count; i++) {
        const roll = Math.random() * 100
        let type: SonarPing['type'] = 'fish'
        if (roll > 95) type = 'treasure'
        else if (roll > 85) type = 'artifact'
        else if (roll > 70) type = 'wreck'

        newPings.push({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          strength: 0.3 + Math.random() * 0.7,
          type,
          depth: 10 + Math.random() * 200,
        })
      }

      setPings(newPings)
      setDepth(50 + Math.random() * 150)
      setSignalStrength(0.4 + Math.random() * 0.6)
    }, 3000)

    return () => clearInterval(interval)
  }, [active])

  if (!hasSonar) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <Card className="bg-slate-800/90 border-cyan-500/30 p-3 max-w-48">
          <div className="flex items-center gap-2 mb-2">
            <Radar className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400">Sonar</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Upgrade radar to unlock</p>
          <Badge variant="outline" className="text-[10px] border-yellow-500/50 text-yellow-400">
            Radar Lv.1+ required
          </Badge>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Card className="bg-slate-900/95 border-cyan-500/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Radar className={`w-4 h-4 ${active ? 'text-green-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className="text-xs font-semibold text-cyan-400">SONAR DEPTH FINDER</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={`h-6 text-xs px-2 ${
              active
                ? 'border-green-500/50 text-green-400 hover:bg-green-500/20'
                : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20'
            }`}
            onClick={() => setActive(!active)}
          >
            {active ? 'OFF' : 'ON'}
          </Button>
        </div>

        {active && (
          <>
            {/* Sonar display */}
            <div className="p-2">
              <canvas
                ref={canvasRef}
                width={240}
                height={240}
                className="rounded-lg border border-cyan-500/20"
              />
            </div>

            {/* Stats */}
            <div className="px-3 pb-3 space-y-2">
              {/* Depth */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ArrowDown className="w-3 h-3" />
                  <span>Depth</span>
                </div>
                <span className="text-cyan-400 font-mono">{depth.toFixed(0)}m</span>
              </div>

              {/* Signal */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Waves className="w-3 h-3" />
                  <span>Signal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-400 rounded-full transition-all"
                      style={{ width: `${signalStrength * 100}%` }}
                    />
                  </div>
                  <span className="text-green-400 font-mono">{(signalStrength * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Detected objects */}
              <div className="flex items-center gap-1 flex-wrap pt-1">
                {pings.map((ping) => {
                  const colors: Record<string, string> = {
                    fish: 'text-cyan-400 border-cyan-500/30',
                    wreck: 'text-purple-400 border-purple-500/30',
                    treasure: 'text-yellow-400 border-yellow-500/30',
                    artifact: 'text-red-400 border-red-500/30',
                  }
                  const icons: Record<string, React.ReactNode> = {
                    fish: <Waves className="w-2.5 h-2.5" />,
                    wreck: <MapPin className="w-2.5 h-2.5" />,
                    treasure: <Target className="w-2.5 h-2.5" />,
                    artifact: <Compass className="w-2.5 h-2.5" />,
                  }
                  return (
                    <Badge key={ping.id} variant="outline" className={`text-[9px] ${colors[ping.type]}`}>
                      {icons[ping.type]}
                      <span className="ml-1">{ping.type} {ping.depth.toFixed(0)}m</span>
                    </Badge>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
