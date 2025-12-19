/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

/**
 * Configuration d'un tab
 */
export interface Tab {
  // Nom de tab
  label: string;
  // Valeur qui represente l'index du tab
  value: any;
}

/**
 * Composant tabs
 */
@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatBadgeModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements AfterViewInit, OnChanges {
  /** Liste des tabs */
  @Input() tabs: Tab[] = [];

  /** Index du tab sélectionné */
  @Input() selectedIndex = 0;

  /**
   * Événement émis lors du changement de tab
   * Envoie directement l'objet Tab concerné
   */
  @Output() tabChange = new EventEmitter<Tab>();

  private elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    // Attendre le rendu complet
    requestAnimationFrame(() => this.updateTabsVisibility());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex'] && !changes['selectedIndex'].firstChange) {
      // Mettre à jour la visibilité après un changement d'index
      requestAnimationFrame(() => this.updateTabsVisibility());
    }
  }

  /**
   * Gestion du changement de tab par interaction utilisateur
   * @param index index de l'onglet sélectionné
   */
  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.tabChange.emit(this.tabs[index]);
    requestAnimationFrame(() => this.updateTabsVisibility());
  }

  /**
   * Met à jour la visibilité des contenus associés aux tabs
   */
  private updateTabsVisibility(): void {
    const container: HTMLElement | null =
      this.elementRef.nativeElement.querySelector('.tabs-content-container');
    if (!container) return;

    const activeTabValue = String(this.tabs[this.selectedIndex]?.value ?? '');

    const allTabContents = Array.from(
      container.querySelectorAll('[tab]')
    ) as HTMLElement[];

    allTabContents.forEach((element) => {
      const elementTabValue = (element.getAttribute('tab') ?? '').trim();
      // Affiche uniquement le contenu correspondant au tab actif
      if (elementTabValue === activeTabValue) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }
}
