import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncidenciasDialogComponent } from './incidencias-dialog.component';

describe('IncidenciasDialogComponent', () => {
  let component: IncidenciasDialogComponent;
  let fixture: ComponentFixture<IncidenciasDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciasDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
