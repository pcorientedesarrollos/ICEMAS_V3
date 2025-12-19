import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../clientes.service';
import { SucursalesService } from '../sucursales/sucursales.service';
import { DataTableComponent, DataTableColumn, DataTableAction } from '../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './cliente-detail.component.html',
    styleUrl: './cliente-detail.component.css',
    })
export class ClienteDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientesService = inject(ClientesService);
  private sucursalesService = inject(SucursalesService);
  private notificationService = inject(NotificationService);

  cliente = signal<any>(null);
  sucursales = signal<any[]>([]);
  loading = signal(true);
  loadingSucursales = signal(false);
  clienteId: number | null = null;

  sucursalesColumns: DataTableColumn[] = [
    { key: 'idSucursal', label: 'ID', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'direccion', label: 'Dirección', sortable: false },
    { key: 'telefono', label: 'Teléfono', sortable: false },
    { key: 'contacto', label: 'Contacto', sortable: false },
  ];

  sucursalesActions: DataTableAction[] = [
    {
      label: 'Editar',
      color: 'success',
      onClick: (row) => this.router.navigate(['/sucursales', row.idSucursal, 'editar'])
    }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.clienteId = +id;
      this.loadCliente(this.clienteId);
      this.loadSucursales(this.clienteId);
    }
  }

  loadCliente(id: number): void {
    this.loading.set(true);
    this.clientesService.getOne(id).subscribe({
      next: (data) => {
        this.cliente.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.router.navigate(['/clientes']);
      }
    });
  }

  loadSucursales(clienteId: number): void {
    this.loadingSucursales.set(true);
    this.clientesService.getSucursales(clienteId).subscribe({
      next: (data) => {
        this.sucursales.set(data);
        this.loadingSucursales.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar sucursales');
        this.loadingSucursales.set(false);
      }
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/clientes', this.clienteId, 'editar']);
  }

  navigateToNewSucursal(): void {
    this.router.navigate(['/sucursales/nuevo'], { queryParams: { clienteId: this.clienteId } });
  }

  navigateBack(): void {
    this.router.navigate(['/clientes']);
  }
}

