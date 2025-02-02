import { Column, Workbook } from "exceljs";
import {
  ENTRETIEN_CAUSE_INSTABILITE,
  ENTRETIEN_RAISON_DEMANDE,
  ENTRETIEN_RESIDENCE,
  ENTRETIEN_TYPE_MENAGE,
} from "../../../_common/model";

import {
  WorksheetRenderer,
  xlFormater,
  xlRenderer,
  XlRowModel,
} from "../../xlLib";
import { StructureUsagersExportModel } from "../StructureUsagersExportModel.type";

export const exportListeEntretiensWorksheetRenderer = {
  renderWorksheet,
};

function renderWorksheet({
  workbook,
  worksheetIndex,
  model,
}: {
  workbook: Workbook;
  worksheetIndex: number;
  model: StructureUsagersExportModel;
}) {
  const worksheetRendered: WorksheetRenderer = xlRenderer.selectWorksheet(
    workbook.worksheets[worksheetIndex]
  );

  configureColumns();

  const rows: XlRowModel[] = buildRows(model);

  rows.forEach((rowModel, i) => {
    worksheetRendered.renderRow(i + 3, rowModel, { insert: true });
  });

  function configureColumns() {
    const columns: Partial<Column>[] = [
      { key: "customRef" },
      { key: "sexe" },
      { key: "nom" },
      { key: "prenom" },
      { key: "surnom" },
      { key: "dateNaissance" },
      { key: "entretienOrientation" },
      { key: "entretienOrientationDetail" },
      { key: "entretienDomiciliation" },
      { key: "entretienRevenus" },
      { key: "entretienRevenusDetail" },
      { key: "entretienLiencommune" },
      { key: "typeMenage" },
      { key: "residence" },
      { key: "entretienResidenceDetails" },
      { key: "entretienCause" },
      { key: "entretienCauseDetail" },
      { key: "entretienRaison" },
      { key: "entretienRaisonDetail" },
      { key: "accompagnement" },
      { key: "accompagnementDetail" },
      { key: "rattachement" },
      { key: "commentaires" },
    ];

    worksheetRendered.configureColumn(columns);

    worksheetRendered.renderCell(1, columns[1].key, {
      value: xlFormater.toLocalTimezone(model.exportDate),
    });
  }

  function buildRows(model: StructureUsagersExportModel): XlRowModel[] {
    return model.usagers.map((usager) => {
      const row: XlRowModel = {
        values: {
          customRef: usager.customRef,
          sexe: usager.sexe,
          nom: usager.nom,
          prenom: usager.prenom,
          surnom: usager.surnom,
          dateNaissance: usager.dateNaissance,
          entretienOrientation: usager.entretien.orientation ? "OUI" : "NON",
          entretienOrientationDetail: usager.entretien.orientation
            ? usager.entretien.orientationDetail
            : "",
          entretienDomiciliation: usager.entretien.domiciliation
            ? "OUI"
            : "NON",
          entretienRevenus: usager.entretien.revenus ? "OUI" : "NON",
          entretienRevenusDetail: usager.entretien.revenus
            ? usager.entretien.revenusDetail
            : "",
          entretienLiencommune: usager.entretien.liencommune || "",
          typeMenage: ENTRETIEN_TYPE_MENAGE[usager.entretien.typeMenage],
          residence: ENTRETIEN_RESIDENCE[usager.entretien.residence],
          entretienResidenceDetails:
            usager.entretien.residence === "AUTRE"
              ? usager.entretien.residenceDetail
              : "",
          entretienCause: ENTRETIEN_CAUSE_INSTABILITE[usager.entretien.cause],
          entretienCauseDetail:
            usager.entretien.cause === "AUTRE"
              ? usager.entretien.causeDetail
              : "",
          entretienRaison: ENTRETIEN_RAISON_DEMANDE[usager.entretien.raison],
          entretienRaisonDetail:
            usager.entretien.raison === "AUTRE"
              ? usager.entretien.raisonDetail
              : "",
          accompagnement: usager.entretien.accompagnement ? "OUI" : "NON",
          accompagnementDetail: usager.entretien.accompagnement
            ? usager.entretien.accompagnementDetail
            : "",
          rattachement: usager.entretien.rattachement,
          commentaires: usager.entretien.commentaires,
        },
      };

      return row;
    });
  }
}
