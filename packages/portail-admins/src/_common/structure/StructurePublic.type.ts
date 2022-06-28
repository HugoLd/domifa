import { Telephone } from "./../telephone/Telephone.type";
import { StructureType, StructureAddresseCourrier } from ".";
import { AppEntity } from "../_core";

export type StructurePublic = AppEntity & {
  id: number; // TODO: à voir si c'est utile
  adresse: string;
  complementAdresse: string;
  nom: string;
  structureType: StructureType;
  ville: string;
  departement: string;
  region: string;
  codePostal: string;
  telephone: Telephone;
  email: string;
  tokenDelete: string;
  adresseCourrier: StructureAddresseCourrier;
};
