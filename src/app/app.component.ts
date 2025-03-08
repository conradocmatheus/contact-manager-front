import {Component} from '@angular/core';
import {ContactTableComponent} from './components/contacts-table/contacts-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ContactTableComponent]
})
export class AppComponent {}
