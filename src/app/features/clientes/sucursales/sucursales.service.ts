import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface Sucursal {
    idSucursal: number;
    idCliente: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    contacto?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSucursalDto {
    idCliente: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    contacto?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SucursalesService {
    private api = inject(ApiService);

    getAll(idCliente?: number): Observable<Sucursal[]> {
        const params = idCliente ? { idCliente } : undefined;
        return this.api.get<Sucursal[]>('sucursales', params);
    }

    getOne(id: number): Observable<Sucursal> {
        return this.api.get<Sucursal>(`sucursales/${id}`);
    }

    create(data: CreateSucursalDto): Observable<Sucursal> {
        return this.api.post<Sucursal>('sucursales', data);
    }

    update(id: number, data: Partial<CreateSucursalDto>): Observable<Sucursal> {
        return this.api.put<Sucursal>(`sucursales/${id}`, data);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.api.delete<{ message: string }>(`sucursales/${id}`);
    }

    getEquipos(id: number): Observable<any[]> {
        return this.api.get<any[]>(`sucursales/${id}/equipos`);
    }

    getServicios(id: number): Observable<any[]> {
        return this.api.get<any[]>(`sucursales/${id}/servicios`);
    }

    getPorCliente(idCliente: number): Observable<Sucursal[]> {
        return this.api.get<Sucursal[]>(`sucursales/por-cliente/${idCliente}`);
    }
}

