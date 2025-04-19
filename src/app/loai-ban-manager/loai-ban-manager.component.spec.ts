import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaiBanManagerComponent } from './loai-ban-manager.component';

describe('LoaiBanManagerComponent', () => {
  let component: LoaiBanManagerComponent;
  let fixture: ComponentFixture<LoaiBanManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaiBanManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaiBanManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
