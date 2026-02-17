import { Injectable } from '@angular/core';
import { SupabaseClientService } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class UsersDb {
  constructor(private supa: SupabaseClientService) { }

  getUsers() {

  }

  setUser(user: { name: string; email: string , password: string , color: string }) {

  }

  updateUser(id: number, user: { name: string; email: string, password: string, color: string }) {

  }

  deleteUser(id: number) {

  }
}
