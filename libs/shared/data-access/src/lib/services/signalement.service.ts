/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SignalerEndommageDto,
  SignalerVehiculePanneDto,
  SignalerIncidentDto,
} from '../models';
import { HttpClient } from '@angular/common/http';
import { TypeNotif } from '../enums';

/**
 * Service pour gérer les signalements des employés
 * Crée des notifications pour l'admin
 */
@Injectable({
  providedIn: 'root',
})
export class SignalementService {
  private apiUrl = '/api/notifications';

  private http = inject(HttpClient);

  /**
   * Signale un conteneur endommagé
   * @param dto Données du signalement
   * @returns Observable émettant la notification créée par le backend
   */
  signalerConteneur(dto: SignalerEndommageDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/endommage`, {
      pointDeCollecteId: dto.pointDeCollecteId,
      date: new Date().toISOString(),
      type: TypeNotif.ENDOMMAGE,
      description: dto.description,
    });
  }

  /**
   * Signale un véhicule en panne
   * @param dto Données du signalement
   * @returns Observable émettant la notification créée par le backend
   */
  signalerVehicule(dto: SignalerVehiculePanneDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/panne-vehicule`, {
      vehiculeId: dto.vehiculeId,
      localisation: dto.localisation,
      date: new Date().toISOString(),
      type: TypeNotif.PANNE_VEHICULE,
      description: dto.description,
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
      type: TypeNotif.INCIDENT,
      description: dto.description,
    });
  }
}
