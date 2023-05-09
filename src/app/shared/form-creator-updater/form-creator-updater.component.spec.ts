import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatorUpdaterComponent } from './form-creator-updater.component';

describe('FormCreatorUpdaterComponent', () => {
  let component: FormCreatorUpdaterComponent;
  let fixture: ComponentFixture<FormCreatorUpdaterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCreatorUpdaterComponent]
    });
    fixture = TestBed.createComponent(FormCreatorUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
