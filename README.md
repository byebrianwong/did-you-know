# Did You Know?

A small web app for learning the real differences between things people mix up:
graveyard vs. cemetery, coffin vs. casket, tornado vs. hurricane vs. typhoon, and so on.

It shows one fact at a time. Tap **Tell me** to see the answer. Then pick:

- **I knew that** — the card is marked as known and does not come back.
- **New to me · next** — the card comes back after a few other cards.

**Browse** (top right) lists every fact in the chosen topic. Facts you marked as
known have a ✓. Open any fact to read it again, put it back into Learn, or mark
it as known.

Progress is saved in your browser (localStorage). Nothing is sent anywhere.

## Run it

```bash
npm install
npm run dev
```

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
