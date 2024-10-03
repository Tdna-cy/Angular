import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListClientsComponent } from './list-clients/list-clients.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "clients", component: ListClientsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
