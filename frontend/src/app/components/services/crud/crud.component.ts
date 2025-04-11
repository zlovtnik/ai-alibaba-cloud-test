import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OrganizationService, Organization } from '../../../services/organization.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [HttpClient, OrganizationService],
  template: `
    <div class="crud-container">
      <h1>Organizations Management</h1>
      
      <div class="crud-section">
        <!-- Search and Create Section -->
        <div class="top-actions">
          <div class="search-box">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search organizations..." (input)="onSearch()">
          </div>
          <button class="create-btn" (click)="showCreateForm = true">Create New Organization</button>
        </div>

        <!-- Create Form -->
        <div class="form-container" *ngIf="showCreateForm">
          <h3>Create New Organization</h3>
          <div class="form-group">
            <input type="text" [(ngModel)]="newOrganization.name" placeholder="Organization Name">
            <input type="text" [(ngModel)]="newOrganization.description" placeholder="Description">
            <div class="form-actions">
              <button (click)="createOrganization()">Create</button>
              <button class="cancel" (click)="showCreateForm = false">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="form-container" *ngIf="editingOrganization">
          <h3>Edit Organization</h3>
          <div class="form-group">
            <input type="text" [(ngModel)]="editingOrganization.name" placeholder="Organization Name">
            <input type="text" [(ngModel)]="editingOrganization.description" placeholder="Description">
            <div class="form-actions">
              <button (click)="saveEdit()">Save Changes</button>
              <button class="cancel" (click)="cancelEdit()">Cancel</button>
            </div>
          </div>
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <!-- Organizations Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let org of organizations">
                <td>{{org.name}}</td>
                <td>{{org.description}}</td>
                <td>{{org.createdAt | date:'medium'}}</td>
                <td>{{org.updatedAt | date:'medium'}}</td>
                <td class="actions">
                  <button (click)="startEdit(org)">Edit</button>
                  <button class="delete" (click)="deleteOrganization(org.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalRecords > 0">
          <div class="pagination-info">
            Showing {{organizations.length}} of {{totalRecords}} records
          </div>
          <div class="pagination-controls">
            <button [disabled]="!hasMoreRecords" (click)="loadMore()">
              Load More ({{remainingRecords}} remaining)
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .crud-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: var(--text-color);
      margin-bottom: 2rem;
    }

    .crud-section {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .top-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .search-box {
      flex: 1;
      max-width: 300px;
    }

    .search-box input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .create-btn {
      background: var(--success-color);
    }

    .create-btn:hover {
      background: #218838;
    }

    .form-container {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
      border: 1px solid #ddd;
    }

    .form-container h3 {
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .table-container {
      background: white;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .actions button {
      padding: 0.25rem 0.5rem;
      font-size: 0.9rem;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 4px;
    }

    .pagination-info {
      color: #666;
    }

    .pagination-controls button {
      background: var(--primary-color);
    }

    .pagination-controls button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .crud-container {
        padding: 1rem;
      }

      .top-actions {
        flex-direction: column;
        gap: 1rem;
      }

      .search-box {
        max-width: 100%;
      }

      .table-container {
        margin: 0 -1rem;
      }

      table {
        font-size: 0.9rem;
      }

      th, td {
        padding: 0.5rem;
      }
    }
  `]
})
export class CrudComponent implements OnInit {
  organizations: Organization[] = [];
  newOrganization: Partial<Organization> = {};
  editingOrganization: Organization | null = null;
  showCreateForm = false;
  error: string = '';
  searchQuery: string = '';
  totalRecords: number = 0;
  hasMoreRecords: boolean = false;
  currentPage: number = 1;
  pageSize: number = 999;

  constructor(private organizationService: OrganizationService) { }

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.organizationService.getAll().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.totalRecords = orgs.length;
        this.hasMoreRecords = orgs.length === this.pageSize;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to load organizations. Please try again later.';
        console.error('Error loading organizations:', err);
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.loadOrganizations();
      return;
    }

    this.organizationService.search(this.searchQuery).subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.totalRecords = orgs.length;
        this.hasMoreRecords = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to search organizations. Please try again.';
        console.error('Error searching organizations:', err);
      }
    });
  }

  loadMore() {
    this.currentPage++;
    this.organizationService.getAll().subscribe({
      next: (orgs) => {
        this.organizations = [...this.organizations, ...orgs];
        this.hasMoreRecords = orgs.length === this.pageSize;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to load more organizations. Please try again.';
        console.error('Error loading more organizations:', err);
      }
    });
  }

  get remainingRecords(): number {
    return Math.max(0, this.totalRecords - (this.currentPage * this.pageSize));
  }

  createOrganization() {
    if (!this.newOrganization.name || !this.newOrganization.description) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.organizationService.create(this.newOrganization as Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>)
      .subscribe({
        next: () => {
          this.loadOrganizations();
          this.newOrganization = {};
          this.showCreateForm = false;
          this.error = '';
        },
        error: (err) => {
          this.error = 'Failed to create organization. Please try again.';
          console.error('Error creating organization:', err);
        }
      });
  }

  startEdit(org: Organization) {
    this.editingOrganization = { ...org };
  }

  saveEdit() {
    if (!this.editingOrganization) return;

    this.organizationService.update(this.editingOrganization.id, this.editingOrganization)
      .subscribe({
        next: () => {
          this.loadOrganizations();
          this.editingOrganization = null;
          this.error = '';
        },
        error: (err) => {
          this.error = 'Failed to update organization. Please try again.';
          console.error('Error updating organization:', err);
        }
      });
  }

  cancelEdit() {
    this.editingOrganization = null;
  }

  deleteOrganization(id: string) {
    if (confirm('Are you sure you want to delete this organization?')) {
      this.organizationService.delete(id)
        .subscribe({
          next: () => {
            this.loadOrganizations();
            this.error = '';
          },
          error: (err) => {
            this.error = 'Failed to delete organization. Please try again.';
            console.error('Error deleting organization:', err);
          }
        });
    }
  }
} 