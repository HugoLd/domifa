import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfilAyantsDroitsComponent } from "./profil-ayants-droits.component";

describe("ProfilAyantsDroitsComponent", () => {
  let component: ProfilAyantsDroitsComponent;
  let fixture: ComponentFixture<ProfilAyantsDroitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilAyantsDroitsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilAyantsDroitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
