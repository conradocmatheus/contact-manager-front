import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get(this.baseUrl);
  }

  getUserById(id: number) {
    return this.http.get(this.baseUrl + id);
  }
}
