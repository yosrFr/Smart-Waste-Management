/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AuthService,
  loadEmployes,
  loadNotifications,
  loadPointsCollecte,
  loadTournees,
  loadVehicules,
  selectIsAuthenticated,
} from '@smart-waste-management/shared/data-access';
import { Observable, Subject } from 'rxjs';

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
  private destroy$: Subject<void> = new Subject<void>();
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadData();
    }

    this.authService.restoreSession();
  }

  private loadData(): void {
    this.store.dispatch(loadEmployes());
    this.store.dispatch(loadVehicules());
    this.store.dispatch(loadPointsCollecte());
    this.store.dispatch(loadTournees());
    this.store.dispatch(loadNotifications());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
