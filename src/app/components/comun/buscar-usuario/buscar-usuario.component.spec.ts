import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscarUsuarioComponent } from './buscar-usuario.component';

describe('BuscarUsuarioComponent', () => {
  let component: BuscarUsuarioComponent;
  let fixture: ComponentFixture<BuscarUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
