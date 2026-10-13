import { FLATS, NATURAL_PITCH_CLASS, SHARPS } from '../lib/music'
import type { AccidentalMode } from '../types/music'
import type { Messages } from '../lib/i18n'

interface NotePadProps {
  mode: AccidentalMode
  pressedPitchClass: number | null
  onAnswer: (pitchClass: number) => void
  messages: Messages
}

export function NotePad({ mode, pressedPitchClass, onAnswer, messages }: NotePadProps) {
  return (
    <div className="note-pad" aria-label={messages.notePadLabel}>
      {SHARPS.map((sharp, pitchClass) => {
        const isNatural = NATURAL_PITCH_CLASS.has(pitchClass)
        const label = mode === 'flats' ? FLATS[pitchClass] : sharp
        const alternate = mode === 'mixed' && !isNatural ? FLATS[pitchClass] : null
        return (
          <button key={sharp} type="button" className={`note-key${isNatural ? '' : ' accidental'}${pressedPitchClass === pitchClass ? ' pressed' : ''}`} onClick={() => onAnswer(pitchClass)} aria-label={alternate ? `${label}, ${alternate}` : label}>
            <span>{label}</span>{alternate && <small>{alternate}</small>}
          </button>
        )
      })}
    </div>
  )
}
