import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getAllContacts(){
    return this.baseUrl;
  }

  getContactById(id: number) {
    return this.http.get(this.baseUrl + id);
  }
}
