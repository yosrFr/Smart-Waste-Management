/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tournee } from '../models';
import { HttpClient } from '@angular/common/http';

/**
 * Service pour gérer les tournées
 */
@Injectable({
  providedIn: 'root',
})
export class TourneeService {
  private apiUrl = '/api/tournees';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les tournées
   * @returns Observable avec la liste des tournées
   */
  getAll(): Observable<Tournee[]> {
    return this.http.get<Tournee[]>(`${this.apiUrl}/all`);
  }
}
