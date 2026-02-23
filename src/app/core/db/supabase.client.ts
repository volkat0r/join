import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  private client: SupabaseClient;

  /**
   * Initializes the Supabase client using environment configuration.
   * Creates a single shared Supabase client instance for the application.
   */
  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  /**
   * Returns the initialized Supabase client instance.
   * Provides access to all Supabase features such as auth, database, and storage.
   */
  get supabase() {
    return this.client;
  }
}
