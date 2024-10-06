import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']   
})

export class EditPlayerComponent implements OnInit {
  @Input() image: string = '';
  

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}

  allProfilePictures = ['boy.png', 'bussiness-man.png', 'girl.png', 'man.png', 'woman.png', 'wolf.png', 'unicorn.png'];

  ngOnInit(): void {
    // Deine Logik hier
  }

  closeDialog(picture?: string): void {
    this.dialogRef.close(picture);  
  }
  
  deletePlayer(): void {
      this.dialogRef.close('delete');  
   }

}
