// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Card from "./components/card.jsx";
import { buildDeck, DEFAULT_FILES } from "./data/deck.js";
import "./App.css";

export default function App() {
  // difficulty (number of cards)
  const [size, setSize] = useState(16);

  // build the very first deck once (random subset)
  const [deck, setDeck] = useState(() => buildDeck(DEFAULT_FILES, 16));

  const [first, setFirst] = useState(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // sounds (stable for this mount)
  const flipSfx = useRef(makeAudio("/sfx/flip.mp3")).current;
  const matchSfx = useRef(makeAudio("/sfx/match.mp3")).current;
  const winSfx = useRef(makeAudio("/sfx/win.mp3")).current;

  const allMatched = matchedCount === deck.length && deck.length > 0;

  // timer
  useEffect(() => {
    if (startedAt && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAt) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startedAt]);

  // win sound
  useEffect(() => {
    if (allMatched) tryPlay(winSfx);
  }, [allMatched, winSfx]);

  function reset(newSize = size) {
    // set difficulty
    setSize(newSize);

    // 🔁 new randomized deck every single time
    const fresh = buildDeck(DEFAULT_FILES, newSize);
    setDeck(fresh);

    // reset gameplay state
    setFirst(null);
    setLock(false);
    setMoves(0);
    setMatchedCount(0);
    setStartedAt(null);
    setElapsed(0);

    // stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    window.scrollTo(0, 0);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function revealCard(id) {
    if (lock) return;
    const clicked = deck.find((c) => c.id === id);
    if (!clicked || clicked.matched || clicked.revealed) return;

    if (!startedAt) setStartedAt(Date.now());
    tryPlay(flipSfx);

    // flip card
    setDeck((d) => d.map((c) => (c.id === id ? { ...c, revealed: true } : c)));

    // if it's the first card
    if (!first) {
      setFirst({ ...clicked, revealed: true });
      return;
    }

    // second card
    setLock(true);
    setMoves((m) => m + 1);
    const isMatch = first.pairId === clicked.pairId;

    setTimeout(() => {
      if (isMatch) {
        tryPlay(matchSfx);
        setDeck((d) =>
          d.map((c) =>
            c.pairId === clicked.pairId ? { ...c, matched: true } : c
          )
        );
        setMatchedCount((cnt) => cnt + 2);
      } else {
        // flip back
        setDeck((d) =>
          d.map((c) =>
            c.id === first.id || c.id === id ? { ...c, revealed: false } : c
          )
        );
      }
      setFirst(null);
      setLock(false);
    }, 600);
  }

  // columns per difficulty
  const cols = size === 16 ? 4 : size === 20 ? 5 : 6;

  return (
    <main className="wrap">
      <header className="topbar" role="banner">
        <div className="topbar__inner">
          <h1>🎄 Hurlbert Family Memory Match</h1>
          <div className="controls">
            <div className="stat">
              Moves: <strong>{moves}</strong>
            </div>
            <div className="stat">
              Time: <strong>{formatTime(elapsed)}</strong>
            </div>

            <select
              className="sel"
              aria-label="Difficulty"
              onChange={(e) => reset(Number(e.target.value))}
              value={size}
            >
              <option value={16}>Easy (8 pairs)</option>
              <option value={20}>Medium (10 pairs)</option>
              <option value={24}>Hard (12 pairs)</option>
            </select>

            <button className="btn" onClick={() => reset(size)}>
              New Game
            </button>
          </div>
        </div>
      </header>

      <div className="content">
        {allMatched ? (
          <section className="win">
            <h2>✨ You matched them all!</h2>
            <p>
              Moves: <strong>{moves}</strong> · Time:{" "}
              <strong>{formatTime(elapsed)}</strong>
            </p>
            <button className="btn" onClick={() => reset(size)}>
              Play Again
            </button>
          </section>
        ) : (
          <section className="board">
            <div
              className="grid"
              aria-label="Memory board"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))`,
              }}
            >
              {deck.map((c) => (
                <div className="cell" key={c.id}>
                  <Card
                    img={c.img}
                    isRevealed={c.revealed}
                    isMatched={c.matched}
                    onClick={() => revealCard(c.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="foot">
        <small>Tip: tap any two cards to find a pair.</small>
      </footer>

      {/* ❄️ Snow layer */}
      <div className="snow">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 10}s`,
              fontSize: `${0.6 + Math.random() * 1.4}em`,
            }}
          >
            ❄
          </span>
        ))}
      </div>
    </main>
  );
}

// --- helpers for safe audio ---
function makeAudio(src) {
  const a = new Audio();
  a.src = src;
  a.preload = "auto";
  a.volume = 0.6;
  return a;
}
function tryPlay(audio) {
  if (!audio) return;
  const p = audio.cloneNode();
  p.volume = audio.volume;
  p.play().catch(() => {});
}
