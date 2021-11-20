import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TaskViewPageComponent } from './pages/taskViewPage/taskViewPage.component';
import { TheoryPageComponent } from './pages/theoryPage/theoryPage.component';
import { WelcomePageComponent } from './pages/welcomePage/welcomePage.component';
import {TaskPageComponent} from "./pages/taskPage/taskPage.component";
import { TheoryViewPageComponent } from './pages/theoryViewPage/theoryViewPage.component';
import {ProfilePageComponent} from "./pages/profile/profile.component";

const routes: Routes = [
  {path: '', component: WelcomePageComponent, data: {title: 'Welcome Page', url: '/'}},
  {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  {path: 'register', component: RegisterComponent, data: {title: 'Register'}},
  {path: 'profile', component: ProfilePageComponent, data: {title: 'Profile'}},
  {path: 'profile/:id', component: ProfilePageComponent, data: {title: 'Profile'}},
  {path: 'task', component: TaskViewPageComponent, data: {title: 'Task Page'}},
  {path: 'theory', component: TheoryViewPageComponent, data: {title: 'Theory Page'}},
  {path: 'task/:taskID', component: TaskPageComponent, data: {title: 'Task Page'}},
  {path: 'theory/:id', component: TheoryPageComponent, data: {title: 'Theory Page'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
