/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicule, CreateVehiculeDto } from '../models';
import { HttpClient } from '@angular/common/http';

/**
 * Service pour gérer les véhicules
 */
@Injectable({
  providedIn: 'root',
})
export class VehiculeService {
  private apiUrl = '/api/vehicules';

  private http = inject(HttpClient);

  /**
   * Récupère tous les véhicules
   * @returns Observable avec la liste des véhicules
   */
  getAll(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/all`);
  }

  /**
   * Crée un nouveau véhicule
   * @param dto Données du véhicule à créer
   * @returns Observable avec le véhicule créé
   */
  create(dto: CreateVehiculeDto): Observable<Vehicule> {
    return this.http.post<Vehicule>(`${this.apiUrl}/add`, dto);
  }

  /**
   * Met à jour un véhicule
   * @param id ID du véhicule
   * @param dto Données à mettre à jour
   * @returns Observable avec le véhicule mis à jour
   */
  update(id: string, dto: Partial<CreateVehiculeDto>): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/update/${id}`, dto);
  }

  /**
   * Supprime un véhicule
   * @param id ID du véhicule à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/delete/${id}`, {});
  }
}
