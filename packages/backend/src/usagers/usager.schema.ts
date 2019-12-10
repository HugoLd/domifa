// tslint:disable: object-literal-sort-keys
import * as mongoose from "mongoose";
import { Usager } from "./interfaces/usagers";

export const UsagerSchema = new mongoose.Schema({
  id: {
    type: Number
  },

  agent: String,
  structureId: { type: Number, required: true },

  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  surnom: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  sexe: { type: String, required: true },

  dateNaissance: { type: Date, required: true },
  villeNaissance: { type: String, required: true },

  ayantsDroits: { type: Array, default: [] },
  ayantsDroitsExist: Boolean,

  etapeDemande: {
    type: Number,
    default: 1,
    required: true
  },

  datePremiereDom: {
    default: null,
    type: Date
  },

  import: { type: Boolean, default: false },

  typeDom: {
    default: "PREMIERE",
    type: String
  },

  decision: {
    dateDebut: { type: Date },
    dateFin: { type: Date, default: Date.now },
    dateDecision: { type: Date, default: Date.now },

    motif: {
      default: "",
      type: String
    },
    motifDetails: {
      default: "",
      type: String
    },
    orientation: {
      default: "",
      type: String
    },
    orientationDetails: {
      default: "",
      type: String
    },
    statut: {
      default: "INSTRUCTION",
      type: String
    },
    userId: Number,
    userName: String
  },

  historique: { type: Array, default: [] },

  rdv: {
    dateRdv: { type: Date, default: null },
    userId: { type: Number, default: 0 },
    userName: { type: String, default: "" }
  },

  entretien: {
    type: {
      domiciliation: Boolean,
      liencommune: String,
      residence: String,
      residenceDetail: String,
      revenus: Boolean,
      revenusDetail: String,
      cause: String,
      causeDetail: String,
      pourquoi: String,
      pourquoiDetail: String,
      accompagnement: Boolean,
      accompagnementDetail: String,
      typeMenage: String,
      commentaires: String
    },
    default: {
      domiciliation: null,
      liencommune: null,
      residence: null,
      residenceDetail: null,
      revenus: null,
      revenusDetail: null,
      cause: null,
      causeDetail: null,
      pourquoi: null,
      pourquoiDetail: null,
      accompagnement: null,
      accompagnementDetail: null,
      commentaires: null,
      typeMenage: null
    }
  },

  lastInteraction: {
    type: {
      nbCourrier: {
        type: Number,
        default: 0
      },
      dateInteraction: {
        type: Date,
        default: null
      }
    },
    default: {
      nbCourrier: 0,
      courrierIn: null,
      courrierOut: null,
      recommandeIn: null,
      recommandeOut: null,
      appel: null,
      dateInteraction: null,
      visite: null
    }
  },

  preference: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false }
  },

  interactions: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interaction"
      }
    ],
    default: []
  },
  docs: [],
  docsPath: [],

  transfert: {
    type: {
      statut: { type: Boolean, default: false },
      address: { type: String, default: "" },
      name: { type: String, default: "" }
    },
    default: false
  }
});

UsagerSchema.pre<Usager>("save", function(next) {
  this.nom = this.nom.charAt(0).toUpperCase() + this.nom.slice(1);
  this.prenom = this.prenom.charAt(0).toUpperCase() + this.prenom.slice(1);
  this.email = this.email.toLowerCase();
  next();
});
