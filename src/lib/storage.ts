import type { AccidentalMode, KeyboardMode, Locale, Progress } from '../types/music'

const STORAGE_KEY = 'sight-reading-progress-v1'
const DEFAULTS: Progress = {
  todayCount: 0,
  date: '',
  accidentalMode: 'mixed',
  keyboardMode: 'piano',
  showSolfege: true,
  locale: 'zh',
}

function isAccidentalMode(value: unknown): value is AccidentalMode {
  return value === 'sharps' || value === 'flats' || value === 'mixed'
}

function isKeyboardMode(value: unknown): value is KeyboardMode {
  return value === 'piano' || value === 'notes'
}

function isLocale(value: unknown): value is Locale {
  return value === 'zh' || value === 'en'
}

export function getDateKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const saved = JSON.parse(raw) as Partial<Progress>
    const today = getDateKey()
    return {
      todayCount: saved.date === today && Number.isFinite(saved.todayCount) ? Math.max(0, saved.todayCount ?? 0) : 0,
      date: today,
      accidentalMode: isAccidentalMode(saved.accidentalMode) ? saved.accidentalMode : 'mixed',
      keyboardMode: isKeyboardMode(saved.keyboardMode) ? saved.keyboardMode : 'piano',
      showSolfege: saved.showSolfege !== false,
      locale: isLocale(saved.locale) ? saved.locale : 'zh',
    }
  } catch {
    return DEFAULTS
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Private browsing or a full storage quota should not interrupt practice.
  }
}
