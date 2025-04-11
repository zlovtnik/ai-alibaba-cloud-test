import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private apiUrl = `${environment.apiUrl}/permissions`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.apiUrl);
    }

    getById(id: string): Observable<Permission> {
        return this.http.get<Permission>(`${this.apiUrl}/${id}`);
    }

    create(permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>): Observable<Permission> {
        return this.http.post<Permission>(this.apiUrl, permission);
    }

    update(id: string, permission: Partial<Permission>): Observable<Permission> {
        return this.http.put<Permission>(`${this.apiUrl}/${id}`, permission);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 