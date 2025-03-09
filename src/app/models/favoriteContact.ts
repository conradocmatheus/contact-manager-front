import {Contact} from './contact';
import {User} from './user';

export interface FavoriteContact {
  id: number;
  userId: number;
  contactId: number;
  user: User;
  contact: Contact;
}
