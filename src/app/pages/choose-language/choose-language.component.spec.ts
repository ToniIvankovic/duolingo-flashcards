import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLanguageComponent } from './choose-language.component';

describe('ChooseLanguageComponent', () => {
  let component: ChooseLanguageComponent;
  let fixture: ComponentFixture<ChooseLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseLanguageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
