/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreateNotificationDto, AppNotification } from '../models';
import { TypeNotif, TypeDechet, EtatConteneur } from '../enums';
import { generateNextId } from '@smart-waste-management/shared/utils';

/**
 * Service pour gérer les notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /**
   * Stockage en mémoire des notifications mockées
   */
  private mockNotifications: AppNotification[] = [
    {
      id: '1',
      type: TypeNotif.PLEIN,
      date: new Date(Date.now() - 3600000).toISOString(),
      description: 'Conteneur plein détecté',
      details: {
        localisation: { latitude: 34.7065, longitude: 10.7487 },
        typeConteneur: TypeDechet.PLASTIQUE,
        etat: 'PLEIN' as EtatConteneur,
      },
    },
    {
      id: '2',
      type: TypeNotif.PANNE,
      date: new Date(Date.now() - 7200000).toISOString(),
      description: 'Véhicule en panne signalé',
      details: {
        matricule: 'TUN1234',
        typeDechet: TypeDechet.ALIMENTAIRE,
      },
    },
    {
      id: '3',
      type: TypeNotif.NOUVELLE_TACHE,
      date: new Date(Date.now() - 10800000).toISOString(),
      description: 'Nouvelle tournée assignée',
      details: {
        tourneeId: 'T001',
        dateDebut: new Date().toISOString(),
        dateFin: new Date(Date.now() + 14400000).toISOString(),
        vehiculeMatricule: 'TUN5678',
        nombrePoints: 15,
      },
    },
  ];

  /**
   * Récupère toutes les notifications
   * @returns Observable avec la liste des notifications triées par date
   */
  getAll(): Observable<AppNotification[]> {
    return of([...this.mockNotifications]);
  }

  /**
   * Crée une nouvelle notification
   * @param dto Données de la notification à créer
   * @returns Observable avec la notification créée
   */
  create(dto: CreateNotificationDto): Observable<AppNotification> {
    const notification: AppNotification = {
      id: generateNextId(this.mockNotifications),
      ...dto,
    } as AppNotification;

    this.mockNotifications.unshift(notification);
    return of(notification);
  }
}
