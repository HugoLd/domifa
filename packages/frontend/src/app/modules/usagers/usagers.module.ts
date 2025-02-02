import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";

import { NgbDateCustomParserFormatter } from "src/app/modules/shared/services/date-formatter";
import { CustomDatepickerI18n } from "../shared/services/date-french";
import { SharedModule } from "../shared/shared.module";
import { UsersModule } from "../users/users.module";
import { UsagerSharedModule } from "./../usager-shared/usager-shared.module";

import { ImportComponent } from "./components/import/import.component";
import { ManageUsagersTableComponent } from "./components/manage/manage-usagers-table/manage-usagers-table.component";
import { ManageUsagersComponent } from "./components/manage/manage.component";

import { UsagerService } from "./services/usager.service";

@NgModule({
  declarations: [
    ManageUsagersComponent,
    ManageUsagersTableComponent,
    ImportComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,
    UsagerSharedModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    SharedModule,
    UsersModule,
  ],
  providers: [
    UsagerService,
    NgbDateCustomParserFormatter,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UsagersModule {}
