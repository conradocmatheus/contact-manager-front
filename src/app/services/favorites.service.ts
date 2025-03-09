import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteContact } from '../models/favoriteContact';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class FavoriteContactService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  getAll(userId: number): Observable<FavoriteContact[]> {
    return this.http.get<FavoriteContact[]>(`${this.apiUrl}/${userId}`);
  }

  getById(id: number): Observable<FavoriteContact> {
    return this.http.get<FavoriteContact>(`${this.apiUrl}/${id}`);
  }

  addFavorite(favorite: FavoriteContact): Observable<FavoriteContact> {
    return this.http.post<FavoriteContact>(this.apiUrl, favorite);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
