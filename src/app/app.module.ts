import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomePageComponent } from './pages/welcomePage/welcomePage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/app-header.component';
import { RangeSliderControlComponent } from './components/slider/range-slider.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaskViewPageComponent } from './pages/taskViewPage/taskViewPage.component';
import {TaskPageComponent} from "./pages/taskPage/taskPage.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { TheoryViewPageComponent } from './pages/theoryViewPage/theoryViewPage.component';
import { TheoryPageComponent } from './pages/theoryPage/theoryPage.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faLightbulb as fasLightbulb, faPen as fasPen } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as farLightbulb } from '@fortawesome/free-regular-svg-icons';
import {ProfilePageComponent} from "./pages/profile/profile.component";
import {AchievementPageComponent} from "./pages/achievementPage/achievementPage.component";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomePageComponent,
    TaskViewPageComponent,
    HeaderComponent,
    RangeSliderControlComponent,
    TaskPageComponent,
    TheoryViewPageComponent,
    HeaderComponent,
    TheoryPageComponent,
    ProfilePageComponent,
    AchievementPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    CodemirrorModule,
    ReactiveFormsModule,
    NgxSliderModule,
    NgSelectModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(fasLightbulb, farLightbulb, fasPen);
  }
}

