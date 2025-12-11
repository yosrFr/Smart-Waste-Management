/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PointDeCollecte,
  CreatePointCollecteDto,
  UpdatePointCollecteDto,
} from '../models';
import { HttpClient } from '@angular/common/http';

/**
 * Service pour gérer les points de collecte
 */
@Injectable({
  providedIn: 'root',
})
export class PointCollecteService {
  private apiUrl = '/api/points';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les points de collecte
   * Simule également la mise à jour aléatoire des niveaux de remplissage
   * @returns Observable avec la liste des points
   */
  getAll(): Observable<PointDeCollecte[]> {
    return this.http.get<PointDeCollecte[]>(`${this.apiUrl}/all`);
  }

  /**
   * Crée un nouveau point de collecte
   * @param dto Données du point à créer
   * @returns Observable avec le point créé
   */
  create(dto: CreatePointCollecteDto): Observable<PointDeCollecte> {
    return this.http.post<PointDeCollecte>(`${this.apiUrl}/add`, dto);
  }

  /**
   * Met à jour un point de collecte
   * @param id ID du point
   * @param dto Données à mettre à jour
   * @returns Observable avec le point mis à jour
   */
  update(id: string, dto: UpdatePointCollecteDto): Observable<PointDeCollecte> {
    return this.http.put<PointDeCollecte>(`${this.apiUrl}/update/${id}`, dto);
  }

  /**
   * Supprime un point de collecte
   * @param id ID du point à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/delete/${id}`, {});
  }
}
