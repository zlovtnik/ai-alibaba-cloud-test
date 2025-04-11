import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '@env/environment';

interface Organization {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-apis',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [HttpClient],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h1>Organizations</h1>
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (keyup.enter)="search()"
            placeholder="Search organizations..."
            [disabled]="isLoading"
          >
          <button (click)="search()" [disabled]="isLoading">Search</button>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        <p>{{ error }}</p>
        <button (click)="retry()">Retry</button>
      </div>

      <div *ngIf="isLoading" class="loading">
        <p>Loading organizations...</p>
      </div>

      <div *ngIf="!isLoading && !error" class="organizations-grid">
        <div *ngFor="let org of organizations" class="organization-card">
          <div class="card-header">
            <h3>{{ org.name }}</h3>
            <span class="date">{{ org.createdAt | date }}</span>
          </div>
          <p class="description">{{ org.description }}</p>
          <div class="card-actions">
            <button class="edit" (click)="editOrganization(org)" [disabled]="isLoading">Edit</button>
            <button class="delete" (click)="deleteOrganization(org.id)" [disabled]="isLoading">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !error && organizations.length === 0" class="no-results">
        <p>No organizations found</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #2c3e50;
      margin: 0;
    }

    .search-box {
      display: flex;
      gap: 1rem;
    }

    input {
      padding: 0.5rem 1rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      min-width: 300px;
    }

    input:focus {
      outline: none;
      border-color: #3498db;
    }

    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .search-box button {
      background: #3498db;
      color: white;
    }

    .search-box button:hover:not(:disabled) {
      background: #2980b9;
    }

    .organizations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .organization-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    h3 {
      margin: 0;
      color: #2c3e50;
    }

    .date {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .description {
      color: #34495e;
      margin-bottom: 1.5rem;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-actions button {
      flex: 1;
    }

    .edit {
      background: #2ecc71;
      color: white;
    }

    .edit:hover:not(:disabled) {
      background: #27ae60;
    }

    .delete {
      background: #e74c3c;
      color: white;
    }

    .delete:hover:not(:disabled) {
      background: #c0392b;
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #3498db;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .error-message button {
      background: #dc3545;
      color: white;
    }

    .error-message button:hover {
      background: #c82333;
    }
  `]
})
export class ApisComponent implements OnInit {
  organizations: Organization[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadOrganizations();
  }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-ID': '3f705ba5-ebc7-4310-a14f-ec0103305d56' // Replace with actual user ID
    });
  }

  loadOrganizations() {
    this.isLoading = true;
    this.error = null;

    this.http.get<Organization[]>(`${environment.apiUrl}/organizations`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (data) => {
        this.organizations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
        this.error = 'Failed to load organizations. Please try again.';
        this.isLoading = false;
      }
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.error = null;

      this.http.get<Organization[]>(`${environment.apiUrl}/organizations?search=${this.searchQuery}`, {
        headers: this.getHeaders()
      }).subscribe({
        next: (data) => {
          this.organizations = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching organizations:', error);
          this.error = 'Failed to search organizations. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.loadOrganizations();
    }
  }

  retry() {
    this.loadOrganizations();
  }

  editOrganization(org: Organization) {
    // Implement edit functionality
    console.log('Edit organization:', org);
  }

  deleteOrganization(id: string) {
    if (confirm('Are you sure you want to delete this organization?')) {
      this.isLoading = true;
      this.error = null;

      this.http.delete(`${environment.apiUrl}/organizations/${id}`, {
        headers: this.getHeaders()
      }).subscribe({
        next: () => {
          this.loadOrganizations();
        },
        error: (error) => {
          console.error('Error deleting organization:', error);
          this.error = 'Failed to delete organization. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
} 