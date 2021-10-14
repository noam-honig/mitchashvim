import { RemultModule } from '@remult/angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


import { UsersComponent } from './users/users.component';
import { AdminGuard, SiteGuard } from './users/roles';
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { terms } from './terms';
import { SitesComponent } from './sites/sites.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { DeliveryManagerComponent } from './delivery-manager/delivery-manager.component';

const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent },
  { path: 'אתרים', component: SitesComponent, canActivate: [SiteGuard] },
  { path: 'משלוחים', component: DeliveriesComponent, canActivate: [AdminGuard] },
  { path: 'שינוע חברתי', component: DeliveryManagerComponent, canActivate: [AdminGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RemultModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }

