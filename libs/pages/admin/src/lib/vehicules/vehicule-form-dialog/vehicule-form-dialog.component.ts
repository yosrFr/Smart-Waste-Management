/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject } from '@angular/core';
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
import { Store } from '@ngrx/store';
import {
  Vehicule,
  TypeDechet,
  createVehicule,
  updateVehicule,
} from '@smart-waste-management/shared/data-access';

@Component({
  selector: 'lib-vehicule-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './vehicule-form-dialog.component.html',
  styleUrl: './vehicule-form-dialog.component.css',
})
export class VehiculeFormDialogComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<VehiculeFormDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as Vehicule | null;

  form: FormGroup;
  isEditMode = false;
  TypeDechet = TypeDechet;

  constructor() {
    this.isEditMode = !!this.data;

    this.form = this.fb.group({
      matricule: [this.data?.matricule || '', [Validators.required]],
      capacite: [
        this.data?.capacite || '',
        [Validators.required, Validators.min(1)],
      ],
      poidsVide: [
        this.data?.poidsVide || '',
        [Validators.required, Validators.min(1)],
      ],
      typeDechet: [this.data?.typeDechet || '', [Validators.required]],
      marque: [this.data?.marque || '', [Validators.required]],
    });

    // if (!this.isEditMode) {
    //   this.form.addControl(
    //     'matricule',
    //     this.fb.control('', Validators.required)
    //   );
    // }
  }

  onSubmit(): void {
    if (this.form.valid) {
      // console.log(this.form.value);

      if (this.isEditMode && this.data) {
        this.store.dispatch(
          updateVehicule({
            id: this.data.id,
            dto: {
              typeDechet: this.form.value.typeDechet,
              capacite: this.form.value.capacite,
              poidsVide: this.form.value.poidsVide,
            },
          })
        );
      } else {
        this.store.dispatch(
          createVehicule({
            dto: {
              typeDechet: this.form.value.typeDechet,
              capacite: this.form.value.capacite,
              poidsVide: this.form.value.poidsVide,
              marque: this.form.value.marque,
              matricule: this.form.value.matricule,
            },
          })
        );
      }
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
