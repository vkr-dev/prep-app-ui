import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Generate } from './generate';

describe('Generate', () => {
  let component: Generate;
  let fixture: ComponentFixture<Generate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generate],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Generate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
