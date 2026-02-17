import { Component, OnInit } from '@angular/core';
import { ContactsDb } from '../../core/db/contacts.db';
import { Contact, ContactWithInitials, GroupedContacts } from './../../core/db/contacts.db';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {
  groupedContacts: GroupedContacts[] = [];

  constructor(private contactsDb: ContactsDb) {}

  async ngOnInit() {
    await this.contactsDb.getContacts();
    this.groupedContacts = this.sortAndGroup(this.contactsDb.contacts());
    console.log('[Contacts] Grouped:', this.groupedContacts);
  }


  private getInitials(name: string): string {
    const [firstName, lastName] = name.split(' ');
    return (firstName?.[0] ?? '') + (lastName?.[0] ?? '');
  }

  private sortAndGroup(contacts: Contact[]): GroupedContacts[] {
    const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    const groups: GroupedContacts[] = [];

    for (const contact of sorted) {
      const letter = contact.name[0].toUpperCase();
      const initials = this.getInitials(contact.name);
      let group = groups.find(g => g.letter === letter);
      if (!group) {
        group = { letter, contacts: [] };
        groups.push(group);
      }
      group.contacts.push({ ...contact, initials });
    }

    return groups;
  }
}
