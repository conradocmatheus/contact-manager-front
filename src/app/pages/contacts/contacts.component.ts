import { Component, OnInit } from '@angular/core';
import { ContactService, PaginatedResponse } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  imports: [
    FormsModule,
    NgForOf,
    PhoneFormatPipe,
    NgIf
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  searchTerm: string = "";
  searchTermSubject = new Subject<string>();

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  userId: string = '';
  loading: boolean = false;

  constructor(
    private contactService: ContactService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Contatos');
  }

  ngOnInit() {
    this.searchTermSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1;
      this.loadContacts();
    });

    this.loadContacts();
  }

  onSearchChange(term: string) {
    this.searchTermSubject.next(term);
  }

  loadContacts() {
    const userData = localStorage.getItem("user");

    if (!userData) {
      console.error("Usuário não está logado!");
      return;
    }

    const user = JSON.parse(userData);
    this.userId = user.id;
    this.loading = true;

    this.contactService.getAllByUser(this.userId, this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (data: PaginatedResponse) => {
          this.contacts = data.contacts;
          this.totalItems = data.pagination.total;
          this.totalPages = data.pagination.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error("Erro ao carregar contatos:", error);
          this.loading = false;
        }
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadContacts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadContacts();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadContacts();
    }
  }

  createContact(): void {
    Swal.fire({
      title: 'Criar Novo Contato',
      html: `
    <input id="swal-name" class="swal2-input" placeholder="Nome" required>
    <input id="swal-email" class="swal2-input" placeholder="Email">
    <input id="swal-phone" class="swal2-input" placeholder="Telefone" required>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Criar Contato',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;

        const userData = localStorage.getItem("user");
        if (!userData) {
          console.error("Usuário não está logado!");
          return;
        }
        const user = JSON.parse(userData);
        const userId = user.id;

        const cleanedPhone = phone.replace(/\D/g, '');
        const phoneRegex = /^(?:\d{10}|\d{11})$/;
        if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
          Swal.showValidationMessage('Por favor, insira um telefone válido com 10 ou 11 dígitos!');
          return null;
        }

        const formattedPhone = cleanedPhone.length === 11
          ? `${cleanedPhone.substring(0, 2)} ${cleanedPhone.substring(2, 7)}-${cleanedPhone.substring(7)}`
          : `${cleanedPhone.substring(0, 2)} ${cleanedPhone.substring(2, 6)}-${cleanedPhone.substring(6)}`;

        if (!name || !formattedPhone) {
          Swal.showValidationMessage('Nome e telefone são obrigatórios!');
          return null;
        }

        return { name, email, phone: formattedPhone, userId };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newContact = result.value;

        this.contactService.create(newContact).subscribe({
          next: () => {
            Swal.fire('Criado!', 'O contato foi criado com sucesso.', 'success');
            this.loadContacts();
          },
          error: (err) => {
            Swal.fire('Erro!', 'Ocorreu um erro ao criar o contato.', 'error');
            console.error('Erro ao criar o contato:', err);
          }
        });
      }
    });
  }


  editContact(contact: Contact): void {
    Swal.fire({
      title: 'Editar Contato',
      html: `
    <input id="swal-name" class="swal2-input" placeholder="Nome" value="${contact.name}">
    <input id="swal-email" class="swal2-input" placeholder="Email" value="${contact.email}">
    <input id="swal-phone" class="swal2-input" placeholder="Telefone" value="${contact.phone}">
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;

        const cleanedPhone = phone.replace(/\D/g, '');

        const phoneRegex = /^(?:\d{10}|\d{11})$/;
        if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
          Swal.showValidationMessage('Por favor, insira um telefone válido com 10 ou 11 dígitos!');
          return null;
        }

        const formattedPhone = cleanedPhone.length === 11
          ? `${cleanedPhone.substring(0, 2)} ${cleanedPhone.substring(2, 7)}-${cleanedPhone.substring(7)}`
          : `${cleanedPhone.substring(0, 2)} ${cleanedPhone.substring(2, 6)}-${cleanedPhone.substring(6)}`;

        if (!name || !formattedPhone) {
          Swal.showValidationMessage('Nome e telefone são obrigatórios!');
          return null;
        }

        return { name, email, phone: formattedPhone };
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
