import { bench } from "@ark/attest";
import { Path, PathAt, PathOf } from "./dot-path.js";

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

bench("Path", () => {
  type Test = Path<MegaOrg>;
  let _: Test;
}).types([4687, "instantiations"]);

bench("PathAt", () => {
  type Test = PathAt<MegaOrg, "departments.0.lead.contact">;
  let _: Test;
}).types([5880, "instantiations"]);

bench("PathOf", () => {
  type Test = PathOf<MegaOrg, number>;
  let _: Test;
}).types([6117, "instantiations"]);
