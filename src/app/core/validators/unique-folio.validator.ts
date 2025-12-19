import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { ServiciosService } from '../../features/servicios/servicios.service';

@Injectable({ providedIn: 'root' })
export class UniqueFolioValidator implements AsyncValidator {
    constructor(private serviciosService: ServiciosService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(300),
            switchMap(folio =>
                this.serviciosService.checkFolio(folio).pipe(
                    map((response: { exists: boolean }) =>
                        response.exists ? { folioTaken: true } : null
                    ),
                    catchError(() => of(null))
                )
            ),
            first()
        );
    }
}
