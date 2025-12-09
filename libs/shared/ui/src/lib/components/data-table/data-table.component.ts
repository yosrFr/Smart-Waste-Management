/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

/**
 * Définition d'une colonne du tableau
 */
export interface TableColumn<T = any> {
  /** Clé de la propriété à afficher */
  key: keyof T | string;
  /** Label de la colonne */
  label: string;
  /** Si la colonne est triable */
  sortable?: boolean;
  /** Template custom (optionnel) */
  customTemplate?: (row: T) => string;
}

/**
 * Actions possibles sur une ligne
 */
export interface TableAction<T = any> {
  /** Icône Material */
  icon: string;
  /** fonction callback executé on click  */
  action: (row: T) => void;
  /** Condition d'affichage */
  visible?: (row: T) => boolean;
}

/**
 * Composant tableau générique réutilisable
 * Supporte le tri, la pagination, la recherche et les actions
 */
@Component({
  selector: 'lib-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: 'data-table.component.html',
  styleUrl: 'data-table.component.css',
})
export class DataTableComponent<T> implements OnInit {
  /** Données du tableau */
  @Input() data: T[] = [];

  /** Définition des colonnes */
  @Input() columns: TableColumn<T>[] = [];

  /** Actions possibles sur chaque ligne */
  @Input() actions: TableAction<T>[] = [];

  /** Active la pagination */
  @Input() paginated = true;

  /** Taille de page par défaut */
  @Input() pageSize = 10;

  /** Active la recherche */
  @Input() searchable = true;

  /** Indique si les données sont en cours de chargement */
  @Input() loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  /**
   * Construire la liste des colonnes affichées
   */
  ngOnInit(): void {
    this.displayedColumns = [
      ...this.columns.map((col) => col.key.toString()),
      ...(this.actions.length > 0 ? ['actions'] : []),
    ];
  }

  /**
   * Afficher la pagination après l'initialisation de la vue
   */
  ngAfterViewInit(): void {
    if (this.paginated) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
  }

  /**
   * Met à jour les données du tableau lors de changements de data
   */
  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  /**
   * Applique un filtre de recherche
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Remise à 0 de la pagination après filtrage des données
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
