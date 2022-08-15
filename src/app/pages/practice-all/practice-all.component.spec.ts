import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeAllComponent } from './practice-all.component';

describe('PracticeAllComponent', () => {
  let component: PracticeAllComponent;
  let fixture: ComponentFixture<PracticeAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
