import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./user-profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const { name, email } = this.profileForm.value;

    console.log('Perfil atualizado:', { name, email });
    alert('Perfil atualizado com sucesso!');
  }

  removeContacts(): void {
    if (confirm('Tem certeza que deseja remover todos os contatos?')) {
      console.log('Contatos removidos');
      alert('Contatos removidos com sucesso!');
    }
  }

  removeFavorites(): void {
    if (confirm('Tem certeza que deseja remover todos os favoritos?')) {
      console.log('Favoritos removidos');
      alert('Favoritos removidos com sucesso!');
    }
  }
}
