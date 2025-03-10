import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import {AboutComponent} from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'about', component: AboutComponent },
];
