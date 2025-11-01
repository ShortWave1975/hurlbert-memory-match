// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Card from "./components/card.jsx";
import { buildDeck, DEFAULT_FILES } from "./data/deck.js";
import "./App.css";

export default function App() {
  const [size, setSize] = useState(16);
  const [deck, setDeck] = useState(() => buildDeck(DEFAULT_FILES, 16));
  const [first, setFirst] = useState(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [showIntro, setShowIntro] = useState(true); // ✅ intro

  const timerRef = useRef(null);

  // sounds
  const flipSfx = useRef(makeAudio("/sfx/flip.mp3")).current;
  const matchSfx = useRef(makeAudio("/sfx/match.mp3")).current;
  const winSfx = useRef(makeAudio("/sfx/win.mp3")).current;

  const allMatched = matchedCount === deck.length && deck.length > 0;

  // ✅ check once if user has seen intro
  useEffect(() => {
    try {
      const seen = localStorage.getItem("hm_seenIntro");
      if (seen === "1") {
        setShowIntro(false);
      }
    } catch {
      // ignore if localStorage not available
    }
  }, []);

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

  // play win sound
  useEffect(() => {
    if (allMatched) safePlay(winSfx);
  }, [allMatched, winSfx, soundOn]);

  function safePlay(audio) {
    if (!soundOn) return;
    tryPlay(audio);
  }

  function reset(newSize = size) {
    setSize(newSize);
    const fresh = buildDeck(DEFAULT_FILES, newSize);
    setDeck(fresh);
    setFirst(null);
    setLock(false);
    setMoves(0);
    setMatchedCount(0);
    setStartedAt(null);
    setElapsed(0);
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
    safePlay(flipSfx);

    // reveal the clicked card
    setDeck((d) => d.map((c) => (c.id === id ? { ...c, revealed: true } : c)));

    // first card of pair
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
        safePlay(matchSfx);
        setDeck((d) =>
          d.map((c) =>
            c.pairId === clicked.pairId ? { ...c, matched: true } : c
          )
        );
        setMatchedCount((cnt) => cnt + 2);
      } else {
        // flip both back
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

  function handleCloseIntro() {
    setShowIntro(false);
    try {
      localStorage.setItem("hm_seenIntro", "1");
    } catch {
      // ignore
    }
  }

  return (
    <div className="page">
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
              <button
                className={`btn btn-sound ${soundOn ? "is-on" : "is-off"}`}
                onClick={() => setSoundOn((s) => !s)}
                type="button"
                aria-pressed={soundOn}
              >
                {soundOn ? "🔊 Sound: On" : "🔇 Sound: Off"}
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
              <p>
                Difficulty:{" "}
                <strong>
                  {size === 16 && "Easy (8 pairs)"}
                  {size === 20 && "Medium (10 pairs)"}
                  {size === 24 && "Hard (12 pairs)"}
                </strong>
              </p>
              <button className="btn" onClick={() => reset(size)}>
                Play Again
              </button>
            </section>
          ) : (
            <section className="board">
              {/* ✅ difficulty pill above board */}
              <div className="difficulty-pill" aria-label="Current difficulty">
                {size === 16 && "Easy (8 pairs)"}
                {size === 20 && "Medium (10 pairs)"}
                {size === 24 && "Hard (12 pairs)"}
              </div>

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

        {/* ✅ INTRO OVERLAY */}
        {showIntro && (
          <div className="intro-overlay" role="dialog" aria-modal="true">
            <div className="intro-card">
              <h2>🎄 Welcome, Hurlbert family!</h2>
              <p>
                Tap two matching cards to clear the board. Choose a difficulty up
                top, and turn sound on/off anytime.
              </p>
              <p className="intro-small">
                (You’ll only see this the first time on this device.)
              </p>
              <button className="btn intro-btn" onClick={handleCloseIntro}>
                Start Playing ➜
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* --- helpers for safe audio --- */
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
