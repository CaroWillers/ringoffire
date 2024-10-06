import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    GameInfoComponent,
    PlayerMobileComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  gameOver: boolean = false;
  game!: Game;
  game$!: Observable<Game>;
  games$: Observable<Game[]>;
  firestore: Firestore = inject(Firestore);
  gameId!: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const gamesCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(gamesCollection, {
      idField: 'id',
    }) as Observable<Game[]>;
  }

  addGame(): void {
    const newGame = new Game();
    const gamesCollection = collection(this.firestore, 'games');

    addDoc(gamesCollection, { ...newGame })
      .then((docRef) => {
        this.gameId = docRef.id;
        console.log('Game added with ID: ', this.gameId);
      })
      .catch((error) => {
        console.error('Error adding game: ', error);
      });
  }
 

  ngOnInit(): void {
    // Route param wird verwendet, um die gameId zu erhalten
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id')!;
  
      if (this.gameId) {
        // Wenn die gameId vorhanden ist, lade das Spiel von Firestore in Echtzeit
        const gameDocRef = doc(this.firestore, `games/${this.gameId}`);
        this.game$ = docData(gameDocRef) as Observable<Game>;
  
        // Abonniere die Echtzeit-Änderungen am Spiel
        this.game$.subscribe((gameData) => {
          if (gameData) {
            this.game = gameData;
          } else {
            // Initialisiere ein leeres Spiel-Objekt, falls keine Daten existieren
            this.initializeEmptyGame();
          }
        });
      }
    });
  }
  
  // Methode zum Initialisieren eines leeren Spiels, falls Firestore-Daten fehlen
  initializeEmptyGame(): void {
    this.game = new Game();
    this.game.players = [];
    this.game.deck = [];
    this.game.playedCards = [];
    this.game.currentPlayer = 0;
    this.game.pickCardAnimation = false;
    this.game.currentCard = '';
    this.game.player_images = [];
  }
  

  loadGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, `games/${this.gameId}`);
      getDoc(gameDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            this.game = docSnap.data() as Game;
          } else {
            console.error('No such game!');
          }
        })
        .catch((error) => {
          console.error('Error fetching game: ', error);
        });
    }
  }

  newGame() {
    this.game = new Game();
    const gamesCollection = collection(this.firestore, 'games');
    addDoc(gamesCollection, { ...this.game })
      .then(() => {
        console.log('New game started and saved to Firestore');
      })
      .catch((error) => {
        console.error('Error starting new game: ', error);
      });
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.deck.length > 0) {
      // Ziehe die oberste Karte vom Deck
      this.currentCard = this.game.deck.pop() || '';

      // Überprüfe, ob currentPlayer korrekt initialisiert ist
      if (isNaN(this.game.currentPlayer)) {
        this.game.currentPlayer = 0; // Setze currentPlayer auf den ersten Spieler
      }

      // Wechsle zum nächsten Spieler, wenn Spieler vorhanden sind
      if (this.game.players.length > 0) {
        this.game.currentPlayer =
          (this.game.currentPlayer + 1) % this.game.players.length;
      } else {
        console.error('Keine Spieler in der Liste.');
      }

      // Starte die Kartenanimation
      this.pickCardAnimation = true;
      this.updateGame(); // Aktualisiere das Spiel in der Datenbank

      // Beende die Animation und aktualisiere das Spiel erneut nach 1 Sekunde
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard); // Füge die Karte zu den gespielten Karten hinzu
        this.pickCardAnimation = false;
        this.updateGame();

        // Überprüfe, ob das Deck leer ist, und beende das Spiel, wenn keine Karten mehr vorhanden sind
        if (this.game.deck.length === 0) {
          this.gameOver = true;
        }
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('/assets/img/profile/user.png');

        this.updateGame();
      }
    });
  }

  updateGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, `games/${this.gameId}`);
      updateDoc(gameDocRef, { ...this.game })
        .then(() => console.log('Game updated successfully'))
        .catch(error => console.error('Error updating game:', error));
    }
  }
  
  

  editPlayer(playerId: number) {
    // Öffnet den Dialog zur Bearbeitung des Spielers
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      data: { playerId }, // Übergibt die Spieler-ID an den Dialog
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      this.handlePlayerAction(playerId, result); // Aufruf der neuen Funktion zur Verarbeitung des Ergebnisses
    });
  }

  // Die Funktion, die das Ergebnis des Dialogs verarbeitet
  handlePlayerAction(playerId: number, result: string): void {
    if (result === 'delete') {
      // Spieler löschen
      this.game.players.splice(playerId, 1); // Entfernt den Spieler aus dem players-Array
      this.game.player_images.splice(playerId, 1); // Entfernt das Profilbild des Spielers
      this.updateGame(); // Aktualisiert den Spielstatus in der Datenbank
    } else if (result) {
      // Profilbild aktualisieren
      this.game.player_images[playerId] = '/assets/img/profile/' + result; // Profilbild speichern
      this.updateGame(); // Aktualisiert den Spielstatus in der Datenbank
    }
  }

  // Methode zum Neustart des Spiels
  restartGame() {
    this.gameOver = false;
    this.game = new Game();
    this.game.initializeDeck();
    this.game.shuffleDeck();
    this.game.playedCards = [];
    this.game.currentPlayer = 0;
    this.updateGame();
  }
}
