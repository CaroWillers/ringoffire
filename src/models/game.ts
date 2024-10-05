export class Game {
  public players: string[] = [];
  public player_images: string []= [];
  public deck: string[] = [];
  public playedCards: string[] = [];
  public currentPlayer: number = 0;
  public pickCardAnimation = false;
  public currentCard: string = '';

  id: any;

  constructor() {
    this.initializeDeck();  // Set up the deck with all cards
    this.shuffleDeck();     // Shuffle the deck after initialization
  }

  // Method to initialize the deck with all cards (1 to 13 of each suit)
  public initializeDeck(): void {
    for (let i = 1; i <= 13; i++) {
      this.deck.push('ace_' + i);        // Add Ace cards
      this.deck.push('clubs_' + i);      // Add Clubs cards
      this.deck.push('diamonds_' + i);   // Add Diamonds cards
      this.deck.push('hearts_' + i);     // Add Hearts cards
    }
  }

  // Public method to shuffle the deck using Fisher-Yates algorithm
  public shuffleDeck(): void {
    let currentIndex = this.deck.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.deck[currentIndex], this.deck[randomIndex]] = [
        this.deck[randomIndex], this.deck[currentIndex],
      ];
    }
  }

  // Method to convert the game state to a JSON object for saving
  public toJson() {
    return {
      players: this.players,
      player_images: this.player_images,
      deck: this.deck,
      playedCards: this.playedCards,
      currentPlayer: this.currentPlayer,
      pickCardAnimation: this.pickCardAnimation,
      currentCard: this.currentCard
    };
  }
}
