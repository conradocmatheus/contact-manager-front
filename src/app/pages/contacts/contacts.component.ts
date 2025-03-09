import { Component, OnInit } from '@angular/core';
import {ContactService} from '../../services/contact.service';
import {Contact} from '../../models/contact';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {FilterPipe} from '../../pipes/filter.pipe';
import {PhoneFormatPipe} from '../../pipes/phone-format.pipe';

@Component({
  selector: 'app-contacts',
  imports: [
    FormsModule,
    NgForOf,
    FilterPipe,
    PhoneFormatPipe
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  searchTerm: string = "";

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getAll().subscribe((data) => {
      this.contacts = data;
    });
  }

  editContact(contact: Contact): void {
    console.log('Editar contato', contact);
  }

  deleteContact(contact: Contact): void {
    console.log('Apagar contato', contact);
  }
}
