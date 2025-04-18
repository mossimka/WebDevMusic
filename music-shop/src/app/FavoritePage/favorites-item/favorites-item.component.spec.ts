import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesItemComponent } from './favorites-item.component';

describe('FavoritesItemComponent', () => {
  let component: FavoritesItemComponent;
  let fixture: ComponentFixture<FavoritesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
