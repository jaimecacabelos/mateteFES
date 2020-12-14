import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscarCentroDialogComponent } from './buscar-centro-dialog.component';

describe('BuscarCentroDialogComponent', () => {
  let component: BuscarCentroDialogComponent;
  let fixture: ComponentFixture<BuscarCentroDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarCentroDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarCentroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
