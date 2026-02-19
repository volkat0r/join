import { Component } from '@angular/core';
import { ContactAddFormComponent } from '../../components/contact-add-form/contact-add-form';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ContactAddFormComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {}
