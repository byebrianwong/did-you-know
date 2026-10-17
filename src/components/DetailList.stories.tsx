import type { Meta, StoryObj } from '@storybook/react-vite'
import { appColumn } from '../stories/decorators'
import { fact } from '../stories/fixtures'
import { DetailList } from './DetailList'

const meta = {
  title: 'Components/DetailList',
  component: DetailList,
  decorators: [appColumn],
  args: { details: fact('raven-crow').details },
} satisfies Meta<typeof DetailList>

export default meta
type Story = StoryObj<typeof meta>

export const TwoThings: Story = {}

export const FourThings: Story = {
  args: { details: fact('lawyer-attorney-barrister-solicitor').details },
}
