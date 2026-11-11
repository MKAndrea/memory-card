import type { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  handleChoice: (card: CardType) => void;
  disabled: boolean;
}

export function Card({ card, handleChoice, disabled }: CardProps) {
  // La carta è visibile se è girata nel turno (isFlipped) o se è già indovinata (isMatched)
  const isRevealed = card.isFlipped || card.isMatched;

  // Assegna la classe del colore in base a quale giocatore ha trovato la coppia (P1 o P2)
  const matchedClass = card.matchedBy
    ? `matched-p${card.matchedBy}`
    : card.isMatched
    ? 'matched'
    : '';

  const handleClick = () => {
    if (!disabled && !isRevealed) {
      handleChoice(card);
    }
  };

  return (
    <div
      className={`card ${isRevealed ? 'flipped' : ''} ${matchedClass}`}
      onClick={handleClick}
    >
      <div className="card-inner">
        {/* Fronte della carta (scoperta) */}
        <div className="card-front">
          {/* Badge del giocatore che ha conquistato la carta */}
          {card.matchedBy && (
            <span className={`player-tag p${card.matchedBy}`}>
              G{card.matchedBy}
            </span>
          )}

          <span className="card-img">{card.img}</span>
          <p className="card-desc">{card.description}</p>
        </div>

        {/* Retro della carta (coperta) */}
        <div className="card-back">
          <span className="card-question">❓</span>
        </div>
      </div>
    </div>
  );
}