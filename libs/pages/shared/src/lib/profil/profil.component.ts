/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectCurrentUser,
  Utilisateur,
  Employe,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
} from '@smart-waste-management/shared/ui';

/**
 * Composant page Profil
 * Affiche les informations de l'utilisateur connecté
 */
@Component({
  selector: 'lib-profil',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    EnumLabelPipe,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  currentUser$: Observable<Utilisateur | null>;
  isEmployee = false;

  constructor() {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      this.isEmployee = user?.role === 'EMPLOYE';
    });
  }

  /**
   * Vérifie si l'utilisateur est un employé
   */
  isEmploye(user: Utilisateur): user is Employe {
    return 'disponibilite' in user;
  }

  /**
   * Retourne la couleur du badge de disponibilité
   */
  getDisponibiliteColor(
    disponibilite: string
  ): 'success' | 'warning' | 'default' {
    switch (disponibilite) {
      case 'DISPONIBLE':
        return 'success';
      case 'EN_MISSION':
        return 'warning';
      default:
        return 'default';
    }
  }

  /**
   * Navigue vers la page de modification du profil
   */
  editProfile(): void {
    // Sera implémenté dans les prochains commits
    console.log('Modifier profil');
  }

  /**
   * Navigue vers la page de changement de mot de passe
   */
  changePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }
}
