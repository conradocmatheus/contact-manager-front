import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ContactService } from './contact.service';
import { environment } from '../../environments/environment';

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

  it('should list contacts without sending a user ID', () => {
    service.getAll(2, 25, 'Ana Silva').subscribe();

    const request = httpTesting.expectOne(
      request => request.url === `${environment.apiUrl}/contacts`
        && request.params.get('page') === '2'
        && request.params.get('limit') === '25'
        && request.params.get('search') === 'Ana Silva'
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      contacts: [],
      pagination: { total: 0, page: 2, limit: 25, totalPages: 0 }
    });
  });

  it('should delete all contacts without sending a user ID', () => {
    service.deleteAll().subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/contacts/all`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
