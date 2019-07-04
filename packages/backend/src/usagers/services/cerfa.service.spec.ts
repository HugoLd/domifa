import { Test, TestingModule } from "@nestjs/testing";
import * as fs from "fs";
import * as mongoose from "mongoose";
import pdftk = require("node-pdftk");
import * as path from "path";
import { DatabaseModule } from "../../database/database.module";
import { StructuresModule } from "../../structures/structure.module";
import { StructuresService } from "../../structures/structures.service";
import { UsersModule } from "../../users/users.module";
import { UsersProviders } from "../../users/users.providers";
import { UsersService } from "../../users/users.service";
import { UsagersModule } from "../usagers.module";
import { UsagersProviders } from "../usagers.providers";
import { CerfaService } from "./cerfa.service";
import { UsagersService } from "./usagers.service";

describe("CerfaService", () => {
  let service: CerfaService;
  let usagerService: UsagersService;
  let userService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UsersModule, UsagersModule, StructuresModule],
      providers: [
        { provide: CerfaService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: UsagersService, useValue: {} },
        {
          provide: StructuresService,
          useValue: {}
        },
        ...UsagersProviders,
        ...UsersProviders
      ]
    }).compile();

    service = module.get<CerfaService>(CerfaService);
    usagerService = module.get<UsagersService>(UsagersService);
    userService = module.get<UsersService>(UsersService);
  });

  it("0. Init + variables", () => {
    expect(service).toBeDefined();

    expect(service.convertDate(null)).toEqual({
      annee: "",
      hours: "",
      jour: "",
      minutes: "",
      mois: ""
    });
  });

  it("1. Load PDF demande", () => {
    const pdfForm1 = "../../ressources/demande.pdf";
    expect(fs.existsSync(path.resolve(__dirname, pdfForm1))).toBe(true);

    const pdfForm2 = "../../ressources/attestation.pdf";
    expect(fs.existsSync(path.resolve(__dirname, pdfForm2))).toBe(true);
  });

  it("3. Attestation de DEMANDE ⏳", async () => {
    const usager = await usagerService.findById(2);
    const user = await userService.findById(1);
    const datasAttendues = {
      "topmostSubform[0].Page1[0].AyantsDroits[0]": "",
      "topmostSubform[0].Page1[0].Datenaissance1[0]": "02",
      "topmostSubform[0].Page1[0].Datenaissance2[0]": "07",
      "topmostSubform[0].Page1[0].Datenaissance3[0]": "1990",
      "topmostSubform[0].Page1[0].LieuNaissance[0]": "SÉNÉGAL",
      "topmostSubform[0].Page1[0].Mme-Monsieur1[0]": "2",
      "topmostSubform[0].Page1[0].Noms[0]": "MAURICE",
      "topmostSubform[0].Page1[0].Prénoms[0]": "AUDIN",
      "topmostSubform[0].Page2[0].NomOrgaDomiciliataire[0]":
        "Association ARCAT",
      "topmostSubform[0].Page2[0].NuméroAgrément[0]": "1000900293",
      "topmostSubform[0].Page2[0].PrefectureDelivrAgrément[0]": "Paris, 75",
      "topmostSubform[0].Page1[0].téléphone[0]": "0606060606",
      "topmostSubform[0].Page1[0].Courriel[0]": "",
      "topmostSubform[0].Page1[0].Groupe_de_boutons_radio[0]": "1",
      "topmostSubform[0].Page1[0].LieuNaissance[1]": "SÉNÉGAL",
      "topmostSubform[0].Page2[0].Mme-Monsieur2[0]": "2",
      "topmostSubform[0].Page2[0].NomsDemandeur[0]": "MAURICE",
      "topmostSubform[0].Page2[0].PrénomsDemandeur[0]": "AUDIN",
      "topmostSubform[0].Page2[0].JourNaissanceDemandeur[0]": "02",
      "topmostSubform[0].Page2[0].MoisNaissanceDemandeur[0]": "07",
      "topmostSubform[0].Page2[0].AnnéeNaissanceDemandeur[0]": "1990",
      "topmostSubform[0].Page2[0].LieuNaissanceDemandeur[0]": "SÉNÉGAL",
      "topmostSubform[0].Page1[0].FaitLeOrganisme1[0]": "04",
      "topmostSubform[0].Page1[0].FaitLeOrganisme2[0]": "07",
      "topmostSubform[0].Page1[0].FaitLeOrganisme3[0]": "2019",
      "topmostSubform[0].Page1[0].FaitLeDemandeur1[0]": "04",
      "topmostSubform[0].Page1[0].FaitLeDemandeur2[0]": "07",
      "topmostSubform[0].Page1[0].FaitLeDemandeur3[0]": "2019",
      "topmostSubform[0].Page1[0].Jourconvocation[0]": "04",
      "topmostSubform[0].Page1[0].Moisconvocation[0]": "07",
      "topmostSubform[0].Page1[0].Annéeconvocation[0]": "2019",
      "topmostSubform[0].Page1[0].Heureconvocation[0]": "21",
      "topmostSubform[0].Page1[0].Minuteconvocation[0]": "30",
      "topmostSubform[0].Page1[0].Nomdelorganisme[0]": "Association ARCAT",
      "topmostSubform[0].Page1[0].PréfectureayantDélivré[0]": "Paris, 75",
      "topmostSubform[0].Page1[0].NumAgrement[0]": "1000900293",
      "topmostSubform[0].Page1[0].AdressePostale[0]":
        "14 rue de Buzenval, CHRS, bleu, Paris, 75014",
      "topmostSubform[0].Page1[0].Courriel[1]": "marko@yopmail.com",
      "topmostSubform[0].Page1[0].téléphone[1]": "0148252303",
      "topmostSubform[0].Page1[0].EntretienAvec[0]": "Anguet Anaïs",
      "topmostSubform[0].Page1[0].EntretienAdresse[0]":
        "14 rue de Buzenval, CHRS, bleu, Paris, 75014"
    };

    expect(usager).toBeDefined();
    expect(user).toBeDefined();

    service.attestation(usager, user);
    expect(service.sexe).toEqual("2");
    expect(service.pdfForm).toEqual("../../ressources/demande.pdf");
    expect(await service.infosPdf).toEqual(datasAttendues);
  });

  it("4. Attestation de DOMICILIATION ✅", async () => {
    const usager = await usagerService.findById(1);
    const user = await userService.findById(1);

    expect(usager).toBeDefined();
    expect(user).toBeDefined();
    expect(service.convertDate(null)).toEqual({
      annee: "",
      hours: "",
      jour: "",
      minutes: "",
      mois: ""
    });

    service.attestation(usager, user);
    expect(service.motifRefus).toEqual("");
    expect(service.sexe).toEqual("1");

    const datasAttendues = {
      "topmostSubform[0].Page1[0].AyantsDroits[0]":
        "Deschamps Mourad né(e) le 01/02/1999 - ",
      "topmostSubform[0].Page1[0].Datenaissance1[0]": "10",
      "topmostSubform[0].Page1[0].Datenaissance2[0]": "12",
      "topmostSubform[0].Page1[0].Datenaissance3[0]": "1990",
      "topmostSubform[0].Page1[0].LieuNaissance[0]": "MARSEILLE",
      "topmostSubform[0].Page1[0].Mme-Monsieur1[0]": "1",
      "topmostSubform[0].Page1[0].Noms[0]": "MARTINE",
      "topmostSubform[0].Page1[0].Prénoms[0]": "DESCHAMPS",
      "topmostSubform[0].Page2[0].NomOrgaDomiciliataire[0]":
        "Association ARCAT",
      "topmostSubform[0].Page2[0].NuméroAgrément[0]": "1000900293",
      "topmostSubform[0].Page2[0].PrefectureDelivrAgrément[0]": "Paris, 75",
      "topmostSubform[0].Page1[0].Nomdelorganisme[0]": "Association ARCAT",
      "topmostSubform[0].Page1[0].RespOrganisme[0]": "Jean-Michel Marin",
      "topmostSubform[0].Page1[0].PréfectureayantDélivré[0]": "Paris, 75",
      "topmostSubform[0].Page1[0].NumAgrement[0]": "1000900293",
      "topmostSubform[0].Page1[0].AdressePostaleOrganisme[0]":
        "14 rue de Buzenval, CHRS, bleu, Paris, 75014",
      "topmostSubform[0].Page1[0].Courriel[0]": "marko@yopmail.com",
      "topmostSubform[0].Page1[0].téléphone[0]": "0148252303",
      "topmostSubform[0].Page1[0].Noms2[0]": "MARTINE",
      "topmostSubform[0].Page1[0].Prénoms2[0]": "DESCHAMPS",
      "topmostSubform[0].Page1[0].AdressePostale[0]":
        "14 rue de Buzenval, CHRS, bleu, Paris, 75014"
    };
    expect(await service.infosPdf).toEqual(datasAttendues);
  });

  it("5. Attestation de REFUS 🚫", async () => {
    const usager = await usagerService.findById(3);
    const user = await userService.findById(1);

    expect(usager).toBeDefined();
    expect(user).toBeDefined();

    usager.decision.motifDetails = "TEST";

    service.attestation(usager, user);
    const datasAttendues = {
      "topmostSubform[0].Page1[0].AyantsDroits[0]":
        "Petit Karim né(e) le 12/10/1909 - Kolim Saiful né(e) le 05/09/1976 - ",
      "topmostSubform[0].Page1[0].Datenaissance1[0]": "06",
      "topmostSubform[0].Page1[0].Datenaissance2[0]": "09",
      "topmostSubform[0].Page1[0].Datenaissance3[0]": "1989",
      "topmostSubform[0].Page1[0].LieuNaissance[0]": "SAINT-ETIENNE",
      "topmostSubform[0].Page1[0].Mme-Monsieur1[0]": "2",
      "topmostSubform[0].Page1[0].Noms[0]": "KARIM",
      "topmostSubform[0].Page1[0].Prénoms[0]": "DELAVEGA",
      "topmostSubform[0].Page2[0].NomOrgaDomiciliataire[0]":
        "Association ARCAT",
      "topmostSubform[0].Page2[0].NuméroAgrément[0]": "1000900293",
      "topmostSubform[0].Page2[0].PrefectureDelivrAgrément[0]": "Paris, 75",
      "topmostSubform[0].Page1[0].téléphone[0]": "0606060606",
      "topmostSubform[0].Page1[0].Courriel[0]": "kakarim@yopmail.com",
      "topmostSubform[0].Page1[0].Groupe_de_boutons_radio[0]": "1",
      "topmostSubform[0].Page1[0].LieuNaissance[1]": "SAINT-ETIENNE",
      "topmostSubform[0].Page2[0].Mme-Monsieur2[0]": "2",
      "topmostSubform[0].Page2[0].NomsDemandeur[0]": "KARIM",
      "topmostSubform[0].Page2[0].PrénomsDemandeur[0]": "DELAVEGA",
      "topmostSubform[0].Page2[0].JourNaissanceDemandeur[0]": "06",
      "topmostSubform[0].Page2[0].MoisNaissanceDemandeur[0]": "09",
      "topmostSubform[0].Page2[0].AnnéeNaissanceDemandeur[0]": "1989",
      "topmostSubform[0].Page2[0].LieuNaissanceDemandeur[0]": "SAINT-ETIENNE",
      "topmostSubform[0].Page1[0].FaitLeOrganisme1[0]": "04",
      "topmostSubform[0].Page1[0].FaitLeOrganisme2[0]": "07",
      "topmostSubform[0].Page1[0].FaitLeOrganisme3[0]": "2019",
      "topmostSubform[0].Page1[0].FaitLeDemandeur1[0]": "04",
      "topmostSubform[0].Page1[0].FaitLeDemandeur2[0]": "07",
      "topmostSubform[0].Page1[0].FaitLeDemandeur3[0]": "2019",
      "topmostSubform[0].Page1[0].Jourconvocation[0]": "25",
      "topmostSubform[0].Page1[0].Moisconvocation[0]": "07",
      "topmostSubform[0].Page1[0].Annéeconvocation[0]": "2019",
      "topmostSubform[0].Page1[0].Heureconvocation[0]": "13",
      "topmostSubform[0].Page1[0].Minuteconvocation[0]": "49",
      "topmostSubform[0].Page1[0].Nomdelorganisme[0]": "Association ARCAT",
      "topmostSubform[0].Page1[0].PréfectureayantDélivré[0]": "Paris, 75",
      "topmostSubform[0].Page1[0].NumAgrement[0]": "1000900293",
      "topmostSubform[0].Page1[0].AdressePostale[0]":
        "14 rue de Buzenval, CHRS, bleu, Paris, 75014",
      "topmostSubform[0].Page1[0].Courriel[1]": "marko@yopmail.com",
      "topmostSubform[0].Page1[0].téléphone[1]": "0148252303",
      "topmostSubform[0].Page1[0].EntretienAvec[0]": "Michat Mehdi",
      "topmostSubform[0].Page1[0].EntretienAdresse[0]":
        "14 rue de Buzenval, CHRS, bleu, Paris, 75014",
      "topmostSubform[0].Page2[0].Décision[0]": "2",
      "topmostSubform[0].Page2[0].MotifRefus[0]":
        "Existence d'un hébergement stable",
      "topmostSubform[0].Page2[0].OrientationProposée[0]": "La mairie de paris"
    };
    expect(await service.infosPdf).toEqual(datasAttendues);

    usager.decision.motif = "refusAutre";
    usager.decision.motifDetails = "TEST";
    service.attestation(usager, user);
    expect(service.motifRefus).toEqual("Autre motif : TEST");
  });
});
