/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SignalerEndommageDto,
  SignalerVehiculePanneDto,
  SignalerIncidentDto,
} from '../models';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';

/**
 * Service pour gérer les signalements des employés
 * Crée des notifications pour l'admin
 */
@Injectable({
  providedIn: 'root',
})
export class SignalementService {
  private apiUrl = '/api/notifications';

  constructor(private http: HttpClient) {}

  private notificationService = inject(NotificationService);

  /**
   * Signale un conteneur endommagé
   * @param dto Données du signalement
   * @returns Observable émettant la notification créée par le backend
   */
  signalerConteneur(dto: SignalerEndommageDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/endommage`, {
      localisation: dto.localisation,
      typeConteneur: dto.typeDechet,
      date: new Date().toISOString(),
    });
  }

  /**
   * Signale un véhicule en panne
   * @param dto Données du signalement
   * @returns Observable émettant la notification créée par le backend
   */
  signalerVehicule(dto: SignalerVehiculePanneDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/panne-vehicule`, {
      matricule: dto.matricule,
      typeDechet: dto.typeDechet,
      date: new Date().toISOString(),
    });
  }

  /**
   * Signale un incident sur le trajet
   * @param dto Données du signalement
   * @returns Observable émettant la notification créée par le backend
   */
  signalerIncident(dto: SignalerIncidentDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/incident`, {
      localisation: dto.localisation,
      date: new Date().toISOString(),
    });
  }
}
