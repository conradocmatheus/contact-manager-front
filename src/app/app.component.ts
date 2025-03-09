import { Component } from '@angular/core';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import {ContactsComponent} from './pages/contacts/contacts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, ContactsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
