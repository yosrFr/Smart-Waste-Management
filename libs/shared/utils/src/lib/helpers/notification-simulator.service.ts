/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NotificationService,
  CreateNotificationDto,
  TypeNotif,
  TypeDechet,
  addNotification,
  AppNotification,
  EtatConteneur,
} from '@smart-waste-management/shared/data-access';

/**
 * Service simulateur de notifications
 * Génère automatiquement des notifications aléatoires pour la démo
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationSimulatorService {
  private simulationSubscription?: Subscription;
  private isRunning = false;

  private notificationService = inject(NotificationService);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  /**
   * Démarre la simulation de notifications
   * Génère une notification toutes les 30-60 secondes
   */
  startSimulation(): void {
    if (this.isRunning) {
      console.warn('Simulation déjà en cours');
      return;
    }

    this.isRunning = true;

    // Génère une notification à intervalle aléatoire
    this.simulationSubscription = interval(this.getRandomInterval())
      .pipe(
        switchMap(() => {
          const dto = this.generateRandomNotification();
          return this.notificationService.create(dto);
        })
      )
      .subscribe((notification) => {
        // Affiche le toast
        this.showToast(notification);

        // Ajoute au store NgRx
        this.store.dispatch(addNotification({ notification }));
      });
  }

  /**
   * Arrête la simulation de notifications
   */
  stopSimulation(): void {
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
      this.simulationSubscription = undefined;
    }
    this.isRunning = false;
  }

  /**
   * Vérifie si la simulation est en cours
   * @returns true si active
   */
  isSimulationRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Génère une notification aléatoire
   * @returns DTO de notification
   */
  private generateRandomNotification(): CreateNotificationDto {
    const types: TypeNotif[] = [
      TypeNotif.PLEIN,
      TypeNotif.ENDOMMAGE,
      TypeNotif.PANNE,
      TypeNotif.INCIDENT,
      TypeNotif.NOUVELLE_TACHE,
    ];

    const randomType = types[Math.floor(Math.random() * types.length)];

    switch (randomType) {
      case TypeNotif.PLEIN:
        return this.generateConteneurPleinNotification();
      case TypeNotif.ENDOMMAGE:
        return this.generateConteneurEndommageNotification();
      case TypeNotif.PANNE:
        return this.generateVehiculeEnPanneNotification();
      case TypeNotif.INCIDENT:
        return this.generateIncidentNotification();
      case TypeNotif.NOUVELLE_TACHE:
        return this.generateNouvelleTacheNotification();
      default:
        return this.generateConteneurPleinNotification();
    }
  }

  /**
   * Génère une notification de conteneur plein
   */
  private generateConteneurPleinNotification(): CreateNotificationDto {
    const typesDechets = Object.values(TypeDechet);
    const typeDechet =
      typesDechets[Math.floor(Math.random() * typesDechets.length)];

    return {
      type: TypeNotif.PLEIN,
      date: new Date().toISOString(),
      description: `Conteneur ${typeDechet} plein détecté`,
      details: {
        localisation: this.getRandomLocation(),
        typeConteneur: typeDechet,
        etat: EtatConteneur.PLEIN,
      },
    };
  }

  /**
   * Génère une notification de conteneur endommagé
   */
  private generateConteneurEndommageNotification(): CreateNotificationDto {
    const typesDechets = Object.values(TypeDechet);
    const typeDechet =
      typesDechets[Math.floor(Math.random() * typesDechets.length)];

    return {
      type: TypeNotif.ENDOMMAGE,
      date: new Date().toISOString(),
      description: `Conteneur ${typeDechet} endommagé signalé`,
      details: {
        localisation: this.getRandomLocation(),
        typeConteneur: typeDechet,
      },
    };
  }

  /**
   * Génère une notification de véhicule en panne
   */
  private generateVehiculeEnPanneNotification(): CreateNotificationDto {
    const matricules = ['TUN1234', 'TUN5678', 'TUN9012', 'TUN3456'];
    const typesDechets = Object.values(TypeDechet);

    return {
      type: TypeNotif.PANNE,
      date: new Date().toISOString(),
      description: 'Véhicule en panne signalé',
      details: {
        matricule: matricules[Math.floor(Math.random() * matricules.length)],
        typeDechet:
          typesDechets[Math.floor(Math.random() * typesDechets.length)],
        localisation: this.getRandomLocation(),
      },
    };
  }

  /**
   * Génère une notification d'incident sur le trajet
   */
  private generateIncidentNotification(): CreateNotificationDto {
    const incidents = [
      'Route barrée',
      'Accident de circulation',
      'Travaux en cours',
      'Manifestation',
      'Conditions météo difficiles',
    ];

    return {
      type: TypeNotif.INCIDENT,
      date: new Date().toISOString(),
      description: incidents[Math.floor(Math.random() * incidents.length)],
      details: {
        localisation: this.getRandomLocation(),
      },
    };
  }

  /**
   * Génère une notification de nouvelle tâche
   */
  private generateNouvelleTacheNotification(): CreateNotificationDto {
    const now = new Date();
    const dateDebut = new Date(now.getTime() + 3600000).toISOString(); // +1h
    const dateFin = new Date(now.getTime() + 18000000).toISOString(); // +5h

    return {
      type: TypeNotif.NOUVELLE_TACHE,
      date: new Date().toISOString(),
      description: 'Nouvelle tournée assignée',
      details: {
        tourneeId: 'T' + Math.floor(Math.random() * 1000),
        dateDebut,
        dateFin,
        vehiculeMatricule: 'TUN' + Math.floor(Math.random() * 10000),
        nombrePoints: 10 + Math.floor(Math.random() * 20),
      },
    };
  }

  /**
   * Génère une localisation aléatoire autour de Sfax
   */
  private getRandomLocation(): { latitude: number; longitude: number } {
    // Centre approximatif: Sfax (34.7065, 10.7487)
    const baseLat = 34.7065;
    const baseLng = 10.7487;
    const radius = 0.05; // ~5km de rayon

    return {
      latitude: baseLat + (Math.random() - 0.5) * radius,
      longitude: baseLng + (Math.random() - 0.5) * radius,
    };
  }

  /**
   * Affiche un toast (snackbar) pour une notification
   * @param notification Notification à afficher
   */
  private showToast(notification: AppNotification): void {
    const icon = this.getNotificationIcon(notification.type);

    this.snackBar.open(`${icon} ${notification.description}`, 'Voir', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [
        'notification-toast',
        `toast-${notification.type.toLowerCase()}`,
      ],
    });
  }

  /**
   * Retourne l'icône pour un type de notification
   * @param type Type de notification
   * @returns Emoji d'icône
   */
  private getNotificationIcon(type: TypeNotif): string {
    switch (type) {
      case TypeNotif.PLEIN:
        return '🗑️';
      case TypeNotif.ENDOMMAGE:
        return '⚠️';
      case TypeNotif.PANNE:
        return '🚛';
      case TypeNotif.INCIDENT:
        return '🚧';
      case TypeNotif.NOUVELLE_TACHE:
        return '📋';
      default:
        return '🔔';
    }
  }

  /**
   * Retourne un intervalle aléatoire entre 30 et 60 secondes
   */
  private getRandomInterval(): number {
    return 30000 + Math.floor(Math.random() * 30000);
  }
}
