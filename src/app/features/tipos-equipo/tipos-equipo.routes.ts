import { Routes } from '@angular/router';
import { TiposEquipoListComponent } from './tipos-equipo-list/tipos-equipo-list.component';
import { TipoEquipoFormComponent } from './tipo-equipo-form/tipo-equipo-form.component';

export const tiposEquipoRoutes: Routes = [
    {
        path: '',
        component: TiposEquipoListComponent
    },
    {
        path: 'nuevo',
        component: TipoEquipoFormComponent
    },
    {
        path: ':id/editar',
        component: TipoEquipoFormComponent
    }
];
