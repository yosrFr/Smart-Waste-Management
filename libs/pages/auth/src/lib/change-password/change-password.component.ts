/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  changePassword,
  selectAuthLoading,
  selectAuthError,
} from '@smart-waste-management/shared/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { changePasswordSuccess } from '@smart-waste-management/shared/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Validateur custom pour vérifier que les mots de passe correspondent
 */
function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const newPassword = control.get('nouveauMotDePasse');
  const confirmPassword = control.get('confirmerMotDePasse');

  if (!newPassword || !confirmPassword) {
    return null;
  }

  return newPassword.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
}

/**
 * Composant page de changement de mot de passe
 */
@Component({
  selector: 'lib-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);
    private actions$ = inject(Actions);
    private snackBar = inject(MatSnackBar);

  changePasswordForm: FormGroup;

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor() {
    this.changePasswordForm = this.fb.group(
      {
        ancienMotDePasse: ['', [Validators.required]],
        nouveauMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
        confirmerMotDePasse: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );

    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    // Écoute le succès du changement de mot de passe
    this.actions$
      .pipe(
        ofType(changePasswordSuccess),
        filter(() => true)
      )
      .subscribe(() => {
        this.snackBar.open(
          'Votre mot de passe a été modifié avec succès.',
          'Fermer',
          {
            duration: 5000,
            panelClass: ['success-snackbar'],
          }
        );
        this.goBack();
      });
  }

  /**
   * Soumet le formulaire
   */
  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.store.dispatch(
        changePassword({
          dto: {
            ancienMotDePasse: this.changePasswordForm.value.ancienMotDePasse,
            nouveauMotDePasse: this.changePasswordForm.value.nouveauMotDePasse,
          },
        })
      );
    }
  }

  /**
   * Retourne à la page précédente
   */
  goBack(): void {
    this.router.navigate(['/shared/profil']);
  }
}
