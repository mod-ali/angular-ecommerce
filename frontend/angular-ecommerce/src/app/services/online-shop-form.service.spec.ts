import { TestBed } from '@angular/core/testing';

import { OnlineShopService } from './online-shop.service';

describe('OnlineShopFormService', () => {
  let service: OnlineShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
