import { Routes } from '@angular/router';
import { MarcasListComponent } from './marcas-list/marcas-list.component';
import { MarcaFormComponent } from './marca-form/marca-form.component';

export const marcasRoutes: Routes = [
    {
        path: '',
        component: MarcasListComponent
    },
    {
        path: 'nuevo',
        component: MarcaFormComponent
    },
    {
        path: ':id/editar',
        component: MarcaFormComponent
    }
];
