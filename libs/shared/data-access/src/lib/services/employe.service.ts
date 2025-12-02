/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Employe,
  Utilisateur,
  CreateUtilisateurDto,
  UpdateUtilisateurAdminDto,
  Administrateur,
} from '../models';
import { Role, Disponibilite } from '../enums';

/**
 * Service pour gérer les employés et utilisateurs
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  /**
   * Utilisateurs mockés (employés + admins)
   */
  private mockEmployes: (Employe | Utilisateur)[] = [
    {
      id: '1',
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@waste.com',
      motDePasse: 'admin123',
      tel: '+216 20 123 456',
      dateNais: '1985-05-15',
      role: Role.ADMIN,
      actif: true,
    },
    {
      id: '2',
      nom: 'Ben Ali',
      prenom: 'Mohamed',
      email: 'employe@waste.com',
      motDePasse: 'employe123',
      tel: '+216 20 234 567',
      dateNais: '1990-03-20',
      role: Role.EMPLOYE,
      actif: true,
      disponibilite: Disponibilite.DISPONIBLE,
      numPermis: 'B123456',
    },
    {
      id: '3',
      nom: 'Trabelsi',
      prenom: 'Ahmed',
      email: 'ahmed@waste.com',
      motDePasse: 'ahmed123',
      tel: '+216 20 345 678',
      dateNais: '1988-07-10',
      role: Role.EMPLOYE,
      actif: true,
      disponibilite: Disponibilite.EN_MISSION,
      numPermis: 'B234567',
    },
    {
      id: '4',
      nom: 'Gharbi',
      prenom: 'Fatma',
      email: 'fatma@waste.com',
      motDePasse: 'fatma123',
      tel: '+216 20 456 789',
      dateNais: '1992-11-25',
      role: Role.EMPLOYE,
      actif: false,
      disponibilite: Disponibilite.DISPONIBLE,
      numPermis: 'B345678',
    },
  ];

  private nextId = 5;

  /**
   * Récupère tous les utilisateurs (employés + admins)
   * @returns Observable avec la liste
   */
  getAll(): Observable<(Employe | Utilisateur)[]> {
    return of([...this.mockEmployes]);
  }

  /**
   * Crée un nouvel utilisateur
   * @param dto Données de l'utilisateur à créer
   * @returns Observable avec l'utilisateur créé
   */
  create(dto: CreateUtilisateurDto): Observable<Employe | Administrateur> {
    const baseUser = {
      id: (this.nextId++).toString(),
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      motDePasse: dto.motDePasse,
      tel: dto.tel,
      dateNais: dto.dateNaissance,
      role: dto.role,
      actif: dto.actif,
    };

    const user: Employe | Administrateur =
      dto.role === Role.EMPLOYE
        ? {
            ...baseUser,
            role: Role.EMPLOYE,
            disponibilite: dto.disponibilite || Disponibilite.DISPONIBLE,
            numPermis: dto.numPermis || '',
          }
        : { ...baseUser, role: Role.ADMIN };

    this.mockEmployes.push(user);
    return of(user);
  }

  /**
   * Met à jour un utilisateur (admin)
   * @param id ID de l'utilisateur
   * @param dto Données à mettre à jour
   * @returns Observable avec l'utilisateur mis à jour
   */
  update(
    id: string,
    dto: UpdateUtilisateurAdminDto
  ): Observable<Employe | Utilisateur> {
    const index = this.mockEmployes.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Utilisateur introuvable');
    }

    this.mockEmployes[index] = {
      ...this.mockEmployes[index],
      ...dto,
    };

    return of(this.mockEmployes[index]);
  }

  /**
   * Supprime un utilisateur
   * @param id ID de l'utilisateur à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<void> {
    this.mockEmployes = this.mockEmployes.filter((e) => e.id !== id);
    return of(undefined);
  }
}
