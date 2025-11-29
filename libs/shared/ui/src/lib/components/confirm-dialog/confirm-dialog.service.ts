/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

/**
 * Service helper pour ouvrir des dialogs de confirmation
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  /**
   * Ouvre un dialog de confirmation
   * Méthode générique pour ouvrir n'importe quel dialog de confirmation
   * @param data Configuration du dialog
   * @returns Observable qui émet true si confirmé, false si annulé
   */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data,
    });

    return dialogRef.afterClosed();
  }

  /**
   * Ouvre un dialog de confirmation pour une suppression
   * @param itemName Nom de l'élément à supprimer
   * @returns Observable qui émet true si confirmé
   */
  confirmDelete(itemName: string): Observable<boolean> {
    return this.confirm({
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
    });
  }
}
