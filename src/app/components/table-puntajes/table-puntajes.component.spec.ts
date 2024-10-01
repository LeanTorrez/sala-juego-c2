import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePuntajesComponent } from './table-puntajes.component';

describe('TablePuntajesComponent', () => {
  let component: TablePuntajesComponent;
  let fixture: ComponentFixture<TablePuntajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePuntajesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePuntajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
