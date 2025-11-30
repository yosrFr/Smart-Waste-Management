/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Composant pour afficher un état vide (pas de données)
 */
@Component({
  selector: 'lib-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  /** Icône à afficher */
  @Input() icon = 'inbox';

  /** Titre du message */
  @Input() title = 'Aucune donnée';

  /** Message descriptif */
  @Input() message = 'Aucun élément à afficher pour le moment';
}
