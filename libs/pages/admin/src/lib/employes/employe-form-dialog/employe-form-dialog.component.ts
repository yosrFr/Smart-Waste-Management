/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
  Role,
  Disponibilite,
  createEmploye,
  Administrateur,
  Utilisateur,
  selectCurrentUser,
  updateEmployeByAdmin,
  updateProfilEmploye,
} from '@smart-waste-management/shared/data-access';

/**
 * Données pour le dialog
 */
interface EmployeDialogData {
  mode: 'create' | 'edit';
  employe: Employe | Administrateur | null;
}

/**
 * Dialog formulaire employé
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
  templateUrl: './employe-form-dialog.component.html',
  styleUrl: './employe-form-dialog.component.css',
})
export class EmployeFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<EmployeFormDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as EmployeDialogData;

  form: FormGroup;
  isEmployeRole = true;
  currentUser: Utilisateur | null = null;

  Role = Role;
  Disponibilite = Disponibilite;

  constructor() {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
    });

    const employe = this.data.employe;
    const isEmploye = employe ? 'disponibilite' in employe : true;

    this.form = this.fb.group({
      nom: [
        employe?.nom || '',
        this.data.mode === 'create' ? [Validators.required] : [],
      ],
      prenom: [
        employe?.prenom || '',
        this.data.mode === 'create' ? [Validators.required] : [],
      ],
      email: [employe?.email || '', [Validators.required, Validators.email]],
      motDePasse: [
        '',
        this.data.mode === 'create'
          ? [Validators.required, Validators.minLength(6)]
          : [],
      ],
      tel: [employe?.tel || '', [Validators.required]],
      dateNaissance: [
        employe?.dateNais || '',
        this.data.mode === 'create' ? [Validators.required] : [],
      ],
      role: [employe?.role || Role.EMPLOYE, [Validators.required]],
      disponibilite: [
        isEmploye && employe && 'disponibilite' in employe
          ? employe.disponibilite
          : Disponibilite.DISPONIBLE,
      ],
      actif: [employe?.actif ?? true],
      numPermis: [
        isEmploye && employe && 'numPermis' in employe ? employe.numPermis : '',
      ],
    });

    this.isEmployeRole = this.form.value.role === Role.EMPLOYE;
  }

  ngOnInit(): void {
    this.onRoleChange();
  }

  onRoleChange(): void {
    const role = this.form.get('role')?.value;
    this.isEmployeRole = role === Role.EMPLOYE;

    if (this.isEmployeRole) {
      this.form.get('numPermis')?.setValidators([Validators.required]);
      this.form.get('disponibilite')?.enable();
    } else {
      this.form.get('numPermis')?.clearValidators();
      this.form.get('disponibilite')?.disable();
    }

    this.form.get('numPermis')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const formValue = this.form.value;

    if (this.data.mode === 'create') {
      // Création d'un nouvel employé
      const dto: any = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        motDePasse: formValue.motDePasse,
        tel: formValue.tel,
        dateNaissance: new Date(formValue.dateNaissance)
          .toISOString()
          .split('T')[0],
        role: formValue.role,
        actif: formValue.actif,
      };

      if (formValue.role === Role.EMPLOYE) {
        dto.disponibilite = formValue.disponibilite;
        dto.numPermis = formValue.numPermis;
      }

      this.store.dispatch(createEmploye({ dto }));
    } else if (this.data.mode === 'edit' && this.data.employe) {
      // Edition d'un employé existant
      const dto: any = {
        email: formValue.email,
        tel: formValue.tel,
        role: formValue.role,
        actif: formValue.actif,
      };

      if (formValue.role === Role.EMPLOYE) {
        dto.disponibilite = formValue.disponibilite;
        dto.numPermis = formValue.numPermis;
      }

      const isAdminEditingOther =
        this.data.employe.role !== Role.EMPLOYE &&
        formValue.role !== Role.EMPLOYE;

      if (isAdminEditingOther) {
        this.store.dispatch(
          updateEmployeByAdmin({ id: this.data.employe.id, dto })
        );
      } else {
        // Modification de son propre profil (employé ou admin)
        this.store.dispatch(
          updateProfilEmploye({ id: this.data.employe.id, dto })
        );
      }
    }

    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
