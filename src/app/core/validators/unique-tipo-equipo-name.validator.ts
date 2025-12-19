import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { TiposEquipoService } from '../../features/tipos-equipo/tipos-equipo.service';

@Injectable({ providedIn: 'root' })
export class UniqueTipoEquipoNameValidator implements AsyncValidator {
    constructor(private tiposEquipoService: TiposEquipoService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(300),
            switchMap(nombre =>
                this.tiposEquipoService.checkNombre(nombre).pipe(
                    map((response: { exists: boolean }) =>
                        response.exists ? { nombreTaken: true } : null
                    ),
                    catchError(() => of(null))
                )
            )
        );
    }
}
