import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HealthResponse {
    status: string;
    version: string;
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class HealthService {
    private apiUrl = `${environment.apiUrl}/health`;

    constructor(private http: HttpClient) { }

    checkHealth(): Observable<HealthResponse> {
        return this.http.get<HealthResponse>(this.apiUrl);
    }
} 