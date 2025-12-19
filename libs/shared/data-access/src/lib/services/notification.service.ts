/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  ApiNotification,
  AppNotification,
  NotificationConteneurEndommage,
  NotificationConteneurPlein,
  NotificationIncident,
  NotificationNouvelleTache,
  NotificationPanneVehicule,
  PointDeCollecte,
  Tournee,
  Vehicule,
} from '../models';
import { HttpClient } from '@angular/common/http';
import { TypeNotif } from '../enums';

/**
 * Service pour gérer les notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = '/api/notifications';

  private http = inject(HttpClient);

  /**
   * Récupère toutes les notifications
   * @returns Observable avec la liste des notifications triées par date
   */
  getAll(): Observable<ApiNotification[]> {
    return this.http.get<ApiNotification[]>(`${this.apiUrl}/all`);
  }

  enrichNotifications(
    notif: ApiNotification,
    tournees: Tournee[],
    vehicules: Vehicule[],
    points: PointDeCollecte[]
  ): AppNotification {
    switch (notif.type) {
      case TypeNotif.NOUVELLE_TACHE:
        return this.mapNouvelleTache(
          notif as NotificationNouvelleTache,
          tournees,
          vehicules
        );

      case TypeNotif.PLEIN:
        return this.mapConteneurPlein(
          notif as NotificationConteneurPlein,
          points
        );

      case TypeNotif.ENDOMMAGE:
        return this.mapConteneurEndommage(
          notif as NotificationConteneurEndommage,
          points
        );

      case TypeNotif.PANNE_VEHICULE:
        return this.mapPanneVehicule(
          notif as NotificationPanneVehicule,
          vehicules
        );

      case TypeNotif.INCIDENT:
        return this.mapIncident(notif as NotificationIncident);

      default:
        return Object.assign({}, notif, { details: {} });
    }
  }

  mapNouvelleTache(
    notif: NotificationNouvelleTache,
    tournees: Tournee[],
    vehicules: Vehicule[]
  ): AppNotification {
    const tournee = tournees.find((t) => t.id === notif.tourneeId);
    const vehicule = vehicules.find((v) => v.id === notif.vehiculeId);

    if (!tournee || !vehicule) {
      throw new Error(
        `Tournee ou vehicule introuvable pour la notification ${notif.id}`
      );
    }

    return {
      ...notif,
      details: {
        nbPointCollecte: tournee.pointsDeCollecteIds.filter(Boolean).length,
        dateDebut: tournee.dateDebut,
        dateFin: tournee.dateFin,
        vehiculeMatricule: vehicule.matricule,
      },
    };
  }

  mapConteneurEndommage(
    notif: NotificationConteneurEndommage,
    points: PointDeCollecte[]
  ): AppNotification {
    const point = points.find((p) => p.id === notif.pointDeCollecteId);

    if (!point) {
      throw new Error(
        `Point de collecte introuvable pour la notification ${notif.id}`
      );
    }

    return {
      ...notif,
      details: {
        localisation: point.localisation,
        typeConteneur: point.typeDechet,
      },
    };
  }

  mapConteneurPlein(
    notif: NotificationConteneurPlein,
    points: PointDeCollecte[]
  ): AppNotification {
    const point = points.find((p) => p.id === notif.pointDeCollecteId);

    if (!point) {
      throw new Error(
        `Point de collecte introuvable pour la notification ${notif.id}`
      );
    }

    return {
      ...notif,
      details: {
        localisation: point.localisation,
        typeConteneur: point.typeDechet,
        niveauRemplissage: point.niveauRemplissage,
      },
    };
  }

  mapPanneVehicule(
    notif: NotificationPanneVehicule,
    vehicules: Vehicule[]
  ): AppNotification {
    const vehicule = vehicules.find((v) => v.id === notif.vehiculeId);

    if (!vehicule) {
      throw new Error(`Vehicule introuvable pour la notification ${notif.id}`);
    }

    return {
      ...notif,
      details: {
        matricule: vehicule.matricule,
        typeDechet: vehicule.typeDechet,
      },
    };
  }

  mapIncident(notif: NotificationIncident): AppNotification {
    const localisation = notif.localisation;

    return {
      ...notif,
      details: {
        localisation,
      },
    };
  }
}
