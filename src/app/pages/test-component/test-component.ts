import { CommonModule } from '@angular/common';
import { ContactAddFormComponent } from './../../components/contact-add-form/contact-add-form';
import { Component } from '@angular/core';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-test-component',
  imports: [ContactAddFormComponent, Button, CommonModule],
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
