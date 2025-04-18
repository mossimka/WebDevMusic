import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingButtonComponent } from './routing-button.component';

describe('RoutingButtonComponent', () => {
  let component: RoutingButtonComponent;
  let fixture: ComponentFixture<RoutingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
