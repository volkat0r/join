import { Component, OnInit } from '@angular/core';
import { ContactsDb } from '../../core/db/contacts.db';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {

  constructor(private contactsDb: ContactsDb) {}

  async ngOnInit() {
    await this.contactsDb.getContacts();
  }
}
