import { TestBed } from '@angular/core/testing';

import { LanguageDataService } from './language-data.service';

describe('LanguageDataService', () => {
  let service: LanguageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
