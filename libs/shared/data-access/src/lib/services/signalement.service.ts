/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  SignalerEndommageDto,
  SignalerVehiculePanneDto,
  SignalerIncidentDto,
} from '../models';
import { NotificationService } from './notification.service';
import { TypeNotif } from '../enums';

/**
 * Service pour gérer les signalements des employés
 * Crée des notifications pour l'admin
 */
@Injectable({
  providedIn: 'root',
})
export class SignalementService {
  private notificationService = inject(NotificationService);

  /**
   * Signale un conteneur endommagé
   * @param dto Données du signalement
   * @returns Observable vide
   */
  signalerConteneur(dto: SignalerEndommageDto): Observable<void> {
    // Crée une notification pour l'admin
    this.notificationService
      .create({
        type: TypeNotif.ENDOMMAGE,
        date: new Date().toISOString(),
        description: `Conteneur endommagé signalé: ${dto.typeDechet}`,
        details: {
          localisation: dto.localisation,
          typeConteneur: dto.typeDechet,
        },
      })
      .subscribe();

    return of(undefined).pipe(delay(500));
  }

  /**
   * Signale un véhicule en panne
   * @param dto Données du signalement
   * @returns Observable vide
   */
  signalerVehicule(dto: SignalerVehiculePanneDto): Observable<void> {
    // Crée une notification pour l'admin
    this.notificationService
      .create({
        type: TypeNotif.PANNE,
        date: new Date().toISOString(),
        description: `Véhicule en panne: ${dto.matricule}`,
        details: {
          matricule: dto.matricule,
          typeDechet: dto.typeDechet,
        },
      })
      .subscribe();

    return of(undefined).pipe(delay(500));
  }

  /**
   * Signale un incident sur le trajet
   * @param dto Données du signalement
   * @returns Observable vide
   */
  signalerIncident(dto: SignalerIncidentDto): Observable<void> {
    // Crée une notification pour l'admin
    this.notificationService
      .create({
        type: TypeNotif.INCIDENT,
        date: new Date().toISOString(),
        details: {
          localisation: dto.localisation,
        },
      })
      .subscribe();

    return of(undefined).pipe(delay(500));
  }
}
