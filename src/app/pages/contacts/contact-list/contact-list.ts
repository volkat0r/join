import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GroupedContacts, ContactWithInitials } from '../../../core/db/contacts.db';
import { ContactAddFormComponent } from '../../../components/contact-add-form/contact-add-form';
import { Button } from '../../../shared/ui/button/button';


@Component({
  selector: 'app-contact-list',
  imports: [ContactAddFormComponent, CommonModule, Button],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  @Input() groups: GroupedContacts[] = [];
  @Input() selectedId: number | null = null;
  @Output() search = new EventEmitter<Event>();
  @Output() select = new EventEmitter<ContactWithInitials>();
  @Output() added = new EventEmitter<void>();

  isContactModalOpen = false;

  openModal() {
    this.isContactModalOpen = true;
  }

  closeModal() {
    this.isContactModalOpen = false;
  }

  onAdded() {
    this.added.emit();
    this.closeModal();
  }
}
