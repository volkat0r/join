import { Injectable } from '@angular/core';
import { SupabaseClientService } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class ContactsDb {
  constructor(private supa: SupabaseClientService) { }

  getContacts() {

  }

  addContact() {

  }

  updateContact() {

  }

  deleteContact() {

  }
}
