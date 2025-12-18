/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import {
  Employe,
  Administrateur,
  updateProfilEmploye,
  AuthService,
} from '@smart-waste-management/shared/data-access';

/**
 * Données pour le dialog
 */
interface EmployeDialogData {
  employe: Employe | Administrateur | null;
}

/**
 * Composant dialog pour éditer le profil d'un utilisateur (employé ou administrateur)
 */
@Component({
  selector: 'lib-employe-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: 'profil-form-dialog.component.html',
  styleUrl: './profil-form-dialog.component.css',
})
export class ProfilFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<ProfilFormDialogComponent>);
  /** Données passées au dialog (employé ou administrateur) */
  readonly data = inject(MAT_DIALOG_DATA) as EmployeDialogData;
  private authService = inject(AuthService);

  /** Formulaire réactif pour les informations de l'utilisateur */
  form!: FormGroup;
  isEmployeRole = true;

  ngOnInit(): void {
    const employe = this.data.employe;
    console.log(employe);

    if (employe) {
      // Initialisez le formulaire avec les données de l'employé
      this.form = this.fb.group({
        nom: [employe.nom || ''],
        prenom: [employe.prenom || ''],
        email: [employe.email || ''],
        tel: [employe.tel || ''],
        dateNaissance: [employe.dateNais || ''],
      });
    }
  }

  /**
   * Soumet le formulaire si valide et ferme le dialog
   */
  onSubmit(): void {
    if (!this.form.valid) return;

    const formValue = this.form.value;

    console.log('Form Value:', formValue);
    console.log('Current Employee:', this.data.employe);

    // Vérifie si `this.data.employe` est défini avant d'envoyer l'action
    if (!this.data.employe) return;

    // Edition d'un employé existant
    const dto: any = {
      nom: formValue.nom,
      prenom: formValue.prenom,
      email: formValue.email,
      tel: formValue.tel,
      dateNais: new Date(formValue.dateNaissance).toISOString().split('T')[0],
    };

    this.store.dispatch(updateProfilEmploye({ id: this.data.employe.id, dto }));

    this.dialogRef.close(true);
  }

  /**
   * Annule l'édition et ferme le dialog
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
