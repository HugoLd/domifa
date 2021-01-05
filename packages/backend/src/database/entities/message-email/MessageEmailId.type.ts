export type MessageEmailTipimailTemplateId =
  | "import-guide"
  | "user-guide"
  | "structure-created"
  | "structure-delete"
  | "user-reset-password"
  | "user-account-created-by-admin"
  | "user-account-activation-pending"
  | "user-account-activated"
  | "structure-hard-reset";

export type MessageContentEmailId =
  | "usager-appointment-created"
  | "admin-batchs-error-report";

export type MessageEmailId =
  | MessageEmailTipimailTemplateId
  | MessageContentEmailId;

export const TIPIMAIL_TEMPLATES_MESSAGE_IDS: MessageEmailTipimailTemplateId[] = [
  "import-guide",
  "user-guide",
  "structure-created",
  "structure-delete",
  "user-reset-password",
  "user-account-created-by-admin",
  "user-account-activation-pending",
  "user-account-activated",
  "structure-hard-reset",
  //  "usager-appointment-created" => migrated out of tipimail templates
];
