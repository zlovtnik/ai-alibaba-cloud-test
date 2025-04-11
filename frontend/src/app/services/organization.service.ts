import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Organization = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

@Injectable()
export class OrganizationService {
    private apiUrl = `${environment.apiUrl}/organizations`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Organization[]> {
        return this.http.get<Organization[]>(this.apiUrl);
    }

    search(query: string): Observable<Organization[]> {
        return this.http.get<Organization[]>(`${this.apiUrl}?search=${query}`);
    }

    getById(id: string): Observable<Organization> {
        return this.http.get<Organization>(`${this.apiUrl}/${id}`);
    }

    create(organization: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Observable<Organization> {
        return this.http.post<Organization>(this.apiUrl, organization);
    }

    update(id: string, organization: Partial<Organization>): Observable<Organization> {
        return this.http.put<Organization>(`${this.apiUrl}/${id}`, organization);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 