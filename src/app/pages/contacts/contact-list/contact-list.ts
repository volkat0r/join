import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GroupedContacts, ContactWithInitials } from '../../../core/db/contacts.db';

@Component({
  selector: 'app-contact-list',
  imports: [],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  @Input() groups: GroupedContacts[] = [];
  @Input() selectedId: number | null = null;
  @Output() search = new EventEmitter<Event>();
  @Output() select = new EventEmitter<ContactWithInitials>();
}
