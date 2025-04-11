import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseCrudService<T> {
    protected abstract apiUrl: string;

    constructor(protected http: HttpClient) { }

    getAll(): Observable<T[]> {
        return this.http.get<T[]>(this.apiUrl);
    }

    getById(id: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${id}`);
    }

    create(item: T): Observable<T> {
        return this.http.post<T>(this.apiUrl, item);
    }

    update(id: string, item: T): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${id}`, item);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 