export type Clef = 'treble' | 'bass'
export type AccidentalMode = 'sharps' | 'flats' | 'mixed'
export type KeyboardMode = 'piano' | 'notes'
export type Locale = 'zh' | 'en'
export type FeedbackState = 'idle' | 'correct' | 'wrong'

export interface Note {
  midi: number
  pitchClass: number
  name: string
  label: string
  octave: number
  letter: string
  accidental: string
  solfege: string
  step: number
  isBlack: boolean
}

export interface Question extends Note {
  clef: Clef
}

export interface PianoKey extends Note {
  whiteIndex: number
  leftWhiteIndex: number
}

export interface Progress {
  todayCount: number
  date: string
  accidentalMode: AccidentalMode
  keyboardMode: KeyboardMode
  showSolfege: boolean
  locale: Locale
}
