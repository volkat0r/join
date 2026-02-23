import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Centralized service responsible for creating and providing a single Supabase client instance.
 * This ensures that the entire application communicates with Supabase through one consistent,
 * preconfigured client, avoiding duplicate connections and simplifying database, auth,
 * and storage interactions across all services and components.
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  /**
   * Returns the initialized Supabase client.
   * Used by other services to perform database queries, authentication,
   * storage operations, and realtime subscriptions.
   */
  get client() {
    return this.supabase;
  }
}
