import { TestBed } from '@angular/core/testing';

import { CardsGameService } from './cards-game.service';

describe('CardsGameService', () => {
  let service: CardsGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
