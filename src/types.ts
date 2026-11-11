// Modello dati per la singola Carta
export interface Card {
  id: number;            // Identificativo univoco della singola carta
  pairId: number;        // Identificativo della coppia (uguale per le due carte gemelle)
  description: string;   // Descrizione o nome della carta
  img: string;           // Immagine o icona/emoji rappresentativa
  isMatched: boolean;    // true se la carta è stata indovinata
  isFlipped: boolean;    // true se la carta è attualmente scoperta a faccia in su
  matchedBy?: 1 | 2;     // Giocatore che ha trovato la coppia (1 o 2) per colorare la carta
}