import { useEffect, useRef } from 'react'
import type { Question } from '../types/music'
import type { Messages } from '../lib/i18n'

interface StaffNotationProps {
  question: Question
  messages: Messages
}

export function StaffNotation({ question, messages }: StaffNotationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, rect.width, rect.height)

      const gap = Math.min(17, rect.height / 11)
      const bottomY = rect.height / 2 + gap * 1.5
      const left = Math.max(35, rect.width * 0.12)
      const right = rect.width - Math.max(28, rect.width * 0.08)
      const noteX = rect.width * 0.64
      const referenceStep = question.clef === 'treble' ? 30 : 18
      const offset = question.step - referenceStep
      const noteY = bottomY - offset * gap / 2

      context.strokeStyle = '#343b3f'
      context.fillStyle = '#343b3f'
      context.lineWidth = 1.25
      for (let index = 0; index < 5; index += 1) {
        const y = bottomY - index * gap
        context.beginPath()
        context.moveTo(left, y)
        context.lineTo(right, y)
        context.stroke()
      }

      context.font = `${gap * 4.6}px Georgia, serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(question.clef === 'treble' ? '𝄞' : '𝄢', left + gap * 1.7, bottomY - gap * 2)

      context.lineWidth = 1.2
      if (offset < 0) {
        for (let lineOffset = -2; lineOffset >= offset; lineOffset -= 2) drawLedger(context, noteX, bottomY - lineOffset * gap / 2)
      }
      if (offset > 8) {
        for (let lineOffset = 10; lineOffset <= offset; lineOffset += 2) drawLedger(context, noteX, bottomY - lineOffset * gap / 2)
      }

      if (question.accidental) {
        context.font = `bold ${gap * 2.2}px Georgia, serif`
        context.textAlign = 'right'
        context.fillText(question.accidental, noteX - gap * 0.9, noteY)
      }

      context.save()
      context.translate(noteX, noteY)
      context.rotate(-0.18)
      context.beginPath()
      context.ellipse(0, 0, gap * 0.72, gap * 0.48, 0, 0, Math.PI * 2)
      context.fillStyle = '#526e87'
      context.fill()
      context.restore()

      context.strokeStyle = '#343b3f'
      context.lineWidth = 1.8
      context.beginPath()
      if (offset < 4) {
        context.moveTo(noteX + gap * 0.62, noteY)
        context.lineTo(noteX + gap * 0.62, noteY - gap * 3.1)
      } else {
        context.moveTo(noteX - gap * 0.62, noteY)
        context.lineTo(noteX - gap * 0.62, noteY + gap * 3.1)
      }
      context.stroke()
    }

    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    draw()
    return () => observer.disconnect()
  }, [question])

  const clefName = question.clef === 'treble' ? messages.trebleClef : messages.bassClef
  return <canvas ref={canvasRef} className="staff-canvas" role="img" aria-label={messages.staffImageLabel(clefName)} />
}

function drawLedger(context: CanvasRenderingContext2D, x: number, y: number) {
  context.beginPath()
  context.moveTo(x - 19, y)
  context.lineTo(x + 19, y)
  context.stroke()
}
