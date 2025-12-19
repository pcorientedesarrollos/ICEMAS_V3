import { Routes } from '@angular/router';

export const TECNICOS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./tecnicos-list/tecnicos-list.component').then(m => m.TecnicosListComponent)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./tecnico-form/tecnico-form.component').then(m => m.TecnicoFormComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./tecnico-detail/tecnico-detail.component').then(m => m.TecnicoDetailComponent)
    },
    {
        path: ':id/editar',
        loadComponent: () => import('./tecnico-form/tecnico-form.component').then(m => m.TecnicoFormComponent)
    }
];
