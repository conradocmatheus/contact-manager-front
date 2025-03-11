import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    ReactiveFormsModule
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
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords() });
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

    const { name, email, currentPassword, newPassword } = this.profileForm.value;

    console.log('Perfil atualizado:', { name, email, currentPassword, newPassword });
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  checkPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return newPassword === confirmPassword ? null : { notSame: true };
    };
  }
}
