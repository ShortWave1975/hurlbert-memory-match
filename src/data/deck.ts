// src/data/deck.ts
export type Card = {
  id: string;
  pairId: string;
  img: string;
  revealed: boolean;
  matched: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildDeck(filenames: string[], size?: number): Card[] {
  const base = size ? filenames.slice(0, size / 2) : filenames;
  const pairs = base.map((name, idx) => {
    const pairId = `p${idx}`;
    const img = `/photos/family/${name}`;
    return [
      { id: `${pairId}-a`, pairId, img, revealed: false, matched: false },
      { id: `${pairId}-b`, pairId, img, revealed: false, matched: false },
    ] as const;
  }).flat();

  return shuffle(pairs);
}

export const DEFAULT_FILES = [
  "Adonis.jpeg",
  "AdonisNolan.jpeg",
  "Cady.jpeg",
  "Christina.jpeg",
  "Jetta.jpeg",
  "Karyn.jpeg",
  "Leia.jpeg",
  "Libby.jpeg",
  "nana.jpeg",
  "Nolan.jpeg",
  "poppop.jpeg",
  "Sofia.jpeg",
  "Suzy.jpeg",
  "Tina.jpeg",
  "Tory.jpeg",
  "ToryChristina.jpeg",
  "Will.jpeg",
  "Yogi.jpeg",
];
