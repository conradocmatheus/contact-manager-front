import { Component, OnInit } from '@angular/core';
import {ContactService} from '../../services/contact.service';
import {Contact} from '../../models/contact';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {FilterPipe} from '../../pipes/filter.pipe';
import {PhoneFormatPipe} from '../../pipes/phone-format.pipe';
import {Title} from '@angular/platform-browser';
import Swal from 'sweetalert2';

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

  constructor(
    private contactService: ContactService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Contatos');
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    const userData = localStorage.getItem("user");

    if (!userData) {
      console.error("Usuário não está logado!");
      return;
    }

    const user = JSON.parse(userData);

    this.contactService.getAllByUser(user.id).subscribe((data) => {
      this.contacts = data;
    });
  }

  editContact(contact: Contact): void {
    console.log('Editar contato', contact);
  }

  deleteContact(contact: Contact): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.delete(contact.id).subscribe(() => {
          Swal.fire('Deletado!', 'O contato foi removido.', 'success');
          this.loadContacts();
        });
      }
    });
  }
}
