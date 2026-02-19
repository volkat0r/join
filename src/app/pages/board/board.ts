import { Component } from '@angular/core';
import { ContactAddFormComponent } from '../../components/contact-add-form/contact-add-form';
import { CommonModule } from '@angular/common';
import { ContactEditFormComponent } from "../../components/contact-edit-form/contact-edit-form";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ContactAddFormComponent, CommonModule, ContactEditFormComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  // Beispiel:
  isContactModalOpen = false;

  openModal() {
    this.isContactModalOpen = true;
  }

  closeModal() {
    this.isContactModalOpen = false;
  }
}
