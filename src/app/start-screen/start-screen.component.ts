import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']  
})
export class StartScreenComponent {

  constructor(private router: Router) { }  

  newGame() {
    // Start Game
    this.router.navigateByUrl('/game');  
  }
}
