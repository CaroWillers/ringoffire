export class Game {
    public players: string[] = [];
    public deck: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;


constructor() {
    for(let i = 1; i < 14; i++) { 
        this.deck.push('ace_' + i);
        this.deck.push('clubs_' + i);
        this.deck.push('diamonds_' + i);
        this.deck.push('hearts_' + i);
        } 
        shuffle(this.deck);
    }
}

function shuffle(array: string[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
       array[randomIndex], array[currentIndex]];
    }
  }