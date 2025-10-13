// src/components/card.jsx
import "./card.css";

export default function Card({ img, isRevealed, isMatched, onClick }) {
  const ariaLabel = isMatched ? "Matched card" : (isRevealed ? "Revealed card" : "Hidden card");
  return (
    <button
      className={`card ${isRevealed ? "is-flipped" : ""} ${isMatched ? "is-matched" : ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={isMatched}
    >
      <div className="card_inner">
        <div className="card_face card_face--front" />
        <div className="card_face card_face--back">
          <img src={img} alt="" draggable={false} />
        </div>
      </div>
    </button>
  );
}
