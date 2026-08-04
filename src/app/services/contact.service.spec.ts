import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ContactService } from './contact.service';
import { environment } from '../../environments/environment.development';

describe('ContactService', () => {
  let service: ContactService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete all contacts without sending a user ID', () => {
    service.deleteAllByUser().subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/contacts/all`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
