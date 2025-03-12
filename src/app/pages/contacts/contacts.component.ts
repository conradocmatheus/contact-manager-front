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
    Swal.fire({
      title: 'Editar Contato',
      html: `
      <input id="swal-name" class="swal2-input" placeholder="Nome" value="${contact.name}">
      <input id="swal-email" class="swal2-input" placeholder="Email" value="${contact.email}">
      <input id="swal-phone" class="swal2-input" placeholder="Phone Number" value="${contact.phone}">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;

        if (!name || !email) {
          Swal.showValidationMessage('Todos os campos são obrigatórios!');
          return null;
        }

        return { name, email, phone };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedContact = { ...contact, ...result.value };

        this.contactService.update(updatedContact.id, updatedContact).subscribe(() => {
          Swal.fire('Atualizado!', 'O contato foi editado com sucesso.', 'success');
          this.loadContacts();
        });
      }
    });
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
