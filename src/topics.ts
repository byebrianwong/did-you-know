import {
  CloudSun,
  Earth,
  FlaskConical,
  Flower2,
  HeartPulse,
  Lightbulb,
  type LucideIcon,
  PawPrint,
  Scale,
  UtensilsCrossed,
} from 'lucide-react'

// How each topic looks: an icon, and a slug that index.css uses to pick the
// topic's colours ([data-topic='animals'] and so on). Icons are from Lucide
// (https://lucide.dev).
export type TopicLook = {
  slug: string
  Icon: LucideIcon
}

export const topicLooks: Record<string, TopicLook> = {
  Animals: { slug: 'animals', Icon: PawPrint },
  'Body & Health': { slug: 'body', Icon: HeartPulse },
  'Death & Burial': { slug: 'death', Icon: Flower2 },
  'Food & Drink': { slug: 'food', Icon: UtensilsCrossed },
  'Law & Crime': { slug: 'law', Icon: Scale },
  'People & Places': { slug: 'people', Icon: Earth },
  'Science & Tech': { slug: 'science', Icon: FlaskConical },
  'Weather & Space': { slug: 'weather', Icon: CloudSun },
}

// A topic that is not listed above gets a light bulb and the app's accent colour.
// Add a new topic here to give it its own icon and colours.
const otherLook: TopicLook = { slug: 'other', Icon: Lightbulb }

export function topicLook(category: string): TopicLook {
  return topicLooks[category] ?? otherLook
}
