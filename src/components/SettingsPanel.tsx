import type { AccidentalMode } from '../types/music'
import type { Messages } from '../lib/i18n'

interface SettingsPanelProps {
  mode: AccidentalMode
  showSolfege: boolean
  messages: Messages
  onModeChange: (mode: AccidentalMode) => void
  onSolfegeChange: (enabled: boolean) => void
}

export function SettingsPanel({ mode, showSolfege, messages, onModeChange, onSolfegeChange }: SettingsPanelProps) {
  const modes: { value: AccidentalMode; label: string }[] = [
    { value: 'sharps', label: messages.sharps },
    { value: 'flats', label: messages.flats },
    { value: 'mixed', label: messages.mixed },
  ]

  return (
    <section className="settings-panel">
      <div className="settings-copy"><strong>{messages.generalPractice}</strong><span>{messages.generalPracticeDescription}</span></div>
      <div className="settings-controls">
        <span className="control-label">{messages.accidentalPractice}</span>
        <div className="segmented" role="group" aria-label={messages.accidentalModeLabel}>
          {modes.map((item) => <button key={item.value} type="button" aria-pressed={mode === item.value} onClick={() => onModeChange(item.value)}>{item.label}</button>)}
        </div>
        <label className="toggle-row">
          <span><strong>{messages.showSolfege}</strong><small>{messages.showSolfegeDescription}</small></span>
          <input type="checkbox" checked={showSolfege} onChange={(event) => onSolfegeChange(event.target.checked)} />
          <span className="toggle-ui" aria-hidden="true" />
        </label>
      </div>
    </section>
  )
}
