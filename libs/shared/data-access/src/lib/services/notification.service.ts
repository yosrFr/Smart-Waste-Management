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
    return this.http.get<ApiNotification[]>(`${this.apiUrl}/all`).pipe(
      tap((response) => {
        // console.log("Réponse de l'API:", response);
      })
    );
  }

  enrichNotifications(
    notif: ApiNotification,
    tournees: Tournee[],
    vehicules: Vehicule[],
    points: PointDeCollecte[]
  ): AppNotification {
    // console.log('notification recu pour etre enrichie', notif);
    switch (notif.type) {
      case TypeNotif.NOUVELLE_TACHE:
        // console.log('notification nouvelle tache', notif);
        return this.mapNouvelleTache(
          notif as NotificationNouvelleTache,
          tournees,
          vehicules
        );

      case TypeNotif.PLEIN:
        // console.log('notification conteneur plein', notif);
        return this.mapConteneurPlein(
          notif as NotificationConteneurPlein,
          points
        );

      case TypeNotif.ENDOMMAGE:
        // console.log('notification conteneur endommagé', notif);
        return this.mapConteneurEndommage(
          notif as NotificationConteneurEndommage,
          points
        );

      case TypeNotif.PANNE_VEHICULE:
        // console.log('notification panne vehicule', notif);
        return this.mapPanneVehicule(
          notif as NotificationPanneVehicule,
          vehicules
        );

      case TypeNotif.INCIDENT:
        // console.log('notification incident', notif);
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
    // console.log('notification nouvelle tache a mapper', notif);
    const tournee = tournees.find((t) => t.id === notif.tourneeId);
    const vehicule = vehicules.find((v) => v.id === notif.vehiculeId);

    // console.log('vehicule trouvee ', vehicule);

    // console.log('tournee trouvee', tournee);

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
    // console.log('notification conteneur endommage', notif);
    const point = points.find((p) => p.id === notif.pointDeCollecteId);

    // console.log('point de collecte trouve', point);
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
    // console.log('notification conteneur plein', notif);
    const point = points.find((p) => p.id === notif.pointDeCollecteId);

    // console.log('point trouve', point);
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
    // console.log('notification panne vehicule', notif);
    const vehicule = vehicules.find((v) => v.id === notif.vehiculeId);

    // console.log('vehicule trouve', vehicule);
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
    // console.log('notification incident', notif);
    const localisation = notif.localisation;

    return {
      ...notif,
      details: {
        localisation,
      },
    };
  }
}
