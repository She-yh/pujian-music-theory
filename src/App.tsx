import { useEffect, useState } from 'react'
import { NotePad } from './components/NotePad'
import { PianoKeyboard } from './components/PianoKeyboard'
import { SettingsPanel } from './components/SettingsPanel'
import { StaffNotation } from './components/StaffNotation'
import { usePractice } from './hooks/usePractice'
import { getMessages } from './lib/i18n'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const practice = usePractice()
  const messages = getMessages(practice.locale)
  const { question } = practice
  const answerLabel = practice.keyboardMode === 'piano' ? messages.answerOnKeyboard : messages.chooseNoteName
  const clefLabel = question.clef === 'treble' ? messages.trebleClef : messages.bassClef

  useEffect(() => {
    document.documentElement.lang = practice.locale === 'zh' ? 'zh-CN' : 'en'
    document.title = practice.locale === 'zh' ? '谱间 · 乐理学习与练习' : 'Pujian · Music Theory Learning and Practice'
    document.querySelector('meta[name="description"]')?.setAttribute('content', practice.locale === 'zh'
      ? '面向所有乐器学习者的乐理学习与练习网站，从识谱、节奏到音程与和弦。'
      : 'A music theory learning and practice website for all musicians, from sight-reading and rhythm to intervals and chords.')
  }, [practice.locale])

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href={import.meta.env.BASE_URL} aria-label={`${messages.brand} ${messages.home}`}>
          <span className="wordmark-mark" aria-hidden="true">谱</span>
          <span><span className="eyebrow">{messages.tagline}</span><span className="brand">{messages.brand}</span></span>
        </a>
        <div className="topbar-actions">
          <button className="language-button" type="button" aria-label={messages.languageLabel} onClick={() => practice.setLocale(practice.locale === 'zh' ? 'en' : 'zh')}>
            {messages.languageButton}
          </button>
          <button className="icon-button" type="button" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm8.1 4.9a8.4 8.4 0 0 0 0-2.2l1.6-1.2-1.6-2.8-1.9.7a8.2 8.2 0 0 0-1.9-1.1L16 4.5h-3.2l-.4 2a8.2 8.2 0 0 0-2 .8l-1.8-1-2 2.5 1.4 1.5a8.4 8.4 0 0 0-.3 2.1l-1.8 1 .9 3.1 2-.1a8.2 8.2 0 0 0 1.6 1.5l-.1 2h3.3l.6-1.9a8.2 8.2 0 0 0 2-.6l1.7 1.1 2.1-2.5-1.3-1.6Z" /></svg>
            <span>{settingsOpen ? messages.close : messages.settings}</span>
          </button>
        </div>
      </header>

      {settingsOpen && <SettingsPanel mode={practice.accidentalMode} showSolfege={practice.showSolfege} messages={messages} onModeChange={practice.setMode} onSolfegeChange={practice.setShowSolfege} />}

      <section className="stats" aria-label={messages.statsLabel}>
        <div className="stat"><strong>{practice.total}</strong><span>{messages.answeredThisRound}</span></div>
        <div className="stat-divider" />
        <div className="stat"><strong>{practice.accuracy}<span>%</span></strong><span>{messages.accuracyThisRound}</span></div>
      </section>

      <section className={`exercise-card${practice.feedback === 'correct' ? ' is-correct' : ''}${practice.feedback === 'wrong' ? ' is-wrong' : ''}`} aria-labelledby="clef-label">
        <div className="exercise-topline">
          <span className="clef-chip" id="clef-label">{clefLabel}</span>
          <span className="question-number">{messages.questionNumber(practice.total + (practice.attempted ? 0 : 1))}</span>
        </div>
        <div className="staff-wrap"><StaffNotation question={question} messages={messages} /></div>
        <div className="prompt-row">
          <span>{answerLabel}</span>
          <button className="hint-button" type="button" aria-expanded={practice.hintVisible} onClick={practice.toggleHint}>{practice.hintVisible ? messages.hideHint : messages.showHint}</button>
        </div>
        <div className="hint-slot" aria-live="polite">
          <span className={practice.hintVisible ? '' : 'visually-hidden'}>
            {messages.hint}: {question.label}{practice.showSolfege ? ` · ${messages.solfege[question.letter]}` : ''}
          </span>
        </div>
        <div className={`feedback ${practice.feedback}`} aria-live="polite">
          {practice.feedback === 'correct' && messages.correct}
          {practice.feedback === 'wrong' && `${messages.tryAgain}${practice.wrongAttempts >= 2 ? ` · ${messages.answer}: ${question.label}${practice.showSolfege ? ` · ${messages.solfege[question.letter]}` : ''}` : ''}`}
          {practice.feedback === 'idle' && messages.idleFeedback}
        </div>
      </section>

      <section className="keyboard-section" aria-label={messages.answerKeyboard}>
        <div className="keyboard-heading">
          <div><span className="eyebrow">YOUR INSTRUMENT</span><h2>{practice.keyboardMode === 'piano' ? messages.pianoKeyboard : messages.noteKeyboard}</h2></div>
          <button className="text-button" type="button" onClick={practice.toggleKeyboardMode}>{practice.keyboardMode === 'piano' ? messages.useNoteKeyboard : messages.usePianoKeyboard}</button>
        </div>
        {practice.keyboardMode === 'piano'
          ? <PianoKeyboard targetMidi={question.midi} pressedMidi={practice.pressedMidi} onAnswer={practice.answer} messages={messages} />
          : <NotePad mode={practice.accidentalMode} pressedPitchClass={practice.pressedPitchClass} onAnswer={practice.answer} messages={messages} />}
      </section>

      <footer className="bottom-row">
        <div><strong>{messages.todayPracticed(practice.todayCount)}</strong><span>{messages.encouragement}</span></div>
        <button className="reset-button" type="button" onClick={practice.resetRound}>{messages.restart}</button>
      </footer>
      <p className="privacy-note">{messages.privacy}</p>
    </main>
  )
}

export default App
