import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuVucManagerComponent } from './khu-vuc-manager.component';

describe('KhuVucManagerComponent', () => {
  let component: KhuVucManagerComponent;
  let fixture: ComponentFixture<KhuVucManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhuVucManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuVucManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
