/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Employe,
  CreateUtilisateurDto,
  UpdateUtilisateurDto,
  Administrateur,
  UpdateProfilEmployeDto,
} from '../models';
import { Role, Disponibilite } from '../enums';
import { generateNextId } from '@smart-waste-management/shared/utils';

/**
 * Service pour gérer les employés et utilisateurs
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  /**
   * Employés mockés
   */
  private mockEmployes: Employe[] = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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

  /**
   * Administrateurs mockés
   */
  private mockAdmins: Administrateur[] = [
    {
      id: '10',
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@waste.com',
      motDePasse: 'admin123',
      tel: '+216 20 123 456',
      dateNais: '1985-05-15',
      role: Role.ADMIN,
      actif: true,
    },
  ];

  /**
   * Regroupe admins + employés
   */
  private get mockUtilisateurs(): (Employe | Administrateur)[] {
    return [...this.mockAdmins, ...this.mockEmployes];
  }

  /**
   * Met à jour la liste des utilisateurs mockés
   */
  private set mockUtilisateurs(value: (Employe | Administrateur)[]) {
    this.mockAdmins = value.filter(
      (u) => u.role === Role.ADMIN
    ) as Administrateur[];
    this.mockEmployes = value.filter(
      (u) => u.role === Role.EMPLOYE
    ) as Employe[];
  }

  /**
   * Récupère tous les utilisateurs (employés + admins)
   * @returns Observable avec la liste des utilisateurs (employés + admins)
   */
  getAll(): Observable<(Employe | Administrateur)[]> {
    return of(this.mockUtilisateurs);
  }

  /**
   * Récupère tous les admins
   * @returns Observable avec la liste des employés
   */
  getAllEmployes(): Observable<Employe[]> {
    return of(this.mockEmployes);
  }

  /**
   * Récupère tous les employés
   * @returns Observable avec la liste des admins
   */
  getAllAdmins(): Observable<Administrateur[]> {
    return of(this.mockAdmins);
  }

  /**
   * Crée un nouvel utilisateur
   * @param dto Données de l'utilisateur à créer
   * @returns Observable avec l'utilisateur créé
   */
  create(dto: CreateUtilisateurDto): Observable<Employe | Administrateur> {
    const baseUser = {
      id: generateNextId(this.mockUtilisateurs),
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      motDePasse: dto.motDePasse,
      tel: dto.tel,
      dateNais: dto.dateNaissance,
      role: dto.role,
      actif: true,
    };

    let newUser: Employe | Administrateur;

    if (dto.role === Role.EMPLOYE) {
      newUser = {
        ...baseUser,
        role: Role.EMPLOYE,
        numPermis: dto.numPermis ?? '',
        disponibilite: Disponibilite.DISPONIBLE,
      };
      this.mockEmployes.push(newUser);
    } else {
      newUser = {
        ...baseUser,
        role: Role.ADMIN,
      };
      this.mockAdmins.push(newUser);
    }

    return of(newUser);
  }

  /**
   * Met à jour un utilisateur depuis le formulaire de modification de l'admin
   * @param id ID de l'utilisateur
   * @param dto Données à mettre à jour
   * @returns Observable avec l'utilisateur mis à jour
   */
  updateByAdmin(
    id: string,
    dto: UpdateUtilisateurDto
  ): Observable<Employe | Administrateur> {
    const utilisateurs = this.mockUtilisateurs;
    const index = utilisateurs.findIndex((u) => u.id === id);

    if (index === -1) throw new Error('Utilisateur introuvable');

    const utilisateur = utilisateurs[index];

    const finalRole = dto.role ?? utilisateur.role;

    let updatedUser: Employe | Administrateur;

    if (finalRole === Role.EMPLOYE) {
      updatedUser = {
        ...(utilisateur as Employe),
        ...dto,
        role: Role.EMPLOYE,
        numPermis: dto.numPermis ?? (utilisateur as Employe).numPermis,
      };
    } else {
      updatedUser = {
        ...(utilisateur as Administrateur),
        ...dto,
        role: Role.ADMIN,
      };
    }

    utilisateurs[index] = updatedUser;
    this.mockUtilisateurs = utilisateurs;

    return of(updatedUser);
  }

  /**
   * Met à jour un utilisateur depuis le formulaire de modification de profil
   * @param id ID de l'utilisateur
   * @param dto Données à mettre à jour
   * @returns Observable avec l'utilisateur mis à jour
   */
  updateProfil(
    id: string,
    dto: UpdateProfilEmployeDto
  ): Observable<Employe | Administrateur> {
    const utilisateurs = this.mockUtilisateurs;
    const index = utilisateurs.findIndex((u) => u.id === id);

    if (index === -1) throw new Error('Utilisateur introuvable');

    const utilisateur = utilisateurs[index];

    const updatedUser = {
      ...utilisateur,
      ...dto,
    };

    utilisateurs[index] = updatedUser;
    this.mockUtilisateurs = utilisateurs;

    return of(updatedUser);
  }

  /**
   * Supprime un utilisateur
   * @param id ID de l'utilisateur à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<void> {
    const utilisateurs = this.mockUtilisateurs;
    const index = utilisateurs.findIndex((u) => u.id === id);

    if (index === -1) throw new Error('Utilisateur introuvable');

    utilisateurs[index].actif = false;

    this.mockUtilisateurs = utilisateurs;
    return of(undefined);
  }
}
