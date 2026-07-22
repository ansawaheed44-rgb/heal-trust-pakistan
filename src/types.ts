export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface ParsedAssessment {
  intro: string;
  possibleCauses: string;
  actionsNow: string;
  urgentHelpIf: string;
  whenToSeeDoctor: string;
  questions: string;
  disclaimer: string;
}

export type HealthLanguage = "english" | "urdu" | "romanUrdu";

export interface PresetSymptom {
  title: string;
  description: string;
  prompt: string;
  language: HealthLanguage;
  category: "urgent" | "general" | "pediatric" | "environmental";
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: string;
  sex: string;
  otherConditions: string;
  allergies: string;
}

export interface SymptomLogEntry {
  id: string;
  userId: string;
  timestamp: string;
  primarySymptom: string;
  painLevel: number;
  fever: string;
  duration: string;
  notes: string;
  assessmentText?: string;
}

export interface HospitalClinic {
  id: string;
  name: string;
  city: "Lahore" | "Karachi" | "Islamabad" | "Rawalpindi" | "Peshawar" | "Quetta" | "Multan" | "Faisalabad";
  address: string;
  phone: string;
  type: "Government Emergency" | "Private Hospital" | "Charity Trust Hospital" | "Diagnostics Lab";
  is24_7: boolean;
  labsAvailable: string[];
}

export interface MedicationSafetyInfo {
  id: string;
  brandNames: string[];
  genericName: string;
  usageCategory: string;
  urduUsage: string;
  safeDosageAdult: string;
  safeDosageChild: string;
  pregnancySafety: "Safe under advice" | "Avoid unless critical" | "Strictly Avoid" | "Consult gynecologist";
  criticalAlerts: string;
  urduAlerts: string;
  description?: string;
  usesAndBenefits?: string[];
  sideEffects?: string[];
  clinicalPrecautions?: string[];
  urduBenefits?: string;
  advantages?: string[];
  disadvantages?: string[];
}
