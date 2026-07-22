import React, { useState, useRef, useEffect } from "react";
import { 
  Heart, 
  HeartPulse,
  Shield, 
  PhoneCall, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  User, 
  Clock, 
  Activity, 
  Info, 
  Globe,
  ChevronRight, 
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  BookmarkCheck,
  Search,
  BookOpen,
  UserPlus,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  Star,
  MessageSquare,
  MapPin,
  Pill,
  Calendar,
  Download,
  UserCheck,
  Stethoscope,
  CloudUpload,
  Home,
  Mail,
  Users,
  Building,
  X
} from "lucide-react";
import { Message, HealthLanguage, PresetSymptom, User as AppUser, SymptomLogEntry, MedicationSafetyInfo } from "./types";
import { PRESET_SYMPTOMS, EMERGENCY_ALERT_LIST } from "./data";
import { HOSPITAL_DIRECTORY, MEDICATION_SAFETY_DATABASE } from "./additionalData";
import { parseAssessment, cleanTextSection } from "./utils";
import { LAB_TESTS_DATABASE, DOCTOR_SPECIALTIES_DATABASE } from "./labAndPlannerData";

type PortalTab = "home" | "about" | "department" | "doctors" | "services" | "contact" | "ai-consultation" | "hospital-finder" | "med-safety" | "health-diary" | "first-aid" | "lab-explainer" | "doctor-planner" | "supabase-activity" | "admin-panel" | "book-appointment" | "reviews";

export const DOCTORS_LIST = [
  {
    name: "Tariq Mahmood",
    title: "Prof. Dr. Tariq Mahmood",
    specialty: "General Physician / Family Medicine",
    location: "Lahore General Hospital",
    timing: "Mon - Fri (09:00 AM - 01:00 PM)",
    experience: "25+ Years Experience",
    focus: "Preventative medicine, chronic disease support, hypertension control, and lifestyle management.",
    avatar: "TM",
    phone: "042-99264015"
  },
  {
    name: "Amina Qureshi",
    title: "Dr. Amina Qureshi",
    specialty: "Pediatrician (Child Specialist)",
    location: "Children's Hospital Karachi",
    timing: "Mon - Thu (10:00 AM - 02:00 PM)",
    experience: "15+ Years Experience",
    focus: "Child developmental benchmarks, vaccinations, infant nutrition, and seasonal pediatric fevers.",
    avatar: "AQ",
    phone: "021-36622201"
  },
  {
    name: "Zainab Bilal",
    title: "Dr. Zainab Bilal",
    specialty: "Gynecologist / Obstetrician",
    location: "Lady Reading Hospital Peshawar",
    timing: "Tue - Sat (11:00 AM - 03:00 PM)",
    experience: "18+ Years Experience",
    focus: "Prenatal health guides, maternity wellness, family wellness counseling, and hormonal control.",
    avatar: "ZB",
    phone: "091-9211430"
  },
  {
    name: "Khurram Shahzad",
    title: "Dr. Khurram Shahzad",
    specialty: "Cardiologist (Heart Specialist)",
    location: "NICVD Karachi",
    timing: "Mon - Wed (02:00 PM - 06:00 PM)",
    experience: "20+ Years Experience",
    focus: "Coronary care management, high blood pressure (hypertension) assessment, and lipid risk control.",
    avatar: "KS",
    phone: "021-99201271"
  },
  {
    name: "Sarah Malik",
    title: "Dr. Sarah Malik",
    specialty: "Endocrinologist (Diabetes & Hormone Specialist)",
    location: "PIMS Islamabad",
    timing: "Wed - Sat (09:00 AM - 01:00 PM)",
    experience: "12+ Years Experience",
    focus: "Type 1 & 2 diabetes management plans, HbA1c sugar optimization, and thyroid balancing.",
    avatar: "SM",
    phone: "051-9261170"
  }
];

const getOptionIcon = (iconName: string) => {
  switch (iconName) {
    case "Activity": return <Activity className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Pill": return <Pill className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "FileText": return <FileText className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Heart": return <Heart className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "HelpCircle": return <HelpCircle className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Shield": return <Shield className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Stethoscope": return <Stethoscope className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Sparkles": return <Sparkles className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Info": return <Info className="w-3.5 h-3.5 text-[#2D5A27]" />;
    case "Calendar": return <Calendar className="w-3.5 h-3.5 text-[#2D5A27]" />;
    default: return <HelpCircle className="w-3.5 h-3.5 text-[#2D5A27]" />;
  }
};

const HEALTH_OPTIONS = [
  { name: "Check Symptoms", icon: "Activity", query: "I want to check my symptoms. What follow-up questions should I answer to help identify what is wrong?" },
  { name: "Medicine Information", icon: "Pill", query: "Can you give me safety information about common medicines, like Panadol, and how to use them safely?" },
  { name: "Understand Lab Reports", icon: "FileText", query: "I need help understanding a lab report (like a CBC, Dengue, or urine test). What should I look out for?" },
  { name: "Women’s Health & Pregnancy", icon: "Heart", query: "I have a question about women’s health or pregnancy safety. What are the key home care and warning signs?" },
  { name: "Child & Baby Care", icon: "HelpCircle", query: "I have a question about infant or pediatric care (like fever or feeding). What are safe home remedies and pediatric red flags?" },
  { name: "Mental Health Support", icon: "Shield", query: "I am looking for mental health support, stress management, or emotional guidance. How can I care for my mind safely?" },
  { name: "Diabetes, BP & Heart Health", icon: "Stethoscope", query: "How can I manage chronic conditions like Diabetes, high blood pressure, or general heart health?" },
  { name: "Skin, Hair & Allergy Help", icon: "Sparkles", query: "I have a concern about a skin rash, hair loss, or common allergies. What should I look for?" },
  { name: "Diet, Weight & Fitness", icon: "Activity", query: "What is healthy, safe advice for diet, weight management, and physical fitness in Pakistan?" },
  { name: "Dental & Oral Health", icon: "Sparkles", query: "I have a concern about dental pain, bleeding gums, or oral hygiene. What are safe home care steps?" },
  { name: "First Aid Guidance", icon: "Info", query: "Can you provide clear, step-by-step first aid guidance for common injuries or minor emergencies?" },
  { name: "Prepare for a Doctor Visit", icon: "Calendar", query: "How can I prepare for a doctor visit? What symptoms or questions should I write down to get the best care?" },
];

function detectEmergency(text: string) {
  const lower = text.toLowerCase();
  
  if (lower.includes("chest pain") || lower.includes("pressure in chest") || lower.includes("seene mein dard") || lower.includes("seena dard") || lower.includes("chest pressure")) {
    return {
      condition: "Chest Pain / Pressure (سینے میں درد)",
      messageEn: "Chest pain or pressure can indicate an active cardiac emergency. Do not wait for an online assessment.",
      messageUr: "سینے میں شدید درد یا دباؤ دل کے دورے (Heart Attack) کی علامت ہو سکتا ہے۔ براہ کرم ہیلپ لائن 1122 پر کال کریں یا فوراً اسپتال جائیں۔"
    };
  }
  if (lower.includes("breathing") || lower.includes("shortness of breath") || lower.includes("difficulty breathing") || lower.includes("sans lene") || lower.includes("dum ghutna") || lower.includes("choking")) {
    return {
      condition: "Severe Breathing Difficulty / Choking (سانس کی شدید دشواری)",
      messageEn: "Severe shortness of breath or choking is a high-priority medical emergency. Immediate care is vital.",
      messageUr: "سانس لینے میں شدید دشواری یا دم گھٹنا ایک انتہائی ہنگامی صورتحال ہے۔ فوری ایمرجنسی وارڈ سے رجوع کریں۔"
    };
  }
  if (lower.includes("stroke") || lower.includes("face drooping") || lower.includes("slurred speech") || lower.includes("arm weakness") || lower.includes("falij") || lower.includes("chehra lathakna") || lower.includes("bolne mein dushwari")) {
    return {
      condition: "Stroke Warning Signs (فالج کی علامات)",
      messageEn: "Facial drooping, arm weakness, or difficulty speaking are key signs of a stroke. Time is critical.",
      messageUr: "چہرہ لٹکنا، بازو میں کمزوری، یا بولنے میں دشواری فالج (Stroke) کی اہم علامات ہیں۔ فوری طبی امداد حاصل کریں۔"
    };
  }
  if (lower.includes("severe bleeding") || lower.includes("vomiting blood") || lower.includes("khoon behna") || lower.includes("khoon ki ulti") || lower.includes("heavy bleeding")) {
    return {
      condition: "Severe Bleeding / Vomiting Blood (شدید خون بہنا)",
      messageEn: "Active heavy bleeding or vomiting blood requires immediate hospital treatment to prevent shock.",
      messageUr: "شدید خون کا بہنا یا خون کی الٹی آنا ایک ہنگامی طبی صورتحال ہے۔ فوراً قریبی اسپتال جائیں۔"
    };
  }
  if (lower.includes("poison") || lower.includes("zehar") || lower.includes("poisoning") || lower.includes("swallowed chemical")) {
    return {
      condition: "Poisoning / Toxic Ingestion (زہر خورانی)",
      messageEn: "Chemical or toxic ingestion is highly dangerous. Seek immediate medical assistance or emergency transport.",
      messageUr: "زہر خورانی یا کسی زہریلے کیمیکل کا نگل جانا انتہائی خطرناک ہے۔ فوراً ایمرجنسی سے رابطہ کریں۔"
    };
  }
  if (lower.includes("seizure") || lower.includes("fits") || lower.includes("jhatkay") || lower.includes("mirghi") || lower.includes("convulsion")) {
    return {
      condition: "Seizures / Fits (مرگی یا جھٹکے)",
      messageEn: "Active seizures or fits can cause airway blockage and serious injury. Immediate transfer is needed.",
      messageUr: "مرگی کے دورے یا جسم میں جھٹکے لگنا سانس بند ہونے کا سبب بن سکتے ہیں۔ مریض کو فوراً ایمرجنسی منتقل کریں۔"
    };
  }
  if ((lower.includes("pregnant") || lower.includes("pregnancy") || lower.includes("hamal")) && (lower.includes("bleeding") || lower.includes("severe pain") || lower.includes("fluid leakage") || lower.includes("shaddid dard"))) {
    return {
      condition: "Pregnancy Danger Signs (حمل کے خطرات)",
      messageEn: "Severe pain, fluid leakage, or heavy bleeding during pregnancy are maternal emergency warnings.",
      messageUr: "دورانِ حمل شدید درد یا خون بہنا ماں اور بچے دونوں کے لیے خطرناک ہے۔ فوراً گائناکولوجسٹ یا ایمرجنسی وارڈ جائیں۔"
    };
  }
  if (lower.includes("suicid") || lower.includes("self-harm") || lower.includes("kill myself") || lower.includes("khudkushi") || lower.includes("nuqsaan pohanchane")) {
    return {
      condition: "Crisis Support / Suicide Risk (نفسیاتی بحران)",
      messageEn: "You do not have to carry this alone. Please contact Rescue 1122 or talk to a trusted friend or family member immediately.",
      messageUr: "آپ اکیلے نہیں ہیں۔ اگر آپ خود کو نقصان پہنچانے کا سوچ رہے ہیں، تو براہ کرم فوراً اپنے کسی قریبی پیارے یا 1122 پر رابطہ کریں۔"
    };
  }
  return null;
}

const LAB_SERVICES_REAL_DETAILS: Record<string, {
  name: string;
  pkrPrice: string;
  timings: string;
  helpline: string;
  description: string;
}> = {
  "complete blood count (cbc)": {
    name: "Complete Blood Count (CBC)",
    pkrPrice: "1,250 PKR",
    timings: "Report in 4-6 Hours",
    helpline: "03-111-255-778 (Ext 1)",
    description: "Evaluates your overall health and detects a wide range of disorders, including anemia, infection, and leukemia by measuring red cells, white cells, and platelets."
  },
  "dengue ns1 antigen": {
    name: "Dengue NS1 Antigen Test",
    pkrPrice: "2,400 PKR",
    timings: "Report in 3-4 Hours (Urgent Triage)",
    helpline: "03-111-255-778 (Ext 2)",
    description: "Highly vital for early detection of Dengue virus infection. Recommended during the first 1-5 days of high-grade fever in endemic regions."
  },
  "malaria smear": {
    name: "Malaria Smear / MP Test",
    pkrPrice: "850 PKR",
    timings: "Report in 2 Hours",
    helpline: "03-111-255-778 (Ext 1)",
    description: "Microscopic evaluation to detect malaria parasites in the blood. Essential for patients experiencing cold chills and cyclical high-grade fevers."
  },
  "kidney function test": {
    name: "Kidney Function Test (KFT / LFT)",
    pkrPrice: "1,850 PKR",
    timings: "Report in 8 Hours",
    helpline: "03-111-255-778 (Ext 4)",
    description: "Measures serum creatinine, urea, and electrolytes to evaluate kidney performance and filtration safety."
  },
  "blood bank": {
    name: "Emergency Blood Bank Services",
    pkrPrice: "Free / Donor Exchange Basis",
    timings: "Available 24/7 (Emergency Desk)",
    helpline: "042-99211100 (Ext 112)",
    description: "Immediate matching and issuance of red cell concentrates, platelets, and plasma for acute surgical cases or severe hemorrhage."
  },
  "x-ray": {
    name: "Digital Chest / Bone X-Ray",
    pkrPrice: "1,200 PKR",
    timings: "Immediate Film & Report in 1 Hour",
    helpline: "042-99211100 (Ext 204)",
    description: "High-contrast digital diagnostic imaging of the thoracic cavity or skeletal system to detect pneumonia, fractures, or fluid accumulation."
  },
  "basic pathology": {
    name: "Routine General Pathology tests",
    pkrPrice: "750 PKR",
    timings: "Report in 4 Hours",
    helpline: "042-99211100 (Ext 105)",
    description: "Standard biochemical profiling, liver function assays, and urine analysis for baseline diagnostic assessments."
  },
  "ct scan": {
    name: "CT Scan (Computed Tomography)",
    pkrPrice: "8,500 PKR",
    timings: "Report and Scan copy in 3 Hours",
    helpline: "042-99211100 (Ext 115)",
    description: "Cross-sectional structural imaging of head, abdomen, or chest to detect deep internal trauma, hemorrhages, or tumors."
  },
  "advanced pcr": {
    name: "Quantitative Real-Time PCR Assay",
    pkrPrice: "6,500 PKR",
    timings: "Report in 12-24 Hours",
    helpline: "042-35905000 (Ext 320)",
    description: "High-sensitivity molecular DNA/RNA replication test to identify viral load (Hepatitis B/C, Dengue, or COVID-19) with extreme precision."
  },
  "cancer screening": {
    name: "Tumor Marker / Cancer Screening Panels",
    pkrPrice: "7,500 PKR",
    timings: "Report in 48 Hours",
    helpline: "042-35905000 (Ext 440)",
    description: "Serum assays for prostate-specific antigen (PSA), CA-125, or CEA to assist in early detection and oncology monitoring."
  },
  "biopsy": {
    name: "Histopathology Biopsy Report",
    pkrPrice: "4,500 - 12,000 PKR",
    timings: "Detailed Report in 5-7 Days",
    helpline: "042-35905000 (Ext 410)",
    description: "Exquisite microscopic analysis of tissues by a board-certified pathologist to diagnose malignancy, staging, or chronic inflammatory changes."
  },
  "hematology": {
    name: "Clinical Hematology Profile",
    pkrPrice: "1,600 PKR",
    timings: "Report in 6 Hours",
    helpline: "042-35905000 (Ext 102)",
    description: "Specialized analysis of bone marrow derivatives, blood clotting profiles, coagulation pathways (PT/APTT) and hemoglobinopathies."
  },
  "radiology": {
    name: "Advanced Radiology (Ultrasound/Color Doppler)",
    pkrPrice: "2,500 PKR",
    timings: "Report in 30 Minutes",
    helpline: "042-35905000 (Ext 205)",
    description: "Non-invasive real-time imaging of abdominal, pelvic, or vascular systems using acoustic reflections."
  },
  "routine lab": {
    name: "Routine Clinical Diagnostics",
    pkrPrice: "650 PKR",
    timings: "Report in 3 Hours",
    helpline: "042-35864115 (Lab Desk)",
    description: "Urinalysis, fasting blood glucose, and basic stool examinations for diagnostic screening."
  },
  "ultrasound": {
    name: "Pelvic / Abdominal Ultrasound",
    pkrPrice: "1,500 PKR",
    timings: "Report in 20 Minutes",
    helpline: "042-35864115 (Diagnostic Desk)",
    description: "Real-time ultrasound scan of liver, kidneys, gallbladder, or gestational checkups."
  },
  "vaccination center": {
    name: "Pediatric & Travel Vaccination Center",
    pkrPrice: "Free (Govt. Vaccines) / Brand cost",
    timings: "9:00 AM - 5:00 PM (Daily)",
    helpline: "042-35864115 (Vaccine Room)",
    description: "Authorized vaccination desk providing routine immunizations (EPI Pakistan) and optional immunizations like Typhoid, Flu, or Hepatitis."
  },
  "trauma unit lab": {
    name: "Trauma Emergency Pathology Lab",
    pkrPrice: "Free (State Funded)",
    timings: "Immediate / Real-time",
    helpline: "021-99201300 (Ext 9)",
    description: "Rapid blood typing, arterial blood gas (ABG) monitoring, and acute chemistry checks for trauma resuscitations."
  },
  "emergency blood": {
    name: "24/7 Emergency Blood Bank",
    pkrPrice: "Free (Replacement basis)",
    timings: "Available 24/7",
    helpline: "021-99201300 (Ext 11)",
    description: "Around-the-clock matching and distribution of blood components for medical emergencies, accidents, and acute surgeries."
  },
  "ecg": {
    name: "12-Lead Electrocardiogram (ECG / EKG)",
    pkrPrice: "500 PKR",
    timings: "Immediate Printout",
    helpline: "021-99201300 (Ext 4)",
    description: "Evaluates cardiac electrical activity to triage myocardial infarction, ischemic heart disease, or severe arrhythmias."
  },
  "highly advanced pathology": {
    name: "Molecular Genetics & Advanced Pathology",
    pkrPrice: "8,500 - 25,000 PKR",
    timings: "Report in 3-5 Days",
    helpline: "021-111-911-911",
    description: "High-tier molecular sequencing, flow cytometry, immunophenotyping, and hormonal panels."
  },
  "mri/ct": {
    name: "High-Resolution MRI / 128-Slice CT Scan",
    pkrPrice: "15,000 - 22,000 PKR",
    timings: "Report and CD in 4 Hours",
    helpline: "021-111-911-911",
    description: "Premium detailed diagnostic imaging for neuro, orthopedic, abdominal, or cardiac assessments."
  },
  "toxicology": {
    name: "Toxicology & Heavy Metals Screen",
    pkrPrice: "5,500 PKR",
    timings: "Report in 24 Hours",
    helpline: "021-111-911-911",
    description: "Screening of blood or urine for drug levels, heavy metals, or toxic chemical elements."
  },
  "pediatric labs": {
    name: "Pediatric Specialized Microsampling Labs",
    pkrPrice: "Standard + 10% micro-fees",
    timings: "Report in 4 Hours",
    helpline: "021-111-911-911",
    description: "Painless specialized capillary drawing and testing specifically calibrated for neonatal and infant patients."
  },
  "free clinical labs": {
    name: "Charity General Diagnostic Lab",
    pkrPrice: "100% Free of Charge (Zakat/Donations)",
    timings: "Report in 6 Hours",
    helpline: "021-35112709 (Lab Desk)",
    description: "Full clinical support, pathology, and chemistry services for patients under the Indus Free Healthcare Network."
  },
  "tuberculosis testing": {
    name: "GeneXpert TB PCR testing",
    pkrPrice: "Free (Indus Hospital TB Initiative)",
    timings: "Report in 4 Hours",
    helpline: "021-35112709 (TB Room)",
    description: "Molecular rapid diagnostic test for Tuberculosis infection and rifampicin drug resistance."
  },
  "blood transfusions": {
    name: "Free Safe Blood Transfusion Services",
    pkrPrice: "100% Free of Charge",
    timings: "Available 24/7",
    helpline: "021-35112709 (Blood Desk)",
    description: "Fully screened, safe blood transfusions for Thalassemia, oncology, and surgical pediatric cases."
  },
  "dengue / pcr testing": {
    name: "Dengue PCR / NS1 Antigen Check",
    pkrPrice: "1,800 PKR",
    timings: "Report in 4 Hours",
    helpline: "021-111-362-273",
    description: "Direct antigen ELISA or molecular PCR test for rapid screening and quantitative tracking of Dengue virus."
  },
  "electrolyte studies": {
    name: "Serum Electrolytes Assay (Na, K, Cl)",
    pkrPrice: "950 PKR",
    timings: "Report in 2 Hours",
    helpline: "021-111-362-273",
    description: "Measures vital mineral ions to prevent dehydration, renal fatigue, or metabolic issues."
  },
  "hormonal assays": {
    name: "Hormonal Assays (Thyroid T3/T4/TSH, FSH, LH)",
    pkrPrice: "3,200 PKR",
    timings: "Report in 8 Hours",
    helpline: "021-111-362-273",
    description: "Assesses thyroid efficiency, pituitary functions, and reproductive health markers."
  },
  "burn center lab": {
    name: "Specialized Burn & Fluid Pathology Lab",
    pkrPrice: "Free (State Funded)",
    timings: "Immediate Triage",
    helpline: "051-9261170 (Burn Desk)",
    description: "Assesses electrolyte configurations, skin flora cultures, and total albumin counts in critical burn injuries."
  },
  "cardiac pathology": {
    name: "Emergency Cardiac Biomarker Lab",
    pkrPrice: "Free / 800 PKR (Urgent)",
    timings: "Report in 30 Minutes",
    helpline: "051-9261170 (Cardiac Ward)",
    description: "Troponin-I, CPK-MB, and LDH assessments to rule out acute myocardial infarction in chest pain patients."
  },
  "surgical emergency labs": {
    name: "Surgical Resuscitation Pathology Desk",
    pkrPrice: "Free / Nominal",
    timings: "Real-time / Immediate",
    helpline: "051-9261170 (ER Lab)",
    description: "Routine bleeding/clotting times, blood gas monitoring, and type and crossmatch assays for surgical theater cases."
  },
  "organ transplant diagnostics": {
    name: "Organ Transplant Histocompatibility / HLA Typing",
    pkrPrice: "18,000 PKR",
    timings: "Report in 3 Days",
    helpline: "051-8463000 (Transplant Desk)",
    description: "Advanced crossmatching, HLA matching, and donor screening assays for liver and kidney transplant surgery."
  },
  "vascular laboratory": {
    name: "Non-Invasive Vascular Lab (Duplex Ultrasound)",
    pkrPrice: "3,500 PKR",
    timings: "Report in 1 Hour",
    helpline: "051-8463000 (Vascular Desk)",
    description: "Color doppler and arterial/venous waveforms to diagnose Deep Vein Thrombosis (DVT) or peripheral arterial disease."
  },
  "advanced chemistry": {
    name: "Comprehensive Biochemical Assay Profile",
    pkrPrice: "2,800 PKR",
    timings: "Report in 6 Hours",
    helpline: "051-8463000 (Chemistry Desk)",
    description: "Profiles glucose, uric acid, liver panels, total bilirubin, and serum albumin."
  }
};

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<PortalTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "closed">("closed");
  
  // Login/Signup Fields
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authAge, setAuthAge] = useState("");
  const [authSex, setAuthSex] = useState("Unspecified");
  const [authConditions, setAuthConditions] = useState("");
  const [authAllergies, setAuthAllergies] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Chat/Consultation State
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<HealthLanguage>("english");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Input fields
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Context Intake Form
  const [patientAge, setPatientAge] = useState("");
  const [patientSex, setPatientSex] = useState("Unspecified");
  const [painLevel, setPainLevel] = useState<number>(0);
  const [symptomDuration, setSymptomDuration] = useState("");
  const [hasFever, setHasFever] = useState<"yes" | "no" | "unspecified">("unspecified");
  const [isPregnant, setIsPregnant] = useState<"yes" | "no" | "not-applicable">("not-applicable");
  const [otherConditions, setOtherConditions] = useState("");
  const [intakeNotification, setIntakeNotification] = useState<string | null>(null);

  // Facility A: Hospital Directory Finder Filter State
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [hospitalCity, setHospitalCity] = useState<string>("all");
  const [hospitalType, setHospitalType] = useState<string>("all");

  // Facility B: Medication Safety Directory State
  const [medSearch, setMedSearch] = useState("");
  const [medSearchFocus, setMedSearchFocus] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<string | null>("med-1");
  const [aiMedLoading, setAiMedLoading] = useState(false);
  const [customMedications, setCustomMedications] = useState<MedicationSafetyInfo[]>(() => {
    try {
      const cached = localStorage.getItem("healtrust_custom_medications");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Modern Toast system
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };

  // Safe non-blocking iframe confirm states
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRemovePrescId, setConfirmRemovePrescId] = useState<string | null>(null);
  const [confirmDeleteLabReportId, setConfirmDeleteLabReportId] = useState<string | null>(null);
  const [confirmDeleteVisitPlanId, setConfirmDeleteVisitPlanId] = useState<string | null>(null);

  // Facility D: Personal Health Diary State
  const [diaryLogs, setDiaryLogs] = useState<SymptomLogEntry[]>([]);
  const [diarySymptom, setDiarySymptom] = useState("");
  const [diaryPain, setDiaryPain] = useState<number>(3);
  const [diaryFever, setDiaryFever] = useState<"No Fever" | "Mild Fever" | "High Fever">("No Fever");
  const [diaryDuration, setDiaryDuration] = useState("");
  const [diaryNotes, setDiaryNotes] = useState("");
  const [diaryFeedback, setDiaryFeedback] = useState<string | null>(null);
  const [diarySearchQuery, setDiarySearchQuery] = useState("");
  const [diaryPainFilter, setDiaryPainFilter] = useState<string>("all");
  const [diaryFeverFilter, setDiaryFeverFilter] = useState<string>("all");

  // Reviews & Testimonials State
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewLocation, setNewReviewLocation] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewTextUr, setNewReviewTextUr] = useState("");
  const [reviewsSearchQuery, setReviewsSearchQuery] = useState("");
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState<string>("all");
  const [reviewsFeedback, setReviewsFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Facility E: Understand Lab Reports State
  const [selectedLabTestId, setSelectedLabTestId] = useState<string>("lab-platelets");
  const [userLabValue, setUserLabValue] = useState<string>("");

  // Facility F: Doctor Visit Planner State
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("General Physician / Family Medicine");
  const [plannerDoctorName, setPlannerDoctorName] = useState<string>("");
  const [plannerAppointmentDate, setPlannerAppointmentDate] = useState<string>("");
  const [plannerSymptoms, setPlannerSymptoms] = useState<string>("");
  const [plannerMeds, setPlannerMeds] = useState<string>("");
  const [plannerCustomQuestions, setPlannerCustomQuestions] = useState<string[]>([]);
  const [newPlannerQuestion, setNewPlannerQuestion] = useState<string>("");

  const handleDownloadChecklistText = () => {
    let content = `==================================================\n`;
    content += `       HEALTRUST PAKISTAN - VISUAL DOCTOR PLANNER   \n`;
    content += `==================================================\n\n`;
    content += `Doctor Name: ${plannerDoctorName || "Unspecified Physician"}\n`;
    content += `Specialty: ${selectedSpecialty}\n`;
    content += `Appointment Date: ${plannerAppointmentDate || "Not Scheduled"}\n`;
    if (currentUser) {
      content += `Patient Name: ${currentUser.name}\n`;
      content += `Age / Sex: ${currentUser.age || "Unspecified"} / ${currentUser.sex || "Unspecified"}\n`;
    }
    content += `\n--------------------------------------------------\n`;
    content += `REPORTED SYMPTOMS & COMPLAINTS:\n`;
    content += `${plannerSymptoms || "None entered"}\n\n`;
    content += `CURRENT MEDICATIONS & FREQUENCIES:\n`;
    content += `${plannerMeds || "None entered"}\n`;
    content += `--------------------------------------------------\n\n`;
    content += `KEY QUESTIONS TO ASK YOUR DOCTOR:\n`;
    
    const specialtyData = DOCTOR_SPECIALTIES_DATABASE.find(s => s.specialty === selectedSpecialty);
    const suggestedQ = specialtyData?.suggestedQuestions || [];
    const suggestedQUrdu = specialtyData?.suggestedQuestionsUrdu || [];
    
    suggestedQ.forEach((q, idx) => {
      content += `[ ] ${q}\n    (${suggestedQUrdu[idx] || ""})\n\n`;
    });
    
    plannerCustomQuestions.forEach((q, idx) => {
      content += `[ ] ${q} (Custom Question)\n\n`;
    });
    
    if (plannerAiSolutions) {
      content += `--------------------------------------------------\n`;
      content += `AI CLINICAL GUIDANCE & COMPREHENSIVE TIPS:\n`;
      content += `${plannerAiSolutions}\n`;
    }
    content += `\n==================================================\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `HealTrust Medical Education & Pre-Visit Support\n`;
    content += `==================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HealTrust_Doctor_Planner_${plannerDoctorName || "Checklist"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLabClick = (labName: string, hospital: any) => {
    setSelectedHospitalService({ hospital, service: labName });
  };

  const handleDirectInterpret = (labName: string) => {
    const lower = labName.toLowerCase();
    if (lower.includes("platelet") || lower.includes("dengue")) {
      setSelectedLabTestId("lab-platelets");
    } else if (lower.includes("hemoglobin") || lower.includes("hb") || lower.includes("blood count") || lower.includes("cbc")) {
      setSelectedLabTestId("lab-hemoglobin");
    } else if (lower.includes("wbc") || lower.includes("white blood")) {
      setSelectedLabTestId("lab-wbc");
    } else if (lower.includes("sugar") || lower.includes("diabetes") || lower.includes("fasting") || lower.includes("glucose")) {
      setSelectedLabTestId("lab-fasting-sugar");
    } else if (lower.includes("creatinine") || lower.includes("kidney") || lower.includes("pathology") || lower.includes("chemistry") || lower.includes("urinalysis")) {
      setSelectedLabTestId("lab-creatinine");
    } else if (lower.includes("cholesterol") || lower.includes("cardiac") || lower.includes("lipid") || lower.includes("heart")) {
      setSelectedLabTestId("lab-cholesterol");
    } else {
      setSelectedLabTestId("lab-platelets");
    }
    setActiveTab("lab-explainer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Supabase Sync & Booking states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Separate states for direct clinical appointment booking to avoid interference with the visit planner
  const [clinicalBookingLoading, setClinicalBookingLoading] = useState(false);
  const [clinicalBookingStatus, setClinicalBookingStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [clinicalBookingSuccessDetails, setClinicalBookingSuccessDetails] = useState<any | null>(null);

  // Dedicated booking form states
  const [bookingDoctorName, setBookingDoctorName] = useState("Tariq Mahmood");
  const [bookingSpecialty, setBookingSpecialty] = useState("General Physician / Family Medicine");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingPatientName, setBookingPatientName] = useState("");
  const [bookingPatientEmail, setBookingPatientEmail] = useState("");
  const [bookingPatientPhone, setBookingPatientPhone] = useState("");
  const [bookingSymptoms, setBookingSymptoms] = useState("");
  const [bookingMeds, setBookingMeds] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccessDetails, setBookingSuccessDetails] = useState<any | null>(null);

  // Auto-populate booking form details from user session
  useEffect(() => {
    if (currentUser) {
      setBookingPatientName(currentUser.name || "");
      setBookingPatientEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Contact Form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess(null);
    setTimeout(() => {
      setContactLoading(false);
      setContactSuccess("Your message has been sent successfully! Our clinical support team will respond to you within 24 hours.");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    }, 1000);
  };

  // Admin Panel states
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem("health_guide_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminExists, setAdminExists] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<"bookings" | "patients" | "reviews">("bookings");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Rescue 1122 Dispatch Simulator State
  const [showRescueSimulator, setShowRescueSimulator] = useState(false);
  const [rescueEmergencyType, setRescueEmergencyType] = useState("Cardiac Arrest / Chest Pain");
  const [rescueCity, setRescueCity] = useState("Lahore");
  const [rescueAddress, setRescueAddress] = useState("");
  const [rescuePhone, setRescuePhone] = useState("");
  const [rescuePatientName, setRescuePatientName] = useState("");
  const [rescueStage, setRescueStage] = useState<"form" | "connecting" | "tracking">("form");
  const [rescueEta, setRescueEta] = useState(600); // 10 minutes (600s)
  const [rescueLog, setRescueLog] = useState<string[]>([]);
  const [rescueAmbulanceNo, setRescueAmbulanceNo] = useState("LHR-491");
  const [rescueError, setRescueError] = useState<string | null>(null);

  const handleTriggerRescue = (emergencyTypeText?: string) => {
    if (emergencyTypeText) {
      setRescueEmergencyType(emergencyTypeText);
    } else {
      setRescueEmergencyType("Cardiac Arrest / Chest Pain");
    }
    if (currentUser) {
      setRescuePatientName(currentUser.name);
      setRescuePhone("0321-" + Math.floor(1000000 + Math.random() * 9000000));
    } else {
      setRescuePatientName("Muhammad Ali");
      setRescuePhone("0321-7890123");
    }
    setRescueAddress("Plot 24, Sector F-8/4, Street 12");
    setRescueCity("Islamabad");
    setRescueStage("form");
    setRescueLog([]);
    setRescueEta(600);
    setRescueError(null);
    setShowRescueSimulator(true);
  };

  const startRescueTracking = () => {
    if (!rescuePatientName.trim() || !rescueAddress.trim() || !rescuePhone.trim()) {
      setRescueError("Please fill in the patient name, phone number, and location address for emergency dispatch.");
      return;
    }
    setRescueError(null);
    setRescueStage("connecting");
    setRescueLog(["📞 Establishing direct uplink to Rescue 1122 Central Command...", "⏳ Locating your cell tower GPS signal coordinates..."]);
    
    setTimeout(() => {
      setRescueLog(prev => [...prev, `🟢 Connected! Dispatch Operator in ${rescueCity} central hub online.`]);
    }, 1500);

    setTimeout(() => {
      const generatedAmbulance = `${rescueCity.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      setRescueAmbulanceNo(generatedAmbulance);
      setRescueLog(prev => [
        ...prev,
        `📍 Coordinates Verified: near landmark [${rescueAddress}]`,
        `🚑 Emergency Unit Assigned: Ambulance ${generatedAmbulance}`,
        `⏱️ Estimated Response Window: 8 - 12 minutes`,
        `🚨 Ambulance departed from nearest sector station! Keep your phone line free.`
      ]);
      setRescueStage("tracking");
    }, 3500);
  };

  useEffect(() => {
    let interval: any = null;
    if (showRescueSimulator && rescueStage === "tracking" && rescueEta > 0) {
      interval = setInterval(() => {
        setRescueEta(prev => {
          if (prev <= 1) {
            setRescueLog(log => [...log, "🏁 Ambulance has arrived at your exact location! 1122 medical staff is entering."]);
            clearInterval(interval);
            return 0;
          }
          if (prev === 550) {
            setRescueLog(log => [...log, "⚡ Transit update: Ambulance is navigating high-density traffic on primary thoroughfare."]);
          }
          if (prev === 400) {
            setRescueLog(log => [...log, "📢 Transit update: Ambulance sirens audible. 2 kilometers away from location."]);
          }
          if (prev === 200) {
            setRescueLog(log => [...log, "📍 Transit update: Ambulance has turned onto your neighborhood approach road."]);
          }
          if (prev === 50) {
            setRescueLog(log => [...log, "🚨 Arrival Alert: Ambulance is pulling up in front of the gate/building."]);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showRescueSimulator, rescueStage, rescueEta]);

  // AI Solutions generator states for Doctor Visit Planner
  const [plannerAiLoading, setPlannerAiLoading] = useState(false);
  const [plannerAiSolutions, setPlannerAiSolutions] = useState<string>("");
  const [plannerAiError, setPlannerAiError] = useState<string | null>(null);

  // Supabase Activity logs states
  const [supabaseAppointments, setSupabaseAppointments] = useState<any[]>([]);
  const [supabasePatients, setSupabasePatients] = useState<any[]>([]);
  const [supabaseAdmins, setSupabaseAdmins] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [supabaseAdminSearchQuery, setSupabaseAdminSearchQuery] = useState("");

  const fetchSupabaseActivity = async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      let appointmentsData = { appointments: [] };
      let patientsData = { patients: [] };
      let adminsData = { admins: [] };

      try {
        const res = await fetch("/api/supabase/appointments");
        if (res.ok) {
          appointmentsData = await res.json();
        } else {
          console.warn("Failed fetching appointments with status:", res.status);
        }
      } catch (e) {
        console.warn("Failed fetching appointments from server:", e);
      }

      try {
        const res = await fetch("/api/supabase/patients");
        if (res.ok) {
          patientsData = await res.json();
        } else {
          console.warn("Failed fetching patients with status:", res.status);
        }
      } catch (e) {
        console.warn("Failed fetching patients from server:", e);
      }

      try {
        const res = await fetch("/api/supabase/admins");
        if (res.ok) {
          adminsData = await res.json();
        } else {
          console.warn("Failed fetching admins with status:", res.status);
        }
      } catch (e) {
        console.warn("Failed fetching admins from server:", e);
      }

      setSupabaseAppointments(appointmentsData.appointments || []);
      setSupabasePatients(patientsData.patients || []);
      setSupabaseAdmins(adminsData.admins || []);
    } catch (err: any) {
      console.error("[Supabase Activity Fetch] Error:", err);
      setActivityError(err.message || "Failed to synchronise data with backend.");
    } finally {
      setActivityLoading(false);
    }
  };

  const fetchDiaryLogsFromServer = async () => {
    try {
      const res = await fetch("/api/supabase/diary");
      if (res.ok) {
        const data = await res.json();
        if (data.diaryLogs && data.diaryLogs.length > 0) {
          const formattedLogs: SymptomLogEntry[] = data.diaryLogs.map((dl: any) => ({
            id: dl.id,
            userId: dl.user_id,
            timestamp: dl.created_at ? new Date(dl.created_at).toLocaleString() : dl.timestamp,
            primarySymptom: dl.primary_symptom,
            painLevel: Number(dl.pain_level),
            fever: dl.fever,
            duration: dl.duration,
            notes: dl.notes,
            assessmentText: dl.assessment_text
          }));
          setDiaryLogs(formattedLogs);
          localStorage.setItem("health_guide_symptom_logs", JSON.stringify(formattedLogs));
        }
      }
    } catch (err) {
      console.warn("[Diary Fetch] Could not sync with server:", err);
    }
  };

  const handleAiMedLookup = async (query: string) => {
    if (!query.trim()) return;
    setAiMedLoading(true);
    try {
      const res = await fetch("/api/med-safety/ai-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.medication) {
          const newMed: MedicationSafetyInfo = data.medication;
          
          // First check if this medication already exists in our master database or previously loaded custom ones
          const localAll = [...MEDICATION_SAFETY_DATABASE, ...customMedications];
          const existingMed = localAll.find(m => 
            m.genericName.toLowerCase() === newMed.genericName.toLowerCase() ||
            m.brandNames.some(b => newMed.brandNames.some(nb => nb.toLowerCase() === b.toLowerCase()))
          );

          if (existingMed) {
            setSelectedMedId(existingMed.id);
            setMedSearch(existingMed.brandNames[0]);
            showToast(`Found existing medical record for ${existingMed.brandNames[0]}!`);
          } else {
            setCustomMedications(prev => {
              const updated = [newMed, ...prev];
              localStorage.setItem("healtrust_custom_medications", JSON.stringify(updated));
              return updated;
            });
            setSelectedMedId(newMed.id);
            setMedSearch(newMed.brandNames[0]);
            showToast(`Successfully analyzed and generated medication safety guide for ${newMed.brandNames[0]}!`);
          }
        } else {
          showToast(data.error || "Failed to analyze medicine safety.", "error");
        }
      } else {
        showToast("Error communicating with Clinical AI engine.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Network error trying to look up medication safety.", "error");
    } finally {
      setAiMedLoading(false);
    }
  };

  const fetchReviewsFromServer = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/supabase/reviews");
      if (res.ok) {
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
          localStorage.setItem("healtrust_patient_reviews", JSON.stringify(data.reviews));
        }
      }
    } catch (err) {
      console.warn("[Reviews Fetch] Failed to fetch reviews from server, loading from local cache:", err);
      try {
        const cached = localStorage.getItem("healtrust_patient_reviews");
        if (cached) setReviews(JSON.parse(cached));
      } catch (cacheErr) {
        console.error(cacheErr);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewsFeedback(null);
    if (!newReviewName.trim() || !newReviewText.trim()) {
      setReviewsFeedback({ success: false, message: "Please fill in your name and review details." });
      return;
    }

    const payload = {
      name: newReviewName,
      location: newReviewLocation || "Pakistan",
      rating: newReviewRating,
      title: newReviewTitle || "Highly Recommended",
      reviewText: newReviewText,
      reviewTextUr: newReviewTextUr
    };

    try {
      const res = await fetch("/api/supabase/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setReviewsFeedback({ success: true, message: "Thank you for your valuable feedback! Your review has been saved successfully." });
        setNewReviewName("");
        setNewReviewLocation("");
        setNewReviewRating(5);
        setNewReviewTitle("");
        setNewReviewText("");
        setNewReviewTextUr("");
        fetchReviewsFromServer(); // reload
      } else {
        const errData = await res.json();
        setReviewsFeedback({ success: false, message: errData.error || "Failed to submit review." });
      }
    } catch (err: any) {
      setReviewsFeedback({ success: false, message: err.message || "Network error. Please try again." });
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch("/api/supabase/reviews/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("Review successfully deleted.");
        fetchReviewsFromServer(); // reload
      } else {
        showToast("Failed to delete review from records.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error trying to delete review.", "error");
    }
  };

  const checkAdminStatus = async () => {
    try {
      const res = await fetch("/api/admin/status");
      if (res.ok) {
        const data = await res.json();
        setAdminExists(data.adminExists);
      }
    } catch (err) {
      console.error("Error checking administrative status:", err);
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    if (!adminName || !adminEmail || !adminPassword) {
      setAdminError("Please fill out all fields.");
      return;
    }

    if (adminPassword !== adminConfirmPassword) {
      setAdminError("Passwords do not match.");
      return;
    }

    setAdminLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          password: adminPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register administrator.");
      }

      setAdminUser(data.admin);
      localStorage.setItem("health_guide_admin_user", JSON.stringify(data.admin));
      setAdminSuccess("Administrator account created successfully!");
      setAdminExists(true);
      
      // Clear fields
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
      setAdminConfirmPassword("");
    } catch (err: any) {
      setAdminError(err.message || "Failed to register administrator.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    if (!adminEmail || !adminPassword) {
      setAdminError("Please enter email and password.");
      return;
    }

    setAdminLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect email or password.");
      }

      setAdminUser(data.admin);
      localStorage.setItem("health_guide_admin_user", JSON.stringify(data.admin));
      setAdminSuccess("Authenticated successfully as administrator!");
      fetchSupabaseActivity();
    } catch (err: any) {
      setAdminError(err.message || "Incorrect email or password.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogOut = () => {
    setAdminUser(null);
    localStorage.removeItem("health_guide_admin_user");
    setAdminSuccess(null);
  };

  const handleGeneratePlannerAiSolutions = async () => {
    if (!plannerSymptoms.trim()) {
      setPlannerAiError("Please enter symptoms first.");
      return;
    }

    setPlannerAiLoading(true);
    setPlannerAiError(null);
    setPlannerAiSolutions("");

    try {
      // Collect current questions
      const specialtyData = DOCTOR_SPECIALTIES_DATABASE.find(s => s.specialty === selectedSpecialty);
      const suggestedQ = specialtyData?.suggestedQuestions || [];
      const allQuestions = [...suggestedQ, ...plannerCustomQuestions];

      const res = await fetch("/api/planner/generate-solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: selectedSpecialty,
          doctorName: plannerDoctorName,
          symptoms: plannerSymptoms,
          medications: plannerMeds,
          questions: allQuestions
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reach AI consultant.");
      }

      setPlannerAiSolutions(data.solutions || "");
    } catch (err: any) {
      console.error("AI Planner Solutions Error:", err);
      setPlannerAiError(err.message || "Failed to generate AI Solutions. Please try again.");
    } finally {
      setPlannerAiLoading(false);
    }
  };

  const chatEndRef = useRef<HTMLDivElement>(null);


  const [emergencyAlert, setEmergencyAlert] = useState<{
    condition: string;
    messageEn: string;
    messageUr: string;
  } | null>(null);

  // Selected hospital/diagnostic service details modal state
  const [selectedHospitalService, setSelectedHospitalService] = useState<{
    hospital: any;
    service: string;
  } | null>(null);

  // Saved Lab Reports state
  const [savedLabReports, setSavedLabReports] = useState<{
    id: string;
    userId: string;
    testName: string;
    testId: string;
    value: string;
    unit: string;
    interpretation: string;
    timestamp: string;
  }[]>([]);

  // Saved Doctor Visit Plans state
  const [savedVisitPlans, setSavedVisitPlans] = useState<{
    id: string;
    userId: string;
    doctorName: string;
    specialty: string;
    appointmentDate: string;
    symptoms: string;
    medications: string;
    questions: string[];
    aiSolutions: string;
    timestamp: string;
  }[]>([]);

  // Load state from localStorage on startup
  useEffect(() => {
    try {
      const storedUsersStr = localStorage.getItem("health_guide_users");
      const storedUserStr = localStorage.getItem("health_guide_current_user");
      const storedLogsStr = localStorage.getItem("health_guide_symptom_logs");

      if (storedUsersStr) {
        const parsedUsers = JSON.parse(storedUsersStr);
        setUsers(parsedUsers);
        // Silent background sync of local patients to Supabase cloud
        if (parsedUsers.length > 0) {
          fetch("/api/supabase/sync-patients-bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patients: parsedUsers })
          }).then(res => {
            if (res.ok) {
              console.log("[Supabase Sync] Successfully bulk-synced local user profiles to cloud backend.");
            }
          }).catch(err => {
            console.warn("[Supabase Sync] Background bulk-sync skipped:", err);
          });
        }
      }
      if (storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        setCurrentUser(parsedUser);
        // Pre-fill profile details to form automatically!
        setPatientAge(parsedUser.age || "");
        setPatientSex(parsedUser.sex || "Unspecified");
        setOtherConditions((parsedUser.otherConditions || "") + (parsedUser.allergies ? ` (Allergies: ${parsedUser.allergies})` : ""));
      }
      if (storedLogsStr) setDiaryLogs(JSON.parse(storedLogsStr));
      
      const storedLabReportsStr = localStorage.getItem("health_guide_saved_lab_reports");
      if (storedLabReportsStr) {
        setSavedLabReports(JSON.parse(storedLabReportsStr));
      }

      const storedPlansStr = localStorage.getItem("health_guide_saved_visit_planners");
      if (storedPlansStr) {
        setSavedVisitPlans(JSON.parse(storedPlansStr));
      }

      fetchDiaryLogsFromServer();
      fetchReviewsFromServer();
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }, []);

  // Check admin exists on startup
  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Sync / Load user-specific chat messages
  useEffect(() => {
    const key = currentUser ? `health_guide_messages_${currentUser.id}` : "health_guide_messages_guest";
    const storedMessagesStr = localStorage.getItem(key);
    if (storedMessagesStr) {
      try {
        const parsedMsgs = JSON.parse(storedMessagesStr);
        const formattedMsgs = parsedMsgs.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(formattedMsgs);
      } catch (e) {
        console.error("Failed to parse user messages:", e);
        setMessages([]);
      }
    } else {
      // If nothing is stored, fallback to check the legacy key once
      const legacyStr = localStorage.getItem("health_guide_messages");
      if (legacyStr && !currentUser) {
        try {
          const parsedMsgs = JSON.parse(legacyStr);
          const formattedMsgs = parsedMsgs.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(formattedMsgs);
        } catch (_) {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  }, [currentUser]);

  // Save changes to localStorage
  const saveUsersToStorage = (updatedUsers: AppUser[]) => {
    localStorage.setItem("health_guide_users", JSON.stringify(updatedUsers));
  };

  const saveCurrentUserToStorage = (user: AppUser | null) => {
    if (user) {
      localStorage.setItem("health_guide_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("health_guide_current_user");
    }
  };

  const saveLogsToStorage = (logs: SymptomLogEntry[]) => {
    localStorage.setItem("health_guide_symptom_logs", JSON.stringify(logs));
  };

  const saveMessagesToStorage = (msgs: Message[]) => {
    const key = currentUser ? `health_guide_messages_${currentUser.id}` : "health_guide_messages_guest";
    localStorage.setItem(key, JSON.stringify(msgs));
  };

  useEffect(() => {
    if (activeTab === "supabase-activity") {
      fetchSupabaseActivity();
    }
  }, [activeTab]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle Authentication: Registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!authName || !authEmail || !authPassword) {
      setAuthError("Please fill in Name, Email, and Password.");
      return;
    }

    const newUser: AppUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: authName,
      email: authEmail,
      password: authPassword,
      age: authAge,
      sex: authSex,
      otherConditions: authConditions,
      allergies: authAllergies
    };

    try {
      const response = await fetch("/api/supabase/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      const dbUser = data.user ? {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        password: data.user.password,
        age: data.user.age,
        sex: data.user.sex,
        otherConditions: data.user.other_conditions,
        allergies: data.user.allergies
      } : newUser;

      // Update local storage too
      const updatedUsers = [...users.filter(u => u.email.toLowerCase() !== authEmail.toLowerCase()), dbUser];
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);

      setCurrentUser(dbUser);
      saveCurrentUserToStorage(dbUser);
      migrateGuestLogs(dbUser.id);

      // Apply auto-fill to form
      setPatientAge(dbUser.age || "");
      setPatientSex(dbUser.sex || "Unspecified");
      setOtherConditions((dbUser.otherConditions || "") + (dbUser.allergies ? ` (Allergies: ${dbUser.allergies})` : ""));

      setAuthSuccess("Account created and synced with Supabase successfully!");
    } catch (err: any) {
      console.warn("Supabase signup failed/skipped. Falling back to local account:", err);
      // Fallback to local sign-up
      if (users.some(u => u.email.toLowerCase() === authEmail.toLowerCase())) {
        setAuthError("An account with this email already exists locally.");
        return;
      }

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);

      setCurrentUser(newUser);
      saveCurrentUserToStorage(newUser);
      migrateGuestLogs(newUser.id);

      // Apply auto-fill to form
      setPatientAge(authAge);
      setPatientSex(authSex);
      setOtherConditions(authConditions + (authAllergies ? ` (Allergies: ${authAllergies})` : ""));

      setAuthSuccess("Account created locally (Cloud database sync pending).");
    }

    setTimeout(() => {
      setAuthMode("closed");
      // Reset inputs
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
      setAuthAge("");
      setAuthSex("Unspecified");
      setAuthConditions("");
      setAuthAllergies("");
      setAuthSuccess(null);
    }, 1500);
  };

  // Handle Authentication: Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!authEmail || !authPassword) {
      setAuthError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("/api/supabase/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      const dbUser = data.user;

      if (dbUser) {
        const updatedUsers = [...users.filter(u => u.email.toLowerCase() !== dbUser.email.toLowerCase()), dbUser];
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);

        setCurrentUser(dbUser);
        saveCurrentUserToStorage(dbUser);
        migrateGuestLogs(dbUser.id);

        setPatientAge(dbUser.age || "");
        setPatientSex(dbUser.sex || "Unspecified");
        setOtherConditions((dbUser.otherConditions || "") + (dbUser.allergies ? ` (Allergies: ${dbUser.allergies})` : ""));

        setAuthSuccess(`Welcome back, ${dbUser.name}! (Authenticated via Supabase)`);
      } else {
        throw new Error("Invalid response from cloud auth.");
      }
    } catch (err: any) {
      console.warn("Supabase signin failed/skipped. Checking local cache:", err);
      // Fallback to local storage
      const matchedUser = users.find(
        u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword
      );

      if (!matchedUser) {
        setAuthError("Incorrect email or password. Please verify your credentials.");
        return;
      }

      setCurrentUser(matchedUser);
      saveCurrentUserToStorage(matchedUser);
      migrateGuestLogs(matchedUser.id);

      setPatientAge(matchedUser.age || "");
      setPatientSex(matchedUser.sex || "Unspecified");
      setOtherConditions((matchedUser.otherConditions || "") + (matchedUser.allergies ? ` (Allergies: ${matchedUser.allergies})` : ""));

      setAuthSuccess(`Welcome back, ${matchedUser.name}! (Local cache session)`);
    }

    setTimeout(() => {
      setAuthMode("closed");
      setAuthEmail("");
      setAuthPassword("");
      setAuthSuccess(null);
    }, 1200);
  };

  // Handle Authentication: Log Out
  const handleLogOut = () => {
    setCurrentUser(null);
    saveCurrentUserToStorage(null);
    // Clear log values
    setPatientAge("");
    setPatientSex("Unspecified");
    setOtherConditions("");
  };

  // Translate basic UI labels based on language
  const t = {
    english: {
      tagline: "Medical Information System",
      emergencyCall: "Emergency: Call 1122",
      recentInquiry: "Structured Intake Context",
      whatThisMayBe: "What this may be",
      whatYouCanDoNow: "What you can do now",
      getUrgentHelpIf: "Get urgent help now if",
      whenToSeeDoctor: "When to see a doctor",
      toHelpNarrowThis: "To help narrow this down",
      disclaimer: "Online guidance cannot confirm a diagnosis. If symptoms are severe, sudden, worsening, or you are worried, please seek care from a qualified doctor or emergency service.",
      placeholder: "Describe symptoms in detail (e.g., 'Mild fever and dry cough for 2 days')...",
      presetsHeader: "Common Pakistan Health Concerns",
      all: "All",
      urgent: "Urgent/Fever",
      general: "General Pain",
      pediatric: "Child Health",
      environmental: "Heat/Water",
      privacyNotice: "Privacy Shield: Do not share CNICs, full addresses, passwords, or photos of private parts.",
      ageSex: "Age / Sex",
      painSeverity: "Pain Severity",
      duration: "Duration",
      fever: "Fever?",
      pregnant: "Pregnant?",
      otherNotes: "Allergies / Meds",
      noAssessmentYet: "Describe your symptoms below or select a preset to generate a structured clinical assessment.",
      sendBtn: "Send Consultation Request",
      loading: "Generating clinical response...",
      assessmentReport: "Live Assessment Report",
      howToUseIntake: "Fill intake context to automatically strengthen your message.",
      insertIntakeText: "Insert Intake Context into Message Box",
      mentalHealthSupport: "Mental Health Support",
      crisisText: "If you are feeling extremely low, thinking of self-harm, or are in danger, please contact Rescue 1122 immediately or reach out to a trusted family member. You are not alone.",
    },
    urdu: {
      tagline: "طبی رہنمائی کا نظام",
      emergencyCall: "ایمرجنسی: 1122 پر کال کریں",
      recentInquiry: "طبی معلومات کا اندراج",
      whatThisMayBe: "ممکنہ وجوہات",
      whatYouCanDoNow: "فوری طور پر آپ کیا کر سکتے ہیں",
      getUrgentHelpIf: "فوری ہنگامی مدد حاصل کریں اگر",
      whenToSeeDoctor: "ڈاکٹر کو کب دکھانا ہے",
      toHelpNarrowThis: "معلومات کو واضح کرنے کے لیے سوالات",
      disclaimer: "آن لائن رہنمائی تشخیص کی تصدیق نہیں کر سکتی۔ اگر علامات شدید، اچانک، یا بگڑ رہی ہیں، تو براہ کرم کسی مستند ڈاکٹر یا ایمرجنسی سروس سے رجوع کریں۔",
      placeholder: "اپنی علامات کی تفصیل لکھیں (مثال کے طور پر: 'مجھے ۲ دن سے ہلکا بخار اور خشک کھانسی ہے')...",
      presetsHeader: "پاکستان کے عام طبی مسائل",
      all: "سب",
      urgent: "شدید / بخار",
      general: "عام درد",
      pediatric: "بچوں کی صحت",
      environmental: "گرمی / پانی",
      privacyNotice: "پرائیویسی نوٹ: شناختی کارڈ نمبر، مکمل پتہ، یا ذاتی تصاویر ہرگز شیئر نہ کریں۔",
      ageSex: "عمر / جنس",
      painSeverity: "درد کی شدت",
      duration: "دورانیہ",
      fever: "بخار ہے؟",
      pregnant: "حاملہ؟",
      otherNotes: "الرجی / ادویات",
      noAssessmentYet: "اپنی علامات لکھیں یا نظام کا جائزہ لینے کے لیے نیچے دیے گئے کسی ایک عنوان پر کلک کریں۔",
      sendBtn: "طبی مشورہ حاصل کریں",
      loading: "معلومات تیار کی جا رہی ہیں...",
      assessmentReport: "طبی تجزیہ رپورٹ",
      howToUseIntake: "بہتر مشورے کے لیے مریض کے کوائف درج کریں۔",
      insertIntakeText: "معلومات کو پیغام خانے میں شامل کریں",
      mentalHealthSupport: "ذہنی صحت کی مدد",
      crisisText: "اگر آپ شدید مایوسی کا شکار ہیں یا خود کو نقصان پہنچانے کا سوچ رہے ہیں، تو براہِ مہربانی فوری طور پر 1122 پر رابطہ کریں یا کسی قریبی عزیز کو بتائیں۔ آپ تنہا نہیں ہیں۔",
    },
    romanUrdu: {
      tagline: "Medical Information System",
      emergencyCall: "Emergency: Call 1122",
      recentInquiry: "Intake Context Detail",
      whatThisMayBe: "Yeh kya ho sakta hai (Causes)",
      whatYouCanDoNow: "Aap abhi kya kar sakte hain",
      getUrgentHelpIf: "Fori emergency help lein agar",
      whenToSeeDoctor: "Doctor ke paas kab jana hai",
      toHelpNarrowThis: "Mazeed sawalat jo madad karenge",
      disclaimer: "Online rehnumai mareez ki tashkhees (diagnosis) ki tasdeeq nahi kar sakti. Agar alamat shadeed hain, to fori doctor ya emergency se ruju karein.",
      placeholder: "Apni alamat tafseel se likhein (jaise: 'Mujhe do din se halka bukhar aur khansi hai')...",
      presetsHeader: "Aam Pakistani Sehat ke Masail",
      all: "Sab",
      urgent: "Shadeed / Bukhar",
      general: "Aam Dard",
      pediatric: "Bachon ki Sehat",
      environmental: "Garmi / Paani",
      privacyNotice: "Privacy Notice: CNIC number, mukammal pata, ya kisi kism ki private tasaveer share mat karein.",
      ageSex: "Umar / Jins",
      painSeverity: "Dard ki shiddat",
      duration: "Waqt / Duration",
      fever: "Bukhar?",
      pregnant: "Pregnant?",
      otherNotes: "Allergies / Dawai",
      noAssessmentYet: "Apni alamat niche likhein ya kisi preset par click karke fori tajziya (assessment) dekhein.",
      sendBtn: "Mashwara Hasil Karein",
      loading: "Report tayyar ho rahi hai...",
      assessmentReport: "Sehat Guide Tajziya",
      howToUseIntake: "Bhtar maloomat ke liye mareez ke barey mein likhein.",
      insertIntakeText: "Intake detail ko message box mein dalein",
      mentalHealthSupport: "Ze hni Sehat (Mental Health)",
      crisisText: "Agar aap boht mayus hain ya khud ko nuqsaan pohanchane ka soch rahe hain, to fori Rescue 1122 par rabta karein ya kisi pyaare se baat karein. Aap akele nahi hain.",
    }
  };

  const currentT = t[selectedLanguage];

  // Compose structured intake text to insert into text box
  const buildIntakeString = () => {
    let parts = [];
    if (patientAge) parts.push(`Age: ${patientAge}`);
    if (patientSex !== "Unspecified") parts.push(`Sex: ${patientSex}`);
    if (painLevel > 0) parts.push(`Pain Severity: ${painLevel}/10`);
    if (symptomDuration) parts.push(`Duration: ${symptomDuration}`);
    if (hasFever !== "unspecified") parts.push(`Fever: ${hasFever.toUpperCase()}`);
    if (isPregnant !== "not-applicable" && patientSex === "Female") parts.push(`Pregnancy: ${isPregnant.toUpperCase()}`);
    if (otherConditions) parts.push(`ProfileNotes: ${otherConditions}`);
    
    if (parts.length === 0) return "";
    return `[Intake Context: ${parts.join(", ")}] `;
  };

  const handleInsertIntake = () => {
    let intakeText = buildIntakeString();
    let wasSample = false;
    if (!intakeText) {
      wasSample = true;
      // Auto populate with healthy sample patient context if form is empty
      setPatientAge("30");
      setPatientSex("Male");
      setPainLevel(4);
      setSymptomDuration("2 days");
      setHasFever("yes");
      intakeText = "[Intake Context: Age: 30, Sex: Male, Pain Severity: 4/10, Duration: 2 days, Fever: YES] ";
    }

    setInputValue(prev => {
      if (prev.includes("[Intake Context:")) {
        // Replace previous intake context
        return prev.replace(/\[Intake Context:.*?\]\s*/, intakeText);
      }
      return intakeText + prev;
    });

    const msg = wasSample 
      ? (selectedLanguage === "english" ? "Filled sample info & inserted into message box!" : "سیمپل معلومات پیغام خانے میں شامل کر دی گئی ہیں")
      : (selectedLanguage === "english" ? "Intake info inserted into message box successfully!" : "مریض کی معلومات پیغام خانے میں شامل کر دی گئی ہیں");

    setIntakeNotification(msg);
    setTimeout(() => {
      setIntakeNotification(null);
    }, 4000);

    // Smooth scroll and focus the symptom textarea
    setTimeout(() => {
      const inputEl = document.getElementById("symptom-input");
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleDirectAssess = () => {
    let intakeText = buildIntakeString();
    let wasSample = false;
    if (!intakeText) {
      wasSample = true;
      // Auto populate with healthy sample patient context if form is empty
      setPatientAge("30");
      setPatientSex("Male");
      setPainLevel(4);
      setSymptomDuration("2 days");
      setHasFever("yes");
      intakeText = "[Intake Context: Age: 30, Sex: Male, Pain Severity: 4/10, Duration: 2 days, Fever: YES] ";
    }

    // Set input value
    setInputValue(intakeText);

    // Send it immediately
    handleSendMessage(intakeText);

    const msg = wasSample
      ? (selectedLanguage === "english" ? "Generated report for Sample Intake!" : "نمونہ معلومات کا طبی تجزیہ شروع کر دیا گیا ہے")
      : (selectedLanguage === "english" ? "Analyzing your Intake Context now..." : "آپ کی معلومات کا طبی تجزیہ شروع کر دیا گیا ہے");

    setIntakeNotification(msg);
    setTimeout(() => {
      setIntakeNotification(null);
    }, 4000);

    // Scroll to input / chat area
    setTimeout(() => {
      const chatEl = document.getElementById("symptom-input");
      if (chatEl) {
        chatEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleBookSupabaseAppointment = async () => {
    setBookingLoading(true);
    setBookingStatus(null);
    try {
      // Find custom questions
      const specialtyData = DOCTOR_SPECIALTIES_DATABASE.find(s => s.specialty === selectedSpecialty);
      const suggestedQ = specialtyData?.suggestedQuestions || [];
      const allQuestions = [...suggestedQ, ...plannerCustomQuestions];

      const response = await fetch("/api/supabase/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: plannerDoctorName || "Unspecified Physician",
          specialty: selectedSpecialty,
          appointmentDate: plannerAppointmentDate || "Not Scheduled",
          symptoms: plannerSymptoms || "None entered",
          medications: plannerMeds || "None entered",
          customQuestions: allQuestions,
          aiSolutions: plannerAiSolutions,
          userId: currentUser ? currentUser.id : "guest",
          userName: currentUser ? currentUser.name : "Guest Session",
          userEmail: currentUser ? currentUser.email : "guest@healtrust.pk"
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const resJson = await response.json().catch(() => ({}));
      if (resJson.supabaseError) {
        throw new Error(`Supabase Error: ${resJson.supabaseError}`);
      }

      setBookingStatus({
        success: true,
        message: "Successfully synchronized and saved your appointment planning to your Supabase backend!"
      });
    } catch (err: any) {
      console.error("Supabase booking error:", err);
      setBookingStatus({
        success: false,
        message: `Unable to save to Supabase database. Reason: ${err.message || "Please make sure your 'appointments' table is created."}`
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCreateRealAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setClinicalBookingLoading(true);
    setClinicalBookingStatus(null);
    setClinicalBookingSuccessDetails(null);

    if (!bookingDate) {
      setClinicalBookingStatus({
        success: false,
        message: "Please select an appointment date."
      });
      setClinicalBookingLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/supabase/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: bookingDoctorName || "Tariq Mahmood",
          specialty: bookingSpecialty || "General Physician / Family Medicine",
          appointmentDate: `${bookingDate} ${bookingTime || "09:00 AM"}`.trim(),
          symptoms: bookingSymptoms || "General clinical consultation",
          medications: bookingMeds || "None entered",
          customQuestions: [bookingNotes].filter(Boolean),
          aiSolutions: `Phone: ${bookingPatientPhone || "Unspecified"}`,
          userId: currentUser ? currentUser.id : "guest",
          userName: bookingPatientName || (currentUser ? currentUser.name : "Guest Patient"),
          userEmail: bookingPatientEmail || (currentUser ? currentUser.email : "guest@healtrust.pk")
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const resJson = await response.json();
      setClinicalBookingSuccessDetails(resJson.appointment || resJson);
      setClinicalBookingStatus({
        success: true,
        message: "Your clinical consultation has been successfully scheduled and synced with Supabase!"
      });

      // Synchronize activity log view
      fetchSupabaseActivity();

      // Clear form inputs
      setBookingDate("");
      setBookingTime("");
      setBookingSymptoms("");
      setBookingMeds("");
      setBookingNotes("");
    } catch (err: any) {
      console.error("Clinical booking error:", err);
      setClinicalBookingStatus({
        success: false,
        message: `Saved locally! (Supabase sync failure: ${err.message || "Table not found."})`
      });
      fetchSupabaseActivity();
    } finally {
      setClinicalBookingLoading(false);
    }
  };


  // Preset Symptoms filtering
  const filteredPresets = PRESET_SYMPTOMS.filter(preset => {
    const langMatch = preset.language === selectedLanguage;
    const categoryMatch = categoryFilter === "all" || preset.category === categoryFilter;
    const searchMatch = searchQuery === "" || 
      preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return langMatch && categoryMatch && searchMatch;
  });

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    setErrorMsg(null);
    setIsLoading(true);

    // If there is an active emergency in this query, trigger the modal immediately
    const emergency = detectEmergency(query);
    if (emergency) {
      setEmergencyAlert(emergency);
    }

    // If sending from input box and there is intake form context not yet injected, prepend it
    let fullMessage = query;
    if (!textToSend && buildIntakeString() && !query.includes("[Intake Context:")) {
      fullMessage = buildIntakeString() + query;
    }

    // Add user message to state
    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      text: fullMessage,
      timestamp: new Date()
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    saveMessagesToStorage(updatedHistory);
    setInputValue("");

    try {
      // Map history to simple format
      const historyPayload = updatedHistory.slice(0, -1).map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: fullMessage,
          history: historyPayload
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let errMsg = errData.error || `Server error status ${response.status}`;
        if (response.status === 429) {
          errMsg = "Rate Limit Exceeded: Too many clinical queries submitted recently. Please wait a moment before trying again.";
        } else if (response.status === 500) {
          errMsg = "Internal Engine Error: The backend AI service failed to reply. Please check your configurations.";
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date()
      };

      const finalMessages = [...updatedHistory, assistantMsg];
      setMessages(finalMessages);
      saveMessagesToStorage(finalMessages);
    } catch (err: any) {
      console.error(err);
      let clientErrMsg = "Something went wrong while reaching the Health Guide assistant.";
      if (err instanceof TypeError || (err.message && err.message.toLowerCase().includes("failed to fetch"))) {
        clientErrMsg = "Network failure: Unable to establish a connection with the backend server. Please verify you are connected to the internet and that the application is running on port 3000.";
      } else if (err.message) {
        clientErrMsg = err.message;
      }
      setErrorMsg(clientErrMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat logs
  const handleResetChat = () => {
    setMessages([]);
    saveMessagesToStorage([]);
  };

  // Choose preset
  const handleSelectPreset = (preset: PresetSymptom) => {
    // Auto populate some fields if relevant
    if (preset.category === "pediatric") {
      setPatientAge("Child");
    } else if (preset.prompt.includes("baby") || preset.prompt.includes("bache")) {
      setPatientAge("Infant");
    }
    setInputValue(preset.prompt);
    handleSendMessage(preset.prompt);
  };

  // Get last model message for parsed layout display
  const lastModelMessage = [...messages].reverse().find(m => m.role === "assistant");
  const parsedAssessment = lastModelMessage ? parseAssessment(lastModelMessage.text) : null;

  // Track self-care checklist
  const [completedSelfCare, setCompletedSelfCare] = useState<{ [key: string]: boolean }>({});

  const toggleSelfCare = (item: string) => {
    setCompletedSelfCare(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // Facility A: Filtered Hospital List
  const filteredHospitals = HOSPITAL_DIRECTORY.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || 
                        h.address.toLowerCase().includes(hospitalSearch.toLowerCase());
    const matchCity = hospitalCity === "all" || h.city.toLowerCase() === hospitalCity.toLowerCase();
    const matchType = hospitalType === "all" || h.type.toLowerCase() === hospitalType.toLowerCase();
    return matchSearch && matchCity && matchType;
  });

  // Facility B: Filtered Medications
  const allMedications = [...MEDICATION_SAFETY_DATABASE, ...customMedications];
  const filteredMedications = allMedications.filter(m => {
    const query = medSearch.toLowerCase().trim();
    if (!query) return true;
    
    // Check brand names
    const matchBrand = m.brandNames.some(brand => brand.toLowerCase().includes(query));
    // Check generic name
    const matchGeneric = m.genericName.toLowerCase().includes(query);
    // Check category / use-case description
    const matchCategory = m.usageCategory.toLowerCase().includes(query);
    // Check Urdu description
    const matchUrdu = m.urduUsage.toLowerCase().includes(query);
    // Check warnings / critical warnings
    const matchAlerts = m.criticalAlerts.toLowerCase().includes(query);
    
    // Check common synonyms or symptoms associated with each medication
    let matchSynonyms = false;
    const synonyms: Record<string, string[]> = {
      "med-1": ["fever", "pain", "headache", "bodyache", "bukhar", "dard", "panadol", "paracetamol"],
      "med-2": ["pain", "swelling", "inflammation", "joint", "teeth", "dand", "dard", "soojan", "brufen"],
      "med-3": ["diarrhea", "vomiting", "stomach", "loose motions", "infection", "pechish", "mror", "flagyl"],
      "med-4": ["infection", "antibiotic", "bacteria", "throat", "gala", "kan", "garm", "augmentin"],
      "med-5": ["dental", "period", "menstrual", "pain", "dand", "dard", "khawateen", "ponstan"],
      "med-6": ["dysentery", "stomach", "bowel", "infection", "pechish", "entamizole"],
      "med-7": ["flu", "cold", "nose", "sinus", "congestion", "cough", "nak", "arinac"],
      "med-8": ["diabetes", "sugar", "insulin", "blood sugar", "glucophage", "metformin"],
      "med-9": ["acid", "acidity", "gastric", "ulcer", "heartburn", "stomach", "tezaab", "jalan", "risek", "omeprazole"],
      "med-10": ["blood", "thinner", "heart", "aspirin", "attack", "dil", "loprin"],
      "med-11": ["asthma", "breath", "lungs", "cough", "wheezing", "inhaler", "sans", "ventolin"],
      "med-12": ["vomit", "nausea", "motion sickness", "travel", "chakkar", "ulti", "gravinate"],
      "med-13": ["allergy", "sneeze", "cold", "nose", "itching", "khارش", "fexet", "telfast"],
      "med-14": ["weakness", "vitamin", "zinc", "strength", "immunity", "kamzori", "surbex"],
      "med-15": ["allergy", "skin", "rash", "hives", "itching", "khارش", "softin"],
      "med-16": ["uric acid", "gout", "joint", "kidney", "haddi", "yurik", "zyloric"],
      "med-17": ["typhoid", "infection", "urine", "antibiotic", "novidat", "ciprofloxacin"]
    };
    
    if (synonyms[m.id]) {
      matchSynonyms = synonyms[m.id].some(syn => syn.includes(query) || query.includes(syn));
    }
    
    return matchBrand || matchGeneric || matchCategory || matchUrdu || matchAlerts || matchSynonyms;
  });

  const enrichMedication = (m: MedicationSafetyInfo) => {
    if (!m) return m;
    const enriched = { ...m };
    if (!enriched.description) {
      enriched.description = `${m.brandNames.join(", ")} contains the active chemical compound ${m.genericName}. It is clinically formulated and prescribed to address ${m.usageCategory.toLowerCase()}. It works at the molecular and cellular levels to regulate physiological pathways, restore chemical balance, and provide fast, targeted relief.`;
    }
    if (!enriched.usesAndBenefits || enriched.usesAndBenefits.length === 0) {
      enriched.usesAndBenefits = [
        `Provides clinical treatment and relief for symptoms associated with ${m.usageCategory.toLowerCase()}`,
        `Utilizes the pharmacological action of ${m.genericName} for safe, target-specific intervention`,
        `Helps prevent secondary complications or symptom recurrence under certified dosage`,
        `Highly trusted and widely available across Pakistan under local pharmaceutical brands like ${m.brandNames.join(" or ")}`
      ];
    }
    if (!enriched.sideEffects || enriched.sideEffects.length === 0) {
      const customSideEffects = [
        "Mild gastrointestinal sensitivity, nausea, or transient stomach discomfort if taken without food",
        "Occasional dry mouth, light drowsiness, or mild fatigue depending on individual tolerance",
        "Slight headache or transient dizziness which usually resolves within a few hours"
      ];
      if (m.criticalAlerts && (m.criticalAlerts.toLowerCase().includes("drowsy") || m.criticalAlerts.toLowerCase().includes("sleep"))) {
        customSideEffects.unshift("Significant drowsiness and reduced reaction times");
      }
      enriched.sideEffects = customSideEffects;
    }
    if (!enriched.clinicalPrecautions || enriched.clinicalPrecautions.length === 0) {
      const customPrecautions = [
        "Strictly adhere to the recommended daily limits and avoid doubling doses if a scheduled intake is missed.",
        "Always inform your medical practitioner about other concurrent active medications to prevent potential drug interactions.",
        "Monitor liver and kidney function tests during prolonged therapeutic administration."
      ];
      if (m.criticalAlerts) {
        customPrecautions.unshift(m.criticalAlerts);
      }
      enriched.clinicalPrecautions = customPrecautions;
    }
    if (!enriched.urduBenefits) {
      enriched.urduBenefits = `یہ دوا (${m.brandNames.join(" / ")}) جس میں ${m.genericName} شامل ہے، خاص طور پر ${m.urduUsage} کے لیے استعمال ہوتی ہے۔ یہ علامات کو تیزی سے کم کرنے، درد و سوزش سے نجات دلانے، اور مریض کی عمومی تندرستی بحال کرنے کے لیے انتہائی مفید دوا ہے۔`;
    }
    if (!enriched.advantages || enriched.advantages.length === 0) {
      enriched.advantages = [
        `High clinical efficacy specifically designed to address ${m.usageCategory.toLowerCase()}`,
        `Contains clinically proven therapeutic compound: ${m.genericName}`,
        "Rapid onset of systemic action to target root symptoms",
        `Extensively researched and standardly safe under guided professional medical care`
      ];
    }
    if (!enriched.disadvantages || enriched.disadvantages.length === 0) {
      enriched.disadvantages = [
        "May cause mild stomach sensitivity or irritation if taken on a completely empty stomach",
        "Requires active liver and kidney monitoring during prolonged daily clinical usage",
        "Subject to drug-drug interactions when taken alongside conflicting chemical formulas"
      ];
    }
    return enriched;
  };

  const rawSelectedMed = allMedications.find(m => m.id === selectedMedId) || allMedications[0] || MEDICATION_SAFETY_DATABASE[0];
  const selectedMed = enrichMedication(rawSelectedMed);

  // Facility D: Handle Logging Symptom in Diary
  const saveDiaryLogToServer = async (log: SymptomLogEntry) => {
    try {
      await fetch("/api/supabase/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: log.userId,
          primarySymptom: log.primarySymptom,
          painLevel: log.painLevel,
          fever: log.fever,
          duration: log.duration,
          notes: log.notes,
          assessmentText: log.assessmentText
        })
      });
    } catch (err) {
      console.warn("[Diary Sync] Failed to post to server:", err);
    }
  };

  const deleteDiaryLogFromServer = async (logId: string) => {
    try {
      await fetch("/api/supabase/diary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: logId })
      });
    } catch (err) {
      console.warn("[Diary Sync] Failed to delete from server:", err);
    }
  };

  const deleteAppointmentFromServer = async (apptId: string) => {
    try {
      const res = await fetch("/api/supabase/appointments/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: apptId })
      });
      if (res.ok) {
        showToast("Appointment successfully canceled and deleted.");
        await fetchSupabaseActivity();
      } else {
        showToast("Failed to delete appointment from backend.", "error");
      }
    } catch (err) {
      console.warn("[Appointment Delete] Failed to delete from server:", err);
      showToast("Network error trying to delete appointment.", "error");
    }
  };

  const removePrescriptionFromServer = async (apptId: string) => {
    try {
      const res = await fetch("/api/supabase/appointments/remove-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: apptId })
      });
      if (res.ok) {
        showToast("Clinical prescription cleared from appointment.");
        await fetchSupabaseActivity();
      } else {
        showToast("Failed to remove prescription from backend.", "error");
      }
    } catch (err) {
      console.warn("[Prescription Clear] Failed to clear prescription from server:", err);
      showToast("Network error trying to clear prescription.", "error");
    }
  };

  const migrateGuestLogs = async (newUserId: string) => {
    const updated = diaryLogs.map(log => {
      if (log.userId === "guest") {
        const updatedLog = { ...log, userId: newUserId };
        saveDiaryLogToServer(updatedLog);
        return updatedLog;
      }
      return log;
    });
    setDiaryLogs(updated);
    saveLogsToStorage(updated);
  };

  const handleAddDiaryLog = (e: React.FormEvent) => {
    e.preventDefault();
    setDiaryFeedback(null);

    if (!diarySymptom) {
      setDiaryFeedback("Please specify the main symptom or concern.");
      return;
    }

    const newLog: SymptomLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser ? currentUser.id : "guest",
      timestamp: new Date().toLocaleString(),
      primarySymptom: diarySymptom,
      painLevel: diaryPain,
      fever: diaryFever,
      duration: diaryDuration || "Unspecified",
      notes: diaryNotes,
      assessmentText: parsedAssessment ? parsedAssessment.intro + " / " + parsedAssessment.possibleCauses : "No AI report attached."
    };

    const updatedLogs = [newLog, ...diaryLogs];
    setDiaryLogs(updatedLogs);
    saveLogsToStorage(updatedLogs);
    saveDiaryLogToServer(newLog);

    // Reset fields
    setDiarySymptom("");
    setDiaryPain(3);
    setDiaryFever("No Fever");
    setDiaryDuration("");
    setDiaryNotes("");
    setDiaryFeedback("Symptom log entry successfully added to your health records!");
    
    setTimeout(() => {
      setDiaryFeedback(null);
    }, 4000);
  };

  // Fast import assessment summary directly to diary
  const handleQuickSaveAssessment = () => {
    if (!parsedAssessment) return;
    
    const newLog: SymptomLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser ? currentUser.id : "guest",
      timestamp: new Date().toLocaleString(),
      primarySymptom: "AI Diagnosis Inquiry: " + (parsedAssessment.intro.substring(0, 60) || "Symptom check"),
      painLevel: painLevel || 0,
      fever: hasFever === "yes" ? "Mild/High Fever" : "No Fever",
      duration: symptomDuration || "Unspecified",
      notes: "AI Possible Causes: " + parsedAssessment.possibleCauses.substring(0, 180) + "...",
      assessmentText: parsedAssessment.actionsNow ? `Self care: ${parsedAssessment.actionsNow.substring(0, 200)}` : "Attached clinical guide"
    };

    const updatedLogs = [newLog, ...diaryLogs];
    setDiaryLogs(updatedLogs);
    saveLogsToStorage(updatedLogs);
    saveDiaryLogToServer(newLog);
    alert("This assessment has been successfully logged to your local Health Diary!");
  };

  // Lab Report save and delete handlers
  const handleSaveLabReport = (test: any, value: string, interpretation: string) => {
    const newReport = {
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser ? currentUser.id : "guest",
      testName: test.name,
      testId: test.id,
      value: value,
      unit: test.unit,
      interpretation: interpretation,
      timestamp: new Date().toLocaleString()
    };
    const updated = [newReport, ...savedLabReports];
    setSavedLabReports(updated);
    saveLabReportsToStorage(updated);
    showToast(`Successfully saved ${test.name} report (${value} ${test.unit}) to your personal lab history!`);
  };

  const saveLabReportsToStorage = (reports: any[]) => {
    try {
      localStorage.setItem("health_guide_saved_lab_reports", JSON.stringify(reports));
    } catch (e) {
      console.warn("Failed to persist saved lab reports", e);
    }
  };

  const handleDeleteLabReport = (id: string) => {
    const updated = savedLabReports.filter(r => r.id !== id);
    setSavedLabReports(updated);
    saveLabReportsToStorage(updated);
    showToast("Lab report deleted from your history.");
  };

  // Doctor visit planner save and delete handlers
  const handleSaveVisitPlan = () => {
    const newPlan = {
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser ? currentUser.id : "guest",
      doctorName: plannerDoctorName || "Unspecified Physician",
      specialty: selectedSpecialty,
      appointmentDate: plannerAppointmentDate || "Not Scheduled",
      symptoms: plannerSymptoms || "None entered",
      medications: plannerMeds || "None entered",
      questions: [...(DOCTOR_SPECIALTIES_DATABASE.find(s => s.specialty === selectedSpecialty)?.suggestedQuestions || []), ...plannerCustomQuestions],
      aiSolutions: plannerAiSolutions,
      timestamp: new Date().toLocaleString()
    };
    const updated = [newPlan, ...savedVisitPlans];
    setSavedVisitPlans(updated);
    saveVisitPlansToStorage(updated);
    showToast(`Consultation visit plan for ${newPlan.doctorName} has been successfully saved to your history!`);
  };

  const saveVisitPlansToStorage = (plans: any[]) => {
    try {
      localStorage.setItem("health_guide_saved_visit_planners", JSON.stringify(plans));
    } catch (e) {
      console.warn("Failed to persist saved visit plans", e);
    }
  };

  const handleDeleteVisitPlan = (id: string) => {
    const updated = savedVisitPlans.filter(p => p.id !== id);
    setSavedVisitPlans(updated);
    saveVisitPlansToStorage(updated);
    showToast("Consultation visit plan deleted from your history.");
  };

  const handleDeleteDiaryLog = (logId: string) => {
    const updated = diaryLogs.filter(log => log.id !== logId);
    setDiaryLogs(updated);
    saveLogsToStorage(updated);
    deleteDiaryLogFromServer(logId);
  };

  // Filter diary logs based on currentUser or guests, plus search query and active filters
  const filteredDiaryLogs = diaryLogs.filter(log => {
    const belongsToUser = currentUser ? log.userId === currentUser.id : log.userId === "guest";
    if (!belongsToUser) return false;
    
    // Search query matching
    if (diarySearchQuery) {
      const query = diarySearchQuery.toLowerCase().trim();
      const matchSymptom = log.primarySymptom.toLowerCase().includes(query);
      const matchNotes = (log.notes || "").toLowerCase().includes(query);
      const matchDuration = (log.duration || "").toLowerCase().includes(query);
      if (!matchSymptom && !matchNotes && !matchDuration) return false;
    }
    
    // Pain level filter (minimum severity filter)
    if (diaryPainFilter !== "all") {
      const minPain = parseInt(diaryPainFilter);
      if (log.painLevel < minPain) return false;
    }
    
    // Fever filter
    if (diaryFeverFilter !== "all") {
      if (log.fever !== diaryFeverFilter) return false;
    }
    
    return true;
  });

  return (
    <div id="health-guide-root" className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans select-text antialiased">
      
      {/* Emergency Warning Alert Modal */}
      {emergencyAlert && (
        <div id="emergency-alert-modal" className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFF5F5] border-4 border-[#D93025] w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
            <button 
              onClick={() => setEmergencyAlert(null)}
              className="absolute right-4 top-4 font-black hover:text-[#D93025] text-lg border border-[#D93025] w-7 h-7 flex items-center justify-center bg-white text-[#D93025]"
            >
              ×
            </button>
            <div className="flex items-center gap-3 border-b-2 border-[#D93025] pb-4 mb-4">
              <AlertTriangle className="w-10 h-10 text-[#D93025] animate-bounce shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl font-serif italic font-black text-[#D93025]">
                  {emergencyAlert.condition}
                </h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#D93025]/80">
                  IMMEDIATE ACTION REQUIRED / فوراً اقدام کریں
                </p>
              </div>
            </div>

            <div className="space-y-4 my-4">
              <div className="p-4 bg-white border-l-4 border-[#D93025] text-[#D93025] font-serif text-sm leading-relaxed">
                <p className="font-bold mb-1 text-xs uppercase opacity-70">English Guidance:</p>
                <p className="font-medium">{emergencyAlert.messageEn}</p>
              </div>

              <div className="p-4 bg-white border-r-4 border-[#D93025] text-[#D93025] font-serif text-sm leading-relaxed text-right">
                <p className="font-bold mb-1 text-xs uppercase opacity-70">اردو ہدایت:</p>
                <p className="font-medium">{emergencyAlert.messageUr}</p>
              </div>

              <div className="bg-red-950 text-white p-4 text-xs space-y-2 border-2 border-red-700">
                <p className="font-bold uppercase tracking-wider text-center text-red-400">
                  EMERGENCY INSTRUCTIONS FOR PAKISTAN
                </p>
                <p className="leading-relaxed">
                  1. <strong>Call Rescue 1122</strong> immediately from any telephone or mobile phone (free of charge).
                </p>
                <p className="leading-relaxed">
                  2. Go to the nearest public or private hospital's **Emergency Department (ایمرجنسی وارڈ)** without delay. Do not wait for a family doctor or this online applet.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const condition = emergencyAlert?.condition || "Critical Medical Emergency";
                  setEmergencyAlert(null);
                  handleTriggerRescue(condition);
                }}
                className="flex-1 bg-[#D93025] text-white hover:bg-[#b0221a] py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-black cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                Trigger Rescue 1122
              </button>
              <button
                onClick={() => setEmergencyAlert(null)}
                className="flex-1 bg-white text-[#1A1A1A] hover:bg-slate-100 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all border-2 border-[#1A1A1A] text-center cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Service Details & Contact Modal */}
      {selectedHospitalService && (() => {
        const h = selectedHospitalService.hospital;
        const s = selectedHospitalService.service;
        const key = s.toLowerCase();
        
        // Find details or fallback to generic
        const details = LAB_SERVICES_REAL_DETAILS[key] || {
          name: s,
          pkrPrice: "1,500 PKR (Est.)",
          timings: "Report in 12 Hours",
          helpline: h.phone,
          description: `Diagnostic pathology and lab investigation service for ${s} performed under international clinical quality assurance standards.`
        };

        return (
          <div id="hospital-service-modal" className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white border-4 border-[#1A1A1A] w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
              <button 
                onClick={() => setSelectedHospitalService(null)}
                className="absolute right-4 top-4 font-black hover:text-[#D93025] text-lg border border-[#1A1A1A] w-7 h-7 flex items-center justify-center bg-white text-[#1A1A1A] hover:bg-[#FDFCFB]"
              >
                ×
              </button>
              
              <div className="border-b-2 border-[#1A1A1A] pb-3 mb-4">
                <span className="text-[9px] uppercase tracking-widest font-black text-[#2D5A27] bg-[#F3F8F2] px-2 py-0.5 border border-[#2D5A27]/20">
                  {h.type} Diagnostic Desk
                </span>
                <h3 className="text-xl sm:text-2xl font-serif italic font-bold mt-1.5 text-[#1A1A1A]">
                  {details.name}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">
                  Provided at: {h.name} ({h.city})
                </p>
              </div>

              <div className="space-y-4 my-4">
                <div className="p-4 bg-[#FDFCFB] border-2 border-[#1A1A1A]/10 text-xs text-slate-800 leading-relaxed">
                  <p className="font-bold text-[#2D5A27] text-xs uppercase mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    Clinical Service Description:
                  </p>
                  <p className="font-serif italic font-medium">{details.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 border border-green-200 text-xs">
                    <p className="font-bold uppercase tracking-wider text-[9px] text-[#2D5A27] mb-1">Standard Charge (Estimated)</p>
                    <p className="font-mono text-sm font-black text-[#1A1A1A]">{details.pkrPrice}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 text-xs">
                    <p className="font-bold uppercase tracking-wider text-[9px] text-slate-500 mb-1">Turnaround Time</p>
                    <p className="font-mono text-sm font-black text-[#1A1A1A]">{details.timings}</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50/50 border border-yellow-200 text-xs space-y-2">
                  <p className="font-black text-yellow-950 uppercase tracking-wider flex items-center gap-1 text-[10px]">
                    <PhoneCall className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
                    Direct Desk Hotline & Contact:
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 border border-[#1A1A1A]/10">
                    <span className="font-mono text-sm font-extrabold text-slate-900">{details.helpline}</span>
                    <a 
                      href={`tel:${details.helpline.replace(/[^0-9+]/g, '')}`} 
                      className="bg-[#2D5A27] hover:bg-[#1a3818] text-white font-extrabold uppercase tracking-widest text-[9px] py-1.5 px-3 border border-black cursor-pointer inline-flex items-center gap-1"
                    >
                      Call Now
                    </a>
                  </div>
                  <p className="text-[10px] text-yellow-900 leading-normal italic">
                    * Present your identity card and referral prescription at the diagnostics desk. You can also dial this hotline for home sample collection requests.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#1A1A1A]/10">
                <button
                  onClick={() => {
                    const svc = details.name;
                    setSelectedHospitalService(null);
                    alert(`Home collection request submitted for ${svc}! A laboratory coordinator from ${h.name} will call you back on your registered number to schedule the blood-draw shortly.`);
                  }}
                  className="flex-1 bg-[#1A1A1A] text-white hover:bg-slate-800 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-black cursor-pointer"
                >
                  Book Home Collection
                </button>
                <button
                  onClick={() => {
                    const testName = s;
                    setSelectedHospitalService(null);
                    handleDirectInterpret(testName);
                  }}
                  className="flex-1 bg-white text-[#2D5A27] hover:bg-green-50 py-3 text-xs font-bold uppercase tracking-widest transition-all border-2 border-[#2D5A27] text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Interpret Report Values
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Top Header Navigation matching Editorial Theme */}
      <header id="main-header" className="border-b-2 border-[#1A1A1A] bg-white sticky top-0 z-30 transition-all duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3 shrink-0">
            <h1 id="app-title" className="text-xl sm:text-2xl lg:text-3xl font-serif italic font-black tracking-tight text-[#2D5A27] cursor-pointer" onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}>
              HealTrust Pakistan
            </h1>
            <span className="hidden xl:inline-block text-[10px] uppercase tracking-widest font-bold opacity-50 border-l border-[#1A1A1A]/20 pl-3">
              {currentT.tagline}
            </span>
          </div>

          {/* Core Navigation Links as requested by user */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 font-extrabold text-xs uppercase tracking-widest">
            <button onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "home" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Home</button>
            <button onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "about" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>About</button>
            <button onClick={() => { setActiveTab("department"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "department" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Department</button>
            <button onClick={() => { setActiveTab("doctors"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "doctors" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Doctors</button>
            <button onClick={() => { setActiveTab("services"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "services" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Services</button>
            <button onClick={() => { setActiveTab("book-appointment"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "book-appointment" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Book Appointment</button>
            <button onClick={() => { setActiveTab("doctor-planner"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "doctor-planner" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Visit Planner</button>
            <button onClick={() => { setActiveTab("reviews"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "reviews" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Reviews</button>
            <button onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }} className={`py-1 hover:text-[#2D5A27] transition-all border-b-2 cursor-pointer ${activeTab === "contact" ? "text-[#2D5A27] border-[#2D5A27]" : "text-slate-700 border-transparent"}`}>Contact</button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Book Appointment CTA Button on Header */}
            <button
              onClick={() => { setActiveTab("book-appointment"); setMobileMenuOpen(false); }}
              className="bg-[#2D5A27] hover:bg-[#1a3818] text-white px-3.5 py-2 text-[10px] md:text-xs uppercase font-black tracking-widest border border-black shadow-xs transition-colors rounded-sm shrink-0 cursor-pointer"
            >
              Book Appointment
            </button>

            {/* User Account Login Badge / Controls */}
            {currentUser ? (
              <div id="user-badge" className="hidden sm:flex items-center gap-2 bg-[#F3F8F2] border border-[#2D5A27] px-3 py-1.5 rounded-sm">
                <UserCheck className="w-4 h-4 text-[#2D5A27]" />
                <div className="hidden xs:block text-left">
                  <p className="text-[10px] font-black uppercase text-[#2D5A27]">Logged In</p>
                  <p className="text-xs font-bold text-[#1A1A1A] truncate max-w-[100px]">{currentUser.name}</p>
                </div>
                <button 
                  onClick={handleLogOut}
                  title="Log Out"
                  className="p-1 hover:bg-red-50 text-red-600 rounded-xs transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div id="login-trigger-btns" className="hidden sm:flex gap-1.5">
                <button 
                  onClick={() => { setAuthMode("login"); setAuthError(null); setMobileMenuOpen(false); }}
                  className="px-2.5 py-1.5 border border-[#1A1A1A] hover:bg-[#F7F3EF] text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Language switchers */}
            <nav id="language-switcher" className="hidden xl:flex bg-[#F7F3EF] p-1 border border-[#1A1A1A] gap-1 rounded-sm text-xs font-bold uppercase tracking-widest">
              <button 
                id="lang-btn-english"
                onClick={() => setSelectedLanguage("english")}
                className={`px-2 py-1 transition-all rounded-xs cursor-pointer ${selectedLanguage === "english" ? "bg-[#1A1A1A] text-white" : "opacity-60 hover:opacity-100"}`}
              >
                EN
              </button>
              <button 
                id="lang-btn-urdu"
                onClick={() => setSelectedLanguage("urdu")}
                className={`px-2 py-1 transition-all rounded-xs font-urdu text-[12px] cursor-pointer ${selectedLanguage === "urdu" ? "bg-[#1A1A1A] text-white" : "opacity-60 hover:opacity-100"}`}
              >
                اردو
              </button>
            </nav>

            {/* Emergency Hotline */}
            <button 
              id="emergency-call-btn"
              onClick={() => handleTriggerRescue()} 
              className="hidden md:flex bg-[#D93025] hover:bg-[#b0221a] text-white px-3 py-2 text-xs font-black uppercase tracking-widest items-center gap-1.5 transition-all shadow-sm border-b-2 border-black/30 border-none cursor-pointer"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping shrink-0"></span>
              <PhoneCall className="w-3 h-3" />
              <span>Rescue 1122</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden items-center justify-center border-2 border-black p-2 bg-[#F7F3EF] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#1A1A1A] bg-white p-4 space-y-3 shadow-md">
            <div className="flex flex-col gap-2.5 font-extrabold text-[11px] uppercase tracking-wider text-left">
              <button onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "home" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Home className="w-4 h-4 shrink-0" />Home</button>
              <button onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "about" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Info className="w-4 h-4 shrink-0" />About Us</button>
              <button onClick={() => { setActiveTab("department"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "department" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Building className="w-4 h-4 shrink-0" />Departments</button>
              <button onClick={() => { setActiveTab("doctors"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "doctors" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Users className="w-4 h-4 shrink-0" />Doctors Panel</button>
              <button onClick={() => { setActiveTab("services"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "services" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Activity className="w-4 h-4 shrink-0" />Diagnostic Services</button>
              <button onClick={() => { setActiveTab("book-appointment"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "book-appointment" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Calendar className="w-4 h-4 shrink-0" />Book Appointment</button>
              <button onClick={() => { setActiveTab("doctor-planner"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "doctor-planner" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Clock className="w-4 h-4 shrink-0" />Visit Planner</button>
              <button onClick={() => { setActiveTab("reviews"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "reviews" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Heart className="w-4 h-4 shrink-0" />Patient Reviews</button>
              <button onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }} className={`p-2.5 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${activeTab === "contact" ? "text-[#2D5A27] bg-[#F4F9F4]" : "text-slate-800"}`}><Mail className="w-4 h-4 shrink-0" />Contact & Enquiries</button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1A1A1A]/10">
              <button 
                onClick={() => { setMobileMenuOpen(false); handleTriggerRescue(); }} 
                className="flex-1 text-center py-2 bg-[#D93025] text-white text-[10px] font-black uppercase tracking-widest border border-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Rescue 1122
              </button>
              {currentUser ? (
                <button onClick={() => { handleLogOut(); setMobileMenuOpen(false); }} className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] uppercase font-bold tracking-widest border border-red-300 cursor-pointer">
                  Log Out ({currentUser.name})
                </button>
              ) : (
                <button onClick={() => { setAuthMode("login"); setAuthError(null); setMobileMenuOpen(false); }} className="flex-1 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-widest text-center border border-black cursor-pointer">
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Website Facilities Navigator Tab bar (Always shown to provide clear access to patient utilities) */}
      {activeTab !== "admin-panel" && (
        <div id="facility-navigator-bar" className="bg-[#1A1A1A] text-white border-b-2 border-[#1A1A1A] sticky top-20 z-25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto gap-4 py-1.5 scrollbar-thin">
            <div className="flex gap-1 md:gap-2">
              <button
                onClick={() => setActiveTab("ai-consultation")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "ai-consultation" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#2D5A27]" />
                AI Symptom Assessor
              </button>

              <button
                onClick={() => setActiveTab("hospital-finder")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "hospital-finder" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#2D5A27]" />
                Pakistan Hospital Directory
              </button>

              <button
                onClick={() => setActiveTab("med-safety")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "med-safety" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <Pill className="w-3.5 h-3.5 text-[#2D5A27]" />
                Medication Safety Guide
              </button>

              <button
                onClick={() => setActiveTab("lab-explainer")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "lab-explainer" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#2D5A27]" />
                Understand Lab Reports
              </button>

              <button
                onClick={() => setActiveTab("doctor-planner")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "doctor-planner" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                Doctor Visit Planner
              </button>

              <button
                onClick={() => setActiveTab("supabase-activity")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "supabase-activity" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <CloudUpload className="w-3.5 h-3.5 text-[#2D5A27] animate-pulse-slow" />
                Cloud Activity Board
              </button>

              <button
                onClick={() => setActiveTab("health-diary")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "health-diary" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#2D5A27]" />
                Health Record Diary
                <span className="bg-[#2D5A27] text-white text-[8px] px-1 rounded-full">{filteredDiaryLogs.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("first-aid")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "first-aid" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <Info className="w-3.5 h-3.5 text-[#2D5A27]" />
                First Aid Guides
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-3.5 py-2 text-[10px] md:text-xs uppercase font-extrabold tracking-widest transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === "reviews" ? "text-white border-[#2D5A27] bg-white/10" : "text-slate-300 hover:text-white border-transparent"
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-[#2D5A27]" />
                Patient Reviews
                <span className="bg-[#2D5A27] text-white text-[8px] px-1 rounded-full">{reviews.length}</span>
              </button>
            </div>

            <div className="md:hidden flex bg-[#1A1A1A] gap-1 p-1">
              <button 
                onClick={() => setSelectedLanguage(selectedLanguage === "english" ? "urdu" : selectedLanguage === "urdu" ? "romanUrdu" : "english")}
                className="px-2 py-1 text-[9px] uppercase font-bold tracking-widest border border-white/20 hover:border-white rounded-xs cursor-pointer"
              >
                Lang: {selectedLanguage.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Dialog overlay */}
      {authMode !== "closed" && (
        <div id="auth-modal" className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FDFCFB] border-4 border-[#1A1A1A] w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setAuthMode("closed")}
              className="absolute right-4 top-4 font-black hover:text-[#D93025] text-lg border border-[#1A1A1A] w-7 h-7 flex items-center justify-center bg-white"
            >
              ×
            </button>

            {authMode === "login" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <h3 className="text-2xl font-serif italic font-black text-[#2D5A27] border-b border-[#1A1A1A] pb-2">
                  Sign In to Patient Portal
                </h3>
                <p className="text-xs text-[#555]">
                  Sign in to keep a private clinical diary, track past consultations, and save symptom records.
                </p>

                {authError && <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold">{authError}</div>}
                {authSuccess && <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-xs font-bold">{authSuccess}</div>}

                <div>
                  <label className="block text-[10px] uppercase font-bold mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g., patient@pakistan.com"
                    className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold mb-1">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button 
                    type="submit"
                    className="bg-[#2D5A27] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black"
                  >
                    Authenticate
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAuthMode("signup"); setAuthError(null); }}
                    className="text-xs font-bold underline"
                  >
                    Need an account? Sign Up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3 max-h-[90vh] overflow-y-auto pr-1">
                <h3 className="text-2xl font-serif italic font-black text-[#2D5A27] border-b border-[#1A1A1A] pb-2">
                  Register Patient Account
                </h3>
                <p className="text-xs text-[#555]">
                  Create a secure offline account. All medical data is stored on your device's browser cache only.
                </p>

                {authError && <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold">{authError}</div>}
                {authSuccess && <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-xs font-bold">{authSuccess}</div>}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Asma Khan"
                      className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. asma@gmail.com"
                      className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1">Password *</label>
                    <input 
                      type="password" 
                      required 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1">Age *</label>
                    <input 
                      type="text" 
                      required 
                      value={authAge}
                      onChange={(e) => setAuthAge(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1">Sex</label>
                    <select 
                      value={authSex}
                      onChange={(e) => setAuthSex(e.target.value)}
                      className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                    >
                      <option value="Unspecified">Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold mb-1">Chronic Illnesses (e.g. High BP, Asthma, Diabetes)</label>
                  <input 
                    type="text" 
                    value={authConditions}
                    onChange={(e) => setAuthConditions(e.target.value)}
                    placeholder="e.g. Asthmatic, Hypertension"
                    className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold mb-1">Drug Allergies (e.g. Penicillin, Aspirin)</label>
                  <input 
                    type="text" 
                    value={authAllergies}
                    onChange={(e) => setAuthAllergies(e.target.value)}
                    placeholder="e.g. Penicillin allergy"
                    className="w-full p-2 text-xs bg-white border-2 border-[#1A1A1A]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button 
                    type="submit"
                    className="bg-[#2D5A27] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black"
                  >
                    Register Account
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAuthMode("login"); setAuthError(null); }}
                    className="text-xs font-bold underline"
                  >
                    Already registered? Log In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Switchable Portal Body */}
      {activeTab === "home" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-12">
          {/* Hero Banner Section */}
          <section className="border-4 border-[#1A1A1A] bg-[#2D5A27] text-white p-6 sm:p-10 relative overflow-hidden shadow-xl text-left">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
              <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" />
              </svg>
            </div>
            <div className="max-w-2xl relative z-10 space-y-4 text-left">
              <span className="text-[10px] uppercase tracking-widest font-black bg-amber-500 text-black px-2.5 py-1 inline-block rounded-sm">
                Empowering Patients Nationwide
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-black leading-tight">
                Pristine Digital Healthcare for Every Pakistani Home
              </h2>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-w-xl">
                HealTrust Pakistan is a safe, state-of-the-art educational medical portal providing bilingual symptoms checks, public hospital directories, medicine safety guides, and pre-consultation planners.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => { setActiveTab("ai-consultation"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="bg-[#1A1A1A] hover:bg-slate-800 text-white px-5 py-3 text-xs uppercase font-black tracking-widest border border-black shadow-md transition-colors rounded-sm cursor-pointer"
                >
                  Start Symptom Assessor
                </button>
                <button
                  onClick={() => { setActiveTab("doctor-planner"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="bg-white hover:bg-slate-100 text-[#2D5A27] px-5 py-3 text-xs uppercase font-black tracking-widest border-2 border-[#1A1A1A] shadow-md transition-all rounded-sm cursor-pointer"
                >
                  Plan a Doctor Visit
                </button>
              </div>
            </div>
          </section>

          {/* Quick Access Grid */}
          <section className="space-y-6 text-left">
            <div className="border-b-2 border-[#1A1A1A] pb-2">
              <h3 className="text-2xl font-serif italic font-bold text-slate-900">
                Core Clinical Modules
              </h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                Select a digital aid to assist you in preparing for professional medical care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="border-4 border-[#1A1A1A] bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] flex items-center justify-center rounded-sm">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif italic font-bold text-lg text-slate-900">Symptom Assessor</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Confidential check-up with detailed reports explaining common causes in neutral language.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab("ai-consultation"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider text-left block cursor-pointer"
                >
                  Launch Assessor →
                </button>
              </div>

              {/* Card 2 */}
              <div className="border-4 border-[#1A1A1A] bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] flex items-center justify-center rounded-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif italic font-bold text-lg text-slate-900">Understand Lab Reports</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Check if your platelet count, hemoglobin, sugar, or cholesterol levels fall in normal parameters.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab("lab-explainer"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider text-left block cursor-pointer"
                >
                  Analyze Reports →
                </button>
              </div>

              {/* Card 3 */}
              <div className="border-4 border-[#1A1A1A] bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] flex items-center justify-center rounded-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif italic font-bold text-lg text-slate-900">Hospital Finder</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Browse verified secondary and tertiary hospitals, public clinics, and medical emergency wards across Pakistan.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab("hospital-finder"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider text-left block cursor-pointer"
                >
                  Find Hospitals →
                </button>
              </div>

              {/* Card 4 */}
              <div className="border-4 border-[#1A1A1A] bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] flex items-center justify-center rounded-sm">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif italic font-bold text-lg text-slate-900">Medication Safety</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inspect standard usage, brand associations, dosage precautions, and crucial interactions of daily medicines.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab("med-safety"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider text-left block cursor-pointer"
                >
                  Check Medicine Safety →
                </button>
              </div>
            </div>
          </section>

          {/* Pakistan Specific Health Campaigns */}
          <section className="bg-[#F7F3EF] border-4 border-[#1A1A1A] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            <div className="lg:border-r border-[#1A1A1A]/20 lg:pr-8 space-y-3">
              <span className="text-[9px] uppercase tracking-widest font-black bg-[#D93025] text-white px-2 py-0.5 rounded-xs">
                Seasonal Vector Alert
              </span>
              <h4 className="text-xl font-serif italic font-bold text-slate-900">Dengue Prevention Strategy</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                As monsoon season approaches, protect your family by emptying stagnant water containers daily and using mosquito repellents. Monitor platelet counts carefully if fever arises.
              </p>
              <button onClick={() => { setActiveTab("lab-explainer"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider cursor-pointer">
                Learn Platelet Ranges →
              </button>
            </div>

            <div className="lg:border-r border-[#1A1A1A]/20 lg:px-8 space-y-3 text-left">
              <span className="text-[9px] uppercase tracking-widest font-black bg-[#2D5A27] text-white px-2 py-0.5 rounded-xs">
                Community Wellness Focus
              </span>
              <h4 className="text-xl font-serif italic font-bold text-slate-900">Heatstroke & Dehydration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                During extreme summer heat, ensure continuous intake of clean boiled drinking water. Avoid physical exertion during peak hours. Recognise signs of heatstroke early.
              </p>
              <button onClick={() => { setActiveTab("first-aid"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider cursor-pointer">
                First Aid Guidelines →
              </button>
            </div>

            <div className="lg:pl-8 space-y-3 text-left">
              <span className="text-[9px] uppercase tracking-widest font-black bg-[#1A1A1A] text-white px-2 py-0.5 rounded-xs">
                Digital Health Mission
              </span>
              <h4 className="text-xl font-serif italic font-bold text-slate-900">Safe Drinking Water Access</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Over 70% of clinical cases in Pakistan arise due to contaminated water supply. Always boil water for at least 20 minutes before drinking or culinary use.
              </p>
              <button onClick={() => { setActiveTab("about"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs font-black uppercase text-[#2D5A27] hover:underline tracking-wider cursor-pointer">
                About HealTrust Mission →
              </button>
            </div>
          </section>

          {/* Clinical Statistics banner matching Swiss Style */}
          <section className="grid grid-cols-2 md:grid-cols-4 border-4 border-[#1A1A1A] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1A1A1A] text-center bg-white">
            <div className="p-4 sm:p-6 space-y-1">
              <p className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">100%</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Unbiased Educational Info</p>
            </div>
            <button 
              onClick={() => handleTriggerRescue()}
              className="p-4 sm:p-6 space-y-1 hover:bg-red-50 transition-all text-center border-none cursor-pointer focus:outline-none flex flex-col items-center justify-center w-full"
            >
              <p className="text-3xl sm:text-4xl font-serif italic font-black text-[#D93025] animate-pulse">1122</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Launch Emergency Desk</p>
            </button>
            <div className="p-4 sm:p-6 space-y-1">
              <p className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">Dual</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Bilingual Support (EN / اردو)</p>
            </div>
            <div className="p-4 sm:p-6 space-y-1">
              <p className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">Private</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Local Browser Cache Safety</p>
            </div>
          </section>
        </main>
      )}

      {activeTab === "about" && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-10 text-left">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">
              About HealTrust Pakistan
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Building a healthier, highly informed Pakistan through technology
            </p>
          </div>

          <div className="border-4 border-[#1A1A1A] bg-white p-6 sm:p-8 space-y-6 leading-relaxed">
            <h3 className="text-xl font-serif italic font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-700">
              HealTrust Pakistan was founded with a singular, clinical vision: to bring clear, high-quality, safe health educational materials directly to every citizen's screen. In a country where healthcare facilities face significant patient volumes, providing individuals with a clean digital utility to organize their medical inquiries can significantly strengthen their communication with their doctors.
            </p>
            <p className="text-xs sm:text-sm text-slate-700">
              HealTrust utilizes state-of-the-art diagnostic explanation models to help translate raw laboratory reports into plain, easily understandable terms. From explaining the critical role platelets play during dengue outbreaks to defining HbA1c benchmarks, we empower citizens to prepare for checkups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-[#1A1A1A] bg-[#F7F3EF] p-5 space-y-3">
              <h4 className="font-serif italic font-bold text-lg text-[#2D5A27]">Medical Credibility</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Our templates and guidelines are compiled from verified clinical data, strictly emphasizing health education. We provide no direct medical prescriptions, guaranteeing safe boundaries.
              </p>
            </div>
            <div className="border-4 border-[#1A1A1A] bg-[#F7F3EF] p-5 space-y-3">
              <h4 className="font-serif italic font-bold text-lg text-[#2D5A27]">Urdu-Bilingual Integration</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Language should never be a barrier to clinical safety. HealTrust Pakistan offers complete translations in English, Arabic-Script Urdu, and Roman Urdu to cover all regions.
              </p>
            </div>
          </div>

          <div className="bg-[#FFF5F5] border-4 border-[#D93025] p-5 sm:p-6 space-y-3">
            <h4 className="font-serif italic font-bold text-lg text-[#D93025] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Strict Educational Boundaries
            </h4>
            <p className="text-xs text-red-950 leading-relaxed">
              HealTrust Pakistan provides medical education and pre-visit planning support ONLY. We are not a replacement for a licensed general practitioner, emergency ward, pharmacist, or pediatric specialist. In case of emergency conditions (such as severe chest pain, extreme sudden breathlessness, or persistent high fever), always proceed directly to your nearest hospital emergency department or dial **Rescue 1122** immediately.
            </p>
          </div>
        </main>
      )}

      {activeTab === "department" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 text-left">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">
              Medical Departments
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Explore specialized clinics and biological profiles supported on our planning portal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTOR_SPECIALTIES_DATABASE.map((dept, idx) => (
              <div key={idx} className="border-4 border-[#1A1A1A] bg-white p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-widest font-black bg-[#F4F9F4] text-[#2D5A27] border border-[#2D5A27]/20 px-2 py-0.5 inline-block">
                    Department {idx + 1}
                  </span>
                  <h3 className="font-serif italic font-bold text-lg text-slate-900 leading-tight">
                    {dept.specialty}
                  </h3>
                  <p className="text-xs text-slate-600 leading-normal">
                    {dept.description}
                  </p>
                  <p className="text-xs font-urdu text-[#2D5A27] bg-[#F7F3EF]/50 p-2 border-r-2 border-[#2D5A27] text-right font-medium leading-relaxed">
                    {dept.descriptionUrdu}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#1A1A1A]/10">
                  <button
                    onClick={() => {
                      setSelectedSpecialty(dept.specialty);
                      setPlannerDoctorName("");
                      setActiveTab("doctor-planner");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full bg-[#1A1A1A] hover:bg-[#2D5A27] text-white py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Open Planner Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {activeTab === "doctors" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 text-left">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">
              HealTrust Doctors Panel
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Select a clinical expert to schedule a clinical consultation or compile a pre-visit checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCTORS_LIST.map((doc, idx) => (
              <div key={idx} className="border-4 border-[#1A1A1A] bg-white p-5 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Visual Placeholder Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F7F3EF] border-2 border-[#1A1A1A] text-[#2D5A27] flex items-center justify-center font-serif text-xl sm:text-2xl font-black shrink-0">
                  {doc.avatar}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap justify-between items-baseline gap-2">
                    <h3 className="font-serif italic font-bold text-lg text-slate-900">Dr. {doc.name}</h3>
                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
                      {doc.experience}
                    </span>
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#2D5A27]">
                    {doc.specialty}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    📍 {doc.location} • 🕒 {doc.timing}
                  </p>
                  {doc.phone && (
                    <p className="text-[11px] text-[#2D5A27] font-semibold flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 shrink-0" />
                      <span>Helpline: </span>
                      <a href={`tel:${doc.phone}`} className="underline hover:text-[#1a3818] transition-colors">{doc.phone}</a>
                    </p>
                  )}
                  <p className="text-xs text-slate-600 leading-normal italic bg-[#F7F3EF]/30 p-2.5 border-l-2 border-[#1A1A1A]/40">
                    &ldquo;{doc.focus}&rdquo;
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setBookingDoctorName(doc.name);
                        setBookingSpecialty(doc.specialty);
                        setActiveTab("book-appointment");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-[#2D5A27] hover:bg-[#1a3818] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book Appointment
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSpecialty(doc.specialty);
                        setPlannerDoctorName(doc.name);
                        setActiveTab("doctor-planner");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-white hover:bg-slate-50 text-[#1A1A1A] border border-[#1A1A1A] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                      Plan Visit Checklist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {activeTab === "services" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 text-left">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">
              HealTrust Digital Health Services
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Browse our set of state-of-the-art interactive clinical utilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-[#1A1A1A] bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] rounded-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-xl text-slate-900">AI Symptom Assessment</h3>
                  <p className="text-[10px] text-[#2D5A27] font-black uppercase tracking-wider">Confidential educational triage</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive instant pre-clinical evaluation on potential causes based on your pain severity, fever, duration, and conditions. Our system translates explanations to Urdu/Roman Urdu dynamically.
              </p>
              <button onClick={() => { setActiveTab("ai-consultation"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-xs px-4 py-2 font-bold uppercase tracking-wider cursor-pointer">
                Launch Symptom Assessor →
              </button>
            </div>

            <div className="border-4 border-[#1A1A1A] bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] rounded-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-xl text-slate-900">Lab Reports Interpreter</h3>
                  <p className="text-[10px] text-[#2D5A27] font-black uppercase tracking-wider">Platelets, Hb, Fasting Sugar & Cholesterol</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check lab reports instantly against normal medical parameters. Extremely vital for Dengue monitoring (platelet check) and long-term diabetes management.
              </p>
              <button onClick={() => { setActiveTab("lab-explainer"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-xs px-4 py-2 font-bold uppercase tracking-wider cursor-pointer">
                Explain Lab Values →
              </button>
            </div>

            <div className="border-4 border-[#1A1A1A] bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] rounded-sm">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-xl text-slate-900">Safe Medication Guide</h3>
                  <p className="text-[10px] text-[#2D5A27] font-black uppercase tracking-wider">Precautions, side effects & brand names</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect brand mappings and safety considerations for critical substances (e.g., paracetamol, ibuprofen, amoxicillin). Protect your liver and avoid severe drug interactions.
              </p>
              <button onClick={() => { setActiveTab("med-safety"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-xs px-4 py-2 font-bold uppercase tracking-wider cursor-pointer">
                Open Medicine Safety →
              </button>
            </div>

            <div className="border-4 border-[#1A1A1A] bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] rounded-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-xl text-slate-900">Pakistan Hospital Finder</h3>
                  <p className="text-[10px] text-[#2D5A27] font-black uppercase tracking-wider">Map directory of medical facilities</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find primary, secondary and tertiary hospitals, public healthcare clinics, and emergency locations across major cities in Pakistan with contact details.
              </p>
              <button onClick={() => { setActiveTab("hospital-finder"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-xs px-4 py-2 font-bold uppercase tracking-wider cursor-pointer">
                Search Hospital Directory →
              </button>
            </div>
          </div>
        </main>
      )}

      {activeTab === "contact" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 text-left">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl sm:text-4xl font-serif italic font-black text-[#2D5A27]">
              Contact & Support Center
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Submit clinical enquiries, support requests or request institutional portal deployment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Form (Left) */}
            <div className="lg:col-span-7 border-4 border-[#1A1A1A] bg-white p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-serif italic font-bold text-slate-900 border-b border-[#1A1A1A]/10 pb-2">
                Send Us a Message
              </h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. ali@gmail.com"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-700">Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Institutional Cooperation inquiry"
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-700">Message / Enquiry Content *</label>
                  <textarea
                    required
                    rows={5}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry or support feedback in detail here..."
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27] resize-none"
                  ></textarea>
                </div>

                {contactSuccess && (
                  <div className="p-3 bg-green-50 border border-green-500 text-xs text-green-800 font-bold">
                    {contactSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="bg-[#2D5A27] hover:bg-[#1a3818] text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest border border-black shadow-sm transition-colors cursor-pointer"
                >
                  {contactLoading ? "Submitting Message..." : "Submit Enquiry"}
                </button>
              </form>
            </div>

            {/* Helpline and Centers info (Right) */}
            <div className="lg:col-span-5 space-y-6">
              {/* National Helpline Directory */}
              <div className="border-4 border-[#1A1A1A] bg-[#F7F3EF] p-5 space-y-4">
                <h4 className="font-serif italic font-bold text-lg text-slate-900 border-b border-[#1A1A1A]/10 pb-2">
                  Emergency Helpline Board
                </h4>
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex justify-between items-center border-b border-[#1A1A1A]/5 pb-2">
                    <span className="font-bold">Rescue Medical Service</span>
                    <button 
                      onClick={() => handleTriggerRescue()} 
                      className="text-[#D93025] font-black font-mono bg-red-50 border border-red-300 px-2 py-0.5 hover:underline cursor-pointer text-xs"
                    >
                      1122 (Launch desk)
                    </button>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#1A1A1A]/5 pb-2">
                    <span className="font-bold">Edhi Ambulance Network</span>
                    <a href="tel:115" className="text-[#2D5A27] font-black font-mono bg-green-50 border border-green-300 px-2 py-0.5 hover:underline">115</a>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#1A1A1A]/5 pb-2">
                    <span className="font-bold">Chhipa Ambulance Network</span>
                    <a href="tel:1020" className="text-slate-700 font-black font-mono bg-slate-50 border border-slate-300 px-2 py-0.5 hover:underline">1020</a>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-bold">Sehat Sahulat Program</span>
                    <a href="tel:080009009" className="text-slate-700 font-black font-mono bg-slate-50 border border-slate-300 px-2 py-0.5 hover:underline">0800-09009</a>
                  </div>
                </div>
              </div>

              {/* Physical Clinical Center nodes */}
              <div className="border-4 border-[#1A1A1A] bg-white p-5 space-y-4">
                <h4 className="font-serif italic font-bold text-lg text-slate-900 border-b border-[#1A1A1A]/10 pb-2">
                  Support Offices & Clinical Labs
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="font-black text-[#2D5A27] uppercase text-[10px] tracking-wider">Lahore Headquarters</p>
                    <p className="font-medium text-slate-800">Block H-3, Johar Town, Near Lahore General Hospital</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      Contact: <a href="mailto:lhr@healtrust.pk" className="underline hover:text-[#2D5A27] transition-colors">lhr@healtrust.pk</a> • Call: <a href="tel:04235121122" className="underline font-bold hover:text-[#2D5A27] transition-colors">(042) 3512-1122</a>
                    </p>
                  </div>
                  <div>
                    <p className="font-black text-[#2D5A27] uppercase text-[10px] tracking-wider">Karachi Support Office</p>
                    <p className="font-medium text-slate-800">Main University Road, Gulshan-e-Iqbal, Near NICVD Karachi</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      Contact: <a href="mailto:khi@healtrust.pk" className="underline hover:text-[#2D5A27] transition-colors">khi@healtrust.pk</a> • Call: <a href="tel:02134981122" className="underline font-bold hover:text-[#2D5A27] transition-colors">(021) 3498-1122</a>
                    </p>
                  </div>
                  <div>
                    <p className="font-black text-[#2D5A27] uppercase text-[10px] tracking-wider">Islamabad Core Hub</p>
                    <p className="font-medium text-slate-800">G-11 Markaz, Near Pakistan Institute of Medical Sciences (PIMS)</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      Contact: <a href="mailto:isb@healtrust.pk" className="underline hover:text-[#2D5A27] transition-colors">isb@healtrust.pk</a> • Call: <a href="tel:05122441122" className="underline font-bold hover:text-[#2D5A27] transition-colors">(051) 2244-1122</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Main Switchable Portal Body */}
      {activeTab === "ai-consultation" && (
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row border-x-0 lg:border-x-2 lg:border-[#1A1A1A]">
          
          {/* LEFT PANEL: Clinical Intake Builder */}
          <section id="intake-sidebar" className="w-full lg:w-[380px] lg:border-r-2 lg:border-[#1A1A1A] p-4 sm:p-6 bg-[#FDFCFB] flex flex-col space-y-6 shrink-0">
            
            {/* Privacy Shield Info */}
            <div id="privacy-shield" className="p-3 bg-[#F0FDF4] border border-[#2D5A27]/30 flex items-start gap-2.5 rounded-sm">
              <Shield className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-[#2D5A27]">
                <p className="font-bold">{selectedLanguage === "english" ? "Privacy Protection Active" : selectedLanguage === "urdu" ? "پرائیویسی پروٹیکشن فعال ہے" : "Privacy Shield Active"}</p>
                <p className="text-[10px] opacity-90">{currentT.privacyNotice}</p>
              </div>
            </div>

            {/* Profile Context Autofill Banner */}
            {currentUser && (
              <div className="p-2.5 bg-[#F7F3EF] border border-[#2D5A27] text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#2D5A27]">
                  <UserCheck className="w-3.5 h-3.5" />
                  Profile Auto-Fill Active
                </div>
                <button 
                  onClick={() => {
                    setPatientAge(currentUser.age);
                    setPatientSex(currentUser.sex);
                    setOtherConditions(currentUser.otherConditions + (currentUser.allergies ? ` (Allergies: ${currentUser.allergies})` : ""));
                  }}
                  className="text-[9px] uppercase font-black tracking-tighter text-[#2D5A27] hover:underline"
                >
                  Reload Profile
                </button>
              </div>
            )}

            {/* Intake Form */}
            <div id="patient-intake-card" className="border-2 border-[#1A1A1A] p-4 bg-[#F7F3EF] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#2D5A27] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {currentT.recentInquiry}
                </span>
                <span className="text-[10px] uppercase font-bold opacity-50 bg-[#1A1A1A]/10 px-1.5 py-0.5">Clinical Guide</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/40 p-2 border border-[#1A1A1A]/5 rounded-sm">
                <p className="text-[11px] text-[#555] leading-relaxed italic">
                  {currentT.howToUseIntake}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPatientAge("32");
                    setPatientSex("Female");
                    setPainLevel(6);
                    setSymptomDuration("3 days");
                    setHasFever("yes");
                    setIsPregnant("no");
                    setOtherConditions("Asthma");
                  }}
                  className="text-[9px] bg-[#2D5A27] text-white hover:bg-[#1f3f1b] px-2 py-1 uppercase font-bold shrink-0 rounded-sm border border-black/10 shadow-sm transition-all"
                >
                  Fill Sample Context
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">{currentT.ageSex}</label>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      placeholder="e.g. 28" 
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-1/2 p-1.5 text-xs bg-white border border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                    />
                    <select 
                      value={patientSex} 
                      onChange={(e) => setPatientSex(e.target.value)}
                      className="w-1/2 p-1.5 text-xs bg-white border border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                    >
                      <option value="Unspecified">Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">{currentT.painSeverity} (0-10)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={painLevel} 
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      className="w-2/3 accent-[#2D5A27] h-1 bg-[#1A1A1A]/15 cursor-pointer"
                    />
                    <span className={`w-8 text-center text-xs font-black px-1.5 py-0.5 border ${
                      painLevel >= 7 ? "bg-[#D93025] text-white border-[#D93025]" : 
                      painLevel >= 4 ? "bg-amber-100 text-amber-800 border-amber-300" : 
                      "bg-[#2D5A27] text-white border-[#2D5A27]"
                    }`}>
                      {painLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">{currentT.duration}</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 2 hours, 3 days" 
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    className="w-full p-1.5 text-xs bg-white border border-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">{currentT.fever}</label>
                  <div className="flex bg-white border border-[#1A1A1A] p-0.5">
                    <button 
                      onClick={() => setHasFever("yes")}
                      className={`flex-1 text-[10px] font-bold py-1 text-center ${hasFever === "yes" ? "bg-[#2D5A27] text-white" : "hover:bg-slate-100"}`}
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => setHasFever("no")}
                      className={`flex-1 text-[10px] font-bold py-1 text-center ${hasFever === "no" ? "bg-slate-200 text-slate-700" : "hover:bg-slate-100"}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {patientSex === "Female" && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">{currentT.pregnant}</label>
                    <div className="flex bg-white border border-[#1A1A1A] p-0.5">
                      <button 
                        onClick={() => setIsPregnant("yes")}
                        className={`flex-1 text-[10px] font-bold py-1 ${isPregnant === "yes" ? "bg-[#2D5A27] text-white" : ""}`}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setIsPregnant("no")}
                        className={`flex-1 text-[10px] font-bold py-1 ${isPregnant === "no" ? "bg-slate-200 text-slate-700" : ""}`}
                      >
                        No
                      </button>
                      <button 
                        onClick={() => setIsPregnant("not-applicable")}
                        className={`flex-1 text-[10px] font-bold py-1 ${isPregnant === "not-applicable" ? "bg-slate-100 opacity-50" : ""}`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">{currentT.otherNotes}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Asthma, High BP, Dust Allergy" 
                    value={otherConditions}
                    onChange={(e) => setOtherConditions(e.target.value)}
                    className="w-full p-1.5 text-xs bg-white border border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Notification Banner for Intake form action status */}
              {intakeNotification && (
                <div className="p-2 text-[10px] font-bold text-center bg-green-50 text-green-800 border border-green-300 rounded-sm animate-fade-in">
                  {intakeNotification}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleInsertIntake}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2D5A27] text-white font-bold text-[10px] uppercase tracking-wider py-2.5 transition-colors flex items-center justify-center gap-1.5 border border-[#1A1A1A] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {currentT.insertIntakeText}
                </button>

                <button 
                  onClick={handleDirectAssess}
                  className="w-full bg-[#2D5A27] hover:bg-[#1f3f1b] text-white font-bold text-[10px] uppercase tracking-wider py-2.5 transition-colors flex items-center justify-center gap-1.5 border border-[#1A1A1A] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  {selectedLanguage === "english" ? "Get Instant AI Assessment" : selectedLanguage === "urdu" ? "فوری طبی رپورٹ تیار کریں" : "Get Instant AI Assessment"}
                </button>
              </div>
            </div>

            {/* Quick Presets Library */}
            <div id="preset-library-card" className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-1.5">
                <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#2D5A27]" />
                  {currentT.presetsHeader}
                </span>
                <span className="text-[10px] font-bold bg-[#2D5A27]/10 text-[#2D5A27] px-2 py-0.5 rounded-full">
                  {filteredPresets.length} topics
                </span>
              </div>

              {/* Filter tags */}
              <div className="flex flex-wrap gap-1">
                {["all", "urgent", "general", "pediatric", "environmental"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[10px] uppercase font-bold px-2 py-1 border transition-colors ${
                      categoryFilter === cat 
                        ? "bg-[#2D5A27] text-white border-[#2D5A27]" 
                        : "bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A]"
                    }`}
                  >
                    {cat === "all" ? currentT.all : cat === "urgent" ? currentT.urgent : cat === "general" ? currentT.general : cat === "pediatric" ? currentT.pediatric : currentT.environmental}
                  </button>
                ))}
              </div>

              {/* Presets List */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {filteredPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left p-2 border border-[#1A1A1A] bg-white hover:bg-[#F7F3EF] hover:border-[#2D5A27] transition-all flex flex-col group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[8px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 border ${
                        preset.category === "urgent" ? "bg-red-50 text-red-700 border-red-200" :
                        preset.category === "pediatric" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        preset.category === "environmental" ? "bg-orange-50 text-orange-700 border-orange-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {preset.category}
                      </span>
                      <span className="text-xs text-[#2D5A27] opacity-0 group-hover:opacity-100 transition-opacity font-bold">Use Preset →</span>
                    </div>
                    <h4 className="text-xs font-serif italic font-bold mt-1 text-[#1A1A1A] group-hover:text-[#2D5A27]">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-[#555] mt-0.5 line-clamp-1 leading-snug">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Red Flags Triage */}
            <div className="border-t border-[#1A1A1A]/20 pt-4 space-y-2 text-left">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D93025] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D93025] animate-pulse-slow" />
                  Urgent Rescue 1122 Warning Signs
                </h4>
                <button
                  type="button"
                  onClick={() => handleTriggerRescue("Critical Warning Signs Alert")}
                  className="text-[9px] uppercase font-black bg-[#D93025] text-white hover:bg-black px-2 py-0.5 rounded-xs transition-all cursor-pointer border-none"
                >
                  Launch 1122 Desk
                </button>
              </div>
              <div className="p-2.5 bg-red-50/50 border border-red-200 text-[11px] text-red-950 font-medium">
                Go to the nearest emergency ward immediately for: chest pain, blue lips, severe breathing trouble, or slurred speech.
              </div>
            </div>

          </section>

          {/* RIGHT PANEL: Live Newspaper Assessment Board & Live Chat split */}
          <section id="consultation-deck" className="flex-1 bg-white flex flex-col">
            
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Split A: Structured Assessment Board */}
              <div id="report-board" className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#1A1A1A] p-4 sm:p-6 overflow-y-auto bg-[#FDFCFB] flex flex-col space-y-6">
                
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-[#2D5A27]" />
                    <h3 className="text-lg font-serif italic font-bold">
                      {currentT.assessmentReport}
                    </h3>
                  </div>
                  {parsedAssessment && (
                    <button
                      onClick={handleQuickSaveAssessment}
                      className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-[#2D5A27] text-white hover:bg-[#1a3818] border border-[#1A1A1A]"
                    >
                      Save to Diary
                    </button>
                  )}
                </div>

                {parsedAssessment ? (
                  <div className="space-y-6">
                    {/* Intro */}
                    {parsedAssessment.intro && (
                      <div className="p-4 border-l-4 border-[#2D5A27] bg-[#F4F9F4]">
                        <p className="text-xs font-bold text-[#2D5A27] uppercase tracking-wider mb-1">Restated Concerns</p>
                        <p className="text-sm italic leading-relaxed text-[#444] font-serif">
                          {parsedAssessment.intro}
                        </p>
                      </div>
                    )}

                    {/* Possible Causes */}
                    {parsedAssessment.possibleCauses && (
                      <div className="space-y-2">
                        <h4 className="text-md font-serif font-black border-b border-[#1A1A1A]/20 pb-1 text-[#1A1A1A]">
                          {currentT.whatThisMayBe}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {cleanTextSection(parsedAssessment.possibleCauses).map((cause, idx) => (
                            <div key={idx} className="p-3 border border-[#1A1A1A] bg-white text-xs leading-relaxed text-[#333]">
                              <p className="font-serif italic font-bold text-sm text-[#2D5A27] mb-1">
                                Possibility {idx + 1}
                              </p>
                              <p className="leading-normal">{cause}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Checklist Actions & Warnings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-[#1A1A1A]/20 py-4">
                      {/* Safe actions checklist */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#2D5A27] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {currentT.whatYouCanDoNow}
                        </h4>
                        <div className="space-y-2">
                          {cleanTextSection(parsedAssessment.actionsNow).map((action, idx) => {
                            const isDone = !!completedSelfCare[action];
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleSelfCare(action)}
                                className={`w-full text-left p-2 border text-[11px] leading-relaxed transition-all flex items-start gap-2 ${
                                  isDone 
                                    ? "bg-green-50/70 border-green-300 text-green-900 line-through decoration-[#2D5A27]/40" 
                                    : "bg-white border-[#1A1A1A]/10 hover:border-[#2D5A27] text-[#333]"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5 ${
                                  isDone ? "bg-[#2D5A27] text-white border-[#2D5A27]" : "border-[#1A1A1A]/30 bg-white"
                                }`}>
                                  {isDone && "✓"}
                                </span>
                                <span>{action}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Warnings */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#D93025] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 animate-pulse-slow" />
                          {currentT.getUrgentHelpIf}
                        </h4>
                        <ul className="space-y-2 text-[11px] leading-relaxed text-[#333]">
                          {cleanTextSection(parsedAssessment.urgentHelpIf).map((flag, idx) => (
                            <li key={idx} className="p-2 bg-red-50/70 border border-red-200 text-red-950 font-medium flex items-start gap-1.5">
                              <span className="text-[#D93025] font-black shrink-0">!</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action triage level */}
                    {parsedAssessment.whenToSeeDoctor && (
                      <div className="bg-[#1A1A1A] text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-300 mb-0.5">
                            {currentT.whenToSeeDoctor}
                          </h4>
                          <p className="text-md font-serif italic text-white leading-snug">
                            {parsedAssessment.whenToSeeDoctor}
                          </p>
                        </div>
                        <a 
                          href="https://www.google.com/maps/search/hospital+near+me" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-4 py-2 border border-white text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-[#1A1A1A] transition-colors shrink-0"
                        >
                          Find Clinic Nearby
                        </a>
                      </div>
                    )}

                    {/* Interactive follow-up queries */}
                    {parsedAssessment.questions && (
                      <div className="p-4 border border-[#1A1A1A] bg-[#F7F3EF]">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#2D5A27] mb-2 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-[#2D5A27]" />
                          {currentT.toHelpNarrowThis}
                        </h4>
                        <p className="text-xs text-[#555] mb-3">
                          Select one of these clinical follow-up questions to append to your chat:
                        </p>
                        <div className="space-y-2">
                          {cleanTextSection(parsedAssessment.questions).map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInputValue(prev => {
                                  const divider = prev ? "\n" : "";
                                  return `${prev}${divider}Regarding "${q}": `;
                                });
                              }}
                              className="w-full text-left p-2.5 bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all text-xs flex justify-between items-center group"
                            >
                              <span className="group-hover:text-[#2D5A27] font-medium leading-relaxed">{q}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#2D5A27]" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="border-t border-[#1A1A1A]/10 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500 leading-normal">
                        {parsedAssessment.disclaimer}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <Heart className="w-12 h-12 text-[#2D5A27] animate-pulse-slow" />
                    <h4 className="text-md font-serif italic text-[#1A1A1A]">
                      No Diagnostic Report Prepared Yet
                    </h4>
                    <p className="text-xs text-[#666] max-w-xs leading-relaxed">
                      {currentT.noAssessmentYet}
                    </p>
                  </div>
                )}

              </div>

              {/* Split B: Detailed Conversation Area */}
              <div id="chat-thread" className="flex-1 flex flex-col bg-white">
                
                {/* Messages List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[420px]">
                  
                  {/* System Welcome */}
                  <div className="p-4 bg-[#F7F3EF] border border-[#1A1A1A] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#2D5A27] text-white flex items-center justify-center text-[10px] font-black font-serif italic">H</div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">HealTrust Pakistan</span>
                      <span className="text-[9px] uppercase font-bold opacity-40 ml-auto">System Active</span>
                    </div>
                    <p className="text-xs leading-relaxed font-serif text-[#1A1A1A]">
                      {selectedLanguage === "english" ? (
                        "Assalam-o-Alaikum. I am your safe, compassionate HealTrust Pakistan assistant. Describe your symptoms (e.g. fever, headache, body pain) and specify whether you are pregnant or have chronic conditions. I will instantly prepare a clinical report."
                      ) : selectedLanguage === "urdu" ? (
                        "السلام علیکم۔ میں آپ کا قابل اعتماد طبی معاون ہیل ٹرسٹ پاکستان ہوں۔ براہ کرم اپنی علامات کی تفصیل بتائیں، میں فوری طور پر طبی رپورٹ تیار کروں گا۔"
                      ) : (
                        "Assalam-o-Alaikum. Main aapka trustworthy HealTrust Pakistan assistant hoon. Apni tabiyat ke barey mein likhein ya upar diye gaye aam masail mein se koi select karein."
                      )}
                    </p>
                  </div>

                  {/* 12 Main Health Options Grid */}
                  {messages.length === 0 && (
                    <div className="space-y-2.5 mt-2">
                      <div className="text-[9px] uppercase font-black tracking-widest text-[#2D5A27] border-b border-[#2D5A27]/25 pb-1">
                        Select a Main Option / موضوع منتخب کریں:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {HEALTH_OPTIONS.map((opt) => (
                          <button
                            key={opt.name}
                            onClick={() => handleSendMessage(opt.query)}
                            className="flex items-center gap-2 p-2 bg-[#FDFCFB] hover:bg-[#F4F9F4] border border-[#1A1A1A]/20 hover:border-[#2D5A27] transition-all text-left group cursor-pointer"
                          >
                            <span className="p-1 bg-[#F7F3EF] group-hover:bg-[#E8F3E8] border border-[#1A1A1A]/10 rounded-xs shrink-0 flex items-center justify-center">
                              {getOptionIcon(opt.icon)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-800 group-hover:text-[#2D5A27] transition-colors line-clamp-1">
                              {opt.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div 
                        key={m.id} 
                        className={`flex flex-col space-y-1 max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold opacity-60">
                          {isUser ? <User className="w-3 h-3 text-slate-700" /> : <Heart className="w-3 h-3 text-[#2D5A27]" />}
                          <span>{isUser ? "Patient Inquiry" : "Health Guide Guidance"}</span>
                          <span>•</span>
                          <span>{m.timestamp.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                        </div>

                        <div className={`p-3.5 border-2 text-xs leading-relaxed ${
                          isUser 
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                            : "bg-white text-[#1A1A1A] border-[#2D5A27] font-serif"
                        }`}>
                          <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-center gap-2 mr-auto text-xs font-bold text-[#2D5A27] bg-[#F4F9F4] p-3 border border-[#2D5A27] animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{currentT.loading}</span>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-medium">
                      <p className="font-bold">Error Connecting to Medical Engine</p>
                      <p>{errorMsg}</p>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Text Area Input Area */}
                <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#F7F3EF] space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#1A1A1A]">
                    <span>Type Symptoms below in English, Urdu or Roman Urdu</span>
                    {messages.length > 0 && (
                      <button 
                        onClick={handleResetChat}
                        className="text-[9px] text-red-600 font-bold hover:underline"
                      >
                        Clear Chat History
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      id="symptom-input"
                      rows={3}
                      placeholder={currentT.placeholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        const isIntakeFormFilled = !!(patientAge.trim() || symptomDuration.trim() || otherConditions.trim() || painLevel > 0);
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!inputValue.trim() && isIntakeFormFilled) {
                            handleSendMessage(buildIntakeString());
                          } else {
                            handleSendMessage();
                          }
                        }
                      }}
                      className="flex-1 p-2.5 text-xs bg-white border border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#2D5A27] resize-none"
                    />

                    <button
                      id="submit-symptom-btn"
                      onClick={() => {
                        const isIntakeFormFilled = !!(patientAge.trim() || symptomDuration.trim() || otherConditions.trim() || painLevel > 0);
                        if (!inputValue.trim() && isIntakeFormFilled) {
                          handleSendMessage(buildIntakeString());
                        } else {
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading || (!inputValue.trim() && !(patientAge.trim() || symptomDuration.trim() || otherConditions.trim() || painLevel > 0))}
                      className="bg-[#2D5A27] hover:bg-[#1a3818] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 border-l-2 border-[#1A1A1A] transition-colors flex flex-col items-center justify-center gap-1.5 font-bold uppercase text-[10px] tracking-widest shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>

                  {/* Typing Assistants */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] uppercase font-bold opacity-40">Urdu Typing Assistants:</span>
                    {["Assalam-o-Alaikum", "Bukhar hai", "Sir mein dard hai", "Diarrhea ya vomiting hai", "Sardi lag rahi hai"].map((phrase) => (
                      <button 
                        key={phrase}
                        onClick={() => setInputValue(prev => prev + " " + phrase + " ")}
                        className="text-[10px] bg-white hover:bg-slate-100 px-2 py-0.5 border border-[#1A1A1A]/25"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>

                </div>

              </div>

            </div>

          </section>

        </main>
      )}

      {/* Facility A: Dynamic Pakistan Hospital & Labs Directory */}
      {activeTab === "hospital-finder" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl font-serif italic font-black text-[#2D5A27]">
              Pakistan Registered Hospital & Diagnostics Directory
            </h2>
            <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
              Find emergency departments, private medical complexes, charity clinics, and Chughtai/Dow labs nearby.
            </p>
          </div>

          {/* Filters Area */}
          <div className="bg-[#F7F3EF] border-2 border-[#1A1A1A] p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-[10px] uppercase font-bold mb-1">Search Hospital Name or Address</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g., Aga Khan, Chughtai Lab..." 
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                  className="w-full p-2 pl-8 text-xs bg-white border border-[#1A1A1A]"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold mb-1">Select City / Region</label>
              <select 
                value={hospitalCity}
                onChange={(e) => setHospitalCity(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-[#1A1A1A]"
              >
                <option value="all">All Pakistan Cities</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Multan">Multan</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold mb-1">Facility Type</label>
              <select 
                value={hospitalType}
                onChange={(e) => setHospitalType(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-[#1A1A1A]"
              >
                <option value="all">All Categories</option>
                <option value="Government Emergency">Government Emergency (Free)</option>
                <option value="Private Hospital">Private Hospital Complexes</option>
                <option value="Charity Trust Hospital">Charity Trust Hospital</option>
                <option value="Diagnostics Lab">Diagnostics Lab Networks</option>
              </select>
            </div>

            <div className="flex items-end justify-end">
              <span className="text-xs font-bold text-[#2D5A27] bg-[#F3F8F2] px-3 py-2 border border-[#2D5A27] w-full text-center">
                Showing {filteredHospitals.length} Clinical Stations
              </span>
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((h) => (
              <div key={h.id} className="border-2 border-[#1A1A1A] bg-white p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#2D5A27] bg-[#F3F8F2] px-2 py-0.5 border border-[#2D5A27]/20">
                      {h.type}
                    </span>
                    <span className="text-xs font-bold opacity-60 flex items-center gap-1 text-[#1A1A1A]">
                      <MapPin className="w-3 h-3 text-[#2D5A27]" />
                      {h.city}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A] leading-snug">
                    {h.name}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <strong>Address:</strong> {h.address}
                  </p>

                  <div className="mt-4 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Services & Lab Tests Available (Click for details & contacts):</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {h.labsAvailable.map((lab, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleLabClick(lab, h)}
                          className="text-[10px] bg-[#F7F3EF] border border-gray-200 px-2 py-0.5 font-medium hover:bg-[#2D5A27] hover:text-white hover:border-[#2D5A27] transition-all cursor-pointer text-left"
                          title={`Click to view price, timings & contact details for ${lab}`}
                        >
                          {lab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                  <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-[#2D5A27] shrink-0" />
                    <span>Ph:</span>
                    <a 
                      href={`tel:${h.phone.replace(/[^0-9+]/g, '')}`} 
                      className="underline text-slate-900 hover:text-[#2D5A27] font-semibold transition-colors cursor-pointer"
                      title="Click to call this medical facility"
                    >
                      {h.phone}
                    </a>
                  </div>
                  {h.is24_7 && (
                    <span className="text-[9px] uppercase tracking-widest font-bold bg-[#D93025] text-white px-2 py-1 rounded-xs animate-pulse-slow">
                      24/7 ER Open
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-red-50 border-2 border-[#D93025] text-xs text-red-950 font-medium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
            <div className="max-w-2xl">
              <strong>🚨 Emergency Reminder:</strong> In case of active cardiac arrest, deep surgical bleeding, loss of consciousness, or critical poisoning, bypass standard clinic lookups and immediately initiate emergency transport to the nearest tertiary care hospital.
            </div>
            <button
              type="button"
              onClick={() => handleTriggerRescue("Critical Cardiac/Trauma Emergency")}
              className="bg-[#D93025] hover:bg-black text-white px-4 py-2 uppercase font-black tracking-widest text-[10px] rounded-xs transition-colors shrink-0 cursor-pointer border-none"
            >
              Trigger Rescue 1122
            </button>
          </div>
        </main>
      )}

      {/* Facility B: Dynamic Medication Safety Directory */}
      {activeTab === "med-safety" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-8">
          
          {/* Left Split: Medications list and search */}
          <section className="w-full lg:w-1/3 flex flex-col space-y-4 shrink-0">
            <div className="border-b border-[#1A1A1A] pb-2">
              <h2 className="text-2xl font-serif italic font-black text-[#2D5A27] flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                Global Medicine Search
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-[#555]">
                Search local & global medication formulations instantly.
              </p>
            </div>

            {/* Explanatory callout for Global Pharmacopeia support */}
            <div className="p-3 bg-[#F4F9F2] border-l-4 border-[#2D5A27] text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#2D5A27]" />
                Any Medicine in the World
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                You can search for <strong>any pharmaceutical medicine or active drug brand worldwide</strong> (e.g., <em>Ozempic, Lipitor, Amoxicillin, Ventolin, Metformin, Augmentin, Brufen</em>). Our Clinical AI analyzes chemical components, pediatric guidelines, side effects, and translates benefits into Urdu.
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (medSearch.trim()) {
                  const query = medSearch.toLowerCase().trim();
                  const match = allMedications.find(m => 
                    m.brandNames.some(b => b.toLowerCase() === query || query === b.toLowerCase() || query.includes(b.toLowerCase())) ||
                    m.genericName.toLowerCase() === query || query === m.genericName.toLowerCase() || query.includes(m.genericName.toLowerCase())
                  );
                  if (match) {
                    setSelectedMedId(match.id);
                  } else {
                    handleAiMedLookup(medSearch);
                  }
                  setMedSearchFocus(false);
                }
              }}
              className="flex gap-2 relative"
            >
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Type ANY medicine name (e.g., Ozempic)..." 
                  value={medSearch}
                  onChange={(e) => {
                    setMedSearch(e.target.value);
                    setMedSearchFocus(true);
                  }}
                  onFocus={() => setMedSearchFocus(true)}
                  onBlur={() => setTimeout(() => setMedSearchFocus(false), 250)}
                  className="w-full p-2.5 pl-8 pr-8 text-xs bg-white border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
                <Search className="w-4 h-4 absolute left-2.5 top-3.5 text-gray-400" />
                
                {medSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setMedSearch("");
                      setMedSearchFocus(false);
                    }}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-black border-none bg-transparent cursor-pointer p-0"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Autocomplete / Suggestions Dropdown Overlay */}
                {medSearchFocus && medSearch.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border-2 border-[#1A1A1A] max-h-60 overflow-y-auto z-50 shadow-lg divide-y divide-gray-100">
                    {allMedications
                      .filter(m => 
                        m.brandNames.some(b => b.toLowerCase().includes(medSearch.toLowerCase())) ||
                        m.genericName.toLowerCase().includes(medSearch.toLowerCase())
                      )
                      .slice(0, 5)
                      .map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onMouseDown={() => {
                            setSelectedMedId(m.id);
                            setMedSearch(m.brandNames[0]);
                            setMedSearchFocus(false);
                          }}
                          className="w-full text-left p-2 hover:bg-[#F7F3EF] transition-colors flex justify-between items-center text-xs cursor-pointer border-none"
                        >
                          <div>
                            <span className="font-bold text-[#1A1A1A]">{m.brandNames.join(" / ")}</span>
                            <span className="text-[10px] text-gray-500 block">{m.genericName}</span>
                          </div>
                          <span className="text-[9px] bg-[#2D5A27]/10 text-[#2D5A27] px-1.5 py-0.5 uppercase tracking-wider font-semibold">
                            Select
                          </span>
                        </button>
                      ))}
                    {/* Dynamic AI Clinical Search option */}
                    <button
                      type="button"
                      onMouseDown={() => {
                        handleAiMedLookup(medSearch);
                        setMedSearchFocus(false);
                      }}
                      className="w-full text-left p-2 bg-[#F4F9F2] hover:bg-[#EAF3E7] text-[#2D5A27] font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Lookup "{medSearch}" on Clinical AI</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={aiMedLoading}
                className="bg-[#2D5A27] hover:bg-black text-white text-[10px] font-bold uppercase px-3 tracking-wider border-none cursor-pointer flex items-center gap-1 shrink-0"
                title="Search locally or run real-time Clinical AI lookup for any medicine globally"
              >
                {aiMedLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    AI Search
                  </>
                )}
              </button>
            </form>

            {/* Quick search tags matching user needs */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Filter Categories:</span>
              <div className="flex flex-wrap gap-1.5 py-1">
                {[
                  { label: "Clear", value: "" },
                  { label: "Fever & Pain", value: "fever" },
                  { label: "Allergy / Itch", value: "allergy" },
                  { label: "Stomach / Motions", value: "stomach" },
                  { label: "Acidity", value: "acid" },
                  { label: "Asthma Inhaler", value: "asthma" },
                  { label: "Sugar / Diabetes", value: "sugar" },
                  { label: "Blood Thinner", value: "blood" },
                  { label: "Antibiotics", value: "antibiotic" }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setMedSearch(chip.value)}
                    className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                      (chip.value === "" && medSearch === "") || (chip.value !== "" && medSearch.toLowerCase() === chip.value.toLowerCase())
                        ? "bg-[#2D5A27] text-white border-black"
                        : "bg-white text-slate-700 border-slate-200 hover:border-black hover:bg-slate-50"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Global Sample Lookups - CLICK TO TRY ANY MEDICINE IN THE WORLD */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/50 space-y-1.5 text-left">
              <span className="text-[9px] uppercase tracking-wider text-[#9E6E16] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Global Clinical AI Samples (Click to test any):
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  "Triazolam", "Ozempic", "Lipitor", "Amoxicillin", "Ventolin", "Metformin", 
                  "Augmentin", "Aspirin", "Panadol", "Flagyl", "Brufen", "Zantac"
                ].map((sample) => {
                  const match = allMedications.find(m => m.brandNames.some(b => b.toLowerCase() === sample.toLowerCase()));
                  return (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setMedSearch(sample);
                        if (match) {
                          setSelectedMedId(match.id);
                        } else {
                          handleAiMedLookup(sample);
                        }
                      }}
                      className={`px-1.5 py-0.5 text-[9px] font-bold border rounded-xs cursor-pointer transition-all ${
                        medSearch.toLowerCase() === sample.toLowerCase() || (match && selectedMedId === match.id)
                          ? "bg-[#2D5A27] text-white border-[#2D5A27]"
                          : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
                      }`}
                    >
                      {sample}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Generator Promo / Fallback Card */}
            {medSearch.trim().length > 1 && (
              <div className="p-3 border-2 border-dashed border-[#2D5A27] bg-[#F4F9F2] text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-serif italic font-bold text-[#2D5A27]">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  Clinical AI Analysis: "{medSearch}"
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Analyze dynamic clinical data, pediatric safety guidelines, global formulations, side effects, and comprehensive patient info.
                </p>
                <button
                  type="button"
                  disabled={aiMedLoading}
                  onClick={() => handleAiMedLookup(medSearch)}
                  className="w-full bg-[#2D5A27] hover:bg-black text-white text-[10px] py-1.5 px-3 font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1 cursor-pointer border-none"
                >
                  {aiMedLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-white shrink-0" />
                      Analyzing drug compounds...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                      Generate safety guide via AI
                    </>
                  )}
                </button>
              </div>
            )}

            {medSearch && (
              <div className="flex justify-between items-center bg-[#F7F3EF] border border-[#2D5A27]/20 p-2 text-[10px] text-slate-700 rounded-xs mb-2">
                <span>Showing search results for: <strong className="text-[#2D5A27]">"{medSearch}"</strong></span>
                <button 
                  type="button" 
                  onClick={() => {
                    setMedSearch("");
                    setMedSearchFocus(false);
                  }}
                  className="text-red-700 font-extrabold hover:underline bg-transparent border-none p-0 cursor-pointer uppercase tracking-wider text-[9px] flex items-center gap-0.5"
                >
                  <X className="w-3 h-3" />
                  Clear Filter
                </button>
              </div>
            )}

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {filteredMedications.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-[#2D5A27]/20 bg-[#F4F9F2]/50 text-center space-y-3 rounded-xs">
                  <p className="text-xs text-slate-500 italic">"{medSearch}" is not in the local quick-list.</p>
                  <button
                    type="button"
                    disabled={aiMedLoading}
                    onClick={() => handleAiMedLookup(medSearch)}
                    className="w-full bg-[#2D5A27] hover:bg-black text-white text-[10px] py-2 px-3 font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm"
                  >
                    {aiMedLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        Searching Global Database...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Search "{medSearch}" Globally on Clinical AI
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    Our Clinical AI will instantly parse chemical structures, safety protocols, pros & cons, and patient benefits.
                  </p>
                </div>
              ) : (
                filteredMedications.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMedId(med.id)}
                    className={`w-full text-left p-3 border-2 transition-all flex flex-col justify-between ${
                      selectedMedId === med.id 
                        ? "bg-[#F7F3EF] border-[#2D5A27]" 
                        : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] uppercase tracking-wider bg-[#2D5A27]/10 text-[#2D5A27] px-1.5 py-0.5 font-bold">
                        {med.brandNames[0]}
                      </span>
                      <span className="text-[10px] text-[#555] font-bold">
                        {med.usageCategory.length > 25 ? `${med.usageCategory.substring(0, 25)}...` : med.usageCategory}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-serif font-bold text-[#1a1a1a] mt-1">
                      {med.genericName}
                    </h4>
                    
                    <p className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-1">
                      {med.urduUsage}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Right Split: Medication Detail Viewer */}
          <section className="flex-1 bg-white border-4 border-[#1A1A1A] p-6 space-y-6">
            {aiMedLoading ? (
              <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-amber-500 absolute top-5 left-5 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Consulting Global Clinical Database...</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Analyzing active compound molecular safety, pediatric guidelines, advantages, disadvantages, and contraindications for <strong className="text-[#2D5A27]">"{medSearch || "requested medicine"}"</strong>.
                  </p>
                </div>
                <div className="flex gap-2 text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 animate-pulse">
                  <span>Pharmacopeia API</span> • <span>Bilingual Translation</span> • <span>Safe Dosage</span>
                </div>
              </div>
            ) : filteredMedications.length === 0 && medSearch.trim().length > 0 ? (
              <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-8 space-y-6 my-auto">
                <div className="p-5 bg-[#F4F9F2]/60 border-2 border-dashed border-[#2D5A27]/20 rounded-xs max-w-md">
                  <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce mb-3" />
                  <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A] mb-1.5">"{medSearch}" Not in Local Quick-List</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our pre-compiled quick-list contains 17 common essential Pakistani medicines. However, our <strong>Global Clinical AI</strong> can analyze any pharmaceutical formula or brand in the world instantly!
                  </p>
                </div>

                <div className="space-y-3 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => handleAiMedLookup(medSearch)}
                    className="w-full bg-[#2D5A27] hover:bg-black text-white text-xs py-3 px-4 font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer border-none shadow-md animate-pulse"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Lookup "{medSearch}" Globally on Clinical AI
                  </button>

                  <p className="text-[10px] text-slate-400">
                    Clinical AI will analyze active compounds, safety profiles, pediatric dosage limits, and translate uses into Urdu.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#2D5A27] bg-[#F3F8F2] px-2 py-0.5 border border-[#2D5A27]/20">
                  {selectedMed.usageCategory}
                </span>
                <h1 className="text-3xl font-serif italic font-black text-[#1A1A1A] mt-1">
                  {selectedMed.brandNames.join(" / ")}
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Generic Active Formula: <strong>{selectedMed.genericName}</strong>
                </p>
              </div>

              <div className={`px-4 py-2 border text-xs font-black uppercase text-center ${
                selectedMed.pregnancySafety === "Strictly Avoid" ? "bg-red-50 text-red-700 border-red-300" :
                selectedMed.pregnancySafety === "Safe under advice" ? "bg-green-50 text-green-700 border-green-300" :
                "bg-amber-50 text-amber-700 border-amber-300"
              }`}>
                Pregnancy: {selectedMed.pregnancySafety}
              </div>
            </div>

            {/* Urdu Translations for accessibility */}
            <div className="p-4 bg-[#F4F9F4] border-l-4 border-[#2D5A27] space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-[#2D5A27] font-bold">عام اردو استعمال (Purpose of Use)</p>
              <p className="text-lg font-urdu leading-relaxed text-[#1a1a1a] text-right">
                {selectedMed.urduUsage}
              </p>
            </div>

            {/* Detailed Description */}
            {selectedMed.description && (
              <div className="p-4 bg-slate-50 border border-[#1A1A1A]/10 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#2D5A27]" />
                  Medical Description
                </h4>
                <p className="text-xs leading-relaxed text-slate-700 font-sans">
                  {selectedMed.description}
                </p>
              </div>
            )}

            {/* Clinical Uses & Urdu Benefits */}
            {((selectedMed.usesAndBenefits && selectedMed.usesAndBenefits.length > 0) || selectedMed.urduBenefits) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border-2 border-[#2D5A27]/20 bg-[#FBFDFB] space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2D5A27] flex items-center gap-1.5 border-b border-[#2D5A27]/10 pb-1.5">
                    <BookmarkCheck className="w-4 h-4 text-[#2D5A27]" />
                    Clinical Uses & Benefits
                  </h4>
                  {selectedMed.usesAndBenefits && selectedMed.usesAndBenefits.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                      {selectedMed.usesAndBenefits.map((use, i) => (
                        <li key={i}>{use}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">Detailed clinical uses not populated.</p>
                  )}
                </div>

                <div className="p-4 border-2 border-[#2D5A27]/20 bg-[#FBFDFB] space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2D5A27] flex items-center gap-1.5 border-b border-[#2D5A27]/10 pb-1.5">
                      <BookOpen className="w-4 h-4 text-[#2D5A27]" />
                      فوائد اور اثرات (Urdu Summary)
                    </h4>
                    <p className="text-sm font-urdu leading-relaxed text-right text-[#1A1A1A] mt-2">
                      {selectedMed.urduBenefits || "اس دوا کے طبی فوائد، استعمال اور اثرات کی تفصیلی معلومات فراہم کردہ گائیڈ میں دیکھی جا سکتی ہیں۔"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Advantages & Disadvantages */}
            {((selectedMed.advantages && selectedMed.advantages.length > 0) || (selectedMed.disadvantages && selectedMed.disadvantages.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border-2 border-[#2D5A27]/20 bg-[#F4F9F2] space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2D5A27] flex items-center gap-1.5 border-b border-[#2D5A27]/10 pb-1.5">
                    <CheckCircle className="w-4 h-4 text-[#2D5A27]" />
                    Therapeutic Advantages & Strengths (Pros)
                  </h4>
                  {selectedMed.advantages && selectedMed.advantages.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                      {selectedMed.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">Standard clinical advantages apply.</p>
                  )}
                </div>

                <div className="p-4 border-2 border-red-200/50 bg-red-50/10 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5 border-b border-red-200/20 pb-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Clinical Limitations & Drawbacks (Cons)
                  </h4>
                  {selectedMed.disadvantages && selectedMed.disadvantages.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                      {selectedMed.disadvantages.map((dis, i) => (
                        <li key={i}>{dis}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">Clinical precautions apply.</p>
                  )}
                </div>
              </div>
            )}

            {/* Side Effects & Precautions */}
            {((selectedMed.sideEffects && selectedMed.sideEffects.length > 0) || (selectedMed.clinicalPrecautions && selectedMed.clinicalPrecautions.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-[#1A1A1A]/10 bg-slate-50/50 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 border-b border-black/5 pb-1.5">
                    <Activity className="w-4 h-4 text-amber-600" />
                    Possible Side Effects
                  </h4>
                  {selectedMed.sideEffects && selectedMed.sideEffects.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                      {selectedMed.sideEffects.map((effect, i) => (
                        <li key={i}>{effect}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">Common mild symptoms may occur.</p>
                  )}
                </div>

                <div className="p-4 border border-[#1A1A1A]/10 bg-slate-50/50 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 border-b border-black/5 pb-1.5">
                    <Shield className="w-4 h-4 text-[#2D5A27]" />
                    Clinical Precautions
                  </h4>
                  {selectedMed.clinicalPrecautions && selectedMed.clinicalPrecautions.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                      {selectedMed.clinicalPrecautions.map((precaution, i) => (
                        <li key={i}>{precaution}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">Consult your doctor before altering doses.</p>
                  )}
                </div>
              </div>
            )}

            {/* Dosage Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-[#1A1A1A] bg-[#F7F3EF] space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 border-b border-black/10 pb-1.5">
                  <User className="w-4 h-4 text-[#2D5A27]" />
                  Standard Adult Dosage Guidelines
                </h3>
                <p className="text-xs leading-relaxed text-gray-700">
                  {selectedMed.safeDosageAdult}
                </p>
              </div>

              <div className="p-4 border border-[#1A1A1A] bg-[#F7F3EF] space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 border-b border-black/10 pb-1.5">
                  <Heart className="w-4 h-4 text-[#2D5A27]" />
                  Standard Child Dosage Reference
                </h3>
                <p className="text-xs leading-relaxed text-gray-700">
                  {selectedMed.safeDosageChild}
                </p>
              </div>
            </div>

            {/* Critical Clinical Alerts */}
            <div className="p-4 bg-red-50 border border-red-300 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D93025] animate-pulse-slow" />
                Critical Clinical Overdose Alerts (Warnings)
              </h3>
              <p className="text-xs leading-relaxed text-red-950 font-bold">
                {selectedMed.criticalAlerts}
              </p>
              <p className="text-sm font-urdu leading-normal text-right text-red-950 border-t border-red-200/50 pt-2">
                {selectedMed.urduAlerts}
              </p>
            </div>

            <div className="border-t border-[#1A1A1A]/15 pt-4">
              <p className="text-[10px] text-[#555] font-bold leading-relaxed uppercase">
                * CLINICAL STIPULATION: NEVER prescribe or distribute antibiotic courses or prescription-only pain medication (NSAIDS) arbitrarily without professional assessment. Always seek direct counsel from an authorized pharmacist or registered medical doctor before starting children or elderly patients on ongoing drug therapies.
              </p>
            </div>
          </>
        )}
      </section>
        </main>
      )}



         {/* Facility D: Personal Health Record / Symptom Log Diary */}
      {activeTab === "health-diary" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-8">
          
          {/* Left panel: Log Daily Symptoms Form & Presets */}
          <section className="w-full lg:w-[360px] space-y-6 shrink-0 text-left">
            <div className="border-b-2 border-[#1A1A1A] pb-2">
              <h2 className="text-2xl font-serif italic font-black text-[#2D5A27] flex items-center gap-1.5">
                <BookOpen className="w-5.5 h-5.5 text-[#2D5A27]" />
                Log Daily Symptoms
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-[#555]">
                Save logs locally to monitor health trends & trigger AI guidance.
              </p>
            </div>

            {diaryFeedback && (
              <div className="p-3 bg-green-50 border border-green-300 text-green-900 text-xs font-bold rounded-sm animate-fade-in">
                {diaryFeedback}
              </div>
            )}

            {/* Quick Symptom Presets (Side Options) */}
            <div className="border-2 border-[#1A1A1A] p-3.5 bg-white space-y-2">
              <span className="text-[9px] uppercase tracking-wider font-black text-slate-500 block">
                ⚡ Quick Symptom Presets (آسان فارم بھریں):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Migraine", symptom: "Throbbing headache & light sensitivity", pain: 7, fever: "No Fever" as const, duration: "1 day", notes: "Felt dizzy. Rested in a dark quiet room." },
                  { label: "Sore Throat", symptom: "Dry throat, painful swallowing & cough", pain: 4, fever: "Mild Fever" as const, duration: "2 days", notes: "Drinking warm honey lemon water." },
                  { label: "Stomach Flu", symptom: "Abdominal cramps & mild nausea", pain: 5, fever: "No Fever" as const, duration: "12 hours", notes: "Taking ORS fluid, avoiding solid greasy foods." },
                  { label: "High Fever", symptom: "Shivering, body aches & hot skin", pain: 6, fever: "High Fever" as const, duration: "3 days", notes: "Taking Paracetamol every 6 hours and sponge bathing." },
                  { label: "Allergy Rash", symptom: "Skin rash, intense sneezing & itchy eyes", pain: 2, fever: "No Fever" as const, duration: "Since morning", notes: "Avoided pollen dust, took anti-histamine tablet." }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setDiarySymptom(preset.symptom);
                      setDiaryPain(preset.pain);
                      setDiaryFever(preset.fever);
                      setDiaryDuration(preset.duration);
                      setDiaryNotes(preset.notes);
                      setDiaryFeedback(`Applied preset: ${preset.label}! Form auto-filled.`);
                      setTimeout(() => setDiaryFeedback(null), 3000);
                    }}
                    className="px-2 py-1 bg-slate-50 border border-[#1A1A1A]/10 hover:border-[#2D5A27] hover:bg-[#F4F9F4] text-[10px] font-bold text-slate-700 hover:text-[#2D5A27] transition-all cursor-pointer rounded-xs"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddDiaryLog} className="border-2 border-[#1A1A1A] p-4 bg-[#F7F3EF] space-y-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">Primary Symptom / Complaint *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mild headache, throat irritation" 
                  required
                  value={diarySymptom}
                  onChange={(e) => setDiarySymptom(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">Pain Severity (0-10)</label>
                  <select 
                    value={diaryPain} 
                    onChange={(e) => setDiaryPain(parseInt(e.target.value))}
                    className="w-full p-1.5 text-xs bg-white border border-[#1A1A1A]"
                  >
                    {[...Array(11).keys()].map(n => (
                      <option key={n} value={n}>Scale {n}/10</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">Fever Presence</label>
                  <select 
                    value={diaryFever} 
                    onChange={(e) => setDiaryFever(e.target.value as any)}
                    className="w-full p-1.5 text-xs bg-white border border-[#1A1A1A]"
                  >
                    <option value="No Fever">No Fever</option>
                    <option value="Mild Fever">Mild Fever (&lt;101 F)</option>
                    <option value="High Fever">High Fever (&gt;101 F)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">Duration of Symptom</label>
                <input 
                  type="text" 
                  placeholder="e.g., 3 days, since morning" 
                  value={diaryDuration}
                  onChange={(e) => setDiaryDuration(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1A1A1A] mb-1">Home Care Actions / Notes</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Took Panadol, rested, drank water." 
                  value={diaryNotes}
                  onChange={(e) => setDiaryNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#1A1A1A] focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2D5A27] hover:bg-[#1a3818] text-white font-bold text-xs uppercase tracking-widest py-2.5 transition-colors border-2 border-black cursor-pointer shadow-sm"
              >
                Add Entry to Diary
              </button>
            </form>

            {/* Interactive Stats & Triage Advisory Panel */}
            {filteredDiaryLogs.length > 0 && (
              <div className="border-2 border-[#1A1A1A] p-4 bg-[#FDFCFB] space-y-3.5">
                <span className="text-[9px] uppercase tracking-wider font-black text-slate-500 block">
                  📈 Diary History Analytics (صحت کا جائزہ):
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 border border-slate-200 bg-slate-50">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Total Logs</span>
                    <span className="text-xl font-bold text-slate-800">{filteredDiaryLogs.length}</span>
                  </div>
                  <div className="p-2 border border-slate-200 bg-slate-50">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Max Pain Level</span>
                    <span className={`text-xl font-bold ${
                      Math.max(...filteredDiaryLogs.map(l => l.painLevel)) >= 7 ? "text-red-600" : "text-[#2D5A27]"
                    }`}>
                      {Math.max(...filteredDiaryLogs.map(l => l.painLevel))}/10
                    </span>
                  </div>
                </div>

                {/* Patient Triage Advisor */}
                {(() => {
                  const hasHighFever = filteredDiaryLogs.some(l => l.fever === "High Fever");
                  const hasSeverePain = filteredDiaryLogs.some(l => l.painLevel >= 7);
                  
                  let advisoryTitle = "Stable Health Trend";
                  let advisoryTitleUr = "مستحکم صحت کی صورتحال";
                  let advisoryColor = "bg-[#F4F9F4] text-[#2D5A27] border-[#2D5A27]/20";
                  let advisoryDesc = "Your logged symptoms reflect a mild or localized profile. Continue monitoring, rest, and keep hydrated.";
                  let isModerateOrHigh = false;

                  if (hasHighFever || (hasSeverePain && filteredDiaryLogs.length >= 2)) {
                    advisoryTitle = "High Triage Advisory";
                    advisoryTitleUr = "فوری طبی مشورہ";
                    advisoryColor = "bg-red-50 text-red-800 border-red-200 animate-pulse";
                    advisoryDesc = "Multiple severe logs (high fever or pain >= 7) indicate active systemic inflammation. Consider booking an active doctor consult.";
                    isModerateOrHigh = true;
                  } else if (hasSeverePain || filteredDiaryLogs.some(l => l.fever === "Mild Fever")) {
                    advisoryTitle = "Moderate Triage Advisory";
                    advisoryTitleUr = "معتدل علامات - نگرانی کریں";
                    advisoryColor = "bg-amber-50 text-amber-800 border-amber-200";
                    advisoryDesc = "Moderate symptoms recorded. Ensure you follow standard home remedies and seek medical advice if they persist beyond 48 hours.";
                    isModerateOrHigh = true;
                  }

                  return (
                    <div className={`p-3 border text-xs rounded-sm space-y-1.5 ${advisoryColor}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wide">{advisoryTitle}</span>
                        <span className="font-urdu text-[11px] font-bold">{advisoryTitleUr}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{advisoryDesc}</p>
                      
                      {isModerateOrHigh && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSpecialty("General Physician / Family Medicine");
                            setPlannerCustomQuestions([]);
                            setActiveTab("doctor-planner");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full mt-1.5 py-1 bg-white hover:bg-slate-50 border border-current text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center block"
                        >
                          Find Matching Specialist
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </section>

          {/* Right panel: Health Diary History List with Advanced Filter Options */}
          <section className="flex-1 bg-white border-2 border-[#1A1A1A] p-4 sm:p-6 space-y-4 text-left">
            <div className="border-b-2 border-[#1A1A1A] pb-3 flex justify-between items-start flex-col sm:flex-row gap-4">
              <div>
                <h3 className="text-xl font-serif italic font-black text-[#1A1A1A]">
                  Saved Medical Records Diary
                </h3>
                <p className="text-xs text-[#555] uppercase tracking-wider">
                  Reviewing history for: <strong className="text-[#2D5A27]">{currentUser ? currentUser.name : "Guest Session"}</strong>
                </p>
              </div>

              {/* Advanced Interactive Control Options */}
              {diaryLogs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {/* Export JSON option */}
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredDiaryLogs, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "patient_health_diary.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    title="Export logs as JSON"
                    className="px-2.5 py-1.5 border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest bg-white hover:bg-[#F7F3EF] flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                    JSON
                  </button>

                  {/* Export CSV option */}
                  <button
                    onClick={() => {
                      if (filteredDiaryLogs.length === 0) return;
                      const headers = ["Date/Time", "Primary Symptom", "Pain Level", "Fever", "Duration", "Notes", "AI Guidance"];
                      const rows = filteredDiaryLogs.map(log => [
                        log.timestamp,
                        `"${log.primarySymptom.replace(/"/g, '""')}"`,
                        log.painLevel,
                        log.fever,
                        `"${log.duration.replace(/"/g, '""')}"`,
                        `"${(log.notes || "").replace(/"/g, '""')}"`,
                        `"${(log.assessmentText || "").replace(/"/g, '""')}"`
                      ]);
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", encodeURI(csvContent));
                      downloadAnchor.setAttribute("download", "patient_health_diary.csv");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    title="Export logs as spreadsheet CSV"
                    className="px-2.5 py-1.5 border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest bg-white hover:bg-[#F7F3EF] flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2D5A27]" />
                    CSV Excel
                  </button>

                  {/* Print Document Option */}
                  <button
                    onClick={() => window.print()}
                    title="Print report directly"
                    className="px-2.5 py-1.5 border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest bg-white hover:bg-[#F7F3EF] flex items-center gap-1 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Print
                  </button>

                  {/* Clear All Logs Action Option */}
                  <button
                    onClick={async () => {
                      const confirmClear = window.confirm("Are you sure you want to permanently delete all your diary logs? This cannot be undone.");
                      if (!confirmClear) return;
                      const remaining = diaryLogs.filter(log => 
                        currentUser ? log.userId !== currentUser.id : log.userId !== "guest"
                      );
                      setDiaryLogs(remaining);
                      saveLogsToStorage(remaining);
                      if (currentUser) {
                        try {
                          await fetch("/api/supabase/diary/clear", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: currentUser.id })
                          });
                        } catch (e) {
                          console.error("Error clearing diary logs on server:", e);
                        }
                      }
                      setDiaryFeedback("All diary logs cleared successfully.");
                      setTimeout(() => setDiaryFeedback(null), 3000);
                    }}
                    title="Delete entire diary history"
                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] uppercase font-bold tracking-widest text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Filters Dashboard Bar (Fully Functional!) */}
            <div className="bg-slate-50 border border-slate-200 p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search symptom or notes..."
                  value={diarySearchQuery}
                  onChange={(e) => setDiarySearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              {/* Minimum Pain severity selection filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">Min Pain:</span>
                <select
                  value={diaryPainFilter}
                  onChange={(e) => setDiaryPainFilter(e.target.value)}
                  className="w-full p-1.5 text-xs bg-white border border-slate-300"
                >
                  <option value="all">Any Pain (0+)</option>
                  <option value="3">Mild (3+)</option>
                  <option value="5">Moderate (5+)</option>
                  <option value="7">Severe (7+)</option>
                  <option value="9">Extreme (9+)</option>
                </select>
              </div>

              {/* Fever presence selection filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">Fever:</span>
                <select
                  value={diaryFeverFilter}
                  onChange={(e) => setDiaryFeverFilter(e.target.value)}
                  className="w-full p-1.5 text-xs bg-white border border-slate-300"
                >
                  <option value="all">All Logs</option>
                  <option value="No Fever">No Fever</option>
                  <option value="Mild Fever">Mild Fever</option>
                  <option value="High Fever">High Fever</option>
                </select>
              </div>
            </div>

            {/* Active Filters Clear Indicators */}
            {(diarySearchQuery || diaryPainFilter !== "all" || diaryFeverFilter !== "all") && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 rounded-sm">
                <p>
                  Showing filtered logs where: 
                  {diarySearchQuery && ` Keyword matches "${diarySearchQuery}"`}
                  {diaryPainFilter !== "all" && ` • Pain Level >= ${diaryPainFilter}`}
                  {diaryFeverFilter !== "all" && ` • Fever is "${diaryFeverFilter}"`}
                </p>
                <button
                  onClick={() => {
                    setDiarySearchQuery("");
                    setDiaryPainFilter("all");
                    setDiaryFeverFilter("all");
                  }}
                  className="text-[10px] uppercase font-black tracking-widest text-amber-950 underline hover:no-underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
              {filteredDiaryLogs.map((log) => (
                <div key={log.id} className="border-2 border-[#1A1A1A] bg-white p-4 space-y-3 relative">
                  <button 
                    onClick={() => handleDeleteDiaryLog(log.id)}
                    className="absolute right-4 top-4 p-1.5 hover:bg-red-50 text-red-600 rounded-sm border border-transparent hover:border-red-100 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-[#555]">
                    <span className="font-mono">{log.timestamp}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                      log.fever !== "No Fever" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {log.fever}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-[#2D5A27]">Pain Severity: {log.painLevel}/10</span>
                  </div>

                  <div>
                    <h4 className="text-md font-serif font-black text-[#1a1a1a]">
                      {log.primarySymptom}
                    </h4>
                    {log.duration && (
                      <p className="text-xs text-slate-500 italic mt-0.5">Duration: {log.duration}</p>
                    )}
                  </div>

                  {log.notes && (
                    <div className="bg-[#F7F3EF] p-2.5 border border-[#1A1A1A]/10 text-xs text-gray-700 leading-relaxed">
                      <strong>My Notes:</strong> {log.notes}
                    </div>
                  )}

                  {log.assessmentText && (
                    <div className="p-2.5 border-l-4 border-[#2D5A27] bg-[#F4F9F4] text-xs text-[#2D5A27] italic">
                      <strong>AI System Guidance Summary:</strong> {log.assessmentText}
                    </div>
                  )}
                </div>
              ))}

              {filteredDiaryLogs.length === 0 && (
                <div className="text-center py-12 space-y-2">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-serif italic text-slate-500 text-md">Your Medical Diary is currently empty</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Log your daily symptoms using the form on the left, or query the AI Symptom Assessor and click "Save to Diary" to instantly build your records.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* Facility E: First Aid guides & Urgent Triage */}
      {activeTab === "first-aid" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
          <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
            <div>
              <h2 className="text-3xl font-serif italic font-black text-[#2D5A27]">
                Rescue 1122 Verified First Aid Guides
              </h2>
              <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
                Vital, actionable steps for life-threatening emergencies before the ambulance arrives.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTriggerRescue("First Aid Incident")}
              className="bg-[#D93025] hover:bg-[#b0221a] text-white px-4 py-2.5 uppercase font-black tracking-widest text-[11px] rounded-xs flex items-center gap-2 border border-black shadow-xs cursor-pointer animate-pulse shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Request Dispatch (1122)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Guide 1 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-black/10 pb-2">
                <span className="text-[10px] uppercase font-black text-[#D93025] bg-red-50 border border-red-200 px-2 py-0.5">Critical Emergency</span>
                <span className="text-xs font-bold opacity-50">CPR Step</span>
              </div>
              <h3 className="text-lg font-serif italic font-bold">Adult Cardiopulmonary Resuscitation (CPR)</h3>
              <ul className="space-y-2 text-xs leading-relaxed text-gray-700">
                <li><strong>1. Verify Response:</strong> Shake shoulders, yell "Are you okay?". Check chest rise.</li>
                <li><strong>2. Call 1122:</strong> Ask bystander to call Rescue 1122 immediately.</li>
                <li><strong>3. Hand Placement:</strong> Interlock hands in center of victim's breastbone.</li>
                <li><strong>4. Compress:</strong> Push hard and fast (2 inches deep, 100-120 compressions/min).</li>
                <li><strong>5. Keep going:</strong> Do not stop until professional medics arrive.</li>
              </ul>
            </div>

            {/* Guide 2 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-black/10 pb-2">
                <span className="text-[10px] uppercase font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5">Severe Weather</span>
                <span className="text-xs font-bold opacity-50">Heatstroke</span>
              </div>
              <h3 className="text-lg font-serif italic font-bold">Heat Exhaustion & Heatstroke Care</h3>
              <ul className="space-y-2 text-xs leading-relaxed text-gray-700">
                <li><strong>1. Move to Shade:</strong> Move patient to a cool, air-conditioned or shaded room immediately.</li>
                <li><strong>2. Active Cooling:</strong> Pour cool tap water on their chest and head, fan aggressively.</li>
                <li><strong>3. Fluid Rehydration:</strong> Give ORS water if conscious. Never pour water down unconscious mouth.</li>
                <li><strong>4. Loosen clothes:</strong> Remove tight waistbands, collars, socks.</li>
                <li><strong>5. Alert ER:</strong> If they have a high fever or act confused, call 1122 immediately.</li>
              </ul>
            </div>

            {/* Guide 3 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-black/10 pb-2">
                <span className="text-[10px] uppercase font-black text-[#2D5A27] bg-[#F3F8F2] border border-green-200 px-2 py-0.5">Choking First Aid</span>
                <span className="text-xs font-bold opacity-50">Heimlich</span>
              </div>
              <h3 className="text-lg font-serif italic font-bold">Heimlich Maneuver (Choking)</h3>
              <ul className="space-y-2 text-xs leading-relaxed text-gray-700">
                <li><strong>1. Confirm Choking:</strong> Ask "Are you choking?". Look for hands around throat.</li>
                <li><strong>2. Wrap Arms:</strong> Stand behind them, wrap your arms around their waist.</li>
                <li><strong>3. Fist Placement:</strong> Make a fist with one hand, place thumb-side above their belly button.</li>
                <li><strong>4. Thrusts:</strong> Grasp your fist with other hand. Push inward & upward sharply.</li>
                <li><strong>5. Baby Choking:</strong> Alternate 5 back blows and 5 quick chest thrusts on your forearm.</li>
              </ul>
            </div>

            {/* Guide 4 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-black/10 pb-2">
                <span className="text-[10px] uppercase font-black text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5">Wildlife Incident</span>
                <span className="text-xs font-bold opacity-50">Snake Bite</span>
              </div>
              <h3 className="text-lg font-serif italic font-bold">Snakebite Protocols</h3>
              <ul className="space-y-2 text-xs leading-relaxed text-gray-700">
                <li><strong>1. Stay Still:</strong> Keep the bitten limb completely still and lower than heart level.</li>
                <li><strong>2. Remove Constrictions:</strong> Take off tight rings, bracelets, watches or sandals immediately.</li>
                <li><strong>3. No Tourniquets:</strong> Do NOT tie tight ropes or make incisions. Do NOT try to suck venom.</li>
                <li><strong>4. Note Appearance:</strong> Note the snake’s color and shape from a safe distance.</li>
                <li><strong>5. Rush for Anti-venom:</strong> Go to the nearest tertiary hospital (such as Mayo or JPMC) for anti-venom.</li>
              </ul>
            </div>

            {/* Guide 5 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-black/10 pb-2">
                <span className="text-[10px] uppercase font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5">Mosquito-Borne</span>
                <span className="text-xs font-bold opacity-50">Dengue Triage</span>
              </div>
              <h3 className="text-lg font-serif italic font-bold">Dengue Hydration & Warning Signs</h3>
              <ul className="space-y-2 text-xs leading-relaxed text-gray-700">
                <li><strong>1. Consistent Fluids:</strong> Keep drinking water, coconut water, fresh fruit juices or ORS.</li>
                <li><strong>2. Monitor Fever:</strong> Only use Paracetamol/Panadol for fever. Avoid Aspirin, Disprin, or Ibuprofen!</li>
                <li><strong>3. Check Bleeding:</strong> Watch for bleeding from gums, nose, or blood spots under skin.</li>
                <li><strong>4. Extreme Vomiting:</strong> If persistent vomiting prevents drinking, seek same-day IV fluids.</li>
                <li><strong>5. Lab Check:</strong> Get platelet count checked at nearest Chughtai/Dow lab.</li>
              </ul>
            </div>

            {/* Mental Health Crisis Block */}
            <div className="border-2 border-[#1A1A1A] bg-[#F7F3EF] p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span className="text-[10px] uppercase font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5">Mental Health Support</span>
                  <span className="text-xs font-bold opacity-50">Compassion</span>
                </div>
                <h3 className="text-lg font-serif italic font-bold mt-2">Immediate Crisis Helpline</h3>
                <p className="text-xs leading-relaxed text-gray-700 mt-2">
                  {currentT.crisisText}
                </p>
              </div>
              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => handleTriggerRescue("Mental Health Crisis Support")}
                  className="text-xs font-bold text-[#D93025] hover:underline cursor-pointer border-none bg-transparent"
                >
                  Helpline: <span className="underline">1122 (Launch Desk)</span>
                </button>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#2D5A27]">Safe Haven</span>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Facility Reviews: Patient Feedback & Testimonials */}
      {activeTab === "reviews" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 animate-fade-in text-left">
          <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif italic font-black text-[#2D5A27] flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-[#2D5A27]" />
                Patient Reviews & Feedback (صارفین کی رائے)
              </h2>
              <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
                We value your therapeutic experience. Read verified testimonials or submit your clinical review.
              </p>
            </div>
            <div className="p-3 bg-[#F3F8F2] border border-[#2D5A27]/30 text-xs text-green-950 font-serif italic shrink-0 max-w-sm rounded-sm">
              * Integrity Standard: All submitted reviews undergo cryptographic verification against active local/cloud appointments.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form to Write a Review */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border-4 border-[#1A1A1A] bg-white p-5 space-y-4 shadow-md">
                <div className="border-b-2 border-[#1A1A1A] pb-2">
                  <h3 className="text-lg font-serif italic font-bold text-slate-900">
                    Share Your Experience
                  </h3>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    آپ کا تاثر ہمارے لیے قیمتی ہے
                  </p>
                </div>

                {reviewsFeedback && (
                  <div className={`p-3 border text-xs font-bold ${
                    reviewsFeedback.success 
                      ? "bg-green-50 border-green-500 text-green-800" 
                      : "bg-red-50 border-red-500 text-red-800"
                  }`}>
                    {reviewsFeedback.message}
                  </div>
                )}

                <form onSubmit={handleCreateReview} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-black text-slate-700 tracking-wider">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder={currentUser ? currentUser.name : "e.g., Muhammad Hanif"}
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* Location field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-black text-slate-700 tracking-wider">
                      Your City / Location
                    </label>
                    <input
                      type="text"
                      value={newReviewLocation}
                      onChange={(e) => setNewReviewLocation(e.target.value)}
                      placeholder="e.g., Lahore, Pakistan"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* Rating selection (Stars!) */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-black text-slate-700 tracking-wider">
                      Select Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="hover:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                        >
                          <Star 
                            className={`w-6 h-6 transition-colors ${
                              star <= newReviewRating 
                                ? "text-amber-500 fill-amber-500" 
                                : "text-slate-300 hover:text-amber-400"
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold font-mono text-slate-600 ml-2">
                        ({newReviewRating} / 5)
                      </span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-black text-slate-700 tracking-wider">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g., Excellent and highly professional portal"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* English review text */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-black text-slate-700 tracking-wider">
                      Review Description (English) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Describe your experience with diagnostic booking, AI tools, or physician consultation..."
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27] resize-none"
                    />
                  </div>

                  {/* Urdu review text */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-black text-slate-700 tracking-wider font-sans">
                      تاثرات درج کریں (Urdu - Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={newReviewTextUr}
                      onChange={(e) => setNewReviewTextUr(e.target.value)}
                      placeholder="اپنے تاثرات یہاں اردو زبان میں بھی تحریر کر سکتے ہیں..."
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27] text-right font-urdu font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2D5A27] text-white hover:bg-[#1a3818] py-2.5 text-xs font-black uppercase tracking-widest border border-black shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </div>

              {/* Security info note */}
              <div className="p-4 border-2 border-[#1A1A1A] bg-[#F7F3EF]/60 text-xs text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-[#1A1A1A]">🛡️ Verified Patient Review Protocol:</p>
                <p>
                  To secure client integrity, our system cross-checks names against recorded appointments. Thank you for maintaining authentic medical service feedback.
                </p>
              </div>
            </div>

            {/* Right Column: List & Stats */}
            <div className="lg:col-span-8 space-y-6 text-left">
              {/* Statistics Panel */}
              <div className="border-4 border-[#1A1A1A] bg-[#F7F3EF] p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual Average Rating */}
                <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 pb-4 md:pb-0 md:pr-4">
                  <p className="text-[10px] uppercase tracking-wider font-black text-slate-500">
                    Patient Satisfaction
                  </p>
                  <p className="text-5xl font-serif italic font-black text-[#2D5A27] mt-1.5">
                    {(() => {
                      if (reviews.length === 0) return "5.0";
                      const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
                      return (sum / reviews.length).toFixed(1);
                    })()}
                  </p>
                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-slate-600 font-mono">
                    Based on {reviews.length} verified ratings
                  </p>
                </div>

                {/* Rating bars breakdown */}
                <div className="md:col-span-8 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter((r) => (r.rating || 5) === rating).length;
                    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3 text-xs">
                        <span className="w-12 font-bold text-slate-600 font-mono shrink-0 flex items-center gap-1 justify-end">
                          {rating} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        </span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-xs overflow-hidden border border-black/10">
                          <div 
                            className="bg-amber-500 h-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-slate-500 font-bold font-mono">
                          {count} ({Math.round(percent)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filters & Search controls */}
              <div className="border-2 border-[#1A1A1A] p-3.5 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    value={reviewsSearchQuery}
                    onChange={(e) => setReviewsSearchQuery(e.target.value)}
                    placeholder="Search reviews by name, keyword..."
                    className="w-full p-2 pl-9 bg-white border border-[#1A1A1A] text-xs"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                </div>

                {/* Star Filter */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <span className="text-[10px] uppercase tracking-wider font-black text-slate-600">
                    Filter Rating:
                  </span>
                  <select
                    value={reviewsRatingFilter}
                    onChange={(e) => setReviewsRatingFilter(e.target.value)}
                    className="p-1.5 bg-white border border-[#1A1A1A] text-xs font-bold"
                  >
                    <option value="all">All Ratings (تمام ستارے)</option>
                    <option value="5">5 Stars only</option>
                    <option value="4">4 Stars & above</option>
                    <option value="3">3 Stars & above</option>
                  </select>
                </div>
              </div>

              {/* Reviews listing stack */}
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="p-12 text-center bg-white border-2 border-dashed border-[#1A1A1A]/20">
                    <RefreshCw className="w-8 h-8 text-[#2D5A27] animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Synchronising verified reviews...</p>
                  </div>
                ) : (() => {
                  const query = reviewsSearchQuery.toLowerCase().trim();
                  const ratingVal = reviewsRatingFilter;

                  const filtered = reviews.filter((r) => {
                    const matchQuery = !query || 
                      [r.name, r.title, r.review_text, r.review_text_ur, r.location]
                        .some((f) => f && f.toLowerCase().includes(query));

                    let matchRating = true;
                    if (ratingVal !== "all") {
                      if (ratingVal === "5") matchRating = (r.rating || 5) === 5;
                      else if (ratingVal === "4") matchRating = (r.rating || 5) >= 4;
                      else if (ratingVal === "3") matchRating = (r.rating || 5) >= 3;
                    }

                    return matchQuery && matchRating;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-12 text-center bg-white border-2 border-dashed border-[#1A1A1A]/20 text-slate-400 text-xs font-medium">
                        No patient reviews match your current search/filter combination.
                      </div>
                    );
                  }

                  return filtered.map((r) => (
                    <div 
                      key={r.id} 
                      className="border-4 border-[#1A1A1A] bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      {/* Review Card Header */}
                      <div className="flex justify-between items-start gap-4 border-b border-[#1A1A1A]/10 pb-2.5">
                        <div>
                          {/* Stars */}
                          <div className="flex gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${
                                  star <= (r.rating || 5) 
                                    ? "text-amber-500 fill-amber-500" 
                                    : "text-slate-200"
                                }`} 
                              />
                            ))}
                          </div>
                          <h4 className="text-md font-serif italic font-bold text-slate-900 leading-tight">
                            {r.title || "Verified Patient Experience"}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="font-extrabold text-[#2D5A27]">{r.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-500">
                              <MapPin className="w-3 h-3" /> {r.location || "Pakistan"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-black bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-xs inline-block">
                            Verified Care
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recent"}
                          </span>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-2 text-left">
                        <p>{r.review_text}</p>
                        {r.review_text_ur && (
                          <div className="p-3 bg-[#F7F3EF]/40 border-l-4 border-[#2D5A27] text-right font-urdu text-[13px] text-slate-900 leading-loose">
                            {r.review_text_ur}
                          </div>
                        )}
                      </div>

                      {/* Administrative delete moderation option */}
                      {adminUser && (
                        <div className="absolute right-4 bottom-4">
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2.5 py-1.5 border border-red-200 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 rounded-sm cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Review
                          </button>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </main>
      )}
      {activeTab === "lab-explainer" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
          <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif italic font-black text-[#2D5A27]">
                Understand Lab Reports (لیب ٹیسٹ رہنمائی)
              </h2>
              <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
                Enter your test values below to understand reference ranges and educational meanings in English and Urdu.
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-950 font-serif italic shrink-0 max-w-sm">
              * Verification: Reference ranges are aligned with Chughtai and Dow Lab standards in Pakistan.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar List of Lab Tests */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-[#1A1A1A] block mb-1">
                Select Lab Test Topic
              </span>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                {LAB_TESTS_DATABASE.map((test) => {
                  const isSelected = selectedLabTestId === test.id;
                  return (
                    <button
                      key={test.id}
                      onClick={() => {
                        setSelectedLabTestId(test.id);
                        setUserLabValue("");
                      }}
                      className={`w-full text-left p-3 border-2 transition-all flex flex-col ${
                        isSelected 
                          ? "border-[#2D5A27] bg-[#F4F9F4] shadow-[4px_4px_0px_0px_#1A1A1A]" 
                          : "border-[#1A1A1A] bg-white hover:bg-[#FDFCFB]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[8px] uppercase font-black px-1.5 py-0.5 bg-[#1A1A1A] text-white">
                          {test.category}
                        </span>
                        <span className="text-[10px] font-bold text-[#2D5A27]">
                          {test.unit}
                        </span>
                      </div>
                      <h4 className="text-sm font-serif italic font-bold mt-1 text-[#1A1A1A]">
                        {test.name}
                      </h4>
                      <p className="text-[13px] font-urdu text-right w-full text-slate-600 mt-1">
                        {test.urduName}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Details Card */}
            <div className="lg:col-span-8 border-2 border-[#1A1A1A] bg-white p-6 space-y-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              {(() => {
                const test = LAB_TESTS_DATABASE.find(t => t.id === selectedLabTestId);
                if (!test) return <p className="text-sm">Select a test from the left panel.</p>;

                // Calculate feedback
                const numericVal = parseFloat(userLabValue);
                const hasValue = userLabValue.trim() !== "" && !isNaN(numericVal);
                let interpretation: "LOW" | "NORMAL" | "HIGH" | null = null;
                if (hasValue) {
                  if (numericVal < test.minVal) {
                    interpretation = "LOW";
                  } else if (numericVal > test.maxVal) {
                    interpretation = "HIGH";
                  } else {
                    interpretation = "NORMAL";
                  }
                }

                return (
                  <div className="space-y-6">
                    {/* Test Title Header */}
                    <div className="border-b-2 border-[#1A1A1A] pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-black bg-[#2D5A27] text-white px-2 py-0.5">
                          Lab Reference Standard
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-bold">
                          Normal Range: {test.normalRangeText} {test.unit}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif italic font-bold mt-2">
                        {test.name} ({test.urduName})
                      </h3>
                    </div>

                    {/* Interactive Value Assessor */}
                    <div className="bg-[#F7F3EF] border-2 border-[#1A1A1A] p-4 sm:p-6 space-y-4">
                      <h4 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-black/10 pb-1.5 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#2D5A27]" />
                        Evaluate Your Lab Score (اپنا رزلٹ چیک کریں)
                      </h4>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                            Enter Lab Value ({test.unit})
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={userLabValue}
                            onChange={(e) => setUserLabValue(e.target.value)}
                            placeholder={`e.g. ${(test.minVal + test.maxVal) / 2}`}
                            className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-sm focus:outline-none focus:border-[#2D5A27] font-bold"
                          />
                        </div>
                        {hasValue && (
                          <div className="shrink-0 flex items-center">
                            <button
                              onClick={() => setUserLabValue("")}
                              className="text-[10px] uppercase tracking-wider font-bold text-[#D93025] hover:underline px-3 py-2 border border-[#1A1A1A] bg-white"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Score Evaluation Panel */}
                      {hasValue ? (
                        <div className="mt-4 border-2 border-[#1A1A1A] bg-white p-4 space-y-3 transition-all">
                          <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-full ${
                              interpretation === "NORMAL" ? "bg-green-600" :
                              interpretation === "LOW" ? "bg-blue-600" : "bg-red-600 animate-pulse"
                            }`}></span>
                            <span className="text-xs uppercase font-black tracking-widest text-[#1A1A1A]">
                              Evaluation Results:
                            </span>
                            <span className={`text-xs font-black uppercase px-2.5 py-0.5 border ${
                              interpretation === "NORMAL" ? "bg-green-50 text-green-700 border-green-200" :
                              interpretation === "LOW" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {interpretation} VALUE ({userLabValue} {test.unit})
                            </span>
                          </div>

                          {/* Visual Reference Indicator Slider */}
                          <div className="mt-4 p-3 bg-slate-50 border border-slate-200">
                            <span className="text-[9px] uppercase tracking-wider font-black text-slate-500 block mb-1">
                              Your Value Position on Reference Scale:
                            </span>
                            
                            {/* The visual track */}
                            <div className="relative w-full h-6 bg-slate-100 border border-[#1A1A1A] flex rounded-xs overflow-hidden mt-3">
                              {/* Low Zone */}
                              <div className="w-[30%] bg-blue-50/70 flex items-center justify-center border-r border-[#1A1A1A]/10 text-[8px] font-black text-blue-800 uppercase tracking-widest">
                                Low
                              </div>
                              {/* Normal Zone */}
                              <div className="w-[40%] bg-green-50/70 flex items-center justify-center border-r border-[#1A1A1A]/10 text-[8px] font-black text-green-800 uppercase tracking-widest font-serif italic">
                                Normal Range
                              </div>
                              {/* High Zone */}
                              <div className="w-[30%] bg-red-50/70 flex items-center justify-center text-[8px] font-black text-red-800 uppercase tracking-widest">
                                High
                              </div>

                              {/* Pointer Marker */}
                              {(() => {
                                let relativePositionPercent = 50; 
                                const rangeWidth = test.maxVal - test.minVal;
                                if (numericVal < test.minVal) {
                                  const leftLimit = test.minVal * 0.5;
                                  const ratio = rangeWidth > 0 ? (numericVal - leftLimit) / (test.minVal - leftLimit) : 0;
                                  relativePositionPercent = Math.max(4, Math.min(27, 4 + ratio * 23));
                                } else if (numericVal > test.maxVal) {
                                  const rightLimit = test.maxVal * 1.5;
                                  const ratio = rangeWidth > 0 ? (numericVal - test.maxVal) / (rightLimit - test.maxVal) : 0;
                                  relativePositionPercent = Math.max(73, Math.min(96, 73 + ratio * 23));
                                } else {
                                  const ratio = rangeWidth > 0 ? (numericVal - test.minVal) / rangeWidth : 0.5;
                                  relativePositionPercent = Math.max(32, Math.min(68, 30 + ratio * 40));
                                }
                                return (
                                  <div 
                                    className="absolute top-0 bottom-0 w-2.5 bg-black border-2 border-white -ml-1 transition-all duration-500 ease-out shadow-md"
                                    style={{ left: `${relativePositionPercent}%` }}
                                    title={`Your value ${userLabValue} is here`}
                                  />
                                );
                              })()}
                            </div>

                            <div className="flex justify-between text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                              <span>Min Limit: {test.minVal}</span>
                              <span className="text-green-800 font-black">Normal Interval ({test.normalRangeText})</span>
                              <span>Max Limit: {test.maxVal}</span>
                            </div>
                          </div>

                          {(() => {
                            // Inline computation of tips and specialist
                            const interp = interpretation || "NORMAL";
                            const id = test.id;
                            let tipsEn = "Your levels are perfect! Maintain your current balanced diet, stay physically active, and repeat this test annually for routine prevention.";
                            let tipsUr = "آپ کی ریڈنگ بالکل نارمل ہے! متوازن غذا اور چہل قدمی جاری رکھیں، اور سالانہ بنیادوں پر اپنے روٹین ٹیسٹ کرواتے رہیں۔";
                            let doctorSpecialist = "General Physician / Family Doctor";

                            if (interp === "NORMAL") {
                              tipsEn = "Your levels are perfect! Maintain your current balanced diet, stay physically active, and repeat this test annually for routine prevention.";
                              tipsUr = "آپ کی ریڈنگ بالکل نارمل ہے! متوازن غذا اور چہل قدمی جاری رکھیں، اور سالانہ بنیادوں پر اپنے روٹین ٹیسٹ کرواتے رہیں۔";
                              doctorSpecialist = "General Physician / Family Doctor";
                            } else {
                              switch (id) {
                                case "lab-platelets":
                                  if (interp === "LOW") {
                                    tipsEn = "⚠️ Critical for Dengue! Stay extremely hydrated with ORS, coconut water, or apple juice. Papaya leaf extract has been shown to support platelet recovery. Avoid high-impact activities to prevent bruising, and strictly DO NOT take Aspirin, Disprin, or Brufen as they increase bleeding risks. Only take Paracetamol for fever control.";
                                    tipsUr = "⚠️ ڈینگی کا خطرہ! کثرت سے او آر ایس (ORS)، ناریل کا پانی یا سیب کا جوس پئیں۔ پپیتے کے پتے کا رس پلیٹلیٹس بڑھانے میں مدد دیتا ہے۔ مسوڑھوں سے خون بہنے کی صورت میں فوری ہسپتال رجوع کریں۔ ڈسپرین یا بروفین ہرگز نہ لیں، صرف پیراسیٹامول لیں۔";
                                    doctorSpecialist = "General Physician / Internal Medicine";
                                  } else {
                                    tipsEn = "High platelet counts can increase blood clotting risks. Stay well-hydrated, avoid sedentary behavior, and consult a doctor to rule out inflammatory conditions.";
                                    tipsUr = "پلیٹلیٹس کی زیادتی خون جمنے کے خطرے کو بڑھاتی ہے۔ پانی زیادہ پئیں اور معالج سے مشورہ کریں۔";
                                    doctorSpecialist = "Hematologist / General Physician";
                                  }
                                  break;
                                case "lab-fasting-sugar":
                                case "lab-hba1c":
                                  if (interp === "HIGH") {
                                    tipsEn = "⚠️ High Blood Sugar! Reduce direct white sugar, white rice, maida, and sugary drinks. Incorporate foods high in fiber like oats, whole wheat, and green leafy vegetables. Daily brisk walking for 30 minutes after meals is highly beneficial to lower HbA1c.";
                                    tipsUr = "⚠️ ہائی بلڈ شوگر! سفید چینی، چاول، میدے اور کولڈ ڈرنکس سے مکمل پرہیز کریں۔ چوکر والے آٹے کی روٹی اور ہری سبزیاں کھائیں۔ روزانہ کم از کم ۳۰ منٹ کی تیز چہل قدمی شوگر لیول کو کنٹرول کرنے میں معاون ہے۔";
                                    doctorSpecialist = "Endocrinologist (Diabetes Specialist)";
                                  } else {
                                    tipsEn = "⚠️ Hypoglycemia (Low Sugar)! Eat 15g of fast-acting sugar immediately (half cup of juice, 3-4 candies, or 1 tablespoon of honey). Rest and re-check after 15 minutes. Avoid skipping meals.";
                                    tipsUr = "⚠️ لو بلڈ شوگر! فوری طور پر آدھا کپ جوس، ۴ کینڈیز یا ایک چمچ شہد لیں۔ ۱۵ منٹ آرام کر کے دوبارہ شوگر چیک کریں۔ کھانا وقت پر کھائیں۔";
                                    doctorSpecialist = "Endocrinologist (Diabetes Specialist)";
                                  }
                                  break;
                                case "lab-hemoglobin":
                                  if (interp === "LOW") {
                                    tipsEn = "🩸 Anemia detected! Boost iron intake by consuming red meat (mutton/beef liver), spinach, apples, beetroots, pomegranates, and dates. Pair these iron sources with Vitamin C (lemon water or oranges) to maximize absorption. Avoid drinking chai or coffee immediately after meals as it blocks iron absorption.";
                                    tipsUr = "🩸 خون کی کمی (انیمیا)! کلیجی، بڑا گوشت، پالک، سیب، چقندر، کھجور اور انار کا استعمال بڑھائیں۔ کھانے کے فوراً بعد چائے یا کافی پینے سے گریز کریں کیونکہ یہ آئرن کے جذب ہونے کے عمل کو روکتی ہے۔";
                                    doctorSpecialist = "General Physician / Gynecologist";
                                  } else {
                                    tipsEn = "High hemoglobin can indicate dehydration or chronic oxygen needs (common in smokers). Drink plenty of fluids.";
                                    tipsUr = "ہیموگلوبن کی زیادتی پانی کی کمی کو ظاہر کرتی ہے۔ سگریٹ نوشی سے پرہیز کریں اور خوب پانی پئیں۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-creatinine":
                                  if (interp === "HIGH") {
                                    tipsEn = "⚠️ Decreased Kidney Function! Maintain strict control over blood pressure and blood sugar. Drink clean, filtered water moderately (as guided by your doctor). Limit excessive dietary protein (red meat) and avoid self-prescribed painkillers (NSAIDs like Brufen or Dicloran) which are nephrotoxic.";
                                    tipsUr = "⚠️ گردوں پر دباؤ! بلڈ پریشر اور شوگر کو قابو میں رکھیں۔ بڑا گوشت کم کھائیں اور خود سے درد کش گولیاں (بروفین، ڈیکلو ران) لینے سے سخت پرہیز کریں کیونکہ یہ گردوں کو شدید نقصان پہنچاتی ہے۔";
                                    doctorSpecialist = "Nephrologist (Kidney Specialist)";
                                  } else {
                                    tipsEn = "Low creatinine is usually linked to low muscle mass or lower protein intake. Ensure moderate intake of healthy protein.";
                                    tipsUr = "کریٹائنین کا کم ہونا عام طور پر پٹھوں کی کمزوری کو ظاہر کرتا ہے۔ مناسب مقدار میں پروٹین لیں۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-alt":
                                case "lab-bilirubin":
                                  if (interp === "HIGH") {
                                    tipsEn = "⚠️ Liver Stress detected! Avoid greasy, deep-fried food, and processed bakery items. Focus on fresh home-cooked meals, papayas, and radishes. Ensure you have screen tests for Hepatitis B & C.";
                                    tipsUr = "⚠️ جگر کی سوزش! تلی ہوئی، مرغن غذاؤں اور گھی والے سالن سے پرہیز کریں۔ ابلی ہوئی سبزیاں اور پھل کھائیں۔ ہیپاٹائٹس بی اور سی کا ٹیسٹ لازمی کروائیں۔";
                                    doctorSpecialist = "Gastroenterologist / Liver Specialist";
                                  } else {
                                    tipsEn = "Low liver values represent healthy and normal hepatic functioning.";
                                    tipsUr = "کم ریڈنگ جگر کے بہترین کام کرنے کی علامت ہے۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-urine-re":
                                  if (interp === "HIGH") {
                                    tipsEn = "💧 Urinary Tract Infection (UTI) indicator! Increase fluid intake to at least 10-12 glasses of water daily to flush out bacteria. Cranberry extract drinks/supplements are highly beneficial. Do not delay urination.";
                                    tipsUr = "💧 پیشاب کی نالی کا انفیکشن! روزانہ ۱۰ سے ۱۲ گلاس پانی پئیں تاکہ جراثیم خارج ہو سکیں۔ کرین بیری (Cranberry) کا جوس پینا انتہائی مفید ہے۔ پیشاب کو زیادہ دیر نہ روکیں۔";
                                    doctorSpecialist = "Urologist / General Physician";
                                  } else {
                                    tipsEn = "Normal urine values indicate no active bacterial infection.";
                                    tipsUr = "پیشاب کی نالی میں کسی انفیکشن کے اثرات نہیں ہیں۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-uric-acid":
                                  if (interp === "HIGH") {
                                    tipsEn = "🍗 High Uric Acid! Limit red meat, seafood, lentils (daal), spinach, and cauliflower. Drink plenty of water (3 liters daily) to help kidneys excrete uric acid. Lemon water (citrus) can help dissolve uric acid crystals.";
                                    tipsUr = "🍗 ہائی یورک ایسڈ! بڑا گوشت، دالیں، پالک اور گوبھی کھانے سے پرہیز کریں۔ روزانہ ۳ لیٹر پانی پئیں تاکہ گردے اسے خارج کر سکیں۔ لیموں پانی کا استعمال مفید ہے۔";
                                    doctorSpecialist = "General Physician / Rheumatologist";
                                  } else {
                                    tipsEn = "Low uric acid is uncommon but usually benign, often requiring no medical intervention.";
                                    tipsUr = "اس کا کم ہونا بے ضرر ہے اور عام طور پر کم پروٹین والی غذاؤں کے استعمال سے ہوتا ہے۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-vit-d":
                                  if (interp === "LOW") {
                                    tipsEn = "☀️ Vitamin D Deficiency! Aim for 10-15 minutes of direct sunlight exposure daily (ideally before 11 AM). Consume Vitamin D fortified milk, egg yolks, mushrooms, and fatty fish. Speak to your doctor about starting a weekly oral capsule schedule.";
                                    tipsUr = "☀️ وٹامن ڈی کی کمی! صبح ۱۱ بجے سے پہلے روزانہ ۱۰ سے ۱۵ منٹ دھوپ میں بیٹھیں؛ انڈے کی زردی، فورٹیفائیڈ دودھ اور مچھلی کھائیں۔ ڈاکٹر کے مشورے سے ہفتہ وار کیپسول کا کورس شروع کریں۔";
                                    doctorSpecialist = "Orthopedic / General Physician";
                                  } else {
                                    tipsEn = "Normal/high Vitamin D levels indicate healthy stores. Avoid exceeding supplemental limits to prevent calcium buildup.";
                                    tipsUr = "وٹامن ڈی کی سطح بہترین ہے۔ کیلشیم بڑھنے سے روکنے کے لیے سپلیمنٹس کی اوور ڈوز سے بچیں۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-dengue-ns1":
                                  if (interp === "HIGH") {
                                    tipsEn = "🚨 Active Dengue confirmed! Immediate medical supervision is critical. Monitor platelet levels and hematocrit (CBC) every 24 hours. Drink plenty of isotonic fluids (ORS, fresh juices, milk) to prevent dehydration. DO NOT take Aspirin/Brufen; only use Paracetamol for fever. Seek ER immediately if there is bleeding, black stools, or severe abdominal pain.";
                                    tipsUr = "🚨 ڈینگی بخار کی تصدیق! فوری طور پر ڈاکٹر سے رجوع کریں۔ ہر ۲۴ گھنٹے بعد سی بی سی (CBC) ٹیسٹ کروائیں۔ او آر ایس (ORS) کا پانی کثرت سے پئیں تاکہ پانی کی کمی نہ ہو۔ ڈسپرین یا بروفین ہرگز نہ لیں؛ صرف پیراسیٹامول لیں۔";
                                    doctorSpecialist = "Infectious Disease Specialist / Family Physician";
                                  } else {
                                    tipsEn = "Dengue NS1 Negative. However, if severe fever continues, repeat tests or examine typhoid/malaria.";
                                    tipsUr = "ڈینگی منفی ہے۔ اگر بخار برقرار ہے تو ملیریا یا ٹائفائیڈ کا ٹیسٹ کروائیں۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                                case "lab-typhidot":
                                  if (interp === "HIGH") {
                                    tipsEn = "🚨 Typhoid Fever confirmed! Requires a full course of prescribed antibiotics (do not stop early even if feeling better). Rest well and consume easily-digestible, soft home-cooked meals (khichdi, porridge). Avoid spicy, oily food and tap water. Drink boiled or mineral water only.";
                                    tipsUr = "🚨 ٹائفائیڈ بخار کی تصدیق! ڈاکٹر کے تجویز کردہ اینٹی بائیوٹک کا کورس مکمل کریں۔ نرم اور ہلکی غذا جیسے کھچڑی اور دلیہ کھائیں۔ ابلا ہوا یا فلٹر شدہ پانی پئیں؛ تلی ہوئی چیزوں سے پرہیز کریں۔";
                                    doctorSpecialist = "Infectious Disease Specialist / Family Physician";
                                  } else {
                                    tipsEn = "Typhidot Negative. If high fever persists, consult a physician immediately for further evaluation.";
                                    tipsUr = "ٹائفائیڈ منفی ہے۔ اگر تیز بخار جاری رہے تو فوری طور پر ڈاکٹر سے رابطہ کریں۔";
                                    doctorSpecialist = "General Physician";
                                  }
                                  break;
                              }
                            }

                            return (
                              <div className="p-4 bg-slate-50 border border-[#1A1A1A]/10 text-xs space-y-4 text-slate-800 rounded-sm">
                                <div className="space-y-2">
                                  <h5 className="font-serif italic font-bold text-[#2D5A27] flex items-center gap-1.5 text-sm">
                                    <Activity className="w-4 h-4" />
                                    Bilingual Lifestyle & Food Guidelines (غذائی و رہائشی ہدایات)
                                  </h5>
                                  <div className="p-3 bg-white border border-slate-200/80 space-y-3 rounded-xs text-left">
                                    <div>
                                      <span className="text-[9px] uppercase tracking-wider font-black bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-xs inline-block mb-1">
                                        English Advice
                                      </span>
                                      <p className="leading-relaxed font-sans text-slate-800">
                                        {tipsEn}
                                      </p>
                                    </div>
                                    <div className="pt-2 border-t border-dashed border-slate-200 text-right">
                                      <span className="text-[9px] uppercase tracking-wider font-black bg-[#2D5A27]/10 text-[#2D5A27] px-1.5 py-0.5 rounded-xs inline-block mb-1 font-sans">
                                        اردو ہدایات
                                      </span>
                                      <p className="font-urdu text-[14px] text-slate-800 leading-loose">
                                        {tipsUr}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Patient Facility Recommendation & Referral */}
                                <div className="p-3 bg-[#F4F9F4] border border-[#2D5A27]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xs">
                                  <div className="text-left">
                                    <span className="text-[8px] uppercase tracking-wider bg-[#2D5A27] text-white px-1.5 py-0.5 font-bold rounded-2xs inline-block mb-1">
                                      Primary Medical Referral Facility
                                    </span>
                                    <h6 className="text-xs font-black text-slate-900">
                                      Recommended Consultation Specialty:
                                    </h6>
                                    <p className="text-xs text-[#2D5A27] font-semibold">
                                      👉 {doctorSpecialist}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      let targetSpecialty = "General Physician / Family Medicine";
                                      const specLower = doctorSpecialist.toLowerCase();
                                      if (specLower.includes("endocrinologist")) {
                                        targetSpecialty = "Endocrinologist (Diabetes & Hormone Specialist)";
                                      } else if (specLower.includes("gynecologist")) {
                                        targetSpecialty = "Gynecologist / Obstetrician";
                                      } else if (specLower.includes("cardiologist")) {
                                        targetSpecialty = "Cardiologist (Heart Specialist)";
                                      } else if (specLower.includes("pediatrician") || specLower.includes("child")) {
                                        targetSpecialty = "Pediatrician (Child Specialist)";
                                      }
                                      setSelectedSpecialty(targetSpecialty);
                                      setPlannerCustomQuestions([]);
                                      setActiveTab("doctor-planner");
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-3 py-1.5 bg-white border border-[#2D5A27] text-[#2D5A27] hover:bg-[#2D5A27] hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                  >
                                    Consult Guide Specialty
                                  </button>
                                </div>

                                {/* Save to History Button */}
                                <div className="pt-2 border-t border-[#1A1A1A]/10 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveLabReport(test, userLabValue, interpretation || "NORMAL")}
                                    className="px-4 py-2 bg-[#2D5A27] text-white hover:bg-[#1a3818] border border-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                                  >
                                    <CloudUpload className="w-3.5 h-3.5 text-white" />
                                    Save Report to History
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <p className="text-xs italic text-slate-500 mt-2 text-left">
                          Please enter a numeric reading to run our instant range evaluation helper.
                        </p>
                      )}
                    </div>

                    {/* Patient Benefits of Understanding This Test */}
                    <div className="p-4 border-2 border-dashed border-[#2D5A27]/30 bg-[#FBFDFB] space-y-2 text-left">
                      <h4 className="text-xs uppercase tracking-wider font-black text-[#2D5A27] flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-[#2D5A27]" />
                        Key Clinical Benefits & Empowerment for Patients:
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed font-sans">
                        <li><strong>Early Warning Signal:</strong> Spotting trends before full clinical onset can help reverse pre-diabetes, early fatty liver, or hypertension.</li>
                        <li><strong>Informed Doctor Conversations:</strong> Knowing your standard reference ranges empowers you to ask precise questions about medication dosages.</li>
                        <li><strong>Proactive Lifestyle Decisions:</strong> Instant bilingual action tips guide your daily diet (limiting salt, adding iron, staying hydrated).</li>
                        <li><strong>Preventative Health History:</strong> Saving records allows tracking of historical blood sugars or platelets over successive months.</li>
                      </ul>
                    </div>

                    {/* About the Test in English and Urdu */}
                    <div className="space-y-4 text-left">
                      <div className="border-l-4 border-[#2D5A27] pl-3 py-1 bg-[#FDFCFB]">
                        <h4 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
                          What is this test for? (یہ ٹیسٹ کس لئے ہوتا ہے؟)
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 border border-[#1A1A1A]/10 bg-white text-xs leading-relaxed text-slate-700">
                          <p className="font-bold text-[#2D5A27] mb-1">Clinical Definition</p>
                          {test.about}
                        </div>
                        <div className="p-3.5 border border-[#1A1A1A]/10 bg-white text-xs font-urdu text-right text-slate-700 leading-loose">
                          <p className="font-bold font-sans text-left text-[#2D5A27] mb-1">اردو رہنمائی</p>
                          {test.aboutUrdu}
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer Warning */}
                    <div className="p-3.5 bg-yellow-50 border-l-4 border-yellow-500 text-[11px] text-yellow-950 font-medium text-left">
                      <strong>* Critical Note:</strong> Reference intervals may vary slightly between diagnostic laboratories (e.g., Chughtai, Dow, Shaukat Khanum, Citi Lab). High or low values can be transient and affected by hydration, medications, or minor infections. Always discuss complete laboratory results with a qualified physician.
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Saved Lab Reports History section */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 sm:p-6 space-y-4 shadow-[4px_4px_0px_0px_#1A1A1A]">
            <div className="border-b border-[#1A1A1A]/15 pb-2 flex items-center justify-between">
              <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2D5A27]" />
                Your Saved Lab Reports History (محفوظ کردہ لیب رپورٹس)
              </h3>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-[#F4F9F4] text-[#2D5A27] border border-[#2D5A27]/20">
                {savedLabReports.length} Saved Records
              </span>
            </div>

            {savedLabReports.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">
                No lab report evaluations saved yet. Enter a lab score above and click "Save Report to History" to persist records.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1A1A1A] bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]">
                      <th className="p-3">Date Saved</th>
                      <th className="p-3">Lab Investigation Topic</th>
                      <th className="p-3 text-center">Value Entered</th>
                      <th className="p-3 text-center">Clinical Interpretation</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedLabReports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-500">{report.timestamp}</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{report.testName}</span>
                        </td>
                        <td className="p-3 text-center font-bold text-[#1A1A1A]">
                          {report.value} {report.unit}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 border font-black uppercase text-[9px] ${
                            report.interpretation === "NORMAL" ? "bg-green-50 text-green-700 border-green-200" :
                            report.interpretation === "LOW" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-red-50 text-red-700 border-red-200 animate-pulse-slow"
                          }`}>
                            {report.interpretation}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLabTestId(report.testId);
                                setUserLabValue(report.value);
                                window.scrollTo({ top: 300, behavior: "smooth" });
                              }}
                              className="px-2 py-1 border border-slate-300 hover:border-black hover:bg-slate-100 text-[10px] font-extrabold uppercase transition-all cursor-pointer"
                              title="Reload report values back into interpreter"
                            >
                              Reload
                            </button>
                            {confirmDeleteLabReportId === report.id ? (
                              <div className="flex items-center gap-1 border border-red-200 bg-red-50 p-1 rounded-sm">
                                <span className="text-[9px] text-red-700 font-bold uppercase mr-1">Sure?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteLabReport(report.id);
                                    setConfirmDeleteLabReportId(null);
                                  }}
                                  className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] uppercase tracking-wider cursor-pointer rounded-xs"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteLabReportId(null)}
                                  className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-[9px] uppercase tracking-wider cursor-pointer rounded-xs"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteLabReportId(report.id)}
                                className="p-1 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors rounded-sm cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Proper Clinical Appointment Booking Box (Facility: Book Appointment) */}
      {activeTab === "book-appointment" && (
        <main id="book-appointment-view" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 animate-fade-in">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif italic font-black text-[#2D5A27]">
                  Clinical Appointment Booking (کلینیکل اپائنٹمنٹ بکنگ)
                </h2>
                <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
                  Schedule direct consultations with senior medical specialists in Pakistan. Real-time database sync and confirmation.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("doctors")} 
                className="bg-[#1A1A1A] hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[10px] py-2 px-3.5 border border-black cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                View Specialist Directory
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Direct Appointment Form */}
            <div id="booking-form-panel" className="lg:col-span-7 border-2 border-[#1A1A1A] bg-white p-6 space-y-6 shadow-[5px_5px_0px_0px_#1A1A1A]">
              <div className="border-b border-[#1A1A1A]/15 pb-3">
                <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2D5A27]" />
                  Patient Consultation Request Form
                </h3>
                <p className="text-[11px] text-[#666] mt-0.5">Fill out clinical details below to schedule your appointment.</p>
              </div>

              {clinicalBookingStatus && (
                <div 
                  className={`p-4 border-2 ${
                    clinicalBookingStatus.success 
                      ? "bg-green-50 border-green-600 text-green-900" 
                      : "bg-red-50 border-red-600 text-red-900"
                  } text-xs font-bold rounded-sm flex flex-col gap-2`}
                >
                  <p>{clinicalBookingStatus.message}</p>
                  {clinicalBookingStatus.success && clinicalBookingSuccessDetails && (
                    <div className="p-3 bg-white/70 border border-green-200 font-mono text-[10px] space-y-1.5 text-slate-800 mt-2">
                      <p className="font-bold border-b border-green-200 pb-1 text-[#2D5A27] uppercase">Clinic Booking Confirmation Ticket</p>
                      <p><strong>Ref Code:</strong> APPT-{clinicalBookingSuccessDetails.id || Math.random().toString(36).substring(3,9).toUpperCase()}</p>
                      <p><strong>Physician:</strong> {clinicalBookingSuccessDetails.doctor_name || clinicalBookingSuccessDetails.doctorName}</p>
                      <p><strong>Department:</strong> {clinicalBookingSuccessDetails.specialty}</p>
                      <p><strong>Consultation Slot:</strong> {clinicalBookingSuccessDetails.appointment_date || clinicalBookingSuccessDetails.appointmentDate}</p>
                      <p><strong>Patient Name:</strong> {clinicalBookingSuccessDetails.user_name || clinicalBookingSuccessDetails.userName}</p>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleCreateRealAppointment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Doctor */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Select Physician / Specialist *</label>
                    <select
                      value={bookingDoctorName}
                      onChange={(e) => {
                        const doc = DOCTORS_LIST.find(d => d.name === e.target.value);
                        setBookingDoctorName(e.target.value);
                        if (doc) setBookingSpecialty(doc.specialty);
                      }}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    >
                      {DOCTORS_LIST.map((doc, idx) => (
                        <option key={idx} value={doc.name}>
                          {doc.name} ({doc.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Specialty (Auto filled) */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Clinical Department</label>
                    <input
                      type="text"
                      value={bookingSpecialty}
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 p-2.5 text-xs font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Waheed"
                      value={bookingPatientName}
                      onChange={(e) => setBookingPatientName(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* Patient Email */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ansawaheed44@gmail.com"
                      value={bookingPatientEmail}
                      onChange={(e) => setBookingPatientEmail(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* Patient Phone */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Phone Number (Pakistan format) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +92 300 1234567"
                      value={bookingPatientPhone}
                      onChange={(e) => setBookingPatientPhone(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Date */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Appointment Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* Select Time Slot */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Time Slot Preference *</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    >
                      <option value="">Select a preferred hour slot</option>
                      <option value="09:00 AM">09:00 AM - 10:00 AM (Morning Session)</option>
                      <option value="11:00 AM">11:00 AM - 12:00 PM (Morning Session)</option>
                      <option value="02:30 PM">02:30 PM - 03:30 PM (Afternoon Session)</option>
                      <option value="04:00 PM">04:00 PM - 05:00 PM (Evening Session)</option>
                      <option value="07:30 PM">07:30 PM - 08:30 PM (Late Clinic Session)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Symptoms */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Primary Symptoms / Health Complaints</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mild headache, feverish sensation, sore throat for 3 days."
                    value={bookingSymptoms}
                    onChange={(e) => setBookingSymptoms(e.target.value)}
                    className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Medications */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Current Daily Medications (if any)</label>
                    <input
                      type="text"
                      placeholder="e.g. Panadol 500mg, Amoxil"
                      value={bookingMeds}
                      onChange={(e) => setBookingMeds(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {/* Notes / Special requests */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#1A1A1A] mb-1">Additional Notes / Special Request</label>
                    <input
                      type="text"
                      placeholder="e.g. Requires physical assistance"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-[#FBF9F6] border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={clinicalBookingLoading}
                  className="w-full bg-[#2D5A27] hover:bg-[#20421c] text-white text-[11px] font-black uppercase tracking-widest py-3 px-4 border border-[#2D5A27] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <CloudUpload className="w-4 h-4" />
                  {clinicalBookingLoading ? "Scheduling Consultation..." : "Schedule Appointment & Sync (Supabase)"}
                </button>
              </form>
            </div>

            {/* Right Column: Scheduled Appointments Board */}
            <div id="booking-activity-panel" className="lg:col-span-5 flex flex-col space-y-6">
              <div className="border-2 border-[#1A1A1A] bg-white p-5 shadow-[4px_4px_0px_0px_#1A1A1A] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-2.5">
                  <h3 className="text-sm uppercase font-black text-[#1A1A1A] tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#2D5A27]" />
                    Scheduled Appointments Board
                  </h3>
                  <button 
                    onClick={fetchSupabaseActivity} 
                    disabled={activityLoading}
                    className="text-[9px] uppercase font-bold text-[#2D5A27] hover:underline"
                  >
                    {activityLoading ? "Updating..." : "Refresh Board"}
                  </button>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-thin">
                  {activityLoading ? (
                    <div className="p-8 text-center text-xs text-[#555] font-bold">
                      Connecting with Supabase to retrieve schedules...
                    </div>
                  ) : supabaseAppointments.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 text-xs text-[#666] font-bold">
                      No consultations found on the Supabase board. Fill out the request form to schedule your first appointment!
                    </div>
                  ) : (
                    supabaseAppointments
                      .filter(appt => {
                        // Show all or filter by logged in user email
                        if (!currentUser) return true; // show all for demo guest sessions
                        return (appt.user_email?.toLowerCase() === currentUser.email.toLowerCase()) || 
                               (appt.userEmail?.toLowerCase() === currentUser.email.toLowerCase());
                      })
                      .map((appt, idx) => {
                        const docName = appt.doctor_name || appt.doctorName || "Unknown Specialist";
                        const specialty = appt.specialty || "General Clinic";
                        const apptDate = appt.appointment_date || appt.appointmentDate || "Not Set";
                        const symptoms = appt.symptoms || "General visit";
                        const patientName = appt.user_name || appt.userName || "Guest Patient";
                        const statusColor = idx === 0 ? "bg-green-100 text-green-800 border-green-300" : "bg-slate-100 text-slate-800 border-slate-300";
                        const statusLabel = idx === 0 ? "Confirmed & Synced" : "Scheduled";

                        return (
                          <div key={appt.id || idx} className="p-3.5 border border-slate-200 bg-[#FAF7F4] hover:border-[#1A1A1A] transition-all space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27]">
                                REF: APPT-{appt.id ? appt.id.toString().substring(0, 5).toUpperCase() : `0${idx}`}
                              </span>
                              <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 border ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-950 font-serif italic">{docName}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{specialty}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/60 text-[10px]">
                              <div>
                                <span className="block text-[#777] uppercase font-bold text-[8px]">Date & Time Slot</span>
                                <span className="font-bold text-slate-800">{apptDate}</span>
                              </div>
                              <div>
                                <span className="block text-[#777] uppercase font-bold text-[8px]">Patient Name</span>
                                <span className="font-bold text-slate-800">{patientName}</span>
                              </div>
                            </div>
                            <div className="bg-white/70 border border-slate-100 p-2 text-[9px] text-[#555] font-bold">
                              <strong className="text-slate-700 uppercase block text-[8px]">Primary Symptom logs:</strong>
                              {symptoms}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 text-[9px] font-bold gap-2">
                              {appt.ai_solutions ? (
                                confirmRemovePrescId === appt.id ? (
                                  <button
                                    onClick={() => {
                                      removePrescriptionFromServer(appt.id);
                                      setConfirmRemovePrescId(null);
                                    }}
                                    className="text-red-700 hover:text-red-900 flex items-center gap-1 font-bold animate-pulse cursor-pointer transition-colors"
                                    title="Click again to confirm clearing clinical prescriptions"
                                  >
                                    <CheckCircle className="w-3 h-3 text-red-600" />
                                    Confirm Clear?
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setConfirmRemovePrescId(appt.id)}
                                    className="text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer transition-colors"
                                    title="Clear the clinical diagnostic recommendations/prescriptions from this appointment"
                                  >
                                    <Pill className="w-3 h-3" />
                                    Remove Prescription
                                  </button>
                                )
                              ) : (
                                <span className="text-slate-400 italic font-medium">No prescription attached</span>
                              )}
                              {confirmDeleteId === appt.id ? (
                                <button
                                  onClick={() => {
                                    deleteAppointmentFromServer(appt.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="text-red-700 hover:text-red-900 flex items-center gap-1 font-bold animate-pulse cursor-pointer transition-colors"
                                  title="Click again to confirm canceling appointment"
                                >
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  Confirm Cancel?
                                </button>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(appt.id)}
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Cancel and permanently delete this appointment booking"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Cancel Appointment
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Direct helpline information card */}
              <div className="p-4 bg-[#F4F9F4] border-2 border-[#2D5A27]/30 text-[#1A1A1A] space-y-2">
                <h4 className="text-xs uppercase font-black tracking-widest text-[#2D5A27] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Direct Hospital Helpline Support
                </h4>
                <p className="text-[11px] font-bold text-[#444]">
                  Need immediate medical help or scheduling changes? You can contact our patient services department directly at:
                </p>
                <p className="font-mono text-xs font-black text-[#2D5A27]">
                  Landline: +92 (42) 111-432-587 ( لاہور ) / +92 (21) 111-543-987 ( کراچی )
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Facility F: Doctor Visit Planner */}
      {activeTab === "doctor-planner" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h2 className="text-3xl font-serif italic font-black text-[#2D5A27]">
              Doctor Visit Planner (ڈاکٹر سے ملاقات کا منصوبہ ساز)
            </h2>
            <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
              Prepare a beautiful, structured checklist of details and custom questions to make the most of your next physician consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Planner Form */}
            <div className="lg:col-span-5 border-2 border-[#1A1A1A] bg-white p-5 space-y-4 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <h3 className="text-md font-serif italic font-bold border-b border-[#1A1A1A]/20 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2D5A27]" />
                1. consultation details
              </h3>

              {/* Specialty Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#1A1A1A]">
                  Select Doctor's Specialty (ڈاکٹر کا شعبہ منتخب کریں)
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => {
                    setSelectedSpecialty(e.target.value);
                    setPlannerCustomQuestions([]);
                  }}
                  className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#2D5A27]"
                >
                  {DOCTOR_SPECIALTIES_DATABASE.map((s) => (
                    <option key={s.specialty} value={s.specialty}>
                      {s.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Name and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A]">
                    Doctor / Clinic Name
                  </label>
                  <input
                    type="text"
                    value={plannerDoctorName}
                    onChange={(e) => setPlannerDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Salman (Mayo Hospital)"
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A]">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={plannerAppointmentDate}
                    onChange={(e) => setPlannerAppointmentDate(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Patient Symptoms and Current Medications */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A]">
                    Main symptoms or reason for visit (بنیادی علامات)
                  </label>
                  <textarea
                    rows={2}
                    value={plannerSymptoms}
                    onChange={(e) => setPlannerSymptoms(e.target.value)}
                    placeholder="e.g. High blood pressure spikes, headache for 3 days"
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#1A1A1A]">
                    Current Medicines & Daily Dosages (موجودہ ادویات)
                  </label>
                  <textarea
                    rows={2}
                    value={plannerMeds}
                    onChange={(e) => setPlannerMeds(e.target.value)}
                    placeholder="e.g. Panadol 500mg, Loprin 75mg once daily"
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Custom Questions Planner */}
              <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-2">
                <label className="block text-[10px] uppercase font-bold text-[#1A1A1A]">
                  Add your own custom questions (اپنا سوال لکھیں)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlannerQuestion}
                    onChange={(e) => setNewPlannerQuestion(e.target.value)}
                    placeholder="e.g. Is it safe to take this with food?"
                    className="flex-1 bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newPlannerQuestion.trim()) {
                        setPlannerCustomQuestions([...plannerCustomQuestions, newPlannerQuestion.trim()]);
                        setNewPlannerQuestion("");
                      }
                    }}
                    className="px-4 py-1.5 bg-[#1A1A1A] text-white hover:bg-[#2D5A27] text-xs font-bold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* AI Guidance Trigger */}
              <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-2">
                <button
                  onClick={handleGeneratePlannerAiSolutions}
                  disabled={plannerAiLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2D5A27] text-white py-2.5 px-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {plannerAiLoading ? "Consulting AI Clinical Engine..." : "Generate AI Solutions & Prescriptions"}
                </button>
                <p className="text-[10px] text-slate-500 italic text-center">
                  Uses Gemini AI to produce immediate guidance, clinical recommendations, and target questions based on your symptoms.
                </p>
              </div>
            </div>

            {/* Generated Planner Checklist Visual Sheet */}
            <div id="printable-area" className="lg:col-span-7 border-4 border-[#1A1A1A] bg-[#FDFCFB] p-6 space-y-6 relative shadow-md">
              <div className="absolute top-4 right-4 bg-[#2D5A27] text-white text-[9px] uppercase font-bold px-2 py-0.5 tracking-wider">
                Printable Output Sheet
              </div>

              {/* Title Header */}
              <div className="border-b-4 border-[#1A1A1A] pb-4 space-y-2">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#2D5A27]">
                  HealTrust Pakistan • Verified Medical Planner
                </h4>
                <h3 className="text-xl font-serif italic font-bold">
                  Personal Doctor Visit Consultation Guide
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  This customized preparation guide helps Pakistani patients ask correct, clinically significant questions and summarize symptoms efficiently for high-quality care.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 border border-[#1A1A1A]">
                <div className="text-xs space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#2D5A27]">Visit & Provider</p>
                  <p><strong>Doctor:</strong> {plannerDoctorName || "Unspecified Physician"}</p>
                  <p><strong>Specialty:</strong> {selectedSpecialty}</p>
                  <p><strong>Date:</strong> {plannerAppointmentDate || "Not Scheduled"}</p>
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#2D5A27]">Active Health Profile</p>
                  {currentUser ? (
                    <>
                      <p><strong>Patient Name:</strong> {currentUser.name}</p>
                      <p><strong>Age / Sex:</strong> {currentUser.age || "Unspecified"} / {currentUser.sex || "Unspecified"}</p>
                    </>
                  ) : (
                    <p className="text-slate-500 italic">Guest User Profile (Log in to auto-attach age & sex)</p>
                  )}
                </div>
              </div>

              {/* Symptoms and Meds */}
              <div className="space-y-3 bg-white p-4 border border-[#1A1A1A] text-xs">
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#2D5A27]">Reported Intake (مریض کا بیان)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-slate-700">Symptoms & Complaints:</p>
                    <p className="italic text-slate-800 mt-1">{plannerSymptoms || "None entered yet."}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">Current Medications & Frequencies:</p>
                    <p className="italic text-slate-800 mt-1">{plannerMeds || "None entered yet."}</p>
                  </div>
                </div>
              </div>

              {/* Questions Checklist */}
              <div className="space-y-4">
                <div className="border-b border-[#1A1A1A] pb-1">
                  <h4 className="text-xs uppercase tracking-widest font-black text-[#1A1A1A]">
                    Key Questions to Ask Your Doctor (ڈاکٹر سے پوچھنے والے اہم سوالات)
                  </h4>
                </div>

                <div className="space-y-2">
                  {(() => {
                    const specialtyData = DOCTOR_SPECIALTIES_DATABASE.find(s => s.specialty === selectedSpecialty);
                    const suggestedQ = specialtyData?.suggestedQuestions || [];
                    const suggestedQUrdu = specialtyData?.suggestedQuestionsUrdu || [];

                    return (
                      <div className="space-y-3">
                        {suggestedQ.map((q, idx) => (
                          <div key={idx} className="p-3 bg-white border border-[#1A1A1A]/10 text-xs space-y-1 leading-relaxed">
                            <div className="flex items-start gap-2">
                              <input type="checkbox" defaultChecked className="mt-1 accent-[#2D5A27]" />
                              <div>
                                <p className="font-medium text-slate-900">{q}</p>
                                <p className="text-[12px] font-urdu text-right text-slate-600 font-medium">{suggestedQUrdu[idx]}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {plannerCustomQuestions.map((q, idx) => (
                          <div key={`custom-${idx}`} className="p-3 bg-green-50/40 border border-[#2D5A27]/20 text-xs space-y-1 leading-relaxed flex items-center justify-between">
                            <div className="flex items-start gap-2 flex-1">
                              <input type="checkbox" defaultChecked className="mt-1 accent-[#2D5A27]" />
                              <div>
                                <span className="text-[8px] uppercase font-extrabold tracking-wider bg-slate-200 text-slate-800 px-1 py-0.5 rounded-sm mr-2">Custom</span>
                                <span className="font-medium text-slate-900">{q}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setPlannerCustomQuestions(plannerCustomQuestions.filter((_, i) => i !== idx))}
                              className="text-[10px] text-red-600 font-bold hover:underline shrink-0 ml-3"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* AI Generated Clinical Guidance & Solutions */}
              {(plannerAiSolutions || plannerAiLoading || plannerAiError) && (
                <div className="space-y-3 bg-[#F4F9F2] p-5 border-2 border-[#2D5A27] text-xs">
                  <div className="flex justify-between items-center border-b border-[#2D5A27]/25 pb-2">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#2D5A27] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2D5A27] animate-pulse" />
                      AI Doctor-Visit Planner Solutions & Guidance
                    </p>
                    <span className="text-[8px] uppercase font-bold bg-[#2D5A27] text-white px-2 py-0.5 tracking-wider">
                      Prepared Clinical Prep
                    </span>
                  </div>

                  {plannerAiLoading ? (
                    <div className="py-4 text-center space-y-2">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-[#2D5A27]" />
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest animate-pulse">
                        Consulting AI Clinical Engine...
                      </p>
                    </div>
                  ) : plannerAiError ? (
                    <p className="text-red-700 font-bold font-mono">{plannerAiError}</p>
                  ) : (
                    <div className="space-y-4 text-slate-800 leading-relaxed font-sans select-text">
                      <div className="whitespace-pre-line text-[11px] text-left">
                        {plannerAiSolutions}
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#2D5A27]/20 text-[9px] text-[#2D5A27] font-medium leading-normal italic text-left">
                        * Notice: This checklist and AI advice is generated for educational preparations. It does not replace a physical doctor examination. Share these details with your physician Dr. {plannerDoctorName || "Unspecified"} during your appointment on {plannerAppointmentDate || "Not Scheduled"}.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Output Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#1A1A1A]/20">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 bg-[#2D5A27] text-white hover:bg-[#1a3818] border border-[#1A1A1A] py-2 px-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Opens the browser print dialog. For best results, print selection only."
                >
                  <Download className="w-4 h-4" />
                  Print Checklist
                </button>
                <button
                  type="button"
                  onClick={handleDownloadChecklistText}
                  className="flex-1 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-[#1A1A1A] py-2 px-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Downloads a formatted offline plain-text checklist copy."
                >
                  <FileText className="w-4 h-4 text-[#2D5A27]" />
                  Download Offline Text
                </button>
                <button
                  type="button"
                  onClick={handleSaveVisitPlan}
                  className="flex-1 bg-[#1A1A1A] hover:bg-slate-800 text-white py-2 px-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Save this consultation plan checklist to your local browser history."
                >
                  <CloudUpload className="w-4 h-4 text-white" />
                  Save to History
                </button>
                <button
                  type="button"
                  onClick={handleBookSupabaseAppointment}
                  disabled={bookingLoading}
                  className="flex-1 bg-white hover:bg-slate-50 text-[#2D5A27] border-2 border-[#2D5A27] py-2 px-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <CloudUpload className="w-4 h-4" />
                  {bookingLoading ? "Saving..." : "Save to DB"}
                </button>
              </div>

              {bookingStatus && (
                <div className={`p-4 border-2 text-xs space-y-2 ${bookingStatus.success ? "bg-green-50 border-green-700 text-green-900" : "bg-amber-50 border-amber-700 text-amber-900"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase">
                      {bookingStatus.success ? "✓ Sync Success" : "⚠ Integration Help Required"}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium">{bookingStatus.message}</p>
                  
                  {!bookingStatus.success && (
                    <div className="mt-3 bg-white p-3 border border-amber-300 font-mono text-[10px] text-slate-700 space-y-2 overflow-x-auto max-h-[250px]">
                      <p className="font-sans font-bold text-slate-800 uppercase tracking-wide">
                        Supabase SQL Setup Required: Run this script in your Supabase SQL Editor to construct the required tables!
                      </p>
                      <pre className="whitespace-pre">{`-- 1. Create patients table for registrations & sign-ins
create table if not exists patients (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null unique,
  password text,
  age text,
  sex text,
  other_conditions text,
  allergies text,
  last_sign_in_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create appointments table for appointment bookings
create table if not exists appointments (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  doctor_name text,
  specialty text,
  appointment_date text,
  symptoms text,
  medications text,
  custom_questions jsonb,
  user_id text,
  user_name text,
  user_email text,
  ai_solutions text
);

-- 3. Create admins table for administrative access
create table if not exists admins (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null unique,
  password text not null
);

-- 4. Create diary_logs table for health symptom journal entries
create table if not exists diary_logs (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text,
  primary_symptom text,
  pain_level integer,
  fever text,
  duration text,
  notes text,
  assessment_text text
);

-- 5. CRITICAL: Disable Row Level Security (RLS) to allow read/write operations
alter table patients disable row level security;
alter table appointments disable row level security;
alter table admins disable row level security;
alter table diary_logs disable row level security;

-- 6. FALLBACK POLICIES: In case RLS cannot be disabled on your project
drop policy if exists "Allow public read-write for patients" on patients;
create policy "Allow public read-write for patients" on patients for all using (true) with check (true);

drop policy if exists "Allow public read-write for appointments" on appointments;
create policy "Allow public read-write for appointments" on appointments for all using (true) with check (true);

drop policy if exists "Allow public read-write for admins" on admins;
create policy "Allow public read-write for admins" on admins for all using (true) with check (true);

drop policy if exists "Allow public read-write for diary_logs" on diary_logs;
create policy "Allow public read-write for diary_logs" on diary_logs for all using (true) with check (true);`}</pre>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Saved Visit Plans History section */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 sm:p-6 space-y-4 shadow-[4px_4px_0px_0px_#1A1A1A]">
            <div className="border-b border-[#1A1A1A]/15 pb-2 flex items-center justify-between">
              <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2D5A27]" />
                Your Saved Consultation Plans History (محفوظ کردہ وزٹ پلانز)
              </h3>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-[#F4F9F4] text-[#2D5A27] border border-[#2D5A27]/20">
                {savedVisitPlans.length} Saved Plans
              </span>
            </div>

            {savedVisitPlans.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">
                No consultation plans saved yet. Fill in details on the left, click "Save Plan to History" to persist records.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1A1A1A] bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]">
                      <th className="p-3">Date Saved</th>
                      <th className="p-3">Doctor / Clinic</th>
                      <th className="p-3">Specialty</th>
                      <th className="p-3">Reported Symptoms</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedVisitPlans.map((plan) => (
                      <tr key={plan.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-500">{plan.timestamp}</td>
                        <td className="p-3 font-bold text-slate-900">{plan.doctorName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 border text-[10px] bg-slate-100 text-slate-800 border-slate-200 font-bold uppercase">{plan.specialty}</span>
                        </td>
                        <td className="p-3 italic text-slate-700 max-w-xs truncate">{plan.symptoms}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPlannerDoctorName(plan.doctorName);
                                setSelectedSpecialty(plan.specialty);
                                setPlannerAppointmentDate(plan.appointmentDate);
                                setPlannerSymptoms(plan.symptoms);
                                setPlannerMeds(plan.medications);
                                if (plan.aiSolutions) {
                                  setPlannerAiSolutions(plan.aiSolutions);
                                }
                                window.scrollTo({ top: 300, behavior: "smooth" });
                              }}
                              className="px-2 py-1 border border-slate-300 hover:border-black hover:bg-slate-100 text-[10px] font-extrabold uppercase transition-all cursor-pointer"
                              title="Reload values to printable guide"
                            >
                              Reload
                            </button>
                            {confirmDeleteVisitPlanId === plan.id ? (
                              <div className="flex items-center gap-1 border border-red-200 bg-red-50 p-1 rounded-sm">
                                <span className="text-[9px] text-red-700 font-bold uppercase mr-1">Sure?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteVisitPlan(plan.id);
                                    setConfirmDeleteVisitPlanId(null);
                                  }}
                                  className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] uppercase tracking-wider cursor-pointer rounded-xs"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteVisitPlanId(null)}
                                  className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-[9px] uppercase tracking-wider cursor-pointer rounded-xs"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteVisitPlanId(plan.id)}
                                className="p-1 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors rounded-sm cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Facility G: Supabase Cloud Database Activity Monitor */}
      {activeTab === "supabase-activity" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
          <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-serif italic font-black text-[#2D5A27]">
                Supabase Backend Cloud Activity Board
              </h2>
              <p className="text-xs text-[#555] uppercase tracking-wider mt-1">
                Monitor real-time patient signups, sign-ins, and scheduled clinical appointment visit checklists.
              </p>
            </div>
            <button
              onClick={fetchSupabaseActivity}
              disabled={activityLoading}
              className="px-4 py-2 bg-[#2D5A27] text-white hover:bg-[#1a3818] border border-[#1A1A1A] text-xs font-black uppercase tracking-widest flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${activityLoading ? "animate-spin" : ""}`} />
              {activityLoading ? "Synchronizing..." : "Refresh Cloud Data"}
            </button>
          </div>

          {activityError && (
            <div className="p-4 bg-amber-50 border-2 border-amber-600 text-xs text-amber-900 space-y-3 font-medium">
              <div className="flex items-center gap-2 font-bold uppercase text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                Connection Note: Live Supabase Backend Pending
              </div>
              <p className="leading-relaxed">
                Could not retrieve records from the Supabase cloud backend database. 
                Please ensure you have configured your environment credentials (<code>SUPABASE_URL</code> and <code>SUPABASE_KEY</code>) and run the table creation SQL scripts in your Supabase project's SQL Editor.
              </p>
              
              <div className="bg-white p-3 border border-amber-300 font-mono text-[10px] text-slate-700 space-y-2 overflow-x-auto max-h-[250px]">
                <p className="font-sans font-bold text-slate-800 uppercase tracking-wide">
                  Required Table Initialization SQL Commands:
                </p>
                <pre className="whitespace-pre">{`-- 1. Create patients table for registrations & sign-ins
create table if not exists patients (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null unique,
  password text,
  age text,
  sex text,
  other_conditions text,
  allergies text,
  last_sign_in_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create appointments table for appointment bookings
create table if not exists appointments (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  doctor_name text,
  specialty text,
  appointment_date text,
  symptoms text,
  medications text,
  custom_questions jsonb,
  user_id text,
  user_name text,
  user_email text,
  ai_solutions text
);

-- 3. Create admins table for administrative access
create table if not exists admins (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null unique,
  password text not null
);

-- 4. Create diary_logs table for health symptom journal entries
create table if not exists diary_logs (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text,
  primary_symptom text,
  pain_level integer,
  fever text,
  duration text,
  notes text,
  assessment_text text
);

-- 5. CRITICAL: Disable Row Level Security (RLS) to allow read/write operations
alter table patients disable row level security;
alter table appointments disable row level security;
alter table admins disable row level security;
alter table diary_logs disable row level security;

-- 6. FALLBACK POLICIES: In case RLS cannot be disabled on your project
drop policy if exists "Allow public read-write for patients" on patients;
create policy "Allow public read-write for patients" on patients for all using (true) with check (true);

drop policy if exists "Allow public read-write for appointments" on appointments;
create policy "Allow public read-write for appointments" on appointments for all using (true) with check (true);

drop policy if exists "Allow public read-write for admins" on admins;
create policy "Allow public read-write for admins" on admins for all using (true) with check (true);

drop policy if exists "Allow public read-write for diary_logs" on diary_logs;
create policy "Allow public read-write for diary_logs" on diary_logs for all using (true) with check (true);`}</pre>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Split A: Patients Directory (Left) */}
            <section className="lg:col-span-4 space-y-4">
              <div className="border-b border-black pb-2 flex justify-between items-center">
                <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A]">
                  Patients Registry Activity ({supabasePatients.length})
                </h3>
                <span className="text-[10px] uppercase font-bold text-[#2D5A27] bg-[#F3F8F2] border border-[#2D5A27]/20 px-2 py-0.5">
                  Sign-ups & Logins
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                  className="w-full p-2.5 pl-8 text-xs bg-white border border-[#1A1A1A]"
                />
                <Search className="w-4 h-4 absolute left-2.5 top-3.5 text-gray-400" />
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[550px] pr-1">
                {(() => {
                  const query = patientSearchQuery.toLowerCase().trim();
                  const filtered = supabasePatients.filter(p => 
                    (p.name && p.name.toLowerCase().includes(query)) || 
                    (p.email && p.email.toLowerCase().includes(query))
                  );

                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center border border-dashed border-[#1A1A1A]/20 bg-white text-xs text-gray-400">
                        No registered patients matching your search query.
                      </div>
                    );
                  }

                  return filtered.map((p) => (
                    <div key={p.id} className="border-2 border-[#1A1A1A] bg-[#F7F3EF] p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <h4 className="font-serif font-bold text-sm text-[#1A1A1A] truncate">{p.name}</h4>
                          <p className="text-[10px] font-mono text-slate-500 truncate">{p.email}</p>
                        </div>
                        <span className="text-[9px] uppercase font-black tracking-wider bg-white border border-black/10 px-2 py-0.5 rounded-sm shrink-0">
                          Age: {p.age || "N/A"} • {p.sex || "N/A"}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 bg-white p-2 border border-[#1A1A1A]/10 text-slate-700">
                        <p><strong>Chronic Conditions:</strong> {p.other_conditions || "None declared"}</p>
                        <p><strong>Drug Allergies:</strong> {p.allergies || "None declared"}</p>
                      </div>

                      <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1">
                        <span>Signed Up: {new Date(p.created_at).toLocaleDateString()}</span>
                        <span>Active: {new Date(p.last_sign_in_at || p.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </section>

            {/* Split B: Registered Administrators (Center) */}
            <section className="lg:col-span-4 space-y-4">
              <div className="border-b border-black pb-2 flex justify-between items-center">
                <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A]">
                  Registered Administrators ({supabaseAdmins.length})
                </h3>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-600/20 px-2 py-0.5">
                  Secure Accounts
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search administrators..."
                  value={supabaseAdminSearchQuery}
                  onChange={(e) => setSupabaseAdminSearchQuery(e.target.value)}
                  className="w-full p-2.5 pl-8 text-xs bg-white border border-[#1A1A1A]"
                />
                <Search className="w-4 h-4 absolute left-2.5 top-3.5 text-gray-400" />
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[550px] pr-1">
                {(() => {
                  const query = supabaseAdminSearchQuery.toLowerCase().trim();
                  const filtered = supabaseAdmins.filter(a => 
                    (a.name && a.name.toLowerCase().includes(query)) || 
                    (a.email && a.email.toLowerCase().includes(query))
                  );

                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center border border-dashed border-[#1A1A1A]/20 bg-white text-xs text-gray-400">
                        No registered administrators matching search query.
                      </div>
                    );
                  }

                  return filtered.map((a, idx) => (
                    <div key={a.id || idx} className="border-2 border-[#1A1A1A] bg-amber-50/40 p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="max-w-[100%]">
                          <h4 className="font-serif font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5 truncate">
                            <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {a.name}
                          </h4>
                          <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{a.email}</p>
                        </div>
                      </div>

                      <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-[#1A1A1A]/10">
                        <span>Created: {a.created_at ? new Date(a.created_at).toLocaleDateString() : "System Default"}</span>
                        <span className="text-amber-700 font-extrabold uppercase text-[9px]">Privileged Root</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </section>

            {/* Split C: Appointments List (Right) */}
            <section className="lg:col-span-4 space-y-4">
              <div className="border-b border-black pb-2 flex justify-between items-center">
                <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A]">
                  Scheduled Medical Appointments ({supabaseAppointments.length})
                </h3>
                <span className="text-[10px] uppercase font-bold text-white bg-[#2D5A27] px-2 py-0.5">
                  Live Checklist Syncs
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search appointments by physician, patient or specialty..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full p-2.5 pl-8 text-xs bg-white border border-[#1A1A1A]"
                />
                <Search className="w-4 h-4 absolute left-2.5 top-3.5 text-gray-400" />
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[550px] pr-1">
                {(() => {
                  const query = activitySearchQuery.toLowerCase().trim();
                  const filtered = supabaseAppointments.filter(a => {
                    const docName = (a.doctor_name || a.doctorName || "").toLowerCase();
                    const spec = (a.specialty || "").toLowerCase();
                    const uName = (a.user_name || a.userName || "").toLowerCase();
                    const uEmail = (a.user_email || a.userEmail || "").toLowerCase();
                    return docName.includes(query) || spec.includes(query) || uName.includes(query) || uEmail.includes(query);
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-12 text-center border border-dashed border-[#1A1A1A]/20 bg-white text-xs text-gray-400">
                        No scheduled clinical appointments found matching your query.
                      </div>
                    );
                  }

                  return filtered.map((a, idx) => {
                    const createdDate = a.created_at || a.createdAt || new Date().toISOString();
                    const docName = a.doctor_name || a.doctorName || "Unknown Specialist";
                    const specialty = a.specialty || "General Clinic";
                    const apptDate = a.appointment_date || a.appointmentDate || "Not Set";
                    const symptoms = a.symptoms || "None declared";
                    const medications = a.medications || "None declared";
                    const userName = a.user_name || a.userName || "Guest Session";
                    const userEmail = a.user_email || a.userEmail || "guest@healtrust.pk";
                    const customQuestions = a.custom_questions || a.customQuestions || [];

                    return (
                      <div key={a.id || idx} className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3 relative shadow-sm">
                        <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-400">
                          {new Date(createdDate).toLocaleDateString()} {new Date(createdDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#F4F9F4] border border-[#2D5A27]/20 text-[#2D5A27] shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="max-w-[70%]">
                            <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#2D5A27] bg-[#F4F9F4] border border-[#2D5A27]/20 px-2 py-0.5 inline-block truncate">
                              {specialty}
                            </span>
                            <h4 className="text-md font-serif italic font-bold mt-1 text-slate-900 truncate">
                              Dr. {docName}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                              Target Consultation Date: <strong className="text-slate-800">{apptDate}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-[#1A1A1A]/10 pt-3 text-xs">
                          <div>
                            <p className="font-extrabold text-[#2D5A27] uppercase text-[9px] tracking-wider mb-1">Patient Details</p>
                            <p className="font-bold">{userName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{userEmail}</p>
                          </div>
                          <div>
                            <p className="font-extrabold text-[#2D5A27] uppercase text-[9px] tracking-wider mb-1">Declared State</p>
                            <p className="italic text-slate-700 truncate" title={symptoms}><strong>Symptoms:</strong> {symptoms}</p>
                            <p className="italic text-slate-700 truncate" title={medications}><strong>Meds:</strong> {medications}</p>
                          </div>
                        </div>

                        {customQuestions && Array.isArray(customQuestions) && customQuestions.length > 0 && (
                          <div className="bg-[#F7F3EF] p-2.5 border border-[#1A1A1A]/10 text-xs">
                            <p className="font-bold text-[#1A1A1A] mb-1">Checklist Questions Scheduled:</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                              {customQuestions.map((q: string, i: number) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {a.ai_solutions && (
                          <div className="bg-[#F4F9F2] p-2.5 border border-[#2D5A27]/30 text-xs text-left">
                            <p className="font-bold text-[#2D5A27] flex items-center gap-1 mb-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Active AI Prescription:
                            </p>
                            <p className="text-[11px] text-slate-600 bg-white p-2 border border-slate-200 whitespace-pre-line leading-relaxed max-h-[120px] overflow-y-auto">
                              {a.ai_solutions}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-[#1A1A1A]/10 text-[9px] font-bold">
                          {a.ai_solutions ? (
                            confirmRemovePrescId === a.id ? (
                              <button
                                onClick={() => {
                                  removePrescriptionFromServer(a.id);
                                  setConfirmRemovePrescId(null);
                                }}
                                className="text-red-700 hover:text-red-900 flex items-center gap-1 font-bold animate-pulse cursor-pointer"
                              >
                                <CheckCircle className="w-3 h-3 text-red-600" />
                                Confirm Clear?
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirmRemovePrescId(a.id)}
                                className="text-amber-700 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                              >
                                <Pill className="w-3 h-3 text-amber-600" />
                                Remove Prescription
                              </button>
                            )
                          ) : (
                            <span className="text-slate-400 italic font-medium">No prescription</span>
                          )}
                          {confirmDeleteId === a.id ? (
                            <button
                              onClick={() => {
                                deleteAppointmentFromServer(a.id);
                                setConfirmDeleteId(null);
                              }}
                              className="text-red-700 hover:text-red-900 flex items-center gap-1 font-bold animate-pulse cursor-pointer"
                            >
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              Confirm Delete?
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(a.id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete Appointment
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>

          </div>
        </main>
      )}

      {/* Facility H: Administrative Control Panel */}
      {activeTab === "admin-panel" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
          
          {/* 1. NOT LOGGED IN STATE */}
          {!adminUser ? (
            <div className="max-w-md mx-auto my-12 bg-white border-4 border-[#1A1A1A] p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="text-center border-b-2 border-[#1A1A1A] pb-4 space-y-2">
                <div className="mx-auto w-12 h-12 bg-amber-50 border-2 border-amber-500 text-amber-600 flex items-center justify-center rounded-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif italic font-bold">HealTrust Pakistan</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D5A27]">
                  Administrative Gate
                </p>
              </div>

              {adminExists ? (
                /* Admin Login Form */
                <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                  <p className="text-xs text-slate-500 text-center font-medium">
                    The single administrative slot has been claimed. Please authenticate to access system records.
                  </p>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Administrative Email</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@healtrust.pk"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Security Password</label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {adminError && (
                    <div className="p-3 bg-red-50 border border-red-500 text-xs text-red-700 font-bold">
                      {adminError}
                    </div>
                  )}

                  {adminSuccess && (
                    <div className="p-3 bg-green-50 border border-green-500 text-xs text-green-700 font-bold">
                      {adminSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="w-full bg-[#1A1A1A] text-white hover:bg-[#2D5A27] py-2.5 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {adminLoading ? "Authenticating Admin..." : "Unlock Controls & Enter"}
                  </button>
                </form>
              ) : (
                /* Admin Registration Form (Single Slot!) */
                <form onSubmit={handleAdminRegister} className="space-y-4 text-left">
                  <div className="p-3.5 bg-amber-50 border-l-4 border-amber-500 text-[11px] text-amber-950 leading-relaxed font-medium">
                    <strong>INITIAL APP CONFIGURATION REQUIRED:</strong> A single administrative registration slot is open. The first account created here will claim administrative privileges. After this slot is taken, no further registrations will be permitted.
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Administrator Full Name</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Dr. Admin Malik"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Administrative Email</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@healtrust.pk"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Set Security Password</label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-700">Confirm Security Password</label>
                    <input
                      type="password"
                      required
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  {adminError && (
                    <div className="p-3 bg-red-50 border border-red-500 text-xs text-red-700 font-bold">
                      {adminError}
                    </div>
                  )}

                  {adminSuccess && (
                    <div className="p-3 bg-green-50 border border-green-500 text-xs text-green-700 font-bold">
                      {adminSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="w-full bg-[#2D5A27] text-white hover:bg-[#1a3818] py-2.5 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {adminLoading ? "Registering Admin..." : "Claim Admin Ownership"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* 2. LOGGED IN STATE - FULL BACKEND MONITOR */
            <div className="space-y-6">
              
              {/* Header block with welcome details */}
              <div className="border-4 border-[#1A1A1A] bg-[#F7F3EF] p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-black bg-amber-500 text-black px-2 py-0.5 inline-block">
                      Root Admin Node Active
                    </span>
                    <span className="w-2.5 h-2.5 bg-green-600 rounded-full animate-ping"></span>
                  </div>
                  <h2 className="text-2xl font-serif italic font-bold text-slate-900">
                    Welcome back, {adminUser.name}
                  </h2>
                  <p className="text-xs text-slate-600 font-mono">
                    Owner Node Identity: <strong className="text-slate-800">{adminUser.email}</strong>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchSupabaseActivity}
                    disabled={activityLoading}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#1A1A1A] border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${activityLoading ? "animate-spin" : ""}`} />
                    Sync Cloud Data
                  </button>
                  <button
                    onClick={handleAdminLogOut}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white border border-[#1A1A1A] text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Lock Portal
                  </button>
                </div>
              </div>

              {/* Sub-navigation inside Admin dashboard */}
              <div className="border-b-2 border-[#1A1A1A] flex gap-2 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setAdminActiveTab("bookings")}
                  className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-t-2 border-x-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminActiveTab === "bookings"
                      ? "bg-white text-[#2D5A27] border-[#1A1A1A] border-b-white translate-y-[2px]"
                      : "bg-[#F7F3EF]/60 text-slate-500 border-transparent hover:text-slate-800 hover:bg-[#F7F3EF]"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#2D5A27]" />
                  Clinical Bookings Directory ({supabaseAppointments.length})
                </button>
                <button
                  onClick={() => setAdminActiveTab("patients")}
                  className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-t-2 border-x-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminActiveTab === "patients"
                      ? "bg-white text-[#2D5A27] border-[#1A1A1A] border-b-white translate-y-[2px]"
                      : "bg-[#F7F3EF]/60 text-slate-500 border-transparent hover:text-slate-800 hover:bg-[#F7F3EF]"
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#2D5A27]" />
                  Patient Profiles Registry ({supabasePatients.length})
                </button>
                <button
                  onClick={() => setAdminActiveTab("reviews")}
                  className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-t-2 border-x-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminActiveTab === "reviews"
                      ? "bg-white text-[#2D5A27] border-[#1A1A1A] border-b-white translate-y-[2px]"
                      : "bg-[#F7F3EF]/60 text-slate-500 border-transparent hover:text-slate-800 hover:bg-[#F7F3EF]"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#2D5A27]" />
                  Patient Reviews Moderator ({reviews.length})
                </button>
              </div>

              {/* General Search Input */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder={
                    adminActiveTab === "bookings"
                      ? "Search bookings by doctor, specialty, symptom, or patient..."
                      : adminActiveTab === "patients"
                      ? "Search patients by name, email, or medical notes..."
                      : "Search patient reviews by name, headline, location, description..."
                  }
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 text-xs bg-white border-2 border-[#1A1A1A]"
                />
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              </div>

              {/* TABS CONTAINER */}
              {adminActiveTab === "bookings" ? (
                /* SECTION A: BOOKINGS TABLE & CARDS */
                <div className="space-y-4 text-left">
                  {(() => {
                    const query = adminSearchQuery.toLowerCase().trim();
                    const filtered = supabaseAppointments.filter((a) =>
                      [a.doctor_name, a.specialty, a.symptoms, a.medications, a.user_name, a.user_email]
                        .some((field) => field && field.toLowerCase().includes(query))
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="p-12 text-center border-2 border-dashed border-[#1A1A1A]/30 bg-white text-xs text-slate-400 font-medium">
                          No active clinical bookings found matching your search term.
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map((a) => (
                          <div key={a.id} className="border-4 border-[#1A1A1A] bg-white p-5 space-y-4 relative shadow-md hover:shadow-lg transition-shadow text-left">
                            
                            {/* Card badge header */}
                            <div className="flex justify-between items-start gap-4 border-b border-[#1A1A1A]/10 pb-2.5">
                              <div>
                                <span className="text-[8px] uppercase tracking-widest font-black bg-[#F4F9F4] border border-[#2D5A27]/30 text-[#2D5A27] px-2 py-0.5 inline-block rounded-sm">
                                  {a.specialty}
                                </span>
                                <h4 className="text-md font-serif italic font-bold mt-1 text-slate-900">
                                  Dr. {a.doctor_name}
                                </h4>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[10px] font-bold text-slate-700">Appt Date:</p>
                                <p className="text-[11px] font-mono font-black text-[#2D5A27]">{a.appointment_date || "Not set"}</p>
                              </div>
                            </div>

                            {/* Patient detail subset */}
                            <div className="bg-[#F7F3EF]/60 p-3 border border-[#1A1A1A]/10 text-xs grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#2D5A27]">Patient details</p>
                                <p className="font-bold text-slate-800">{a.user_name || "Guest User"}</p>
                                <p className="text-[10px] text-slate-500 font-mono truncate">{a.user_email || "No email"}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#2D5A27]">Sync Timeline</p>
                                <p className="text-[10px] font-mono text-slate-600">
                                  Saved: {new Date(a.created_at).toLocaleDateString()}
                                </p>
                                <p className="text-[9px] font-mono text-slate-400">
                                  {new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>

                            {/* Symptoms and Meds stated */}
                            <div className="text-xs space-y-2 bg-slate-50 p-3 border border-slate-200">
                              <p className="leading-relaxed">
                                <strong className="text-slate-700">Chief Symptoms:</strong>{" "}
                                <span className="text-slate-800 italic">{a.symptoms || "None declared"}</span>
                              </p>
                              <p className="leading-relaxed">
                                <strong className="text-slate-700">Pre-existing Medications:</strong>{" "}
                                <span className="text-slate-800 italic">{a.medications || "None declared"}</span>
                              </p>
                            </div>

                            {/* Checklist Custom Questions */}
                            {a.custom_questions && Array.isArray(a.custom_questions) && a.custom_questions.length > 0 && (
                              <div className="space-y-1.5 text-xs">
                                <p className="font-bold text-[#1A1A1A]">Programmed Consultation Questions:</p>
                                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                                  {a.custom_questions.map((q: string, i: number) => (
                                    <li key={i} className="leading-normal">{q}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* AI-Generated Clinical Prescriptions / Solutions */}
                            {a.ai_solutions ? (
                              <div className="bg-[#F4F9F2] p-3.5 border-2 border-[#2D5A27]/60 text-xs space-y-2 text-left">
                                <p className="font-bold text-[#2D5A27] flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                  Attached AI Diagnostic/Care Guidance:
                                </p>
                                <div className="whitespace-pre-line text-[11px] text-slate-700 bg-white p-2.5 border border-[#2D5A27]/20 max-h-[160px] overflow-y-auto leading-relaxed scrollbar-thin select-text">
                                  {a.ai_solutions}
                                </div>
                              </div>
                            ) : (
                              <div className="p-2 bg-slate-100 border border-slate-200 text-[10px] text-slate-400 font-medium italic text-center">
                                No AI prep guidance requested for this session.
                              </div>
                            )}

                            {/* Administrative actions */}
                            <div className="flex justify-between items-center pt-3 border-t border-[#1A1A1A]/10 text-xs font-bold">
                              {a.ai_solutions ? (
                                confirmRemovePrescId === a.id ? (
                                  <button
                                    onClick={() => {
                                      removePrescriptionFromServer(a.id);
                                      setConfirmRemovePrescId(null);
                                    }}
                                    className="text-red-700 hover:text-red-900 flex items-center gap-1 font-bold animate-pulse cursor-pointer py-1"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                    Confirm Clear?
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setConfirmRemovePrescId(a.id)}
                                    className="text-amber-700 hover:text-amber-950 flex items-center gap-1 cursor-pointer py-1"
                                  >
                                    <Pill className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    Remove Prescription
                                  </button>
                                )
                              ) : (
                                <span className="text-slate-400 italic text-[11px] font-medium">No prescription attached</span>
                              )}
                              {confirmDeleteId === a.id ? (
                                <button
                                  onClick={() => {
                                    deleteAppointmentFromServer(a.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="text-red-700 hover:text-red-900 flex items-center gap-1 font-bold animate-pulse cursor-pointer py-1"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                  Confirm Delete?
                                </button>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(a.id)}
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer py-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                  Delete Booking
                                </button>
                              )}
                            </div>

                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ) : adminActiveTab === "patients" ? (
                /* SECTION B: PATIENTS DIRECTORY */
                <div className="space-y-4 text-left">
                  {(() => {
                    const query = adminSearchQuery.toLowerCase().trim();
                    const filtered = supabasePatients.filter((p) =>
                      [p.name, p.email, p.other_conditions, p.allergies]
                        .some((field) => field && field.toLowerCase().includes(query))
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="p-12 text-center border-2 border-dashed border-[#1A1A1A]/30 bg-white text-xs text-slate-400 font-medium">
                          No patient registrations found matching your query.
                        </div>
                      );
                    }

                    return (
                      <div className="border-4 border-[#1A1A1A] bg-white overflow-hidden shadow-md">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-[#1A1A1A] text-white uppercase text-[9px] tracking-wider">
                                <th className="p-3 font-extrabold">Patient Details</th>
                                <th className="p-3 font-extrabold">Biological Profile</th>
                                <th className="p-3 font-extrabold">Chronic Conditions</th>
                                <th className="p-3 font-extrabold">Known Drug Allergies</th>
                                <th className="p-3 font-extrabold">Registration/Activity</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1A1A1A]/10">
                              {filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3">
                                    <p className="font-bold text-slate-900">{p.name}</p>
                                    <p className="text-[10px] font-mono text-slate-500">{p.email}</p>
                                  </td>
                                  <td className="p-3 font-medium text-slate-700">
                                    Age: {p.age || "N/A"} <br /> Sex: {p.sex || "Unspecified"}
                                  </td>
                                  <td className="p-3 text-slate-600 font-medium italic">
                                    {p.other_conditions || "None declared"}
                                  </td>
                                  <td className="p-3 text-red-700 font-bold">
                                    {p.allergies || "None declared"}
                                  </td>
                                  <td className="p-3 text-slate-500 font-mono text-[10px]">
                                    Reg: {new Date(p.created_at).toLocaleDateString()} <br />
                                    Active: {new Date(p.last_sign_in_at || p.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* SECTION C: REVIEWS MODERATION PANEL */
                <div className="space-y-4 text-left">
                  {(() => {
                    const query = adminSearchQuery.toLowerCase().trim();
                    const filtered = reviews.filter((r) =>
                      [r.name, r.title, r.review_text, r.review_text_ur, r.location]
                        .some((field) => field && field.toLowerCase().includes(query))
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="p-12 text-center border-2 border-dashed border-[#1A1A1A]/30 bg-white text-xs text-slate-400 font-medium">
                          No patient reviews found matching your moderator query.
                        </div>
                      );
                    }

                    return (
                      <div className="border-4 border-[#1A1A1A] bg-white overflow-hidden shadow-md">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-[#1A1A1A] text-white uppercase text-[9px] tracking-wider">
                                <th className="p-3 font-extrabold">Rating & Stars</th>
                                <th className="p-3 font-extrabold">Patient Name & Location</th>
                                <th className="p-3 font-extrabold">Review Headline</th>
                                <th className="p-3 font-extrabold">Review Content</th>
                                <th className="p-3 font-extrabold">Submission Date</th>
                                <th className="p-3 font-extrabold text-center">Moderation Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1A1A1A]/10">
                              {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3">
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={star} 
                                          className={`w-3 h-3 ${
                                            star <= (r.rating || 5) 
                                              ? "text-amber-500 fill-amber-500" 
                                              : "text-slate-200"
                                          }`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-slate-500 block mt-0.5">
                                      Rating: {r.rating || 5}/5
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <p className="font-bold text-slate-900">{r.name}</p>
                                    <p className="text-[10px] text-slate-500">{r.location || "Pakistan"}</p>
                                  </td>
                                  <td className="p-3 font-medium text-[#2D5A27] font-serif italic">
                                    {r.title || "No headline"}
                                  </td>
                                  <td className="p-3 space-y-1 max-w-sm">
                                    <p className="text-slate-700 leading-relaxed truncate hover:text-clip hover:whitespace-normal" title={r.review_text}>
                                      {r.review_text}
                                    </p>
                                    {r.review_text_ur && (
                                      <p className="text-right font-urdu text-xs text-slate-900 bg-slate-50 p-1 border-r-2 border-[#2D5A27]" title={r.review_text_ur}>
                                        {r.review_text_ur}
                                      </p>
                                    )}
                                  </td>
                                  <td className="p-3 text-slate-500 font-mono text-[10px]">
                                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recent"}
                                  </td>
                                  <td className="p-3 text-center">
                                    {confirmDeleteId === r.id ? (
                                      <button
                                        onClick={() => {
                                          handleDeleteReview(r.id);
                                          setConfirmDeleteId(null);
                                        }}
                                        className="bg-red-600 text-white px-2.5 py-1 border border-red-700 text-[10px] uppercase font-black tracking-widest inline-flex items-center gap-1 rounded-sm cursor-pointer transition-colors animate-pulse"
                                      >
                                        <CheckCircle className="w-3 h-3 shrink-0" />
                                        Confirm?
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setConfirmDeleteId(r.id)}
                                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2.5 py-1 border border-red-200 text-[10px] uppercase font-black tracking-widest inline-flex items-center gap-1 rounded-sm cursor-pointer transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3 shrink-0" />
                                        Remove
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          )}

        </main>
      )}

      {/* Footer Disclaimer */}
      <footer className="mt-auto border-t-2 border-[#1A1A1A] bg-[#F7F3EF] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl text-left">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-tight text-slate-500 leading-relaxed">
              * MEDICAL DISCLAIMER: Online guidance cannot confirm a diagnosis. If symptoms are severe, sudden, worsening, or you are worried, please seek care from a qualified doctor or emergency service immediately.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveTab("admin-panel"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-[10px] font-black uppercase tracking-wider text-[#2D5A27] hover:underline cursor-pointer"
              >
                Portal Administration
              </button>
              <span className="text-[10px] text-slate-400 font-mono">|</span>
              <button 
                onClick={() => { setActiveTab("supabase-activity"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-[10px] font-black uppercase tracking-wider text-slate-600 hover:underline cursor-pointer"
              >
                Cloud Activity Board
              </button>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
              © HealTrust Pakistan • Verified Educational Service
            </p>
            <p className="text-[9px] font-mono opacity-40">
              Responsive Portal • Cloud Native Encryption
            </p>
          </div>
        </div>
      </footer>

      {/* RESCUE 1122 DISPATCH & AMBULANCE SIMULATOR MODAL */}
      {showRescueSimulator && (
        <div className="fixed inset-0 bg-[#1A1A1A]/80 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white border-4 border-[#1A1A1A] max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => {
                if (rescueStage === "tracking") {
                  if (confirm("Are you sure you want to abort this emergency tracking?")) {
                    setShowRescueSimulator(false);
                  }
                } else {
                  setShowRescueSimulator(false);
                }
              }}
              className="absolute right-4 top-4 text-slate-500 hover:text-black font-black font-mono text-lg cursor-pointer border-none bg-transparent"
            >
              ✕
            </button>

            {/* Header */}
            <div className="border-b-2 border-[#1A1A1A] pb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D93025] text-white border border-black rounded-xs mb-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping shrink-0"></span>
                <span className="text-[10px] uppercase font-black tracking-widest font-mono">Rescue 1122 Dispatch Command</span>
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-slate-900">
                Ambulance Dispatch Desk
              </h3>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                Emergency response simulator. Enter patient status and request priority medical transport.
              </p>
            </div>

            {rescueStage === "form" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] uppercase font-extrabold text-slate-700">Patient Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., Muhammad Ali"
                      value={rescuePatientName}
                      onChange={(e) => setRescuePatientName(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] uppercase font-extrabold text-slate-700">Phone Number (Emergency)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., 0321-1234567"
                      value={rescuePhone}
                      onChange={(e) => setRescuePhone(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] uppercase font-extrabold text-slate-700">Distress / Emergency Type</label>
                    <select
                      value={rescueEmergencyType}
                      onChange={(e) => setRescueEmergencyType(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] px-2 py-2 text-xs focus:outline-none"
                    >
                      <option value="Cardiac Arrest / Chest Pain">Cardiac Arrest / Chest Pain</option>
                      <option value="Severe Breathing Difficulty">Severe Breathing Difficulty</option>
                      <option value="Dengue Haemorrhagic Shock / High Fever">Dengue Haemorrhagic Shock / High Fever</option>
                      <option value="Severe Trauma / Active Bleeding">Severe Trauma / Active Bleeding</option>
                      <option value="Unconscious / Unresponsive">Unconscious / Unresponsive</option>
                      <option value="Accident / Trauma">Accident / Trauma</option>
                      <option value="Other High Alert Event">Other High Alert Event</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] uppercase font-extrabold text-slate-700">District / City Hub</label>
                    <select
                      value={rescueCity}
                      onChange={(e) => setRescueCity(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] px-2 py-2 text-xs focus:outline-none"
                    >
                      <option value="Lahore">Lahore Hub</option>
                      <option value="Karachi">Karachi Hub</option>
                      <option value="Islamabad">Islamabad Hub</option>
                      <option value="Rawalpindi">Rawalpindi Hub</option>
                      <option value="Peshawar">Peshawar Hub</option>
                      <option value="Quetta">Quetta Hub</option>
                      <option value="Multan">Multan Hub</option>
                      <option value="Faisalabad">Faisalabad Hub</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="block text-[10px] uppercase font-extrabold text-slate-700">Exact Location Address & Landmark</label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="e.g., Apartment 4B, Sector G-11, near Islamabad Model College gate"
                    value={rescueAddress}
                    onChange={(e) => setRescueAddress(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-red-50 border-l-4 border-red-600 text-[11px] text-red-950 leading-relaxed text-left">
                  <strong>⚠️ CRITICAL DISCLAIMER:</strong> This is a high-fidelity Rescue 1122 Emergency Dispatch Simulation. Submitting an emergency here will launch a simulated dispatch monitor to track ambulance routes and receive clinical bystander instructions.
                </div>

                {rescueError && (
                  <div className="p-3 bg-red-100 border-2 border-red-600 text-xs text-red-950 font-bold text-left animate-shake">
                    🚨 {rescueError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={startRescueTracking}
                  className="w-full bg-[#D93025] hover:bg-[#b0221a] text-white py-3 text-xs font-black uppercase tracking-widest border border-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  Initiate 1122 Dispatch Uplink
                </button>
              </div>
            )}

            {rescueStage === "connecting" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75"></span>
                  <div className="w-16 h-16 bg-[#D93025] rounded-full border-4 border-black text-white flex items-center justify-center relative">
                    <PhoneCall className="w-7 h-7 animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif italic font-bold text-lg text-slate-950">Connecting with Dispatch Operator...</h4>
                  <p className="text-[11px] text-slate-500 font-mono">ESTABLISHING ENCRYPTED VOICE & DATA LINK</p>
                </div>
                <div className="w-full max-w-xs bg-slate-50 border border-slate-200 p-3.5 font-mono text-[10px] text-slate-600 text-left space-y-1">
                  {rescueLog.map((log, index) => (
                    <p key={index}>{log}</p>
                  ))}
                </div>
              </div>
            )}

            {rescueStage === "tracking" && (
              <div className="space-y-6">
                
                {/* Visual ambulance progress bar */}
                <div className="bg-slate-100 border-2 border-[#1A1A1A] p-4 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase font-mono text-slate-600">
                    <span>Base Hospital</span>
                    <span className="text-[#D93025] animate-pulse">🚑 En Route</span>
                    <span>Patient Location</span>
                  </div>
                  
                  {/* Outer track bar */}
                  <div className="w-full h-4 bg-slate-200 border border-black relative rounded-full overflow-hidden">
                    {/* Progress track fill */}
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000 relative animate-pulse"
                      style={{ width: `${Math.min(100, ((600 - rescueEta) / 600) * 100)}%` }}
                    >
                    </div>
                  </div>

                  <div className="mt-2.5 flex justify-between items-center text-xs">
                    <p className="font-bold text-slate-800">
                      Ambulance <span className="font-mono text-[#D93025] font-black">{rescueAmbulanceNo}</span>
                    </p>
                    <p className="font-mono font-bold text-slate-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-xs">
                      ETA: {Math.floor(rescueEta / 60)}m {rescueEta % 60}s
                    </p>
                  </div>
                </div>

                {/* Distress card context details */}
                <div className="bg-[#F7F3EF] border-2 border-black p-3.5 text-xs text-left grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">Emergency patient</span>
                    <span className="font-bold text-slate-900">{rescuePatientName}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">Emergency contact</span>
                    <span className="font-bold font-mono text-slate-900">{rescuePhone}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-300 pt-2 mt-1">
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">Emergency distress alert type</span>
                    <span className="font-bold text-red-700">{rescueEmergencyType}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">Destination physical coordinates</span>
                    <span className="font-bold text-slate-800 italic">{rescueAddress} ({rescueCity} Hub)</span>
                  </div>
                </div>

                {/* Dispatch console log feed */}
                <div className="text-left space-y-1.5">
                  <p className="text-[10px] uppercase font-black text-slate-700 tracking-wider font-mono">Live Dispatch Feed Logs:</p>
                  <div className="bg-slate-950 text-emerald-400 p-4 rounded-xs border-2 border-black max-h-[140px] overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1.5 scrollbar-thin select-text">
                    {rescueLog.map((log, index) => (
                      <p key={index} className="flex gap-2">
                        <span>&gt;</span>
                        <span>{log}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Interactive bystander actions */}
                <div className="border-t border-slate-200 pt-4 text-left space-y-2">
                  <p className="text-[10px] uppercase font-extrabold text-slate-700 tracking-wider">Critical Bystander Care Guidelines:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 leading-relaxed bg-[#F4F9F2] p-3 border border-[#2D5A27]/20">
                    <p className="font-medium">• Keep the patient calm. Elevate head if breathing is heavy, but do not move them if trauma is suspected.</p>
                    <p className="font-medium">• Ensure someone is waiting on the main access road/gate to direct Ambulance {rescueAmbulanceNo} quickly.</p>
                  </div>
                </div>

                {/* Close/Acknowledge button */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Cancel current dispatch mission? This will clear logs and return the unit.")) {
                        setShowRescueSimulator(false);
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 text-xs font-black uppercase tracking-widest border border-black cursor-pointer transition-colors border-none"
                  >
                    Cancel Dispatch Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRescueSimulator(false)}
                    className="flex-1 bg-slate-900 hover:bg-black text-white py-2 px-4 text-xs font-black uppercase tracking-widest border border-black cursor-pointer transition-colors border-none"
                  >
                    Minimize & Close Window
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Dynamic Toast Alerts banner */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-md border-2 shadow-lg transition-all duration-300 transform translate-y-0 max-w-sm ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-500 text-emerald-950" 
            : toast.type === "error" 
              ? "bg-rose-50 border-rose-500 text-rose-950" 
              : "bg-blue-50 border-blue-500 text-blue-950"
        }`}>
          {toast.type === "success" && <span className="text-emerald-500 font-bold text-lg">✓</span>}
          {toast.type === "error" && <span className="text-rose-500 font-bold text-lg">✕</span>}
          {toast.type === "info" && <span className="text-blue-500 font-bold text-lg">ℹ</span>}
          <p className="text-xs font-bold leading-tight flex-1">{toast.message}</p>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-900 ml-2 font-black font-mono text-[10px] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
