import type { Meta, StoryObj } from '@storybook/react-vite'
import { appColumn } from '../stories/decorators'
import { facts } from '../stories/fixtures'
import { PhotoGrid } from './PhotoGrid'

// The grid picks its columns from the number of pictures that are not wide.
const meta = {
  title: 'Components/PhotoGrid',
  component: PhotoGrid,
  decorators: [appColumn],
  args: { images: facts.twoImages.images ?? [] },
  argTypes: { images: { control: false } },
} satisfies Meta<typeof PhotoGrid>

export default meta
type Story = StoryObj<typeof meta>

export const OnePhoto: Story = {
  args: { images: facts.oneImage.images ?? [] },
}

export const TwoPhotos: Story = {}

export const ThreePhotos: Story = {
  args: { images: facts.threeImages.images ?? [] },
}

export const FourPhotos: Story = {
  args: { images: facts.fourImages.images ?? [] },
}

// Maps use fit: 'contain', so no part of the map is cropped off.
export const Maps: Story = {
  args: { images: facts.maps.images ?? [] },
}

// Diagrams drawn by scripts/make-diagrams.mjs have no license line.
export const Diagrams: Story = {
  args: { images: facts.diagrams.images ?? [] },
}

// A wide diagram spans the full row at its own shape.
export const WideDiagram: Story = {
  args: { images: facts.wideDiagram.images ?? [] },
}

export const PhotosAndWideDiagram: Story = {
  args: { images: facts.diagramsAndWide.images ?? [] },
}

// When a picture fails to load, the alt text and caption still show.
export const BrokenImage: Story = {
  args: {
    images: [{ ...(facts.oneImage.images ?? [])[0], src: '/images/does-not-exist.jpg' }],
  },
}
