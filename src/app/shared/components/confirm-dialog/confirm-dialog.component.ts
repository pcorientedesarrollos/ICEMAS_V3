import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
    @Input() isOpen = signal(false);
    @Input() title = '¿Confirmar acción?';
    @Input() message = '¿Está seguro que desea continuar?';
    @Input() confirmText = 'Confirmar';
    @Input() cancelText = 'Cancelar';
    @Input() type: 'danger' | 'warning' | 'info' = 'danger';
    @Input() loading = signal(false);

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        if (!this.loading()) {
            this.confirm.emit();
        }
    }

    onCancel(): void {
        if (!this.loading()) {
            this.cancel.emit();
        }
    }

    close(): void {
        if (!this.loading()) {
            this.cancel.emit();
        }
    }
}
