/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Composant en-tête de page avec titre et actions
 */
@Component({
  selector: 'lib-page-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  /** Sous-titre optionnel */
  @Input() subtitle?: string;

  /** Affiche le bouton retour */
  @Input() showBack = false;

  /** Événement émis lors du clic sur le bouton retour */
  @Output() back = new EventEmitter<void>();
}
