import { AuthenticatedInGuard } from '@remult/angular';
import { Injectable } from '@angular/core';



export const Roles = { 
    admin: 'admin',
    sites:'sites'
}


@Injectable()
export class AdminGuard extends AuthenticatedInGuard {

    isAllowed() {
        return Roles.admin;
    }
}
@Injectable({
    providedIn: 'root'
})
export class SiteGuard extends AuthenticatedInGuard {

    isAllowed() {
        return Roles.sites;
    }
}