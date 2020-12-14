import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscarUsuarioDialogComponent } from './buscar-usuario-dialog.component';

describe('BuscarUsuarioDialogComponent', () => {
  let component: BuscarUsuarioDialogComponent;
  let fixture: ComponentFixture<BuscarUsuarioDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarUsuarioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
