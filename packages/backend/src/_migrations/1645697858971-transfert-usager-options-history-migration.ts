import { MigrationInterface, QueryRunner } from "typeorm";

import { domifaConfig } from "../config";
import { usagerRepository } from "../database/services/usager/usagerRepository.service";
import { UsagerOptionsHistoryTable } from "../database/entities/usager/UsagerOptionsHistoryTable.typeorm";
import { usagerOptionsHistoryRepository } from "../database/services/usager/usagerOptionsHistoryRepository.service";
import { Usager } from "../_common/model";
import { appLogger } from "../util";

export class manualMigration1645697858971 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(_queryRunner: QueryRunner): Promise<void> {
    if (
      domifaConfig().envId === "prod" ||
      domifaConfig().envId === "preprod" ||
      domifaConfig().envId === "local"
    ) {
      const usagers: Usager[] = await (
        await usagerRepository.typeorm()
      ).query(
        `
        SELECT uuid, options, "structureId"
        FROM usager
        WHERE options->'historique'->'transfert' != '[]'::jsonb
      `
      );

      appLogger.warn(
        "[MIGRATION] Copie des données de l'historique du transfert"
      );

      for (const usager of usagers) {
        const newUsagerOptionsHistory = [];
        for (const transfertHistory of usager.options.historique.transfert) {
          newUsagerOptionsHistory.push(
            new UsagerOptionsHistoryTable({
              usagerUUID: usager.uuid,
              userId: null,
              userName: transfertHistory.user,
              structureId: usager.structureId,
              action: transfertHistory.action,
              type: "transfert",
              createdAt: new Date(transfertHistory.date),
              nom: transfertHistory?.content?.nom ?? null,
              prenom: null,
              actif: transfertHistory?.content?.actif ?? false,
              dateDebut: transfertHistory?.content?.dateDebut ?? null,
              dateFin: transfertHistory?.content?.dateFin ?? null,
              dateNaissance: null,
              adresse: transfertHistory?.content?.adresse ?? null,
            })
          );
        }
        await usagerOptionsHistoryRepository.save(newUsagerOptionsHistory);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
