import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../clientes.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UniqueClienteNameValidator } from '../../../core/validators/unique-cliente-name.validator';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientesService = inject(ClientesService);
  private notificationService = inject(NotificationService);
  private uniqueNameValidator = inject(UniqueClienteNameValidator);

  isEditMode = signal(false);
  saving = signal(false);
  clienteId: number | null = null;

  form: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required],
      [this.uniqueNameValidator.validate.bind(this.uniqueNameValidator)]
    ],
    empresa: ['', Validators.required],
    telefono: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.clienteId = +id;
      this.loadCliente(this.clienteId);
    }
  }

  loadCliente(id: number): void {
    this.clientesService.getOne(id).subscribe({
      next: (cliente) => {
        this.form.patchValue({
          nombre: cliente.nombre,
          empresa: cliente.empresa,
          telefono: cliente.telefono || ''
        });
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.router.navigate(['/clientes']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const data = this.form.value;

    const request$ = this.isEditMode()
      ? this.clientesService.update(this.clienteId!, data)
      : this.clientesService.create(data);

    request$.subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditMode() ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente'
        );
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.notificationService.error('Error al guardar el cliente');
        this.saving.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }
}
