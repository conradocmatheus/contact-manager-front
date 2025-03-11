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
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./user-profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  isLoading = false;
  isPasswordChanging = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toast: NgToastService,
    private titleService: Title
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords() });

    this.titleService.setTitle('Meu Perfil');
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email
      });
    } else {
      this.toast.warning('Você precisa estar logado para acessar esta página', 'Atenção', 3000);
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { name, email, currentPassword, newPassword } = this.profileForm.value;
    const userId = this.user.id;

    this.userService.updateProfile(userId, { name, email }).subscribe({
      next: (updatedUser) => {
        this.user = { ...this.user, name, email };
        this.authService.updateCurrentUser(this.user);

        if (currentPassword && newPassword) {
          this.isPasswordChanging = true;

          this.userService.updatePassword(userId, {
            currentPassword,
            newPassword
          }).subscribe({
            next: () => {
              this.isLoading = false;
              this.isPasswordChanging = false;
              this.toast.success('Perfil e senha atualizados com sucesso!', 'Sucesso', 3000);
              this.resetPasswordFields();
            },
            error: (err) => {
              this.isLoading = false;
              this.isPasswordChanging = false;
              this.toast.danger('Erro ao atualizar a senha. Verifique sua senha atual.', 'Erro', 3000);
              console.error('Erro ao atualizar senha:', err);
              this.resetPasswordFields();
            }
          });
        } else {
          this.isLoading = false;
          this.toast.success('Perfil atualizado com sucesso!', 'Sucesso', 3000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.danger('Erro ao atualizar o perfil. Tente novamente.', 'Erro', 3000);
        console.error('Erro ao atualizar perfil:', err);
      }
    });
  }

  resetPasswordFields(): void {
    this.profileForm.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  removeContacts(): void {
    if (confirm('Tem certeza que deseja remover todos os contatos?')) {
      this.toast.success('Contatos removidos com sucesso!', 'Sucesso', 3000);
    }
  }

  removeFavorites(): void {
    if (confirm('Tem certeza que deseja remover todos os favoritos?')) {
      this.toast.success('Favoritos removidos com sucesso!', 'Sucesso', 3000);
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

      if (!newPassword && !confirmPassword) {
        return null;
      }

      return newPassword === confirmPassword ? null : { notSame: true };
    };
  }
}
