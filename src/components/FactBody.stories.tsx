import type { Meta, StoryObj } from '@storybook/react-vite'
import { appColumn } from '../stories/decorators'
import { facts } from '../stories/fixtures'
import { FactBody } from './FactBody'

const meta = {
  title: 'Components/FactBody',
  component: FactBody,
  decorators: [appColumn],
  args: { fact: facts.twoImages },
  argTypes: { fact: { control: false } },
} satisfies Meta<typeof FactBody>

export default meta
type Story = StoryObj<typeof meta>

export const WithPhotos: Story = {}

export const WithoutPhotos: Story = {
  args: { fact: facts.noImages },
}

export const WithDiagrams: Story = {
  args: { fact: facts.diagramsAndWide },
}
