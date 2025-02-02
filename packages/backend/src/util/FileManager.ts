import { remove } from "fs-extra";
import { extname } from "path";
import { appLogger } from ".";

// Liste des extensions autorisé selon le contexte
export const mimeTypes = {
  STRUCTURE_CUSTOM_DOC: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  STRUCTURE_DOC: [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  IMPORT: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.spreadsheet",
  ],
  USAGER_DOC: ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
};

export const extensions = {
  STRUCTURE_CUSTOM_DOC: [".docx"],
  STRUCTURE_DOC: [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
    ".odt",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ots",
    ".ods",
  ],
  IMPORT: [".xls", ".xlsx", ".ots", ".ods"],
  USAGER_DOC: [".jpg", ".jpeg", ".png", ".pdf"],
};

// Suppression effective d'un fichier
export async function deleteFile(pathFile: string): Promise<void> {
  try {
    await remove(pathFile);
  } catch (error) {
    appLogger.error("[FILES] Delete file fail - " + pathFile, {
      sentry: true,
      error,
    });
  }
}

export function randomName(file: Express.Multer.File): string {
  const name = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join("");
  return name + extname(file.originalname);
}

// Vérification des mimetype
export function validateUpload(
  uploadType:
    | "STRUCTURE_CUSTOM_DOC"
    | "STRUCTURE_DOC"
    | "USAGER_DOC"
    | "IMPORT",
  _req: any,
  file: Express.Multer.File
): boolean {
  const validFileMimeType = mimeTypes[uploadType].includes(file.mimetype);
  const validFileExtension = extensions[uploadType].includes(
    extname(file.originalname).toLowerCase()
  );

  return validFileMimeType && validFileExtension;
}
