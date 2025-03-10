import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
//import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AboutComponent } from './pages/about/about.component';
import { EmptyLayoutComponent } from './shared/empty-layout/empty-layout.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: EmptyLayoutComponent, // Layout sem sidebar
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      //{ path: 'signup', component: SignupComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
