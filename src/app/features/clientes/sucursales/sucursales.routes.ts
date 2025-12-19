import { Routes } from '@angular/router';

export const SUCURSALES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./sucursales-list/sucursales-list.component').then(m => m.SucursalesListComponent)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./sucursal-form/sucursal-form.component').then(m => m.SucursalFormComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./sucursal-detail/sucursal-detail.component').then(m => m.SucursalDetailComponent)
    },
    {
        path: ':id/editar',
        loadComponent: () => import('./sucursal-form/sucursal-form.component').then(m => m.SucursalFormComponent)
    }
];
