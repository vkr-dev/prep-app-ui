import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Generate } from './generate';

describe('Generate', () => {
  let component: Generate;
  let fixture: ComponentFixture<Generate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generate],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({ topic: 'SQL' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Generate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
