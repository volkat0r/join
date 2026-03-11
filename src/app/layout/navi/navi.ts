import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { Subscription } from '@supabase/supabase-js';

@Component({
  selector: 'app-navi',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navi.html',
  styleUrl: './navi.scss',
})
export class Navi implements OnInit, OnDestroy {
  isLoggedIn = signal<boolean>(false);
  private authSubscription?: Subscription;

  /**
   * Creates the navi component.
   * @param supabase Supabase service used for session/auth state.
   */
  constructor(private supabase: SupabaseService) {}

  /**
   * Initializes auth state and subscribes to auth changes.
   * @returns Promise that resolves when initial auth state is applied.
   */
  async ngOnInit() {
    const { data } = await this.supabase.getSession();
    this.isLoggedIn.set(!!data.session);
    this.subscribeToAuthChanges();
  }

  /**
   * Subscribes to auth state changes and updates login status.
   * @returns Nothing.
   */
  private subscribeToAuthChanges() {
    const {
      data: { subscription },
    } = this.supabase.onAuthStateChange((_event, session) => {
      this.isLoggedIn.set(!!session);
    });

    this.authSubscription = subscription;
  }

  /**
   * Cleans up auth-state subscription on component destroy.
   * @returns Nothing.
   */
  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
