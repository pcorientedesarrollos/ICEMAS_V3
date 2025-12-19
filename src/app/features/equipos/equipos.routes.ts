import { Routes } from '@angular/router';

export const EQUIPOS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./equipos-list/equipos-list.component').then(m => m.EquiposListComponent)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./equipo-form/equipo-form.component').then(m => m.EquipoFormComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./equipo-detail/equipo-detail.component').then(m => m.EquipoDetailComponent)
    },
    {
        path: ':id/editar',
        loadComponent: () => import('./equipo-form/equipo-form.component').then(m => m.EquipoFormComponent)
    }
];
