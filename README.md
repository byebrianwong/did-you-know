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
