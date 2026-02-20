import { CommonModule } from '@angular/common';
import { ContactAddFormComponent } from './../../components/contact-add-form/contact-add-form';
import { Component } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { InputFieldComponent } from '../../shared/ui/input-field/input-field';

@Component({
  selector: 'app-test-component',
  imports: [
    ContactAddFormComponent,
    Button,
    InputFieldComponent,
    CommonModule
  ],
  templateUrl: './test-component.html',
  styleUrl: './test-component.scss',
})
export class TestComponent {
  // Beispiel:
  isContactModalOpen = false;

  openModal() {
    this.isContactModalOpen = true;
  }

  closeModal() {
    this.isContactModalOpen = false;
  }
}
