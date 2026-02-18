import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContactWithInitials } from '../../core/db/contacts.db';

@Component({
  selector: 'app-contact-details',
  imports: [],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
})
export class ContactDetails {
  @Input() contact: ContactWithInitials | null = null;
  @Output() edit = new EventEmitter<ContactWithInitials>();
  @Output() delete = new EventEmitter<ContactWithInitials>();
}
