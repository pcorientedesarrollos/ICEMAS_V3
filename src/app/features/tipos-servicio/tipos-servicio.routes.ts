import { Routes } from '@angular/router';
import { TiposServicioListComponent } from './tipos-servicio-list/tipos-servicio-list.component';
import { TipoServicioFormComponent } from './tipo-servicio-form/tipo-servicio-form.component';

export const tiposServicioRoutes: Routes = [
    {
        path: '',
        component: TiposServicioListComponent
    },
    {
        path: 'nuevo',
        component: TipoServicioFormComponent
    },
    {
        path: ':id/editar',
        component: TipoServicioFormComponent
    }
];
