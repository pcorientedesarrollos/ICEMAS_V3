import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface Breadcrumb {
    label: string;
    url: string;
    active: boolean;
}

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);

    breadcrumbs: Breadcrumb[] = [];

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.buildBreadcrumbs(this.activatedRoute.root)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(breadcrumbs => {
                this.breadcrumbs = breadcrumbs;
            });

        // Initial breadcrumbs
        this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
    }

    private buildBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: Breadcrumb[] = []
    ): Breadcrumb[] {
        // Add home breadcrumb
        if (breadcrumbs.length === 0) {
            breadcrumbs.push({
                label: 'Inicio',
                url: '/dashboard',
                active: false
            });
        }

        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data['breadcrumb'];
            const params = child.snapshot.params;

            if (label) {
                // Replace :id with actual value if exists
                const displayLabel = params['id']
                    ? label.replace(':id', `#${params['id']}`)
                    : label;

                breadcrumbs.push({
                    label: displayLabel,
                    url: url,
                    active: false
                });
            }

            return this.buildBreadcrumbs(child, url, breadcrumbs);
        }

        // Mark last breadcrumb as active
        if (breadcrumbs.length > 0) {
            breadcrumbs[breadcrumbs.length - 1].active = true;
        }

        return breadcrumbs;
    }
}
