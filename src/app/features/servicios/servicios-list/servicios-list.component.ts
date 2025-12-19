import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { DataTableComponent, DataTableColumn, DataTableAction } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AutocompleteInputComponent, AutocompleteOption } from '../../../shared/components/autocomplete-input/autocomplete-input.component';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent, AutocompleteInputComponent],
  templateUrl: './servicios-list.component.html',
  styleUrl: './servicios-list.component.css',
})
export class ServiciosListComponent {
  private serviciosService = inject(ServiciosService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  servicios = signal<any[]>([]);
  loading = signal(true);
  showDeleteModal = signal(false);
  selectedServicio = signal<any>(null);

  // Autocomplete state
  autocompleteOptions = signal<AutocompleteOption[]>([]);
  autocompleteLoading = signal(false);

  columns: DataTableColumn[] = [
    { key: 'idServicio', label: 'ID', sortable: true, hideOnMobile: true, width: 'w-1 whitespace-nowrap' },
    { key: 'folio', label: 'Folio', sortable: true, width: 'whitespace-nowrap' },
    { key: 'fechaServicio', label: 'Fecha', sortable: true, format: (value) => new Date(value).toLocaleDateString('es-MX'), width: 'whitespace-nowrap' },
    { key: 'cliente.nombre', label: 'Cliente', sortable: false, maxWidth: '150px' },
    { key: 'equipo.nombre', label: 'Equipo', sortable: false, hideOnMobile: true, maxWidth: '250px' },
    { key: 'tecnico.nombre', label: 'Técnico', sortable: false, hideOnMobile: true, maxWidth: '150px' },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      type: 'badge',
      width: 'w-1 whitespace-nowrap'
    },
  ];

  actions: DataTableAction[] = [
    {
      label: 'Ver',
      color: 'primary',
      onClick: (row) => this.router.navigate(['/servicios', row.idServicio])
    },
    {
      label: 'Editar',
      color: 'success',
      onClick: (row) => this.router.navigate(['/servicios', row.idServicio, 'editar'])
    },
    {
      label: 'Eliminar',
      color: 'danger',
      onClick: (row) => this.openDeleteModal(row)
    }
  ];

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading.set(true);
    this.serviciosService.getAll().subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Error al cargar servicios');
        this.loading.set(false);
      }
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/servicios/nuevo']);
  }

  openDeleteModal(servicio: any): void {
    this.selectedServicio.set(servicio);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const id = this.selectedServicio()?.idServicio;
    if (!id) return;

    this.serviciosService.delete(id).subscribe({
      next: () => {
        this.notificationService.success('Servicio eliminado correctamente');
        this.showDeleteModal.set(false);
        this.loadServicios();
      },
      error: (error) => {
        this.notificationService.error('Error al eliminar servicio');
      }
    });
  }

  getCountByEstado(estado: string): number {
    return this.servicios().filter(s =>
      s.estado?.toLowerCase().trim() === estado.toLowerCase().trim()
    ).length;
  }

  // Autocomplete methods
  onAutocompleteSearch(query: string): void {
    this.autocompleteLoading.set(true);
    this.serviciosService.autocompleteId(query).subscribe({
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
    this.router.navigate(['/servicios', option.id]);
  }

  onAutocompleteClear(): void {
    this.autocompleteOptions.set([]);
  }
}
