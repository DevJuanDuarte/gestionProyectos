import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoPageComponent } from './proyecto-page.component';

describe('ProyectoPageComponent', () => {
  let component: ProyectoPageComponent;
  let fixture: ComponentFixture<ProyectoPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProyectoPageComponent]
    });
    fixture = TestBed.createComponent(ProyectoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
