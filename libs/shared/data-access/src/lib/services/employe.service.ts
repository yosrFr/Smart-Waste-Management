/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Employe,
  CreateUtilisateurDto,
  UpdateUtilisateurDto,
  Administrateur,
  UpdateProfilEmployeDto,
} from '../models';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

/**
 * Service pour gérer les employés et utilisateurs
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private apiUrlUser = '/api/utilisateurs';
  private apiUrlEmployes = '/api/employes';
  private apiUrlAdmins = '/api/administrateurs';

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  /**
   * Récupère tous les utilisateurs (employés + admins)
   * @returns Observable avec la liste des utilisateurs (employés + admins)
   */
  getAll(): Observable<(Employe | Administrateur)[]> {
    return this.http.get<(Employe | Administrateur)[]>(this.apiUrlUser);
  }

  /**
   * Crée un nouvel utilisateur (admin ou employé)
   * @param dto Données de l'utilisateur à créer
   * @returns Observable avec l'utilisateur créé
   */
  create(dto: CreateUtilisateurDto): Observable<any> {
    if (dto.role === 'EMPLOYE') {
      return this.http.post(`${this.apiUrlEmployes}/add`, dto);
    }
    return this.http.post(`${this.apiUrlAdmins}/add`, dto);
  }

  /**
   * Met à jour un utilisateur depuis le formulaire de modification de l'admin
   * @param id ID de l'utilisateur
   * @param dto Données à mettre à jour
   * @returns Observable avec l'utilisateur mis à jour
   */
  updateByAdmin(id: string, dto: UpdateUtilisateurDto): Observable<any> {
    return this.http.put(`${this.apiUrlEmployes}/updateByAdmin/${id}`, dto);
  }

  /**
   * Met à jour un utilisateur depuis le formulaire de modification de profil
   * @param id ID de l'utilisateur
   * @param dto Données du profil
   * @returns Observable avec l'utilisateur mis à jour
   */
  updateProfil(id: string, dto: UpdateProfilEmployeDto): Observable<any> {
    if (this.authService.getCurrentUser()?.role == 'EMPLOYE') {
      return this.http.put(`${this.apiUrlEmployes}/update/${id}`, dto);
    }
    return this.http.put(`${this.apiUrlAdmins}/update/${id}`, dto);
  }

  /**
   * Supprime un utilisateur
   * @param id ID de l'utilisateur à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrlUser}/${id}`, {});
  }
}
