import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, take } from 'rxjs/operators';
import { ClientesService } from '../../features/clientes/clientes.service';

@Injectable({ providedIn: 'root' })
export class UniqueClienteNameValidator implements AsyncValidator {
    private clientesService = inject(ClientesService);

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || control.value.trim() === '') {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(500), // Wait 500ms after user stops typing
            switchMap(nombre =>
                this.clientesService.checkNombre(nombre).pipe(
                    map(response => response.exists ? { nombreTaken: true } : null),
                    catchError(() => of(null)) // On error, don't block the form
                )
            ),
            take(1)
        );
    }
}
