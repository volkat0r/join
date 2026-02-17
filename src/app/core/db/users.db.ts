import { Injectable, signal } from '@angular/core';
import { SupabaseClientService } from './supabase.client';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class UsersDb {

  users = signal<User[]>([]);

  constructor(private supa: SupabaseClientService) { }

  async getUsers() {
    const { data: users, error } = await this.supa.supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('[Supabase] Error loading users:', error.message);
      return;
    }

    if (!users) return;
    this.users.set(users || []);
  }

  async setUser(user: Omit<User, 'id'>) {
    const { data, error } = await this.supa.supabase
      .from('users')
      .insert([{ ...user }])
      .select();

    if (error) {
      console.error('[Supabase] Error adding user:', error.message);
      return;
    }
  }

  async updateUser(id: number, update: Partial<User>) {
    const { data, error } = await this.supa.supabase
      .from('users')
      .update(update)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Supabase] Error updating user:', error.message);
      return;
    }
  }

  async deleteUser(id: number) {
    const { error } = await this.supa.supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase] Error deleting user:', error.message);
      return;
    }
  }
}
