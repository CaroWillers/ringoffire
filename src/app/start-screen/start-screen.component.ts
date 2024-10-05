import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';  // Importiere Firestore
import { Game } from '../../models/game';   

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']  
})
export class StartScreenComponent {

  constructor(private router: Router, private firestore: Firestore) { }  // Füge Firestore hinzu

  newGame() { 
    const newGame = new Game(); 
    const gamesCollection = collection(this.firestore, 'games');
    
    // Spiel erstellen und mit der ID navigieren
    addDoc(gamesCollection, { ...newGame }).then((docRef) => { 
      const gameId = docRef.id;  // Die erzeugte ID des Spiels
      this.router.navigateByUrl(`/game/${gameId}`); // Zu game/:id navigieren
    }).catch(error => {
      console.error('Error creating new game: ', error);
    });
  }
}