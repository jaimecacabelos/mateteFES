import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipificacionComponent } from './tipificacion.component';

describe('TipificacionComponent', () => {
  let component: TipificacionComponent;
  let fixture: ComponentFixture<TipificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
