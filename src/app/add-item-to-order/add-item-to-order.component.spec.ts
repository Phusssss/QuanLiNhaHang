import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemToOrderComponent } from './add-item-to-order.component';

describe('AddItemToOrderComponent', () => {
  let component: AddItemToOrderComponent;
  let fixture: ComponentFixture<AddItemToOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemToOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemToOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
