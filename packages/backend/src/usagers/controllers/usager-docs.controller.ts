import { UsagerDocsTable } from "./../../database/entities/usager/UsagerDocsTable.typeorm";
import { usagerDocsRepository } from "./../../database/services/usager/usagerDocsRepository.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { diskStorage } from "multer";
import * as crypto from "crypto";

import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";

import { AllowUserStructureRoles } from "../../auth/decorators";
import { CurrentUsager } from "../../auth/decorators/current-usager.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { AppUserGuard } from "../../auth/guards";
import { UsagerAccessGuard } from "../../auth/guards/usager-access.guard";
import { domifaConfig } from "../../config";

import { appLogger } from "../../util";
import { deleteFile, randomName, validateUpload } from "../../util/FileManager";
import {
  UsagerDoc,
  UsagerLight,
  UserStructureAuthenticated,
} from "../../_common/model";

import { AppLogsService } from "../../modules/app-logs/app-logs.service";
import { UploadUsagerDocDto } from "../dto";

@UseGuards(AuthGuard("jwt"), AppUserGuard, UsagerAccessGuard)
@ApiTags("docs")
@ApiBearerAuth()
@Controller("docs")
export class UsagerDocsController {
  constructor(private readonly appLogsService: AppLogsService) {}

  @ApiOperation({ summary: "Upload de pièces jointes" })
  @Post(":usagerRef")
  @AllowUserStructureRoles("simple", "responsable", "admin")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        if (!validateUpload("USAGER_DOC", req, file)) {
          throw new HttpException("INCORRECT_FORMAT", HttpStatus.BAD_REQUEST);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: async (req: any, _file: Express.Multer.File, cb: any) => {
          const dir = path.join(
            domifaConfig().upload.basePath,
            `${req.user.structureId}`,
            `${req.usager.ref}`
          );
          await fse.ensureDir(dir);
          cb(null, dir);
        },
        filename: (_req: any, file: Express.Multer.File, cb: any) => {
          return cb(null, randomName(file));
        },
      }),
    })
  )
  public async uploadDoc(
    @Param("usagerRef") usagerRef: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() postData: UploadUsagerDocDto,
    @CurrentUser() user: UserStructureAuthenticated,
    @CurrentUsager() currentUsager: UsagerLight,
    @Res() res: Response
  ) {
    try {
      this.encryptFile(file.path);
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "CANNOT_ENCRYPT_FILE" });
    }

    const userName = user.prenom + " " + user.nom;

    const newDoc: UsagerDocsTable = {
      createdAt: new Date(),
      createdBy: userName,
      filetype: file.mimetype,
      label: postData.label,
      path: file.filename,
      usagerRef,
      structureId: currentUsager.structureId,
      usagerUUID: currentUsager.uuid,
    };

    await usagerDocsRepository.save(newDoc);

    const docs = await usagerDocsRepository.getUsagerDocs(
      usagerRef,
      currentUsager.structureId
    );

    return res.status(HttpStatus.OK).json(docs);
  }

  @Delete(":usagerRef/:docUuid")
  @AllowUserStructureRoles("simple", "responsable", "admin")
  public async deleteDocument(
    @Param("usagerRef") usagerRef: number,
    @Param("docUuid") docUuid: string,
    @CurrentUser() user: UserStructureAuthenticated,
    @CurrentUsager() currentUsager: UsagerLight,
    @Res() res: Response
  ) {
    const doc = await usagerDocsRepository.findOne({
      uuid: docUuid,
      structureId: currentUsager.structureId,
    });

    if (!doc) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "DOC_NOT_FOUND" });
    }

    const pathFile = path.join(
      domifaConfig().upload.basePath,
      `${currentUsager.structureId}`,
      `${currentUsager.ref}`,
      doc.path
    );

    await deleteFile(pathFile);

    await deleteFile(pathFile + ".encrypted");

    await usagerDocsRepository.deleteByCriteria({
      uuid: doc.uuid,
    });

    await this.appLogsService.create({
      userId: user.id,
      usagerRef,
      structureId: user.structureId,
      action: "SUPPRIMER_PIECE_JOINTE",
    });

    const docs = await usagerDocsRepository.getUsagerDocs(
      usagerRef,
      currentUsager.structureId
    );

    return res.status(HttpStatus.OK).json(docs);
  }

  @Get(":usagerRef")
  @AllowUserStructureRoles("simple", "responsable", "admin")
  public async getUsagerDocuments(
    @Param("usagerRef") usagerRef: number,
    @CurrentUsager() currentUsager: UsagerLight
  ): Promise<UsagerDoc[]> {
    return await usagerDocsRepository.getUsagerDocs(
      usagerRef,
      currentUsager.structureId
    );
  }

  @Get(":usagerRef/:docUuid")
  @AllowUserStructureRoles("simple", "responsable", "admin")
  public async getDocument(
    @Param("usagerRef") usagerRef: number,
    @Param("docUuid") docUuid: string,
    @Res() res: Response,
    @CurrentUsager() currentUsager: UsagerLight
  ) {
    const doc = await usagerDocsRepository.findOne({
      uuid: docUuid,
      usagerRef,
      structureId: currentUsager.structureId,
    });

    if (!doc) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "DOC_NOT_FOUND" });
    }

    const pathFile = path.join(
      domifaConfig().upload.basePath,
      `${currentUsager.structureId}`,
      `${currentUsager.ref}`,
      doc.path
    );

    if (!(await fse.pathExists(pathFile + ".encrypted"))) {
      // Si le fichier
      if (!(await fse.pathExists(pathFile))) {
        const basePathExists = await fse.pathExists(
          path.join(
            domifaConfig().upload.basePath,
            `${currentUsager.structureId}`,
            `${currentUsager.ref}`
          )
        );

        const baseStructurePathExists = await fse.pathExists(
          path.join(
            domifaConfig().upload.basePath,
            `${currentUsager.structureId}`
          )
        );

        const baseUsagerPathExists = await fse.pathExists(
          path.resolve(path.join(domifaConfig().upload.basePath))
        );

        appLogger.error("Error reading usager document", {
          sentry: true,
          context: {
            pathFile,
            basePathExists,
            baseStructurePathExists,
            baseUsagerPathExists,
          },
        });
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "DOC_NOT_FOUND" });
      }
      // FIX: pour les rares documents non encryptés du tout début du projet
      else {
        try {
          await this.encryptFile(pathFile);
        } catch (e) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "CANNOT_ENCRYPT_FILE" });
        }
      }
    }

    // Clés de chiffrement
    const key = domifaConfig().security.files.private;
    let iv = domifaConfig().security.files.iv;

    // TEMP FIX : Utiliser la deuxième clé d'encryptage générée le 30 juin
    // A supprimer une fois que les fichiers seront de nouveaux regénérés
    if (new Date(doc.createdAt) < new Date("2021-06-12T01:01:01.113Z")) {
      iv = domifaConfig().security.files.ivSecours;
    }

    const decipher = crypto.createDecipheriv("aes-256-cfb", key, iv);

    const input = fs.createReadStream(pathFile + ".encrypted");
    const output = fs.createWriteStream(pathFile + ".unencrypted");

    return input
      .pipe(decipher)
      .pipe(output)
      .on("error", (error: Error) => {
        appLogger.error("[FILES] CANNOT_DECRYPT_FILE : " + pathFile, {
          error,
          sentry: true,
        });
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "CANNOT_ENCRYPT_FILE" });
      })
      .on("finish", () => {
        // Suppression du fichier non chiffré
        deleteFile(pathFile + ".unencrypted");

        return res.sendFile(output.path as string);
      });
  }

  private async encryptFile(fileName: string): Promise<void> {
    const key = domifaConfig().security.files.private;
    const iv = domifaConfig().security.files.iv;

    const cipher = crypto.createCipheriv("aes-256-cfb", key, iv);

    const input = fs.createReadStream(fileName);
    const output = fs.createWriteStream(fileName + ".encrypted");

    input
      .pipe(cipher)
      .pipe(output)
      .on("error", (error) => {
        appLogger.error("[FILES] CANNOT_ENCRYPT_FILE : " + fileName, {
          sentry: true,
          error,
        });
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      })
      .on("finish", () => {
        // Suppression du fichier d'origine non-chiffré
        deleteFile(fileName);
      });
  }
}
