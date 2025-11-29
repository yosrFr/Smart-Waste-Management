/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Données du dialog de confirmation
 */
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
}

/**
 * Composant dialog de confirmation
 */
@Component({
  selector: 'lib-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: 'confirm-dialog.component.html',
  styleUrl: 'confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  // dialogRef référence au dialog en cours
  // Permet de le fermer et de renvoyer une valeur
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  // Use MAT_DIALOG_DATA injection token pour avoir un accès au data du dialog component
  readonly data = inject(MAT_DIALOG_DATA) as ConfirmDialogData;

  /**
   * Fermer le dialog en renvoyant true
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Fermer le dialog en renvoyant false
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
