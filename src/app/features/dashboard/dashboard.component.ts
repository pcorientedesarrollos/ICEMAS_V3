import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    {
      label: 'Servicios Totales',
      value: '248',
      change: '+12%',
      trend: 'up',
      color: 'bg-primary-500',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    {
      label: 'Pendientes',
      value: '12',
      change: '+5%',
      trend: 'up',
      color: 'bg-yellow-500',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      label: 'Completados',
      value: '194',
      change: '+8%',
      trend: 'up',
      color: 'bg-green-500',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      label: 'Técnicos Activos',
      value: '8',
      change: '0%',
      trend: 'up',
      color: 'bg-purple-500',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    }
  ];

  recentServices = [
    { folio: 'SRV-001', cliente: 'VIPS Mérida Centro' },
    { folio: 'SRV-002', cliente: 'Oxxo Montejo' },
    { folio: 'SRV-003', cliente: 'Liverpool Altabrisa' },
  ];

  technicians = [
    { name: 'Juan Pérez', specialty: 'Refrigeración', initials: 'JP', activeServices: 3 },
    { name: 'María García', specialty: 'Aires Acondicionados', initials: 'MG', activeServices: 5 },
    { name: 'Carlos López', specialty: 'Mantenimiento', initials: 'CL', activeServices: 2 },
  ];
}
