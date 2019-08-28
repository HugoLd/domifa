import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StructureGuard } from "./guards/structure-guard";
import { NotFoundComponent } from "./modules/general/components/errors/not-found/not-found.component";
import { HomeComponent } from "./modules/general/components/home/home.component";
import { MentionsLegalesComponent } from "./modules/general/components/mentions/mentions-legales/mentions-legales.component";
import { StructuresConfirmComponent } from "./modules/structures/components/structures-confirm/structures-confirm.component";
import { StructuresFormComponent } from "./modules/structures/components/structures-form/structures-form.component";
import { StructuresSearchComponent } from "./modules/structures/components/structures-search/structures-search.component";
import { UsagersFormComponent } from "./modules/usagers/components/form/usagers-form";
import { ManageUsagersComponent } from "./modules/usagers/components/manage/manage.component";
import { UsagersProfilComponent } from "./modules/usagers/components/profil/profil-component";
import { LoginComponent } from "./modules/users/components/login/login.component";
import { RegisterUserComponent } from "./modules/users/components/register-user/register-user.component";
import { ResetPasswordComponent } from "./modules/users/components/reset-password/reset-password.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "connexion", component: LoginComponent },
  { path: "inscription", component: StructuresSearchComponent },
  { path: "structures/confirm/:token", component: StructuresConfirmComponent },
  { path: "structures/nouveau", component: StructuresFormComponent },
  {
    canActivate: [StructureGuard],
    component: RegisterUserComponent,
    path: "inscription/:id"
  },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "reset-password/:token", component: ResetPasswordComponent },
  { path: "usager/nouveau", component: UsagersFormComponent },
  { path: "usager/:id/edit", component: UsagersFormComponent },
  { path: "usager/:id/renouvellement", component: UsagersFormComponent },
  { path: "usager/:id", component: UsagersProfilComponent },
  { path: "manage", component: ManageUsagersComponent },
  { path: "mentions-legales", component: MentionsLegalesComponent },
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "404" }
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
