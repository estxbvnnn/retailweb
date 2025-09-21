import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AwsPage } from './aws.page';

describe('AwsPage', () => {
  let component: AwsPage;
  let fixture: ComponentFixture<AwsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AwsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
