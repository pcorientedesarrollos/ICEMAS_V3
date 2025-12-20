import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientesService } from '../clientes.service';
import { CatalogTableComponent, CatalogTableColumn, CatalogTableAction } from '../../../shared/components/catalog-table/catalog-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AutocompleteInputComponent } from '../../../shared/components/autocomplete-input/autocomplete-input.component';
import type { AutocompleteOption } from '../../../core/interfaces';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, CatalogTableComponent, ModalComponent, AutocompleteInputComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css'
})
export class ClientesListComponent {
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  clientes = signal<any[]>([]);
  loading = signal(true);
  showDeleteModal = signal(false);
  selectedCliente = signal<any>(null);

  // Autocomplete state
  autocompleteOptions = signal<AutocompleteOption[]>([]);
  autocompleteLoading = signal(false);

  // Sucursales Modal state
  showSucursalesModal = signal(false);
  selectedClienteForSucursales = signal<any>(null);
  sucursalesData = signal<any[]>([]);
  sucursalesLoading = signal(false);

  sucursalesColumns: CatalogTableColumn[] = [
    { key: 'idSucursal', label: 'ID', sortable: true, width: 'w-1 whitespace-nowrap' },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'direccion', label: 'Dirección', sortable: false },
    { key: 'telefono', label: 'Teléfono', sortable: false }
  ];

  columns: CatalogTableColumn[] = [
    { key: 'idCliente', label: 'ID', sortable: true, width: 'w-1 whitespace-nowrap' },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'empresa', label: 'Empresa', sortable: true, hideOnMobile: true },
    { key: 'telefono', label: 'Teléfono', sortable: false, width: 'whitespace-nowrap', hideOnMobile: true },
    {
      key: 'sucursales',
      label: 'Sucursales',
      type: 'button',
      width: 'w-1 whitespace-nowrap',
      iconOnly: true,
      action: (row) => this.viewSucursales(row),
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
    }
  ];

  actions: CatalogTableAction[] = [
    {
      label: 'Ver',
      color: 'primary',
      onClick: (row) => this.router.navigate(['/clientes', row.idCliente])
    },
    {
      label: 'Editar',
      color: 'success',
      onClick: (row) => this.router.navigate(['/clientes', row.idCliente, 'editar'])
    },
    {
      label: 'Eliminar',
      color: 'danger',
      onClick: (row) => this.openDeleteModal(row)
    }
  ];

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading.set(true);
    this.clientesService.getAll().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Error al cargar clientes');
        this.loading.set(false);
      }
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  openDeleteModal(cliente: any): void {
    this.selectedCliente.set(cliente);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const id = this.selectedCliente()?.idCliente;
    if (!id) return;

    this.clientesService.delete(id).subscribe({
      next: () => {
        this.notificationService.success('Cliente eliminado correctamente');
        this.showDeleteModal.set(false);
        this.loadClientes();
      },
      error: (error) => {
        this.notificationService.error('Error al eliminar cliente');
      }
    });
  }

  // Autocomplete methods
  onAutocompleteSearch(query: string): void {
    this.autocompleteLoading.set(true);
    this.clientesService.autocomplete(query).subscribe({
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
    this.router.navigate(['/clientes', option.id]);
  }

  onAutocompleteClear(): void {
    this.autocompleteOptions.set([]);
  }

  // Sucursales Modal methods
  viewSucursales(cliente: any): void {
    this.selectedClienteForSucursales.set(cliente);
    this.showSucursalesModal.set(true);
    this.loadSucursales(cliente.idCliente);
  }

  loadSucursales(id: number): void {
    this.sucursalesLoading.set(true);
    this.clientesService.getSucursales(id).subscribe({
      next: (data) => {
        this.sucursalesData.set(data);
        this.sucursalesLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar sucursales');
        this.sucursalesLoading.set(false);
      }
    });
  }

  closeSucursalesModal(): void {
    this.showSucursalesModal.set(false);
    this.selectedClienteForSucursales.set(null);
    this.sucursalesData.set([]);
  }
}
