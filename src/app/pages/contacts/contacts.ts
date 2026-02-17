import { Component, OnInit, signal } from '@angular/core';
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
  groupedContacts = signal<GroupedContacts[]>([]);
  selected: ContactWithInitials | null = null;

  constructor(private contactsDb: ContactsDb) { }

  async ngOnInit() {
    await this.contactsDb.getContacts();
    this.groupedContacts.set(this.sortAndGroup(this.contactsDb.contacts()));
  }

  private getInitials(name: string): string {
    const parts = name.split(' ');
    const [first, last] = [parts[0], parts.at(-1)];
    return (first?.[0] ?? '') + (last?.[0] ?? '');
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

  selectContact(c: ContactWithInitials) {
    this.selected = c;
  }

  editSelected() {
    console.log('Edit:', this.selected);
    // später: Overlay oder Edit-Form öffnen
  }

  deleteSelected() {
    console.log('Delete:', this.selected);
    // später: delete logic
  }
}
