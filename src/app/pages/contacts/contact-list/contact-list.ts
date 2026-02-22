import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GroupedContacts, ContactWithInitials } from '../../../core/db/contacts.db';
import { ContactAddFormComponent } from '../../../components/contact-add-form/contact-add-form';
import { Button } from '../../../shared/ui/button/button';
import { InputFieldComponent } from '../../../shared/ui/input-field/input-field';


@Component({
  selector: 'app-contact-list',
  imports: [
            ContactAddFormComponent,
            CommonModule,
            Button,
            InputFieldComponent
          ],
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
  searchError: string | null = null;

  onSearchInput(event: Event) {
    this.search.emit(event);
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    if (term.length < 3) {
      this.searchError = null;
      return;
    }
    const hasResults = this.groups.some(g =>
      g.contacts.some(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
      )
    );
    this.searchError = hasResults ? null : 'No contacts found';
  }

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
