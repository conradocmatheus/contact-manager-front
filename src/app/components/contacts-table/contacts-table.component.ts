import {Component, OnInit} from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-contacts-table',
  imports: [
    NgForOf
  ],
  templateUrl: './contacts-table.component.html',
  styleUrl: './contacts-table.component.css'
})
export class ContactTableComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactsService: ContactService) {}

  ngOnInit() {
    this.contactsService.getAllContacts().subscribe((data: Contact[]) => {
      this.contacts = data;
    });
  }
}
