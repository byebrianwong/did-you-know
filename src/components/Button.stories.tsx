import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Tell me', onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Quiet: Story = {
  args: { variant: 'quiet', children: 'I knew that' },
}

export const Wide: Story = {
  args: { wide: true },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
}

// A button with a keyboard shortcut shows the key after its label. The button's
// name stays "Tell me"; screen readers get the key from aria-keyshortcuts.
// Phones and touch screens hide the key.
export const WithShortcut: Story = {
  args: { wide: true, shortcut: 'Space' },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Tell me' })
    await expect(button).toHaveAttribute('aria-keyshortcuts', 'Space')
    await expect(button).toHaveTextContent('Space')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'))
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

// The two buttons as they sit together under a revealed card.
export const Pair: Story = {
  render: (args) => (
    <div className="actions" style={{ width: 480 }}>
      <Button {...args} variant="quiet" shortcut="K">
        I knew that
      </Button>
      <Button {...args} shortcut="N">
        New to me · next
      </Button>
    </div>
  ),
}
