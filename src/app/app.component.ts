import {Component, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NgForOf],
  template: `<h1>Users</h1><ul><li *ngFor="let user of users">{{ user.name }}</li></ul>`
})
export class AppComponent implements OnInit {
  title = 'contact-manager-front';

  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => this.users = data,
      error: (err) => console.error('Error getting users', err),
      }
    )
  }
}
