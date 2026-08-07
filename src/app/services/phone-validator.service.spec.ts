import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PhoneValidatorService } from './phone-validator.service';

describe('PhoneValidatorService', () => {
  let service: PhoneValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PhoneValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
