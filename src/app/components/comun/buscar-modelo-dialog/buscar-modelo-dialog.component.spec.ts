import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscarModeloDialogComponent } from './buscar-modelo-dialog.component';

describe('BuscarModeloDialogComponent', () => {
  let component: BuscarModeloDialogComponent;
  let fixture: ComponentFixture<BuscarModeloDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarModeloDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarModeloDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
