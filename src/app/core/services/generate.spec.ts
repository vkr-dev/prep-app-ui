import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Generate } from './generate';

describe('Generate', () => {
  let service: Generate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Generate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
