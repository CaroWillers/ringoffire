import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']   
})
export class PlayerComponent {
  @Input() name: string = '';  
  @Input() playerActive: boolean = false;  
  @Input() image: string = '';
 
  ngOnInit() {
    console.log(`Player: ${this.name}, Active: ${this.playerActive}`);  
  }
}
