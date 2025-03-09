import {Contact} from './contact';
import {FavoriteContact} from './favoriteContact';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  contacts: Contact[];
  favorites: FavoriteContact[];
}
