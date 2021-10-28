import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TaskViewPageComponent } from './pages/taskViewPage/taskViewPage.component';
import { WelcomePageComponent } from './pages/welcomePage/welcomePage.component';

const routes: Routes = [
  {path: '', component: WelcomePageComponent, data: {title: 'Welcome Page', url: '/'}},
  {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  {path: 'register', component: RegisterComponent, data: {title: 'Register'}},
  {path: 'task', component: TaskViewPageComponent, data: {title: 'Task Page'}},
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }