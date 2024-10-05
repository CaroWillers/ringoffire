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
  game!: Game;
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

  updateGame(): void {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, `games/${this.gameId}`);
      updateDoc(gameDocRef, {
        deck: this.game.deck,
        playedCards: this.game.playedCards,
        players: this.game.players,
        currentPlayer: this.game.currentPlayer,
        currentCard: this.currentCard,
      })
        .then(() => {
          console.log('Game updated successfully');
        })
        .catch((error) => {
          console.error('Error updating game: ', error);
        });
    } else {
      console.error('No game ID available to update.');
    }
  }

  ngOnInit(): void {
    // Initialisiere ein leeres Spiel-Objekt, um undefined-Probleme zu vermeiden
    this.game = new Game();
    this.game.players = [];
    this.game.deck = [];
    this.game.playedCards = [];
    this.game.currentPlayer = 0;
    this.game.pickCardAnimation = false;
    this.game.currentCard = '';
    this.game.player_images = [];

    // Dann lade das Spiel von Firestore
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id')!;
      this.loadGame();
    });
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
      this.currentCard = this.game.deck.pop() || '';

      console.log(
        'Vorheriger Spieler (vor der Prüfung):',
        this.game.currentPlayer
      );

      // Überprüfe, ob currentPlayer korrekt initialisiert ist
      if (isNaN(this.game.currentPlayer)) {
        console.error('currentPlayer ist NaN! Initialisierung auf 0.');
        this.game.currentPlayer = 0; // Setze currentPlayer auf den ersten Spieler
      }

      console.log(
        'Vorheriger Spieler (nach der Prüfung):',
        this.game.currentPlayer
      );
      console.log('Anzahl der Spieler:', this.game.players.length);

      // Wechsle zum nächsten Spieler, wenn Spieler vorhanden sind
      if (this.game.players.length > 0) {
        this.game.currentPlayer =
          (this.game.currentPlayer + 1) % this.game.players.length;
        console.log('Nächster Spieler:', this.game.currentPlayer);
      } else {
        console.error('Keine Spieler in der Liste.');
      }

      this.pickCardAnimation = true;
      this.updateGame();

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.updateGame();
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

  editPlayer(playerId: number) {
    console.log('Edit player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((selectedImage: string) => {
      if (selectedImage) {
        this.game.player_images[playerId] = '/assets/img/profile/' + selectedImage;  
        this.updateGame();
      }
    });
  }
}
