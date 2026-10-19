import { factsById, type Fact } from '../facts'

// Real facts picked for stories, so every story shows real text and real pictures.
// Each one is chosen for a specific layout case.

export function fact(id: string): Fact {
  const found = factsById.get(id)
  if (!found) throw new Error(`No fact with id "${id}". Was it renamed in src/data?`)
  return found
}

export const facts = {
  noImages: fact('md-do'),
  oneImage: fact('magma-lava'),
  twoImages: fact('raven-crow'),
  threeImages: fact('alligator-crocodile-caiman'),
  fourImages: fact('leopard-jaguar-cheetah'),
  wideDiagram: fact('ton-tonne'),
  diagramsAndWide: fact('planet-dwarf-planet'),
  diagrams: fact('accuracy-precision'),
  maps: fact('holland-netherlands'),
  longTitle: fact('england-britain-uk-british-isles'),
  manySources: fact('artery-vein'),
}

// A small deck for page stories and interaction tests: 7 facts in 3 topics.
// Learn shows them in this order, because page stories turn shuffling off.
export const sampleDeck: Fact[] = [
  fact('raven-crow'),
  fact('frog-toad'),
  fact('elk-moose'),
  fact('sea-ocean'),
  fact('lake-pond'),
  fact('magma-lava'),
  fact('jail-prison'),
]

// One fact from each topic, in the order of src/topics.ts, for stories that show
// every topic's colours and icon.
export const factPerTopic: Fact[] = [
  fact('raven-crow'),
  fact('virus-bacteria'),
  fact('graveyard-cemetery'),
  fact('cilantro-coriander'),
  fact('jail-prison'),
  fact('holland-netherlands'),
  fact('weight-mass'),
  fact('weather-climate'),
]
