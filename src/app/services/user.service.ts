import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateProfile(id: number, userData: { name: string, email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  updatePassword(id: number, passwordData: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/password/${id}`, passwordData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
