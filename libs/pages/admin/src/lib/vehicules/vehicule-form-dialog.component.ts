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
  template: ``,
  styles: [``],
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
      marque: [this.data?.marque || '', [Validators.required]],
      capaciteMax: [
        this.data?.capaciteMax || '',
        [Validators.required, Validators.min(1)],
      ],
      poidsVide: [
        this.data?.poidsVide || '',
        [Validators.required, Validators.min(1)],
      ],
      typeDechet: [this.data?.typeDechet || '', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditMode && this.data) {
        this.store.dispatch(
          updateVehicule({
            id: this.data.id,
            dto: this.form.value,
          })
        );
      } else {
        this.store.dispatch(createVehicule({ dto: this.form.value }));
      }
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
