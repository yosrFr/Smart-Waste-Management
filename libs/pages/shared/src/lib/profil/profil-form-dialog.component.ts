/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject } from '@angular/core';
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
  Utilisateur,
  selectCurrentUser,
} from '@smart-waste-management/shared/data-access';

/**
 * Données pour le dialog
 */
interface EmployeDialogData {
  employe: Employe | Administrateur | null;
}

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
export class ProfilFormDialogComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<ProfilFormDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as EmployeDialogData;

  form: FormGroup;
  isEmployeRole = true;
  currentUser: Utilisateur | null = null;

  constructor() {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
    });

    const employe = this.data.employe;

    this.form = this.fb.group({
      nom: [employe?.nom || this.currentUser?.nom],
      prenom: [employe?.prenom || this.currentUser?.prenom],
      email: [employe?.email || this.currentUser?.email],
      tel: [employe?.tel || this.currentUser?.tel],
      dateNaissance: [employe?.dateNais || this.currentUser?.dateNais],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const formValue = this.form.value;

    // Edition d'un employé existant
    const dto: any = {
      nom: formValue.nom,
      prenom: formValue.prenom,
      email: formValue.email,
      tel: formValue.tel,
      dateNais: formValue.dateNaissance,
    };

    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
