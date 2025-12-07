/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCurrentUser } from '@smart-waste-management/shared/data-access';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'smart-waste-management';
  private store = inject(Store);

  ngOnInit(): void {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.store.dispatch(loadCurrentUser());
      } catch (e) {
        console.error('Erreur lors de la lecture de currentUser:', e);
      }
    }
  }
}
