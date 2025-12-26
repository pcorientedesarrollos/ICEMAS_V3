import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { UserRole } from '../enums/user-role.enum';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: UserRole;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private api = inject(ApiService);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    isAuthenticated = signal(false);
    currentUser = signal<User | null>(null);

    constructor() {
        // Only check auth in browser, not during SSR
        if (this.isBrowser) {
            this.checkAuthStatus();
        }
    }

    private checkAuthStatus(): void {
        const token = this.getToken();
        const savedUser = this.getSavedUser();

        if (token && savedUser) {
            // Restore from localStorage
            this.isAuthenticated.set(true);
            this.currentUser.set(savedUser);
        } else if (token) {
            // Token exists but no user data - clear orphaned token
            this.removeToken();
        }
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.api.post<AuthResponse>('auth/login', credentials).pipe(
            tap(response => {
                this.saveToken(response.access_token);
                this.saveUser(response.user);
                this.currentUser.set(response.user);
                this.isAuthenticated.set(true);
                this.router.navigate(['/dashboard']);
            })
        );
    }

    register(data: RegisterData): Observable<User> {
        return this.api.post<User>('auth/register', data);
    }

    logout(): void {
        this.removeToken();
        this.removeUser();
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(environment.jwtTokenKey);
        }
        return null;
    }

    private saveToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem(environment.jwtTokenKey, token);
        }
    }

    private removeToken(): void {
        if (this.isBrowser) {
            localStorage.removeItem(environment.jwtTokenKey);
        }
    }

    private saveUser(user: User): void {
        if (this.isBrowser) {
            localStorage.setItem('current_user', JSON.stringify(user));
        }
    }

    private getSavedUser(): User | null {
        if (this.isBrowser) {
            const userData = localStorage.getItem('current_user');
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    private removeUser(): void {
        if (this.isBrowser) {
            localStorage.removeItem('current_user');
        }
    }

    private loadUserProfile(): void {
        this.api.get<User>('auth/profile').subscribe({
            next: (user) => {
                this.currentUser.set(user);
                this.saveUser(user); // Update saved user
            },
            error: () => {
                // Silently fail - user data from localStorage is still valid
                // Only explicit logout will clear the session
            }
        });
    }

    // Role helper methods
    hasRole(role: UserRole): boolean {
        const user = this.currentUser();
        return user?.role === role;
    }

    isAdmin(): boolean {
        return this.hasRole(UserRole.ADMINISTRADOR);
    }

    isTecnico(): boolean {
        return this.hasRole(UserRole.TECNICO);
    }
}
