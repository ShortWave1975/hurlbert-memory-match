// src/data/deck.js

export function makeCard(id, pairId, img) {
  return { id, pairId, img, revealed: false, matched: false };
}

// Fisher–Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * buildDeck
 * filenames: array of image filenames in /public/photos/family/
 * size: total number of cards (even). Example: 16 for 8 pairs.
 */
export function buildDeck(filenames, size) {
  const base = size ? filenames.slice(0, size / 2) : filenames;

  const pairs = base.flatMap((name, idx) => {
    const pairId = `p${idx}`;
    const img = `/photos/family/${name}`;
    return [
      makeCard(`${pairId}-a`, pairId, img),
      makeCard(`${pairId}-b`, pairId, img),
    ];
  });

  return shuffle(pairs);
}

// Update filenames here to match exactly what's in public/photos/family/
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
