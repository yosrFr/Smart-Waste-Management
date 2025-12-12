/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  private http = inject(HttpClient);

  /**
   * Récupère toutes les tournées
   * @returns Observable avec la liste des tournées
   */
  getAll(): Observable<Tournee[]> {
    return this.http.get<Tournee[]>(`${this.apiUrl}/all`).pipe(
      map((data) =>
        data.map((t) => ({
          ...t,
          dateDebut: new Date(t.dateDebut),
          dateFin: new Date(t.dateFin),
        }))
      )
    );
  }
}
