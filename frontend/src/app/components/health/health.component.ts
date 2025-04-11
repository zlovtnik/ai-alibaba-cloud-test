import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';

@Component({
    selector: 'app-health',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="health-container">
      <h2>API Health Status</h2>
      <div *ngIf="healthStatus" class="status-card">
        <p><strong>Status:</strong> {{ healthStatus.status }}</p>
        <p><strong>Version:</strong> {{ healthStatus.version }}</p>
        <p><strong>Last Check:</strong> {{ healthStatus.timestamp | date:'medium' }}</p>
      </div>
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
    styles: [`
    .health-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .status-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .error-message {
      color: #dc3545;
      padding: 1rem;
      background: #f8d7da;
      border-radius: 4px;
      margin-top: 1rem;
    }
  `]
})
export class HealthComponent implements OnInit {
    healthStatus: any;
    error: string = '';

    constructor(private healthService: HealthService) { }

    ngOnInit() {
        this.checkHealth();
    }

    checkHealth() {
        this.healthService.checkHealth().subscribe({
            next: (response) => {
                this.healthStatus = response;
                this.error = '';
            },
            error: (err) => {
                this.error = 'Failed to connect to the API. Please make sure the server is running.';
                console.error('Health check failed:', err);
            }
        });
    }
} 