import { useState, useEffect } from 'react';
import { Card } from './components/Card';
import type { Card as CardType } from './types';
import './App.css';

// Collezione completa di elementi base (fino a 12 coppie = 24 carte)
const ALL_BASE_CARDS = [
  { pairId: 1, description: 'Cane', img: '🐶' },
  { pairId: 2, description: 'Gatto', img: '🐱' },
  { pairId: 3, description: 'Volpe', img: '🦊' },
  { pairId: 4, description: 'Panda', img: '🐼' },
  { pairId: 5, description: 'Leone', img: '🦁' },
  { pairId: 6, description: 'Rana', img: '🐸' },
  { pairId: 7, description: 'Pizza', img: '🍕' },
  { pairId: 8, description: 'Razzo', img: '🚀' },
  { pairId: 9, description: 'Gelato', img: '🍦' },
  { pairId: 10, description: 'Unicorno', img: '🦄' },
  { pairId: 11, description: 'Joypad', img: '🎮' },
  { pairId: 12, description: 'Alieno', img: '👾' },
];

export function App() {
  // 1. Numero di coppie selezionato (default: 8 coppie = 16 carte, max: 12 coppie = 24 carte)
  const [pairsCount, setPairsCount] = useState<number>(8);

  // 2. Stato del mazzo di carte
  const [cards, setCards] = useState<CardType[]>([]);
  const [turns, setTurns] = useState<number>(0);

  // 3. Le due carte selezionate nel turno
  const [choiceOne, setChoiceOne] = useState<CardType | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<CardType | null>(null);

  // 4. Blocca i click durante il controllo del turno
  const [disabled, setDisabled] = useState<boolean>(false);

  // 5. Modalità a Coppie (2 Giocatori a turni)
  const [isTwoPlayers, setIsTwoPlayers] = useState<boolean>(true);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [scoreP1, setScoreP1] = useState<number>(0);
  const [scoreP2, setScoreP2] = useState<number>(0);

  // Inizia una nuova partita con il numero di coppie scelto
  const startNewGame = (selectedPairsCount: number = pairsCount) => {
    // 1. Peschiamo il numero di elementi desiderati dalla lista base
    const selectedBase = ALL_BASE_CARDS.slice(0, selectedPairsCount);

    const deck: CardType[] = [];

    // 2. Per ciascun elemento creiamo 2 carte gemelle
    selectedBase.forEach((item) => {
      // Prima carta della coppia
      deck.push({
        id: deck.length + 1,
        pairId: item.pairId,
        description: item.description,
        img: item.img,
        isMatched: false,
        isFlipped: false,
      });

      // Seconda carta della coppia (stesso pairId, diverso id)
      deck.push({
        id: deck.length + 1,
        pairId: item.pairId,
        description: item.description,
        img: item.img,
        isMatched: false,
        isFlipped: false,
      });
    });

    // 3. Mescola casualmente le carte
    const shuffledDeck = deck.sort(() => Math.random() - 0.5);

    setCards(shuffledDeck);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setDisabled(false);
    setActivePlayer(1);
    setScoreP1(0);
    setScoreP2(0);
  };

  // Crea il mazzo al primo caricamento del gioco
  useEffect(() => {
    startNewGame(pairsCount);
  }, []);

  // Gestione del cambio numero di carte dal menu a tendina
  const handlePairsCountChange = (newCount: number) => {
    setPairsCount(newCount);
    startNewGame(newCount);
  };

  // Gestione click su una carta: imposta isFlipped a true sulla carta cliccata
  const handleChoice = (card: CardType) => {
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    if (!choiceOne) {
      setChoiceOne(card);
    } else {
      setChoiceTwo(card);
    }
  };

  // Controlla se le due carte hanno lo stesso pairId
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true); // Impedisce altri click durante il controllo

      if (choiceOne.pairId === choiceTwo.pairId) {
        // COPPIA CORRETTA:
        // impostiamo isMatched = true e salviamo quale giocatore l'ha trovata (matchedBy)
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.pairId === choiceOne.pairId
              ? {
                  ...c,
                  isMatched: true,
                  isFlipped: true,
                  matchedBy: isTwoPlayers ? activePlayer : undefined,
                }
              : c
          )
        );

        // Aggiungi punto al giocatore di turno
        if (activePlayer === 1) {
          setScoreP1((prev) => prev + 1);
        } else {
          setScoreP2((prev) => prev + 1);
        }

        // Chi indovina continua a giocare
        resetTurn(true);
      } else {
        // COPPIA ERRATA: aspetta 1 secondo e poi rigira le carte (isFlipped = false)
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === choiceOne.id || c.id === choiceTwo.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          resetTurn(false);
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Resetta le scelte e passa al prossimo turno
  const resetTurn = (wasMatch: boolean) => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);

    // Se il giocatore sbaglia in modalità a coppie, il turno passa all'altro
    if (!wasMatch && isTwoPlayers) {
      setActivePlayer((prev) => (prev === 1 ? 2 : 1));
    }
  };

  // Partita finita se tutte le carte sono state indovinate (isMatched: true)
  const isGameOver = cards.length > 0 && cards.every((card) => card.isMatched);

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🃏 Memory Card</h1>
        <p className="subtitle">Trova le coppie! Scegli il numero di carte e sfida il tuo compagno.</p>

        {/* Barra Opzioni e Controlli */}
        <div className="controls-row">
          <div className="setting-item">
            <label htmlFor="card-count-select">Numero di Carte:</label>
            <select
              id="card-count-select"
              className="select-custom"
              value={pairsCount}
              onChange={(e) => handlePairsCountChange(Number(e.target.value))}
            >
              <option value={4}>8 Carte (4 coppie)</option>
              <option value={6}>12 Carte (6 coppie)</option>
              <option value={8}>16 Carte (8 coppie)</option>
              <option value={10}>20 Carte (10 coppie)</option>
              <option value={12}>24 Carte (12 coppie - Massimo)</option>
            </select>
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => startNewGame(pairsCount)}>
              🔄 Nuova Partita
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsTwoPlayers(!isTwoPlayers);
                startNewGame(pairsCount);
              }}
            >
              👥 {isTwoPlayers ? '2 Giocatori (A Coppie)' : '1 Giocatore (Singolo)'}
            </button>
          </div>
        </div>
      </header>

      {/* Tabellone Punteggio con Colori Distinti per Giocatore */}
      {isTwoPlayers ? (
        <div className="scoreboard">
          <div className={`player-card player-1 ${activePlayer === 1 ? 'active' : ''}`}>
            <h3>🔵 Giocatore 1 {activePlayer === 1 && '👈 Turno'}</h3>
            <p className="score">Coppie: <strong>{scoreP1}</strong></p>
          </div>
          <div className="vs-badge">VS</div>
          <div className={`player-card player-2 ${activePlayer === 2 ? 'active' : ''}`}>
            <h3>🔴 Giocatore 2 {activePlayer === 2 && '👈 Turno'}</h3>
            <p className="score">Coppie: <strong>{scoreP2}</strong></p>
          </div>
        </div>
      ) : (
        <div className="single-stats">
          <p>Mosse effettuate: <strong>{turns}</strong></p>
        </div>
      )}

      {/* Fine partita */}
      {isGameOver && (
        <div className="game-over-banner">
          {isTwoPlayers ? (
            <h2>
              {scoreP1 > scoreP2 && '🎉 Ha vinto il Giocatore 1 (Blu)!'}
              {scoreP2 > scoreP1 && '🎉 Ha vinto il Giocatore 2 (Rosa)!'}
              {scoreP1 === scoreP2 && '🤝 Pareggio perfetto!'}
            </h2>
          ) : (
            <h2>🎉 Complimenti! Hai completato il gioco in {turns} tentativi!</h2>
          )}
        </div>
      )}

      {/* Griglia dinamica delle carte */}
      <div className={`card-grid count-${cards.length}`}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default App;