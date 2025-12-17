/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { map, Observable, Subject } from 'rxjs';
import {
  login,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '@smart-waste-management/shared/data-access';

/**
 * Composant page de connexion
 * Gère le formulaire de login, la soumission et l'affichage des erreurs
 * Les redirections après login réussi sont gérées via les effets NgRx
 */
@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  /** FormBuilder injecté pour créer les formulaires réactifs */
  private fb = inject(FormBuilder);

  /** Store NgRx injecté pour dispatcher des actions et sélectionner l'état */
  private store = inject(Store);

  /** Formulaire login */
  loginForm: FormGroup;

  /** Masquer ou afficher le mot de passe */
  hidePassword = true;

  /** Observable indiquant si l'authentification est en cours */
  loading$: Observable<boolean>;

  /** Observable contenant les erreurs liées à l'authentification */
  error$: Observable<string | null>;

  /** Observable indiquant si l'utilisateurs est déjà authentifié */
  isAuthenticated$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor() {
    // Initialisation du formulaire de login avec validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Sélection des observables depuis le store
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Soumet le formulaire de connexion
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(
        login({
          credentials: {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
          },
        })
      );
    }
  }
}
