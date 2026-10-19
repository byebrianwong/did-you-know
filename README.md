# Did You Know?

A small web app for learning the real differences between things people mix up:
graveyard vs. cemetery, coffin vs. casket, tornado vs. hurricane vs. typhoon, and so on.

Live site: https://did-you-know-phi.vercel.app

It shows one fact at a time. Tap **Tell me** to see the answer. Then pick:

- **I knew that** — the card is marked as known and does not come back.
- **New to me · next** — the card comes back after a few other cards.

**Browse** (top right) shows every fact in the chosen topic as a grid of picture
cards, grouped by topic. Facts you marked as known are labelled **Known**. Open
any fact to read it again, put it back into Learn, or mark it as known.

Progress is saved in your browser (localStorage). Nothing is sent anywhere.

## Run it

```bash
npm install
npm run dev
```

## Storybook

This app is also an example of a well-organised Storybook. Every piece of the UI
is a small component with its own stories, and the whole app has page stories
that test the main flows.

```bash
npm run storybook   # open Storybook at http://localhost:6006
npm test            # run every story as a test in a headless browser
```

How the code is split:

- `src/components/` holds components that only display things. They get
  everything through props and hold no app state. Each has a `.stories.tsx` file
  next to it.
- `src/useLearnDeck.ts` holds the deck state: which facts are known, which topic
  is chosen, and which card is next.
- `src/App.tsx` connects the two. It takes the facts and a progress store as
  props. The real app passes all facts and `browserStore` (localStorage). Stories
  pass a small deck and `memoryStore`, so each story starts from a known state.
- `src/stories/fixtures.ts` picks real facts for stories, each chosen for a
  layout case (no pictures, four pictures, a wide diagram, a long title, and so on).

What the stories check:

- **Interactions.** Stories with a `play` function click and type like a person,
  then check the result: revealing a card, "New to me" bringing a card back 4
  cards later, the keyboard shortcuts, filtering by topic, and marking a card as
  known from Browse. They show step by step in the Interactions panel.
- **Accessibility.** Every story is checked with axe, and `npm test` fails on
  any violation (`a11y.test: 'error'` in `.storybook/preview.tsx`).
- **Themes.** The toolbar switches between light and dark. It sets `data-theme`
  on `<html>`. Without it, the app follows the system setting. Colours are
  defined once in `src/index.css` with `light-dark()`.
- **Visual changes.** Chromatic snapshots every story in light and dark. Page
  and header stories are also snapshotted at phone width. The modes are listed
  in `.storybook/modes.ts`.

The GitHub workflow in `.github/workflows/storybook.yml` runs `npm test` and
publishes to Chromatic on every push. The Chromatic job needs a
`CHROMATIC_PROJECT_TOKEN` repository secret. Until that secret is added, the job
is skipped.

## Deploys

The repo is connected to a Vercel project. Every push to `main` deploys to the
live site. Pushes to other branches get their own preview URL.

## Add facts

Facts live in `src/data/*.json`, one file per topic. Every file in that folder is
loaded automatically. Each fact looks like this:

```json
{
  "id": "graveyard-cemetery",
  "category": "Death & Burial",
  "title": "Graveyard vs. Cemetery",
  "question": "Is a graveyard the same thing as a cemetery?",
  "answer": "Short, direct answer.",
  "details": [{ "term": "Graveyard", "text": "..." }],
  "bonus": "One surprising extra fact.",
  "sources": ["https://..."]
}
```

`id` must be unique across all files. Progress is stored by `id`, so changing an
id resets that fact for anyone who already marked it.

Each topic (`category`) has an icon and a colour. The icons are listed in
`src/topics.ts` and the colours in `src/index.css` (`[data-topic='…']`). A new
topic shows a light bulb in the accent colour until it is added to both.

## Add pictures

Pictures show up below the answer. There are two kinds, and nothing is AI-generated:

- **Real photos and maps** from [Wikimedia Commons](https://commons.wikimedia.org),
  with the author and license under each one.
- **Diagrams** drawn by `scripts/make-diagrams.mjs` (targets, graphs, bars to
  scale). Every shape is computed from a number in the fact, or from a value
  listed with its source in the script, so they can be checked.

### Photos

To add one, find the file on Commons, then run:

```bash
node scripts/fetch-image.mjs <fact-id> <slug> "File:<Commons file name>" "<label>" "<alt text>"
```

The script:

- downloads a 640px-wide copy to `public/images/<fact-id>/<slug>.jpg` (or `.png`),
- reads the author and license from Commons, and refuses anything that is not
  CC0, public domain, CC BY or CC BY-SA,
- adds the entry to the fact's `images` list in `src/data/*.json`.

Options: `--note "<text>"` adds a short line under the label (for example
"Dots inside the rosettes"), and `--contain` shows the whole image without
cropping, for maps and diagrams. The resize step uses `sips`, so the script runs
on macOS only.

Before keeping a picture, open it and check that it really shows what the label
says. Many photos online are mislabeled (a "yam" that is a sweet potato, a
"crow" that is a raven). Prefer images that the matching Wikipedia article
already uses, and skip a picture when in doubt.

### Diagrams

Diagrams are defined in `scripts/make-diagrams.mjs`. To change one or add one,
edit that file and run:

```bash
node scripts/make-diagrams.mjs
```

It writes the SVG files to `public/images/<fact-id>/` and updates each fact's
`images` list. Set `wide: true` for a diagram that should span the full width of
the card, such as a row of things drawn to scale.
