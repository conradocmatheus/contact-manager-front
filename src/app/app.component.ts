import { Component } from '@angular/core';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
