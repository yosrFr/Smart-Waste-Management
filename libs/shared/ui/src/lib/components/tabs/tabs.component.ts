/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

/**
 * Configuration d'un tab avec compteur
 */
export interface Tab {
  label: string;
  value: any;
}

/**
 * Composant tabs avec compteurs (badges)
 */
@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatBadgeModule],
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  /** Liste des tabs avec leurs compteurs */
  @Input() tabs: Tab[] = [];

  /** Index du tab sélectionné */
  @Input() selectedIndex = 0;

  /** Événement émis lors du changement de tab */
  @Output() tabChange = new EventEmitter<Tab>();

  onTabChange(index: number): void {
    this.tabChange.emit(this.tabs[index]);
  }
}
