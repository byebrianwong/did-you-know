import { ModeToggle, type Mode } from './ModeToggle'
import { ProgressMeter } from './ProgressMeter'
import { TopicChips } from './TopicChips'

type HeaderProps = {
  mode: Mode
  onModeChange: (mode: Mode) => void
  knownCount: number
  total: number
  topicOptions: string[]
  topic: string
  onTopicChange: (topic: string) => void
}

// Logo, Learn/Browse switch, progress, and topic chips.
export function Header({ mode, onModeChange, knownCount, total, topicOptions, topic, onTopicChange }: HeaderProps) {
  return (
    <header className="top">
      <div className="top-row">
        <h1 className="logo">
          Did you <em>know?</em>
        </h1>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>
      <p className="tagline">The real differences between things everyone mixes up.</p>
      <ProgressMeter known={knownCount} total={total} />
      <TopicChips options={topicOptions} selected={topic} onSelect={onTopicChange} />
    </header>
  )
}
