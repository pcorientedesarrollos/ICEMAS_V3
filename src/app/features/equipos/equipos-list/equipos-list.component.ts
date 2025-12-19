import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EquiposService } from '../equipos.service';
import { DataTableComponent, DataTableColumn, DataTableAction } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AdvancedFiltersComponent, FilterField, FilterValues } from '../../../shared/components/advanced-filters/advanced-filters.component';

@Component({
  selector: 'app-equipos-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent, AdvancedFiltersComponent],
  templateUrl: './equipos-list.component.html',
  styleUrl: './equipos-list.component.css'
})
export class EquiposListComponent implements OnInit {
  private equiposService = inject(EquiposService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  equipos = signal<any[]>([]);
  allEquipos = signal<any[]>([]); // Store all data for client-side filtering
  loading = signal(true);
  showDeleteModal = signal(false);
  selectedEquipo = signal<any>(null);

  // Filter configuration
  filterFields: FilterField[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Buscar por nombre...' },
    { key: 'modelo', label: 'Modelo', type: 'text', placeholder: 'Buscar por modelo...' },
    { key: 'serie', label: 'No. Serie', type: 'text', placeholder: 'Buscar por serie...' },
    {
      key: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '1', label: 'Activo' },
        { value: '0', label: 'Inactivo' }
      ]
    }
  ];

  columns: DataTableColumn[] = [
    { key: 'idEquipo', label: 'ID', sortable: true, hideOnMobile: true, width: 'w-1 whitespace-nowrap' },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'modelo', label: 'Modelo', sortable: true, hideOnMobile: true, width: 'whitespace-nowrap' },
    { key: 'serie', label: 'Serie', sortable: false, hideOnMobile: true, width: 'whitespace-nowrap' },
    { key: 'createdAt', label: 'Creado', sortable: true, hideOnMobile: true, format: (value) => value ? new Date(value).toLocaleDateString('es-MX') + ' ' + new Date(value).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : 'N/A', width: 'whitespace-nowrap' },
    { key: 'updatedAt', label: 'Modificado', sortable: true, hideOnMobile: true, format: (value) => value ? new Date(value).toLocaleDateString('es-MX') + ' ' + new Date(value).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : 'N/A', width: 'whitespace-nowrap' },
    { key: 'estado', label: 'Estado', sortable: true, type: 'badge', format: (value) => value === 1 ? 'Activo' : 'Inactivo', width: 'w-1 whitespace-nowrap' }
  ];

  actions: DataTableAction[] = [
    {
      label: 'Ver',
      color: 'primary',
      onClick: (row) => this.router.navigate(['/equipos', row.idEquipo])
    },
    {
      label: 'Editar',
      color: 'success',
      onClick: (row) => this.router.navigate(['/equipos', row.idEquipo, 'editar'])
    },
    {
      label: 'Eliminar',
      color: 'danger',
      onClick: (row) => this.openDeleteModal(row)
    }
  ];

  ngOnInit(): void {
    this.loadEquipos();
  }

  loadEquipos(): void {
    this.loading.set(true);
    this.equiposService.getAll().subscribe({
      next: (data) => {
        this.allEquipos.set(data); // Store all data
        this.equipos.set(data); // Initially show all
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar equipos');
        this.loading.set(false);
      }
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/equipos/nuevo']);
  }

  openDeleteModal(equipo: any): void {
    this.selectedEquipo.set(equipo);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const id = this.selectedEquipo()?.idEquipo;
    if (!id) return;

    this.equiposService.delete(id).subscribe({
      next: () => {
        this.notificationService.success('Equipo eliminado correctamente');
        this.showDeleteModal.set(false);
        this.loadEquipos();
      },
      error: () => {
        this.notificationService.error('Error al eliminar equipo');
        this.showDeleteModal.set(false);
      }
    });
  }

  // Filter methods
  onFiltersChanged(filters: FilterValues): void {
    let filtered = [...this.allEquipos()];

    // Apply filters
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        filtered = filtered.filter(equipo => {
          switch (key) {
            case 'nombre':
              return equipo.nombre?.toLowerCase().includes(value.toLowerCase());
            case 'modelo':
              // Handle null/undefined modelo values
              if (!equipo.modelo) return false;
              return equipo.modelo.toLowerCase().includes(value.toLowerCase());
            case 'serie':
              // Handle null/undefined serie values
              if (!equipo.serie) return false;
              return equipo.serie.toLowerCase().includes(value.toLowerCase());
            case 'estado':
              return equipo.estado?.toString() === value.toString();
            default:
              return true;
          }
        });
      }
    });

    this.equipos.set(filtered);
  }

  onFiltersCleared(): void {
    this.equipos.set([...this.allEquipos()]);
  }
}
