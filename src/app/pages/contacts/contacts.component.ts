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
import { PhoneValidatorService } from '../../services/phone-validator.service';

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
    private titleService: Title,
    private phoneValidatorService: PhoneValidatorService
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
      preConfirm: this.handlePreConfirm.bind(this)
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        let phone = result.value.phone;
        phone = "+55" + phone;

        this.phoneValidatorService.validatePhoneNumber(phone).subscribe({
          next: (validationData) => {
            if (!validationData.valid) {
              Swal.fire('Erro!', 'O número de telefone não é válido.', 'error');
            } else {
              this.contactService.create(result.value).subscribe({
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
          },
          error: (error) => {
            Swal.fire('Erro!', 'Ocorreu um erro ao validar o número de telefone.', 'error');
            console.error('Erro na validação:', error);
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
      preConfirm: this.handlePreConfirm.bind(this)
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        let phone = result.value.phone;
        phone = "+55" + phone;

        this.phoneValidatorService.validatePhoneNumber(phone).subscribe({
          next: (validationData) => {
            if (!validationData.valid) {
              Swal.fire('Erro!', 'O número de telefone não é válido.', 'error');
            } else {
              const updatedContact = { ...contact, ...result.value };

              this.contactService.update(updatedContact.id, updatedContact).subscribe({
                next: () => {
                  Swal.fire('Atualizado!', 'O contato foi editado com sucesso.', 'success');
                  this.loadContacts();
                },
                error: (err) => {
                  Swal.fire('Erro!', 'Ocorreu um erro ao editar o contato.', 'error');
                  console.error('Erro ao editar o contato:', err);
                }
              });
            }
          },
          error: (error) => {
            Swal.fire('Erro!', 'Ocorreu um erro ao validar o número de telefone.', 'error');
            console.error('Erro na validação:', error);
          }
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

  private handlePreConfirm(): { name: string; email: string; phone: string, userId: number } | null {
    const name = (document.getElementById('swal-name') as HTMLInputElement).value;
    const email = (document.getElementById('swal-email') as HTMLInputElement).value;
    const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;

    const formattedPhone = this.formatPhone(phone);
    if (!name || !formattedPhone) {
      Swal.showValidationMessage('Nome e telefone são obrigatórios!');
      return null;
    }

    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error("Usuário não está logado!");
      return null;
    }
    const user = JSON.parse(userData);
    const userId = user.id;

    return { name, email, phone: formattedPhone, userId };
  }


  private formatPhone(phone: string): string | null {
    const cleanedPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^(?:\d{10}|\d{11})$/;

    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      Swal.showValidationMessage('Por favor, insira um telefone válido com 10 ou 11 dígitos!');
      return null;
    }

    return cleanedPhone.length === 11
      ? `${cleanedPhone.substring(0, 2)} ${cleanedPhone.substring(2, 7)}-${cleanedPhone.substring(7)}`
      : `${cleanedPhone.substring(0, 2)} ${cleanedPhone.substring(2, 6)}-${cleanedPhone.substring(6)}`;
  }


  exportContacts(): void {
    this.loading = true;
    const allContacts: Contact[] = [];

    const loadAllContacts = (page: number) => {
      this.contactService.getAllByUser(this.userId, page, this.itemsPerPage, this.searchTerm).subscribe({
        next: (data: PaginatedResponse) => {
          allContacts.push(...data.contacts);

          if(page < data.pagination.totalPages) {
            loadAllContacts(page + 1);
          } else {
            this.exportToCSV(allContacts);
            this.loading = false;
          }
        },
        error: (err) => {
          console.error("Erro ao carregar contatos:", err);
          this.loading = false;
        }
      });
    };

    loadAllContacts(1);
  }

  exportToCSV(contacts: Contact[]) {
    const contactsToExport = contacts.map(contact => ({
      Nome: contact.name,
      Email: contact.email || 'Não informado',
      Telefone: contact.phone,
    }));

    const header = Object.keys(contactsToExport[0]);
    const csvContent = [
      header.join(','),
      ...contactsToExport.map(contact => Object.values(contact).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contatos.csv';
    link.click();
  }
}
