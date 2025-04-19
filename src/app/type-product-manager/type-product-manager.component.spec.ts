import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProductManagerComponent } from './type-product-manager.component';

describe('TypeProductManagerComponent', () => {
  let component: TypeProductManagerComponent;
  let fixture: ComponentFixture<TypeProductManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeProductManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeProductManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
