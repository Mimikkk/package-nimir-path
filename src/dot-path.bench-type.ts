import { bench } from "@ark/attest";
import {
  Path as DpvPath,
  PathValue as DpvPathValue,
  getByPath,
  setByPath,
} from "dot-path-value";
import { getProperty, setProperty } from "dot-prop";
import type { Get, Paths } from "type-fest";
import { get, Path, PathAt, PathOf, set } from "./dot-path.js";

interface Contact {
  email: string;
  slack?: string;
}

interface Lead {
  id: number;
  contact: Contact;
}

interface EngDept {
  name: "eng";
  lead: Lead;
  org: MegaOrg;
}

interface SalesDept {
  name: "sales";
  quota: { q1: number; q2: number; carry: { from: string; amount: number } };
}

interface Prefs {
  theme: "light" | "dark";
  notify: { email: boolean; push: boolean };
}

interface Profile {
  displayName: string;
  prefs: Prefs;
}

interface UserNode {
  profile: Profile;
  lastSeen: string;
  reputation: number;
}

interface MegaOrg {
  id: string;
  meta: {
    region: string;
    scoring: { internal: number; external: { vendor: string; score: number } };
  };
  departments: [EngDept, SalesDept];
  roster: UserNode[];
  orphans: {
    misc: [string, { nested: { token: symbol; ok: true } }];
  };
  translations: DeepTranslations;
}

interface TrCommonActions {
  save: string;
  cancel: string;
  confirm: string;
  back: string;
  next: string;
  retry: string;
  close: string;
}

interface TrCommonLabels {
  email: string;
  password: string;
  name: string;
  optional: string;
  required: string;
  search: string;
  noResults: string;
}

interface TrCommonAria {
  openMenu: string;
  closeDialog: string;
  loading: string;
  sortColumn: string;
  expandRow: string;
}

interface TrCommon {
  actions: TrCommonActions;
  labels: TrCommonLabels;
  aria: TrCommonAria;
}

interface TrLayoutHeader {
  brand: string;
  navHome: string;
  navSettings: string;
  userMenu: { account: string; logout: string; preferences: string };
}

interface TrLayoutFooter {
  copyrightFmt: string;
  links: { privacy: string; terms: string; contact: string };
}

interface TrLayoutSidebar {
  collapse: string;
  expand: string;
  sections: { main: string; admin: string; tools: string };
}

interface TrLayout {
  header: TrLayoutHeader;
  footer: TrLayoutFooter;
  sidebar: TrLayoutSidebar;
}

interface TrHomeHero {
  title: string;
  subtitle: string;
  cta: { primary: string; secondary: string };
  badges: { new: string; beta: string };
}

interface TrHomeSections {
  features: { heading: string; item1: string; item2: string; item3: string };
  pricing: { heading: string; perMonth: string; contactSales: string };
}

interface TrPageHome {
  hero: TrHomeHero;
  sections: TrHomeSections;
}

interface TrAuthLogin {
  title: string;
  forgotPassword: string;
  signUpPrompt: string;
  errors: { invalidCreds: string; locked: string; network: string };
}

interface TrAuthRegister {
  title: string;
  acceptTerms: string;
  errors: { weakPassword: string; emailTaken: string };
}

interface TrAuthMfa {
  title: string;
  hint: string;
  backup: { heading: string; description: string };
}

interface TrPageAuth {
  login: TrAuthLogin;
  register: TrAuthRegister;
  mfa: TrAuthMfa;
}

interface TrSettingsAccountProfile {
  title: string;
  displayName: string;
  bio: string;
  avatar: { upload: string; remove: string };
}

interface TrSettingsAccountSecurityTwoFactor {
  title: string;
  enable: string;
  disable: string;
  backupCodes: {
    heading: string;
    description: string;
    regenerate: string;
    download: string;
  };
  recovery: { heading: string; body: string; action: string };
}

interface TrSettingsAccountSecuritySessions {
  title: string;
  revoke: string;
  revokeAll: string;
  current: string;
}

interface TrSettingsAccountSecurity {
  title: string;
  password: { change: string; strengthHint: string };
  twoFactor: TrSettingsAccountSecurityTwoFactor;
  sessions: TrSettingsAccountSecuritySessions;
}

interface TrSettingsAccountNotifications {
  title: string;
  channels: { email: string; push: string; sms: string };
  digest: { daily: string; weekly: string; off: string };
}

interface TrSettingsAccountBillingInvoice {
  title: string;
  downloadPdf: string;
  status: { paid: string; open: string; void: string };
}

interface TrSettingsAccountBillingPayment {
  title: string;
  addMethod: string;
  default: string;
}

interface TrSettingsAccountBilling {
  plan: { current: string; upgrade: string; downgrade: string };
  invoice: TrSettingsAccountBillingInvoice;
  payment: TrSettingsAccountBillingPayment;
}

interface TrSettingsAccount {
  profile: TrSettingsAccountProfile;
  security: TrSettingsAccountSecurity;
  notifications: TrSettingsAccountNotifications;
  billing: TrSettingsAccountBilling;
}

interface TrPageSettings {
  title: string;
  account: TrSettingsAccount;
}

interface TrDashboardWidgets {
  revenue: { title: string; tooltip: string };
  users: { title: string; active: string; inactive: string };
  system: { title: string; healthy: string; degraded: string };
}

interface TrPageDashboard {
  welcomeFmt: string;
  widgets: TrDashboardWidgets;
}

interface TrErrorsApi {
  timeout: string;
  unauthorized: string;
  forbidden: string;
  notFound: string;
  conflict: string;
  rateLimited: string;
  server: string;
}

interface TrErrorsForm {
  generic: string;
  invalid: string;
  readonly: string;
}

interface TrErrors {
  api: TrErrorsApi;
  form: TrErrorsForm;
}

interface TrValidationField {
  tooShort: string;
  tooLong: string;
  invalidFormat: string;
  required: string;
}

interface TrValidation {
  email: TrValidationField;
  password: TrValidationField;
  url: TrValidationField;
  phone: TrValidationField;
  date: TrValidationField;
}

interface TrComponentsModal {
  confirmTitle: string;
  confirmBody: string;
  discardTitle: string;
  discardBody: string;
}

interface TrComponentsTable {
  empty: string;
  loading: string;
  loadMore: string;
  ofRowsFmt: string;
}

interface TrComponentsDatePicker {
  placeholder: string;
  clear: string;
  presets: { today: string; last7: string; last30: string; custom: string };
}

interface TrComponents {
  modal: TrComponentsModal;
  table: TrComponentsTable;
  datePicker: TrComponentsDatePicker;
}

interface TrMetaLocale {
  rtl: string;
  ltr: string;
  regionalFmt: string;
}

interface TrMeta {
  version: string;
  locale: string;
  localeHints: TrMetaLocale;
}

export interface DeepTranslations {
  meta: TrMeta;
  common: TrCommon;
  layout: TrLayout;
  pages: {
    home: TrPageHome;
    auth: TrPageAuth;
    settings: TrPageSettings;
    dashboard: TrPageDashboard;
  };
  errors: TrErrors;
  validation: TrValidation;
  components: TrComponents;
}

// expressions

bench("warm-up", () => {}).types([0, "instantiations"]);

/**
 * `dot-path-value` `Path` / `PathValue` recurse with no root guard; `EngDept.org: MegaOrg`
 * makes `DpvPath<MegaOrg>` non-terminating. Same subtree under `departments` without that edge.
 */
type EngDeptAcyclic = Omit<EngDept, "org"> & { org: Pick<MegaOrg, "id"> };
type MegaOrgAcyclic = Omit<MegaOrg, "departments"> & {
  departments: [EngDeptAcyclic, SalesDept];
};

bench("Path", () => {
  type Test = Path<MegaOrgAcyclic>;
  let _: Test;
})
  .mark({ mean: [0.19, "ns"], median: [0, "s"] })
  .types([3885, "instantiations"]);

bench("PathAt", () => {
  type Test = PathAt<MegaOrgAcyclic, "departments.0.lead.contact">;
  let _: Test;
})
  .mark({ mean: [1.88, "ns"], median: [1.8, "ns"] })
  .types([4601, "instantiations"]);

bench("PathOf", () => {
  type Test = PathOf<MegaOrgAcyclic, number>;
  let _: Test;
})
  .mark({ mean: [1.91, "ns"], median: [1.8, "ns"] })
  .types([4728, "instantiations"]);

bench("get", () => {
  let item!: MegaOrgAcyclic;
  get(item, "departments.0.lead.contact");
})
  .mark({ mean: [29.02, "ns"], median: [28.4, "ns"] })
  .types([4804, "instantiations"]);

bench("set", () => {
  let item: MegaOrgAcyclic = {} as never;
  set(item, "departments.0.lead.contact", {
    email: "test@test.com",
    slack: "@test",
  });
})
  .mark({ mean: [174.36, "ns"], median: [170.1, "ns"] })
  .types([6254, "instantiations"]);

bench("dpv Path", () => {
  type Test = DpvPath<MegaOrgAcyclic>;
  let _: Test;
})
  .mark({ mean: [1.92, "ns"], median: [1.8, "ns"] })
  .types([4066, "instantiations"]);

bench("dpv PathValue", () => {
  type Test = DpvPathValue<MegaOrgAcyclic, "departments.0.lead.contact">;
  let _: Test;
})
  .mark({ mean: [1.93, "ns"], median: [1.8, "ns"] })
  .types([12706, "instantiations"]);

bench("dpv get", () => {
  let item!: MegaOrgAcyclic;
  getByPath(item, "departments.0.lead.contact");
})
  .mark({ mean: [24.53, "ns"], median: [23.9, "ns"] })
  .types([4447, "instantiations"]);

bench("dpv set", () => {
  let item: MegaOrgAcyclic = {} as never;
  setByPath(item, "departments.0.lead.contact", {
    email: "test@test.com",
    slack: "@test",
  });
})
  .mark({ mean: [173.69, "ns"], median: [169.8, "ns"] })
  .types([4651, "instantiations"]);

bench("dp Paths", () => {
  type Test = Paths<
    MegaOrgAcyclic,
    { bracketNotation: false; maxRecursionDepth: 10 }
  >;
  let _: Test;
})
  .mark({ mean: [1.93, "ns"], median: [1.8, "ns"] })
  .types([46603, "instantiations"]);

bench("dp Get", () => {
  type Test = Get<MegaOrgAcyclic, "departments.0.lead.contact">;
  let _: Test;
})
  .mark({ mean: [1.9, "ns"], median: [1.8, "ns"] })
  .types([36269, "instantiations"]);

bench("dp get", () => {
  let item!: MegaOrgAcyclic;
  getProperty(item, "departments.0.lead.contact");
})
  .mark({ mean: [2.15, "ns"], median: [2, "ns"] })
  .types([23075, "instantiations"]);

bench("dp set", () => {
  let item: MegaOrgAcyclic = {} as never;
  setProperty(item, "departments.0.lead.contact", {
    email: "test@test.com",
    slack: "@test",
  });
})
  .mark({ mean: [447.85, "ns"], median: [432.4, "ns"] })
  .types([10, "instantiations"]);
