import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TecnicosService } from '../tecnicos.service';
import { DataTableComponent, DataTableColumn, DataTableAction } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AutocompleteInputComponent, AutocompleteOption } from '../../../shared/components/autocomplete-input/autocomplete-input.component';

@Component({
  selector: 'app-tecnicos-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent, AutocompleteInputComponent],
  templateUrl: './tecnicos-list.component.html',
  styleUrl: './tecnicos-list.component.css',
})
export class TecnicosListComponent {
  private tecnicosService = inject(TecnicosService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  tecnicos = signal<any[]>([]);
  loading = signal(true);
  showDeleteModal = signal(false);
  selectedTecnico = signal<any>(null);

  // Autocomplete state
  autocompleteOptions = signal<AutocompleteOption[]>([]);
  autocompleteLoading = signal(false);

  columns: DataTableColumn[] = [
    { key: 'idTecnico', label: 'ID', sortable: true, width: 'w-1 whitespace-nowrap' },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true, hideOnMobile: true },
    { key: 'telefono', label: 'Teléfono', sortable: false, width: 'whitespace-nowrap', hideOnMobile: true },
    { key: 'especialidad', label: 'Especialidad', sortable: true },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      type: 'badge',
      format: (value) => value === 1 ? 'Activo' : 'Inactivo',
      width: 'w-1 whitespace-nowrap'
    },
  ];

  actions: DataTableAction[] = [
    {
      label: 'Ver',
      color: 'primary',
      onClick: (row) => this.router.navigate(['/tecnicos', row.idTecnico])
    },
    {
      label: 'Editar',
      color: 'success',
      onClick: (row) => this.router.navigate(['/tecnicos', row.idTecnico, 'editar'])
    },
    {
      label: 'Eliminar',
      color: 'danger',
      onClick: (row) => this.openDeleteModal(row)
    }
  ];

  ngOnInit(): void {
    this.loadTecnicos();
  }

  loadTecnicos(): void {
    this.loading.set(true);
    this.tecnicosService.getAll().subscribe({
      next: (data) => {
        this.tecnicos.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Error al cargar técnicos');
        this.loading.set(false);
      }
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/tecnicos/nuevo']);
  }

  openDeleteModal(tecnico: any): void {
    this.selectedTecnico.set(tecnico);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const id = this.selectedTecnico()?.idTecnico;
    if (!id) return;

    this.tecnicosService.delete(id).subscribe({
      next: () => {
        this.notificationService.success('Técnico eliminado correctamente');
        this.showDeleteModal.set(false);
        this.loadTecnicos();
      },
      error: (error) => {
        this.notificationService.error('Error al eliminar técnico');
      }
    });
  }

  // Autocomplete methods
  onAutocompleteSearch(query: string): void {
    this.autocompleteLoading.set(true);
    this.tecnicosService.autocomplete(query).subscribe({
      next: (results) => {
        this.autocompleteOptions.set(results);
        this.autocompleteLoading.set(false);
      },
      error: () => {
        this.autocompleteOptions.set([]);
        this.autocompleteLoading.set(false);
      }
    });
  }

  onAutocompleteSelect(option: AutocompleteOption): void {
    this.router.navigate(['/tecnicos', option.id]);
  }

  onAutocompleteClear(): void {
    this.autocompleteOptions.set([]);
  }
}
