import { Component, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsDb } from '../../core/db/contacts.db';
import { Contact, ContactWithInitials, GroupedContacts } from './../../core/db/contacts.db';
import { ContactDetails } from './contact-details/contact-details';
import { ContactList } from './contact-list/contact-list';
import { ContactHeader } from './contact-header/contact-header';
import { UserFeedbackComponent } from '../../shared/ui/user-feedback/user-feedback';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactDetails, ContactList, ContactHeader, UserFeedbackComponent],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {
  @ViewChild('feedback') feedback!: UserFeedbackComponent;

  groupedContacts = signal<GroupedContacts[]>([]);
  searchTerm = signal('');
  selected: ContactWithInitials | null = null;
  isMobileDetailOpen = false;

  constructor(private contactsDb: ContactsDb) {}

  /**
   * Fetches contacts from the database and initializes the grouped contacts signal.
   */
  async ngOnInit() {
    await this.contactsDb.getContacts();
    this.groupedContacts.set(this.sortAndGroup(this.contactsDb.contacts()));
  }

  /**
   * Filters grouped contacts by name, email, or phone when the search term is at least 3 characters.
   */
  filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (term.length < 3) return this.groupedContacts();
    return this.groupedContacts()
      .map((group) => ({
        ...group,
        contacts: group.contacts.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.phone.includes(term),
        ),
      }))
      .filter((group) => group.contacts.length > 0);
  });

  /**
   * Returns the uppercase initials from a full name (first and last name characters).
   * @param name - The full name to extract initials from.
   * @returns A string of up to two characters representing the initials.
   */
  private getInitials(name: string): string {
    const parts = name.split(' ');
    const [first, last] = [parts[0], parts.at(-1)];
    return (first?.[0] ?? '') + (last?.[0] ?? '');
  }

  /**
   * Sorts contacts alphabetically by name and groups them by their first letter.
   * @param contacts - The flat array of contacts to sort and group.
   * @returns An array of grouped contacts, each group keyed by its letter.
   */
  private sortAndGroup(contacts: Contact[]): GroupedContacts[] {
    const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    const groups: GroupedContacts[] = [];

    for (const contact of sorted) {
      const letter = contact.name[0].toUpperCase();
      const initials = this.getInitials(contact.name);
      let group = groups.find((g) => g.letter === letter);
      if (!group) {
        group = { letter, contacts: [] };
        groups.push(group);
      }
      group.contacts.push({ ...contact, initials });
    }

    return groups;
  }

  /**
   * Handles the search input event and updates the search term signal.
   * @param event - The native input event from the search field.
   */
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  /**
   * Selects a contact and opens the mobile detail view.
   * @param c - The contact to select.
   */
  selectContact(c: ContactWithInitials) {
    this.selected = c;
    this.isMobileDetailOpen = true;
  }

  /**
   * Closes the mobile detail view and clears the selection.
   */
  backToList() {
    this.isMobileDetailOpen = false;
    this.selected = null;
  }

  /**
   * Performs an update per edit action at Supabase.
   */
  async editSelected() {
    if (!this.selected) return;

    await this.contactsDb.getContacts();
    this.groupedContacts.set(this.sortAndGroup(this.contactsDb.contacts()));

    const updated = this.contactsDb.contacts().find(c => c.id === this.selected!.id);
    if (updated) {
      this.selected = { ...updated, initials: this.getInitials(updated.name) };
    }

    this.feedback.show(`Contact '${this.selected.name}' has been updated!`);
  }

  /**
   * Refreshes the contacts list from the database and shows a creation feedback message.
   */
  async onContactAdded() {
    await this.contactsDb.getContacts();
    this.groupedContacts.set(this.sortAndGroup(this.contactsDb.contacts()));

    this.feedback.show(`Contact has been created!`);
  }

  /**
   * Deletes the currently selected contact, refreshes the grouped list,
   * clears the selection, and shows a deletion feedback message.
   */
  async deleteSelected() {
    if (!this.selected) return;

    const deletedName = this.selected.name;

    await this.contactsDb.deleteContact(this.selected.id);

    const remaining = this.contactsDb.contacts().filter((c) => c.id !== this.selected!.id);
    this.groupedContacts.set(this.sortAndGroup(remaining));

    this.selected = null;
    this.isMobileDetailOpen = false;

    this.feedback.show(`Contact '${deletedName}' has been deleted!`);
  }
}
