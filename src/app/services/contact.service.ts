import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact';
import { environment } from '../../environments/environment.development';

export interface PaginatedResponse {
  contacts: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getAllByUser(userId: string, page: number = 1, limit: number = 10, search: string = ''): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(
      `${this.apiUrl}/by-user/${userId}?page=${page}&limit=${limit}&search=${search}`
    );
  }

  create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  update(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteAllByUser(userId:number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/all/${userId}`);
  }
}
