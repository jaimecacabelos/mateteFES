import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipificacionDialogComponent } from './tipificacion-dialog.component';

describe('TipificacionDialogComponent', () => {
  let component: TipificacionDialogComponent;
  let fixture: ComponentFixture<TipificacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipificacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipificacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
