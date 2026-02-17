import { Injectable, signal } from '@angular/core';
import { SupabaseClientService } from './supabase.client';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class ContactsDb {

  contacts = signal<Contact[]>([]);

  constructor(private supa: SupabaseClientService) { }

  async getContacts() {
    const { data: contacts, error } = await this.supa.supabase
      .from('contacts')
      .select('*');

    if (error) {
      console.error('[Supabase] Error loading contacts:', error.message);
      return;
    }

    console.log('[Supabase] Contacts response:', contacts);
    if (!contacts) return;
    this.contacts.set(contacts || []);
  }

  async setContact(contact: Omit<Contact, 'id'>) {
    const { data, error } = await this.supa.supabase
      .from('contacts')
      .insert([{ ...contact }])
      .select();

    if (error) {
      console.error('[Supabase] Error adding contact:', error.message);
      return;
    }

  }

  async updateContact(id: number, update: Partial<Contact>) {
    const { data, error } = await this.supa.supabase
      .from('contacts')
      .update(update)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Supabase] Error updating contact:', error.message);
      return;
    }
  }

  async deleteContact(id: number) {
    const { error } = await this.supa.supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase] Error deleting contact:', error.message);
      return;
    }
  }
}
