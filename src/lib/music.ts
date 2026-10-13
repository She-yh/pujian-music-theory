import type { AccidentalMode, Clef, Note, PianoKey, Question } from '../types/music'

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const SOLFEGE: Record<string, string> = { C: 'do', D: 're', E: 'mi', F: 'fa', G: 'sol', A: 'la', B: 'si' }
const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
const NATURAL_PITCHES = new Set([0, 2, 4, 5, 7, 9, 11])
const BLACK_PITCHES = new Set([1, 3, 6, 8, 10])

export const MIDI_RANGE = { min: 43, max: 84 }
export const SHARPS = SHARP_NAMES
export const FLATS = FLAT_NAMES

export function midiToNote(midi: number, preferFlat = false): Note {
  const pitchClass = midi % 12
  const name = (preferFlat ? FLAT_NAMES : SHARP_NAMES)[pitchClass]
  const octave = Math.floor(midi / 12) - 1
  const letter = name[0]
  return {
    midi,
    pitchClass,
    name,
    octave,
    letter,
    label: `${name}${octave}`,
    accidental: name.length > 1 ? name.slice(1) : '',
    solfege: SOLFEGE[letter],
    step: octave * 7 + LETTERS.indexOf(letter),
    isBlack: !NATURAL_PITCHES.has(pitchClass),
  }
}

export function buildQuestionPool(clef: Clef, mode: AccidentalMode): Question[] {
  const pool: Question[] = []
  for (let midi = MIDI_RANGE.min; midi <= MIDI_RANGE.max; midi += 1) {
    if (mode !== 'mixed' && !BLACK_PITCHES.has(midi % 12)) continue
    const preferFlat = mode === 'flats' || (mode === 'mixed' && !NATURAL_PITCHES.has(midi % 12) && Math.random() < 0.5)
    const note = midiToNote(midi, preferFlat)
    if (clef === 'treble' && note.step < 24) continue
    if (clef === 'bass' && note.step > 30) continue
    pool.push({ ...note, clef })
  }
  return pool
}

export function pickQuestion(previousMidi: number | null, mode: AccidentalMode): Question {
  const clef: Clef = Math.random() < 0.5 ? 'treble' : 'bass'
  const pool = buildQuestionPool(clef, mode)
  const choices = pool.filter((note) => note.midi !== previousMidi)
  const source = choices.length > 0 ? choices : pool
  return source[Math.floor(Math.random() * source.length)]
}

export function buildPianoKeys(): PianoKey[] {
  const keys: PianoKey[] = []
  let whiteIndex = 0
  for (let midi = MIDI_RANGE.min; midi <= MIDI_RANGE.max; midi += 1) {
    const note = midiToNote(midi)
    const leftWhiteIndex = whiteIndex
    const key: PianoKey = { ...note, whiteIndex, leftWhiteIndex }
    keys.push(key)
    if (!note.isBlack) whiteIndex += 1
  }
  return keys
}

export const NATURAL_PITCH_CLASS = NATURAL_PITCHES
