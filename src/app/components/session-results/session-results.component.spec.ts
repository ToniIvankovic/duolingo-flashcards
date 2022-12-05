import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResultsComponent } from './session-results.component';

describe('SessionResultsComponent', () => {
  let component: SessionResultsComponent;
  let fixture: ComponentFixture<SessionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
