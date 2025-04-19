import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTimekeepingComponent } from './staff-timekeeping.component';

describe('StaffTimekeepingComponent', () => {
  let component: StaffTimekeepingComponent;
  let fixture: ComponentFixture<StaffTimekeepingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffTimekeepingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
