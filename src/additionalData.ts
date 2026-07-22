import { HospitalClinic, MedicationSafetyInfo } from "./types";

export const HOSPITAL_DIRECTORY: HospitalClinic[] = [
  // Lahore
  {
    id: "lhr-1",
    name: "Mayo Hospital (Emergency Department)",
    city: "Lahore",
    address: "Hospital Road, Near Anarkali Bazaar, Lahore",
    phone: "042-99211100",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Blood Bank", "X-Ray", "Basic Pathology", "CT Scan"]
  },
  {
    id: "lhr-2",
    name: "Shaukat Khanum Memorial Cancer Hospital & Research Centre",
    city: "Lahore",
    address: "7A Block R-3, Johar Town, Lahore",
    phone: "042-35905000",
    type: "Private Hospital",
    is24_7: true,
    labsAvailable: ["Advanced PCR", "Cancer Screening", "Biopsy", "Hematology", "Radiology"]
  },
  {
    id: "lhr-3",
    name: "Chughtai Lab & Healthcare Head Office",
    city: "Lahore",
    address: "7-A Jail Road, Main Gulberg, Lahore",
    phone: "03-111-255-778",
    type: "Diagnostics Lab",
    is24_7: true,
    labsAvailable: ["Complete Blood Count (CBC)", "Dengue NS1 Antigen", "Malaria Smear", "Kidney Function Test"]
  },
  {
    id: "lhr-4",
    name: "Al-Khidmat Hospital & Diagnostic Center",
    city: "Lahore",
    address: "Wahdat Road, Clifton Colony, Lahore",
    phone: "042-35864115",
    type: "Charity Trust Hospital",
    is24_7: true,
    labsAvailable: ["Routine Lab", "Ultrasound", "Vaccination Center"]
  },

  // Karachi
  {
    id: "khi-1",
    name: "Jinnah Postgraduate Medical Centre (JPMC)",
    city: "Karachi",
    address: "Rafiqui Shaheed Road, Cantonment Board, Karachi",
    phone: "021-99201300",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Trauma Unit Lab", "Emergency Blood", "X-Ray", "ECG"]
  },
  {
    id: "khi-2",
    name: "Aga Khan University Hospital (AKUH)",
    city: "Karachi",
    address: "National Stadium Road, Aga Khan 3, Karachi",
    phone: "021-111-911-911",
    type: "Private Hospital",
    is24_7: true,
    labsAvailable: ["Highly Advanced Pathology", "MRI/CT", "Toxicology", "Pediatric Labs"]
  },
  {
    id: "khi-3",
    name: "The Indus Hospital",
    city: "Karachi",
    address: "Plot C-131, Sector 31-D, Korangi Crossing, Karachi",
    phone: "021-35112709",
    type: "Charity Trust Hospital",
    is24_7: true,
    labsAvailable: ["Free Clinical Labs", "Tuberculosis Testing", "Blood Transfusions"]
  },
  {
    id: "khi-4",
    name: "Dow Diagnostics Lab Center",
    city: "Karachi",
    address: "Baba-e-Urdu Road, Karachi",
    phone: "021-111-362-273",
    type: "Diagnostics Lab",
    is24_7: true,
    labsAvailable: ["Dengue / PCR Testing", "Electrolyte Studies", "Hormonal Assays"]
  },

  // Islamabad & Rawalpindi
  {
    id: "isb-1",
    name: "Pakistan Institute of Medical Sciences (PIMS)",
    city: "Islamabad",
    address: "G-8/3, Islamabad",
    phone: "051-9261170",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Burn Center Lab", "Cardiac Pathology", "Surgical Emergency Labs"]
  },
  {
    id: "isb-2",
    name: "Shifa International Hospital",
    city: "Islamabad",
    address: "H-8/4, Islamabad",
    phone: "051-8463000",
    type: "Private Hospital",
    is24_7: true,
    labsAvailable: ["Organ Transplant Diagnostics", "Vascular Laboratory", "Advanced Chemistry"]
  },
  {
    id: "rwp-1",
    name: "Holy Family Hospital (HFH)",
    city: "Rawalpindi",
    address: "Satellite Town, Rawalpindi",
    phone: "051-9290321",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Gynecological Emergency", "Pediatric High Dependency Labs", "Microbiology"]
  },

  // Other Major Cities
  {
    id: "pesh-1",
    name: "Khyber Teaching Hospital (KTH)",
    city: "Peshawar",
    address: "University Road, Peshawar",
    phone: "091-9216340",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Blood Transfusion", "Emergency Surgery Diagnostics", "Ultrasound"]
  },
  {
    id: "quetta-1",
    name: "Sandeman Provincial Hospital (Civil Hospital)",
    city: "Quetta",
    address: "Jinnah Road, Quetta",
    phone: "081-9202013",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Trauma Blood Bank", "Basic Urinalysis", "Digital Radiography"]
  },
  {
    id: "mul-1",
    name: "Nishtar Hospital Emergency Complex",
    city: "Multan",
    address: "Nishtar Road, Multan",
    phone: "061-9200231",
    type: "Government Emergency",
    is24_7: true,
    labsAvailable: ["Dengue Special Lab Room", "Electrolytes Panel", "CT Scan"]
  }
];

export const MEDICATION_SAFETY_DATABASE: MedicationSafetyInfo[] = [
  {
    id: "med-1",
    brandNames: ["Panadol", "Calpol", "Disprol", "Febrol"],
    genericName: "Paracetamol / Acetaminophen",
    usageCategory: "Pain relief and Fever reduction",
    urduUsage: "بخار دور کرنے اور جسمانی درد کم کرنے کے لیے",
    safeDosageAdult: "500mg to 1000mg (1-2 tablets) every 4-6 hours. Never exceed 4000mg (8 tablets) in 24 hours.",
    safeDosageChild: "Usually 10-15mg per kg body weight per dose. Consult pediatrician for exact syrup dosage.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "Extremely harmful to the liver in overdose. Never double-dose or take along with other cold remedies containing paracetamol.",
    urduAlerts: "زیادہ مقدار جگر (liver) کو شدید نقصان پہنچا سکتی ہے۔ ایک وقت میں مقررہ سے زیادہ خوراک نہ لیں۔"
  },
  {
    id: "med-2",
    brandNames: ["Brufen", "Cafen"],
    genericName: "Ibuprofen (NSAID)",
    usageCategory: "Anti-inflammatory & Intense Painkiller",
    urduUsage: "سوجن اور شدید جوڑوں یا دانت کے درد کے لیے",
    safeDosageAdult: "200mg to 400mg every 6-8 hours after meals. Max 1200mg per day.",
    safeDosageChild: "Do not give to children under 6 months without clear doctor guidance.",
    pregnancySafety: "Strictly Avoid",
    criticalAlerts: "Must be taken with food. Avoid if you have active stomach ulcers, asthma, or kidney disease. Avoid during late pregnancy.",
    urduAlerts: "خالی پیٹ لینے سے معدے میں زخم (ulcers) ہو سکتے ہیں۔ دمہ اور گردے کے مریض احتیاط کریں۔"
  },
  {
    id: "med-3",
    brandNames: ["Flagyl", "Metrozine"],
    genericName: "Metronidazole (Antiprotozoal/Antibiotic)",
    usageCategory: "Stomach infections & loose motions",
    urduUsage: "پیٹ کی خرابی، مروڑ اور دست (diarrhea) کے لیے",
    safeDosageAdult: "Usually 400mg three times a day, strictly as prescribed by a qualified physician.",
    safeDosageChild: "Dosage depends strictly on age/weight. Never self-prescribe.",
    pregnancySafety: "Avoid unless critical",
    criticalAlerts: "Strictly avoid any alcohol or heavy vinegar products. Complete the full course. Do not stop early even if diarrhea stops.",
    urduAlerts: "خود سے اینٹی بائیوٹک شروع نہ کریں۔ کورس مکمل کریں ورنہ جراثیم دوبارہ حملہ کر سکتے ہیں۔"
  },
  {
    id: "med-4",
    brandNames: ["Augmentin", "Clamoxin"],
    genericName: "Amoxicillin + Clavulanic Acid (Antibiotic)",
    usageCategory: "Broad-spectrum Bacterial Infections",
    urduUsage: "بیکٹیریل انفیکشن (جیسے گلے، کان یا چھاتی کی خرابی)",
    safeDosageAdult: "375mg, 625mg or 1g tablets, usually taken twice or thrice daily for 5-7 days under prescription.",
    safeDosageChild: "Syrup suspension based on exact child weight. Prescribed by pediatricians only.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "This is an antibiotic. It is completely ineffective against viruses like Flu, Cold, Dengue, or Covid. Misuse leads to dangerous antibiotic resistance.",
    urduAlerts: "یہ اینٹی بائیوٹک ہے۔ نزلہ، زکام، ڈینگی یا کورونا جیسے وائرل بخار میں اس کا کوئی فائدہ نہیں۔"
  },
  {
    id: "med-5",
    brandNames: ["Ponstan", "Mefnac"],
    genericName: "Mefenamic Acid",
    usageCategory: "Dental pain & Menstrual pain relief",
    urduUsage: "دانت کے درد اور خواتین میں مخصوص ایام کے درد کے لیے",
    safeDosageAdult: "Usually 250mg or 500mg capsules after meals, maximum 3 times a day for limited duration.",
    safeDosageChild: "Not recommended for young children unless specified.",
    pregnancySafety: "Strictly Avoid",
    criticalAlerts: "Can trigger asthma attacks in sensitive individuals. Do not use for more than 7 days continuously without consulting your dentist/doctor.",
    urduAlerts: "مسلسل ۷ دن سے زیادہ استعمال نہ کریں۔ دمہ کے مریض احتیاط سے کام لیں۔"
  },
  {
    id: "med-6",
    brandNames: ["Entamizole", "Nidazole-Co"],
    genericName: "Diloxanide Furoate + Metronidazole",
    usageCategory: "Amoebic Dysentery & mixed bowel infections",
    urduUsage: "پیچش اور انتڑیوں کی شدید خرابی کے لیے",
    safeDosageAdult: "Usually 1 tablet three times daily for 5-10 days as directed by your doctor.",
    safeDosageChild: "Only under expert clinical guidance.",
    pregnancySafety: "Consult gynecologist",
    criticalAlerts: "May cause minor metallic taste, nausea, or headache. Do not take on an empty stomach.",
    urduAlerts: "دوا کے استعمال سے منہ کا ذائقہ تبدیل ہو سکتا ہے۔ ہمیشہ کھانا کھانے کے بعد لیں۔"
  },
  {
    id: "med-7",
    brandNames: ["Arinac", "Sina-Flu"],
    genericName: "Ibuprofen + Pseudoephedrine",
    usageCategory: "Nasal congestion & Sinus pressure",
    urduUsage: "بند ناک، زکام اور سر درد کے لیے",
    safeDosageAdult: "1-2 tablets every 4 to 6 hours. Do not exceed 6 tablets in 24 hours.",
    safeDosageChild: "Do not give to children under 12 years of age.",
    pregnancySafety: "Strictly Avoid",
    criticalAlerts: "Contains pseudoephedrine, which can raise heart rate and blood pressure. Avoid if you have severe hypertension or heart disease.",
    urduAlerts: "ہائی بلڈ پریشر یا دل کے مریض یہ دوا استعمال نہ کریں۔ اس سے دل کی دھڑکن تیز ہو سکتی ہے۔"
  },
  {
    id: "med-8",
    brandNames: ["Glucophage", "Neodipar"],
    genericName: "Metformin Hydrochloride",
    usageCategory: "Diabetes Management & Blood Sugar Control",
    urduUsage: "خون میں شوگر کی مقدار (Diabetes) کو کنٹرول کرنے کے لیے",
    safeDosageAdult: "Usually 500mg, 850mg or 1000mg tablets, taken with or after meals once or twice daily. Max 2000mg per day.",
    safeDosageChild: "Only prescribed by pediatric endocrinologists for specific cases.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "Can cause mild stomach upset or diarrhea initially. Always take with meals to reduce gastrointestinal side effects. Watch for signs of lactic acidosis (rare but severe).",
    urduAlerts: "شروع میں معدہ خراب یا دست ہو سکتے ہیں۔ ہمیشہ کھانے کے دوران یا فوراً بعد لیں۔"
  },
  {
    id: "med-9",
    brandNames: ["Risek", "Omep", "Zepril", "Oprazole"],
    genericName: "Omeprazole (Proton Pump Inhibitor)",
    usageCategory: "Acid Reflux, Heartburn & Gastric Ulcers",
    urduUsage: "معدے کی تیزابیت، جلن، اور السر کے علاج کے لیے",
    safeDosageAdult: "Usually 20mg or 40mg capsules taken once daily in the morning, strictly 30-60 minutes before breakfast.",
    safeDosageChild: "Prescribed by medical specialist based on age and body weight for severe acid reflux.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "Long term unmonitored use can reduce calcium absorption and lead to bone weakness or kidney fatigue. Do not use for months without checking with a doctor.",
    urduAlerts: "ہمیشہ صبح خالی پیٹ ناشتے سے آدھا گھنٹہ پہلے لیں۔ طویل عرصے تک بغیر مشورے کے استعمال نہ کریں۔"
  },
  {
    id: "med-10",
    brandNames: ["Loprin", "Ascard", "Aspirin"],
    genericName: "Low-Dose Aspirin (Acetylsalicylic Acid)",
    usageCategory: "Blood Thinner & Cardiovascular Protection",
    urduUsage: "خون کو پتلا رکھنے اور دل کے دورے (Heart Attack) سے بچاؤ کے لیے",
    safeDosageAdult: "75mg to 150mg once daily after a meal. Never take on an empty stomach.",
    safeDosageChild: "Strictly forbidden for children under 16 due to the risk of Reye's Syndrome (a severe brain/liver disorder).",
    pregnancySafety: "Consult gynecologist",
    criticalAlerts: "Increases risk of internal bleeding or stomach ulcers. Discontinue prior to elective surgical procedures under consulting doctor's advice.",
    urduAlerts: "بچوں کو ہرگز نہ دیں۔ اس سے اندرونی خون بہنے یا معدے میں سوزش کا خطرہ بڑھ سکتا ہے۔"
  },
  {
    id: "med-11",
    brandNames: ["Ventolin", "Salbo"],
    genericName: "Salbutamol (Bronchodilator)",
    usageCategory: "Asthma, Wheezing & Respiratory Relief Inhaler",
    urduUsage: "دمہ، کھانسی اور سانس کی تنگی کو دور کرنے کے لیے",
    safeDosageAdult: "1 to 2 puffs of inhaler as needed for sudden shortness of breath, up to 4 times a day.",
    safeDosageChild: "Use with a spacer device under adult supervision. Dosage specified by pediatrician.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "Can cause mild hand tremors, increased heart rate, or restlessness. If your symptoms do not improve after 4 puffs, seek emergency care immediately.",
    urduAlerts: "اس کے استعمال سے ہاتھ کانپ سکتے ہیں یا دل کی دھڑکن تیز ہو سکتی ہے۔ شدید تنگی میں فوری ہسپتال جائیں۔"
  },
  {
    id: "med-12",
    brandNames: ["Gravinate", "Vomil", "Nausex"],
    genericName: "Dimenhydrinate (Antihistamine)",
    usageCategory: "Nausea, Vomiting & Motion Sickness",
    urduUsage: "الٹی، متلی، چکر آنے اور سفر کے دوران طبیعت کی خرابی کے لیے",
    safeDosageAdult: "500mg to 100mg (1-2 tablets) every 4-6 hours. Max 400mg per day.",
    safeDosageChild: "Consult a doctor for appropriate pediatric liquid syrup dosing. Avoid in newborns.",
    pregnancySafety: "Consult gynecologist",
    criticalAlerts: "Causes significant drowsiness. Do not drive or operate heavy machinery after taking this medicine. Avoid combining with alcohol or other sedatives.",
    urduAlerts: "اس دوا سے شدید نیند یا غنودگی ہو سکتی ہے۔ گاڑی چلانے یا مشینری کے استعمال سے پرہیز کریں۔"
  },
  {
    id: "med-13",
    brandNames: ["Fexet", "Telfast", "Fexo"],
    genericName: "Fexofenadine Hydrochloride (Non-Drowsy Antihistamine)",
    usageCategory: "Seasonal Allergies, Sneezing & Runny Nose",
    urduUsage: "الرجی، چھینکوں، خارش اور بہتی ہوئی ناک کے آرام کے لیے",
    safeDosageAdult: "60mg twice daily or 120mg / 180mg once daily with water.",
    safeDosageChild: "Pediatric syrup format available for children over 2 years, dosed strictly by weight.",
    pregnancySafety: "Avoid unless critical",
    criticalAlerts: "Non-drowsy formulation for most people, but always check individual sensitivity. Do not take with fruit juices (grapefruit, apple, orange) as they decrease absorption.",
    urduAlerts: "اسے پھلوں کے جوس کے ساتھ مت لیں کیونکہ اس سے دوا کا اثر کم ہو جاتا ہے؛ ہمیشہ سادہ پانی سے لیں۔"
  },
  {
    id: "med-14",
    brandNames: ["Surbex-Z", "Cac-1000", "Theragran-M"],
    genericName: "Multivitamins with Zinc & Vitamin C",
    usageCategory: "Immunity Booster & Nutritional Supplement",
    urduUsage: "جسمانی کمزوری، قوت مدافعت بڑھانے اور وٹامنز کی کمی دور کرنے کے لیے",
    safeDosageAdult: "1 tablet daily, preferably in the morning after breakfast.",
    safeDosageChild: "Use specialized children's multi-syrups under pediatric recommendation.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "Taking vitamin supplements on an empty stomach may cause mild nausea or abdominal cramps. Do not exceed the daily recommended dosage.",
    urduAlerts: "خالی پیٹ لینے سے ہلکی متلی ہو سکتی ہے، اس لیے ناشتے کے بعد لیں۔ روزانہ ایک سے زیادہ گولی نہ لیں۔"
  },
  {
    id: "med-15",
    brandNames: ["Softin", "Lorin", "Loratadine"],
    genericName: "Loratadine (Second-generation Antihistamine)",
    usageCategory: "Allergic Rhinitis, Skin Rashes & Hives",
    urduUsage: "چمڑی کی الرجی، خارش اور ہر طرح کی الرجی کی علامات کے لیے",
    safeDosageAdult: "10mg (1 tablet) once daily.",
    safeDosageChild: "5mg once daily for children aged 2-5; 10mg once daily for children over 6 years.",
    pregnancySafety: "Safe under advice",
    criticalAlerts: "Generally safe and well-tolerated. If liver or kidney disease exists, consult your doctor to adjust the dosing frequency.",
    urduAlerts: "گردے یا جگر کے مریض استعمال سے پہلے ڈاکٹر سے مشورہ کر کے خوراک کا تعین کروائیں۔"
  },
  {
    id: "med-16",
    brandNames: ["Zyloric", "Purinol"],
    genericName: "Allopurinol (Uric Acid Inhibitor)",
    usageCategory: "Gout & Elevated Serum Uric Acid Treatment",
    urduUsage: "یورک ایسڈ (Uric Acid) کو کم کرنے اور جوڑوں کے شدید درد سے بچاؤ کے لیے",
    safeDosageAdult: "Usually starting at 100mg daily, titrated up to 300mg daily after meals under direct medical supervision.",
    safeDosageChild: "Not recommended for general pediatric use.",
    pregnancySafety: "Avoid unless critical",
    criticalAlerts: "Drink plenty of water (at least 2-3 liters per day) to prevent the formation of kidney stones. Discontinue and seek urgent help if any skin rash occurs.",
    urduAlerts: "استعمال کے دوران زیادہ سے زیادہ پانی پیئں۔ اگر جسم پر سرخ نشان یا ریشز ہوں تو دوا فوراً روک دیں۔"
  },
  {
    id: "med-17",
    brandNames: ["Ciproxin", "Novidat", "Cipro"],
    genericName: "Ciprofloxacin (Fluoroquinolone Antibiotic)",
    usageCategory: "Severe Urinary & Gastrointestinal Infections",
    urduUsage: "پیٹ، پیشاب کی نالی یا ٹائیفائیڈ (Typhoid) کے بیکٹیریل انفیکشن کے لیے",
    safeDosageAdult: "Usually 250mg or 500mg tablets, taken twice daily (every 12 hours) for 3 to 7 days.",
    safeDosageChild: "Generally avoided in children due to potential cartilage damage risks, unless explicitly prescribed by a pediatrician.",
    pregnancySafety: "Strictly Avoid",
    criticalAlerts: "Do not take with milk, yogurt, or calcium-fortified juices. Complete the full course. Can rarely cause tendonitis or joint issues.",
    urduAlerts: "یہ طاقتور اینٹی بائیوٹک ہے۔ اسے دودھ یا دہی کے ساتھ مت لیں۔ ڈاکٹر کے مشورے کے بغیر ہرگز استعمال نہ کریں۔"
  }
];
