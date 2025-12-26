import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServicioAsociado {
    idServicio: number;
    folio: string;
    fechaServicio: string;
    estado: string;
    cliente: string;
    sucursal: string;
    tecnico: string;
}

@Component({
    selector: 'app-equipo-delete-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './equipo-delete-confirm-modal.component.html',
    styleUrls: ['./equipo-delete-confirm-modal.component.css'],
})
export class EquipoDeleteConfirmModalComponent {
    @Input() equipoNombre: string = '';
    @Input() serviciosAsociados: ServicioAsociado[] = [];
    @Input() isOpen: boolean = false;

    @Output() confirmed = new EventEmitter<boolean>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm() {
        this.confirmed.emit(true);
    }

    onCancel() {
        this.cancelled.emit();
    }

    getEstadoBadgeClass(estado: string): string {
        switch (estado?.toLowerCase()) {
            case 'completado':
                return 'badge-success';
            case 'pendiente':
                return 'badge-warning';
            case 'en proceso':
                return 'badge-info';
            case 'cancelado':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    }
}
