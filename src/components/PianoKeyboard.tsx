import { useEffect, useMemo, useRef } from 'react'
import { buildPianoKeys } from '../lib/music'
import type { Messages } from '../lib/i18n'

interface PianoKeyboardProps {
  targetMidi: number
  pressedMidi: number | null
  onAnswer: (midi: number) => void
  messages: Messages
}

export function PianoKeyboard({ targetMidi, pressedMidi, onAnswer, messages }: PianoKeyboardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const keys = useMemo(buildPianoKeys, [])
  const whiteWidth = window.matchMedia('(min-width: 700px)').matches ? 52 : 43

  useEffect(() => {
    const target = keys.find((key) => key.midi === targetMidi)
    const scroll = scrollRef.current
    if (!target || !scroll) return
    const keyCenter = target.leftWhiteIndex * whiteWidth + (target.isBlack ? 0 : whiteWidth / 2)
    scroll.scrollTo({ left: Math.max(0, keyCenter - scroll.clientWidth / 2), behavior: 'smooth' })
  }, [keys, targetMidi, whiteWidth])

  return (
    <div className="piano-frame">
      <div className="piano-scroll" ref={scrollRef} tabIndex={0} aria-label={messages.pianoKeyboard}>
        <div className="piano-keys" style={{ width: `${keys.filter((key) => !key.isBlack).length * whiteWidth}px` }}>
          {keys.filter((key) => !key.isBlack).map((key) => (
            <button key={key.midi} type="button" className={`white-key${pressedMidi === key.midi ? ' pressed' : ''}`} style={{ left: `${key.whiteIndex * whiteWidth}px`, width: `${whiteWidth}px` }} onClick={() => onAnswer(key.midi)} aria-label={key.label}>
              {key.letter === 'C' && <span className="key-label">{key.label}</span>}
            </button>
          ))}
          {keys.filter((key) => key.isBlack).map((key) => (
            <button key={key.midi} type="button" className={`black-key${pressedMidi === key.midi ? ' pressed' : ''}`} style={{ left: `${key.leftWhiteIndex * whiteWidth - (whiteWidth * 0.31)}px`, width: `${whiteWidth * 0.62}px` }} onClick={() => onAnswer(key.midi)} aria-label={key.label} />
          ))}
        </div>
      </div>
      <div className="piano-caption"><span>{messages.low}</span><span>{messages.pressPianoKey}</span><span>{messages.high}</span></div>
    </div>
  )
}
