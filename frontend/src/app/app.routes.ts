import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { ApisComponent } from './components/services/apis/apis.component';
import { CrudComponent } from './components/services/crud/crud.component';
import { HealthComponent } from './components/health/health.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'services/apis',
                component: ApisComponent
            },
            {
                path: 'services/crud',
                component: CrudComponent
            },
            {
                path: 'health',
                component: HealthComponent
            }
        ]
    }
];
