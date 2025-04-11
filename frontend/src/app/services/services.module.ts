import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationService } from './organization.service';
import { UserService } from './user.service';
import { PermissionService } from './permission.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        OrganizationService,
        UserService,
        PermissionService
    ]
})
export class ServicesModule { } 