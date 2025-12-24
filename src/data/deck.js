// src/data/deck.js

export function makeCard(id, pairId, img) {
  return { id, pairId, img, revealed: false, matched: false };
}

// Fisher–Yates shuffle (in-place)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * buildDeck
 * filenames: array of image filenames that live in /public/photos/family/
 * size: total number of cards (must be even) e.g. 16 = 8 pairs
 *
 * IMPORTANT: we now shuffle the filenames FIRST so each new game
 * can get a different subset of faces.
 */
export function buildDeck(filenames, size) {
  // 1) make a copy so we don't mutate the original list
  const shuffledFiles = shuffle([...filenames]);

  // 2) decide how many pairs we need
  const pairsNeeded = size ? size / 2 : shuffledFiles.length;

  // 3) take that many from the *shuffled* list
  const base = shuffledFiles.slice(0, pairsNeeded);

  // 4) turn each filename into TWO cards
  const pairs = base.flatMap((name, idx) => {
    const pairId = `p${idx}`;
    const img = `/photos/family/${name}`;
    return [
      makeCard(`${pairId}-a`, pairId, img),
      makeCard(`${pairId}-b`, pairId, img),
    ];
  });

  // 5) shuffle the actual cards so the pairs aren’t next to each other
  return shuffle(pairs);
}

// ✅ Update this list to match exactly what's in public/photos/family/
export const DEFAULT_FILES = [
  "Adonis.jpeg",
  "AdonisNolan.jpeg",
  "Angelo.png",
  "Cady.jpeg",
  "Christina.jpeg",
  "cosette.png",
  "gaetano.png",
  "gg.png",
  "giuseppe.png",
  "gramma.png",
  "jamie.png",
  "Jetta.jpeg",
  "Karyn.jpeg",
  "kasia.png",
  "Leia.jpeg",
  "Libby.jpeg",
  "liza.png",
  "mike.png",
  "nana.jpeg",
  "Nolan.jpeg",
  "nonno.png",
  "poppop.jpeg",
  "scott.png",
  "Sofia.jpeg",
  "Suzy.jpeg",
  "timcady.png",
  "Tina.jpeg",
  "tom.png",
  "Tory.jpeg",
  "ToryChristina.jpeg",
  "ts.png",
  "whiskey.png",
  "Will.jpeg",
  "Yogi.jpeg",
    "auntlaurie.png",
  "grampy.png",
];
