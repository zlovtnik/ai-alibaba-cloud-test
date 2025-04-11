import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Column {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date';
  required?: boolean;
}

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-form">
      <h2>{{ isEdit ? 'Edit' : 'New' }} {{ entityName }}</h2>
      
      <form (ngSubmit)="onSubmit()">
        <div *ngFor="let column of columns" class="form-group">
          <label [for]="column.name">{{ column.label }}</label>
          <input
            [type]="column.type"
            [id]="column.name"
            [name]="column.name"
            [(ngModel)]="formData[column.name]"
            [attr.required]="column.required || null"
          >
        </div>

        <div class="form-actions">
          <button type="submit">{{ isEdit ? 'Update' : 'Create' }}</button>
          <button type="button" (click)="onCancel()">Cancel</button>
          <button *ngIf="isEdit" type="button" (click)="onDelete()" class="delete">Delete</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .edit-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button[type="submit"] {
      background: #4CAF50;
      color: white;
    }

    button[type="button"] {
      background: #f44336;
      color: white;
    }

    .delete {
      background: #ff0000;
    }

    button:hover {
      opacity: 0.9;
    }
  `]
})
export class EditFormComponent implements OnInit {
  @Input() entityName!: string;
  @Input() columns!: Column[];
  @Input() apiUrl!: string;
  @Input() query?: string;
  @Input() id?: string;
  @Input() userId!: string;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  formData: any = {};
  isEdit = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.isEdit = !!this.id;
    if (this.isEdit) {
      this.loadData();
    }
  }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-ID': this.userId
    });
  }

  loadData() {
    const url = this.query
      ? `${this.apiUrl}?${this.query}`
      : `${this.apiUrl}/${this.id}`;

    this.http.get(url, { headers: this.getHeaders() }).subscribe(data => {
      this.formData = data;
    });
  }

  onSubmit() {
    const request$ = this.isEdit
      ? this.http.put(`${this.apiUrl}/${this.id}`, this.formData, { headers: this.getHeaders() })
      : this.http.post(this.apiUrl, this.formData, { headers: this.getHeaders() });

    request$.subscribe(() => {
      this.saved.emit();
    });
  }

  onCancel() {
    this.cancelled.emit();
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete(`${this.apiUrl}/${this.id}`, { headers: this.getHeaders() }).subscribe(() => {
        this.deleted.emit();
      });
    }
  }
} 