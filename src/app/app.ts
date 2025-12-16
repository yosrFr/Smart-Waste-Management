/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loadCurrentUser,
  loadNotifications,
  loadPointsCollecte,
  loadTournees,
  loadVehicules,
  selectAllTournees,
  selectAllVehicules,
  selectNotificationsLoading,
  selectPointsCollecteEntities,
} from '@smart-waste-management/shared/data-access';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';

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

    // Charger les entités essentielles : Points de collecte, Tournées et Véhicules
    this.store.dispatch(loadPointsCollecte());
    this.store.dispatch(loadTournees());
    this.store.dispatch(loadVehicules());

    // Attendre que toutes les entités soient chargées avant de charger les notifications
    this.store
      .select(selectPointsCollecteEntities)
      .pipe(
        takeUntil(this.destroy$),
        filter((points) => points && Object.keys(points).length > 0), // Vérifier que les points de collecte sont chargés
        switchMap(() => this.store.select(selectAllTournees)), // Une fois les points chargés, on charge les tournées
        filter((tournees) => tournees && tournees.length > 0), // Vérifier que les tournées sont chargées
        switchMap(() => this.store.select(selectAllVehicules)), // Une fois les tournées chargées, on charge les véhicules
        filter((vehicules) => vehicules && vehicules.length > 0), // Vérifier que les véhicules sont chargés
        switchMap(() => {
          // Une fois que tout est chargé, on charge les notifications
          this.store.dispatch(loadNotifications());
          return this.store.select(selectNotificationsLoading); // Attendre le chargement des notifications
        })
      )
      .subscribe((loading) => {
        if (!loading) {
          // console.log(
          //   'Toutes les données sont chargées, notifications prêtes.'
          // );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
