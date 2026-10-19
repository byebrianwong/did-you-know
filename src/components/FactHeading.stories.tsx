import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { appColumn } from '../stories/decorators'
import { factPerTopic, facts } from '../stories/fixtures'
import { topicLooks } from '../topics'
import { FactHeading } from './FactHeading'

// The top of the Learn card and of a fact opened from Browse: the topic tag, the
// title and the question. The tag shows the topic's icon. The tag and each "vs."
// in the title use the topic's colour, the same as the topic's Browse cards.
const meta = {
  title: 'Components/FactHeading',
  component: FactHeading,
  decorators: [appColumn],
  args: { fact: facts.twoImages },
  argTypes: { fact: { control: false } },
} satisfies Meta<typeof FactHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Animals: Story = {
  play: async ({ canvas }) => {
    // The "vs." is styled on its own, but the heading still reads as one piece of text.
    await expect(canvas.getByRole('heading', { name: 'Raven vs. Crow' })).toBeInTheDocument()
  },
}

// One heading per topic, so axe checks the contrast of every topic's tag, in
// light and dark. The last one is a topic with no entry in src/topics.ts: it
// gets a light bulb and the accent colour.
export const EveryTopic: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {[...factPerTopic, { ...facts.noImages, category: 'Music' }].map((fact) => (
        <div key={fact.id}>
          <FactHeading fact={fact} />
        </div>
      ))}
    </div>
  ),
  play: async () => {
    // A topic added to src/topics.ts needs a fact in factPerTopic, so its colours are checked too.
    await expect(factPerTopic.map((fact) => fact.category)).toEqual(Object.keys(topicLooks))
  },
}
