import { useCallback, useEffect, useRef, useState } from 'react'
import { pickQuestion } from '../lib/music'
import { getDateKey, loadProgress, saveProgress } from '../lib/storage'
import type { AccidentalMode, FeedbackState, KeyboardMode, Locale, Question } from '../types/music'

export function usePractice() {
  const [progress] = useState(loadProgress)
  const [question, setQuestion] = useState<Question>(() => pickQuestion(null, progress.accidentalMode))
  const [accidentalMode, setAccidentalMode] = useState<AccidentalMode>(progress.accidentalMode)
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>(progress.keyboardMode)
  const [showSolfege, setShowSolfege] = useState(progress.showSolfege)
  const [locale, setLocale] = useState<Locale>(progress.locale)
  const [feedback, setFeedback] = useState<FeedbackState>('idle')
  const [hintVisible, setHintVisible] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [todayCount, setTodayCount] = useState(progress.todayCount)
  const [attempted, setAttempted] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [pressedMidi, setPressedMidi] = useState<number | null>(null)
  const [pressedPitchClass, setPressedPitchClass] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const nextQuestion = useCallback((mode = accidentalMode) => {
    clearTimer()
    setQuestion((current) => pickQuestion(current.midi, mode))
    setFeedback('idle')
    setHintVisible(false)
    setPressedMidi(null)
    setPressedPitchClass(null)
    setAttempted(false)
    setWrongAttempts(0)
    setLocked(false)
  }, [accidentalMode, clearTimer])

  useEffect(() => () => clearTimer(), [clearTimer])

  useEffect(() => {
    saveProgress({
      todayCount,
      date: getDateKey(),
      accidentalMode,
      keyboardMode,
      showSolfege,
      locale,
    })
  }, [todayCount, accidentalMode, keyboardMode, showSolfege, locale])

  const answer = useCallback((value: number) => {
    if (locked) return
    const isNotePad = keyboardMode === 'notes'
    const isCorrect = isNotePad ? value === question.pitchClass : value === question.midi
    const firstAttempt = !attempted
    const nextTotal = total + (firstAttempt ? 1 : 0)
    const nextCorrect = correct + (firstAttempt && isCorrect ? 1 : 0)

    setLocked(true)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setAttempted(true)
    setPressedMidi(isNotePad ? null : value)
    setPressedPitchClass(isNotePad ? value : null)
    setTotal(nextTotal)
    setCorrect(nextCorrect)
    if (firstAttempt) setTodayCount((count) => count + 1)

    if (isCorrect) {
      timerRef.current = window.setTimeout(() => nextQuestion(), 650)
    } else {
      setWrongAttempts((count) => count + 1)
      timerRef.current = window.setTimeout(() => {
        setLocked(false)
        setPressedMidi(null)
        setPressedPitchClass(null)
      }, 420)
    }
  }, [attempted, correct, keyboardMode, locked, nextQuestion, question, total])

  const setMode = useCallback((mode: AccidentalMode) => {
    if (mode === accidentalMode) return
    setAccidentalMode(mode)
    setQuestion((current) => pickQuestion(current.midi, mode))
    setFeedback('idle')
    setHintVisible(false)
    setAttempted(false)
    setWrongAttempts(0)
    setLocked(false)
    setPressedMidi(null)
    setPressedPitchClass(null)
    clearTimer()
  }, [accidentalMode, clearTimer])

  const toggleKeyboardMode = useCallback(() => {
    setKeyboardMode((mode) => mode === 'piano' ? 'notes' : 'piano')
    nextQuestion()
  }, [nextQuestion])

  const resetRound = useCallback(() => {
    clearTimer()
    setCorrect(0)
    setTotal(0)
    setFeedback('idle')
    setHintVisible(false)
    setAttempted(false)
    setWrongAttempts(0)
    setLocked(false)
    setPressedMidi(null)
    setPressedPitchClass(null)
    nextQuestion()
  }, [clearTimer, nextQuestion])

  return {
    question, accidentalMode, keyboardMode, showSolfege, locale, feedback, hintVisible,
    correct, total, todayCount, attempted, wrongAttempts,
    pressedMidi, pressedPitchClass,
    accuracy: total ? Math.round(correct / total * 100) : 0,
    setMode, setShowSolfege, setLocale, toggleHint: () => setHintVisible((visible) => !visible),
    toggleKeyboardMode, resetRound, answer,
  }
}
