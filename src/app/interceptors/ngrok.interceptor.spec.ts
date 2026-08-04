import { TestBed } from '@angular/core/testing';

import { NgrokInterceptor } from './ngrok.interceptor';

describe('NgrokInterceptor', () => {
  let interceptor: NgrokInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgrokInterceptor]
    });
    interceptor = TestBed.inject(NgrokInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
