import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsAddComponent } from './records-add.component';

describe('RecordsAddComponent', () => {
  let component: RecordsAddComponent;
  let fixture: ComponentFixture<RecordsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
