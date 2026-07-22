export interface LabTestReference {
  id: string;
  name: string;
  urduName: string;
  category: "Blood Count" | "Kidney/Liver" | "Diabetes" | "Infections" | "Heart/Lipids";
  normalRangeText: string;
  normalRangeTextUrdu: string;
  unit: string;
  minVal: number;
  maxVal: number;
  about: string;
  aboutUrdu: string;
  whatHighMeans: string;
  whatHighMeansUrdu: string;
  whatLowMeans: string;
  whatLowMeansUrdu: string;
}

export interface DoctorSpecialtyTemplate {
  specialty: string;
  description: string;
  descriptionUrdu: string;
  suggestedQuestions: string[];
  suggestedQuestionsUrdu: string[];
}

export const LAB_TESTS_DATABASE: LabTestReference[] = [
  {
    id: "lab-platelets",
    name: "Platelet Count (PLT)",
    urduName: "پلیٹلیٹس کاؤنٹ",
    category: "Blood Count",
    normalRangeText: "150,000 - 450,000",
    normalRangeTextUrdu: "150,000 سے 450,000",
    unit: "cells/mcL",
    minVal: 150000,
    maxVal: 450000,
    about: "Platelets are blood cells that help with clotting. Monitoring platelets is highly critical during Dengue season in Pakistan.",
    aboutUrdu: "پلیٹلیٹس خون کے خلیات ہیں جو خون کو جمنے میں مدد دیتے ہیں۔ پاکستان میں ڈینگی بخار کے موسم میں اس ٹیسٹ کی نگرانی انتہائی ضروری ہے۔",
    whatHighMeans: "High levels (Thrombocytosis) can increase risk of blood clots. Can be caused by inflammation, infection, or iron deficiency.",
    whatHighMeansUrdu: "پلیٹلیٹس کی زیادتی خون جمنے کے خطرے کو بڑھا سکتی ہے۔ یہ سوزش، انفیکشن، یا آئرن کی کمی کے باعث ہو سکتا ہے۔",
    whatLowMeans: "Low levels (Thrombocytopenia) are common in Dengue or Malaria. It increases the risk of bleeding (gums, nose, skin spots). Seek immediate same-day doctor assessment if below 100,000.",
    whatLowMeansUrdu: "پلیٹلیٹس کی کمی ڈینگی یا ملیریا بخار میں عام ہے۔ اس سے مسوڑھوں، ناک، یا جلد سے خون بہنے کا خطرہ بڑھ جاتا ہے۔ اگر یہ ۱ لاکھ سے کم ہو تو فوری ڈاکٹر سے رجوع کریں۔"
  },
  {
    id: "lab-hemoglobin",
    name: "Hemoglobin (Hb)",
    urduName: "ہیموگلوبن",
    category: "Blood Count",
    normalRangeText: "12.0 - 16.5 (Female: 12.0-15.5, Male: 13.5-17.5)",
    normalRangeTextUrdu: "12.0 سے 16.5 (خواتین: 12.0-15.5، مرد: 13.5-17.5)",
    unit: "g/dL",
    minVal: 12.0,
    maxVal: 17.5,
    about: "Hemoglobin is the oxygen-carrying protein in red blood cells. Iron-deficiency anemia is highly prevalent in Pakistani women and children.",
    aboutUrdu: "ہیموگلوبن سرخ خلیات میں آکسیجن پہنچانے والا پروٹین ہے۔ پاکستانی خواتین اور بچوں میں آئرن کی کمی کے باعث خون کی کمی (انیمیا) بہت عام ہے۔",
    whatHighMeans: "High hemoglobin can indicate dehydration, smoking, chronic lung disease, or living at high altitudes.",
    whatHighMeansUrdu: "ہیموگلوبن کی زیادتی پانی کی کمی (Dehydration)، سگریٹ نوشی، یا پھیپھڑوں کی پرانی بیماری کی نشاندہی کر سکتی ہے۔",
    whatLowMeans: "Low hemoglobin indicates Anemia. It causes fatigue, weakness, pale skin, and shortness of breath. Often treated with iron-rich foods, folic acid, or iron supplements under advice.",
    whatLowMeansUrdu: "ہیموگلوبن کی کمی انیمیا (خون کی کمی) کو ظاہر کرتی ہے۔ اس سے تھکاوٹ، کمزوری اور سانس پھولنے کا مسئلہ ہوتا ہے۔ عام طور پر آئرن سے بھرپور غذاؤں یا سپلیمنٹس سے علاج کیا جاتا ہے۔"
  },
  {
    id: "lab-wbc",
    name: "White Blood Cell (WBC)",
    urduName: "سفید خلیات کاؤنٹ",
    category: "Blood Count",
    normalRangeText: "4,000 - 11,000",
    normalRangeTextUrdu: "4,000 سے 11,000",
    unit: "/mcL",
    minVal: 4000,
    maxVal: 11000,
    about: "WBCs are key cells of the immune system that fight off bacterial, viral, and parasitic infections.",
    aboutUrdu: "سفید خلیات جسم کے مدافعتی نظام کا حصہ ہیں جو جراثیم، وائرس اور انفیکشن کے خلاف لڑتے ہیں۔",
    whatHighMeans: "High WBC (Leukocytosis) suggests an active bacterial infection, acute inflammation, tissue damage, or severe emotional/physical stress.",
    whatHighMeansUrdu: "سفید خلیات کی زیادتی جسم میں کسی فعال بیکٹیریل انفیکشن، شدید سوزش، یا جسمانی تناؤ کی نشاندہی کرتی ہے۔",
    whatLowMeans: "Low WBC (Leukopenia) can indicate viral infections (like Dengue, Typhoid), autoimmune disorders, bone marrow suppression, or severe nutritional deficiencies.",
    whatLowMeansUrdu: "سفید خلیات کی کمی وائرل انفیکشن (جیسے ڈینگی، ٹائیفائیڈ)، قوتِ مدافعت کی کمزوری، یا شدید غذائی کمی کی وجہ سے ہو سکتی ہے۔"
  },
  {
    id: "lab-fasting-sugar",
    name: "Fasting Blood Sugar",
    urduName: "نہار منہ شوگر ٹیسٹ",
    category: "Diabetes",
    normalRangeText: "70 - 100 (Normal), 101 - 125 (Prediabetes), 126+ (Diabetic)",
    normalRangeTextUrdu: "70 سے 100 (نارمل)، 101 سے 125 (ذیابیطس سے پہلے)، 126 سے زائد (ذیابیطس)",
    unit: "mg/dL",
    minVal: 70,
    maxVal: 100,
    about: "Measures glucose levels after an 8 to 12 hour fast. Critical for managing Diabetes, which affects millions of people across Pakistan.",
    aboutUrdu: "یہ ٹیسٹ ۸ سے ۱۲ گھنٹے نہار منہ رہنے کے بعد شوگر کی مقدار کی جانچ کرتا ہے۔ پاکستان میں ذیابیطس کے کنٹرول کے لیے یہ ٹیسٹ بنیادی اہمیت رکھتا ہے۔",
    whatHighMeans: "High glucose levels (Hyperglycemia) suggest Pre-diabetes or Diabetes. Symptoms include extreme thirst, frequent urination, and blurry vision. Speak with an endocrinologist.",
    whatHighMeansUrdu: "شوگر کی زیادتی ذیابیطس (Diabetes) کو ظاہر کرتی ہے۔ علامات میں زیادہ پیاس لگنا، بار بار پیشاب آنا اور نظر کا دھندلا پن شامل ہیں۔",
    whatLowMeans: "Low glucose (Hypoglycemia) is below 70 mg/dL. Causes shakiness, sweating, dizziness, and confusion. Treat immediately by taking sugar, juice, or sweet candy.",
    whatLowMeansUrdu: "شوگر کی کمی (۷۰ سے کم) انتہائی خطرناک ہو سکتی ہے۔ اس کی علامات میں لرزہ، پسینہ آنا اور چکر آنا شامل ہیں۔ فوری طور پر چینی، جوس یا میٹھی چیز لیں۔"
  },
  {
    id: "lab-hba1c",
    name: "HbA1c (Glycated Hemoglobin)",
    urduName: "ایچ بی اے ون سی (۳ ماہ کی اوسط شوگر)",
    category: "Diabetes",
    normalRangeText: "4.0 - 5.6% (Normal), 5.7 - 6.4% (Prediabetes), 6.5% + (Diabetic)",
    normalRangeTextUrdu: "4.0 سے 5.6 فیصد (نارمل)، 5.7 سے 6.4 فیصد (ذیابیطس سے پہلے)، 6.5 فیصد یا زیادہ (ذیابیطس)",
    unit: "%",
    minVal: 4.0,
    maxVal: 5.6,
    about: "Reflects average blood sugar levels over the past 2 to 3 months. Essential for understanding glycemic stability and overall effectiveness of diabetic treatment.",
    aboutUrdu: "یہ ٹیسٹ پچھلے ۲ سے ۳ مہینوں میں آپ کے خون میں شوگر کی اوسط مقدار کو ظاہر کرتا ہے۔ یہ ذیابیطس کے مریضوں کے علاج کی کامیابی جانچنے کا سب سے اہم ذریعہ ہے۔",
    whatHighMeans: "High HbA1c (6.5% and above) indicates poor long-term glucose control, increasing risks of nerve damage, kidney failure, and eye issues. Requires medication adjustment, diet restrict and walking.",
    whatHighMeansUrdu: "ایچ بی اے ون سی کا زیادہ ہونا ظاہر کرتا ہے کہ شوگر طویل عرصے سے بے قابو ہے۔ اس سے نظر کی کمزوری، اعصابی نقصان اور گردوں کے مسائل پیدا ہو سکتے ہیں۔",
    whatLowMeans: "Very low levels (below 4%) are rare and are usually caused by persistent low blood sugar episodes or rare blood disorders.",
    whatLowMeansUrdu: "بہت کم ہونا شاذ و نادر ہی ہوتا ہے اور یہ بار بار شوگر ڈاؤن ہونے یا خون کے مخصوص مسائل کی وجہ سے ہو سکتا ہے۔"
  },
  {
    id: "lab-creatinine",
    name: "Serum Creatinine",
    urduName: "سیرم کریٹائنین (گردے کا ٹیسٹ)",
    category: "Kidney/Liver",
    normalRangeText: "0.6 - 1.2",
    normalRangeTextUrdu: "0.6 سے 1.2",
    unit: "mg/dL",
    minVal: 0.6,
    maxVal: 1.2,
    about: "Creatinine is a waste product filtered out of the body by the kidneys. It indicates how well your kidneys are filtering wastes.",
    aboutUrdu: "کریٹائنین جسم کا ایک فضول مادہ ہے جسے گردے چھان کر باہر نکالتے ہیں۔ یہ ٹیسٹ ظاہر کرتا ہے کہ آپ کے گردے کس حد تک کام کر رہے ہیں۔",
    whatHighMeans: "High creatinine indicates decreased kidney function, kidney injury, or severe dehydration. High blood pressure or long-term diabetes can damage kidneys.",
    whatHighMeansUrdu: "کریٹائنین کی زیادتی گردوں کی کمزوری یا شدید پانی کی کمی کو ظاہر کرتی ہے۔ ہائی بلڈ پریشر اور شوگر گردوں کو نقصان پہنچا سکتے ہیں۔",
    whatLowMeans: "Low creatinine is less common and can indicate lower muscle mass, severe liver disease, or extreme protein malnutrition.",
    whatLowMeansUrdu: "کریٹائنین کی کمی عام طور پر پٹھوں کی کمزوری یا جگر کے شدید مسائل کی وجہ سے ہو سکتی ہے۔"
  },
  {
    id: "lab-alt",
    name: "ALT (SGPT) - Liver Enzyme",
    urduName: "اے ایل ٹی (جگر کا اینزائم)",
    category: "Kidney/Liver",
    normalRangeText: "7 - 56",
    normalRangeTextUrdu: "7 سے 56",
    unit: "U/L",
    minVal: 7,
    maxVal: 56,
    about: "An enzyme found mostly in the liver cells. Helpful to detect liver inflammation or damage, which is highly prevalent due to Hepatitis B & C viruses in Pakistan.",
    aboutUrdu: "یہ اینزائم جگر کے خلیات میں پایا جاتا ہے۔ یہ جگر کی سوزش اور نقصان کا پتہ لگانے میں انتہائی معاون ہے، جو پاکستان میں ہیپاٹائٹس کے پھیلاؤ کی وجہ سے اہم ہے۔",
    whatHighMeans: "Elevated ALT suggests liver damage or inflammation, often caused by viral hepatitis, excessive fatty liver, certain medications, or alcohol intake.",
    whatHighMeansUrdu: "اے ایل ٹی کا بڑھ جانا جگر کی سوزش، چربی کی زیادتی (Fatty Liver) یا ہیپاٹائٹس کی نشاندہی کرتا ہے۔",
    whatLowMeans: "A low ALT level is normal and is expected, indicating healthy and well-functioning liver tissue.",
    whatLowMeansUrdu: "اے ایل ٹی کا کم ہونا بالکل نارمل اور متوقع ہے، جو جگر کے صحت مند ہونے کی علامت ہے۔"
  },
  {
    id: "lab-bilirubin",
    name: "Serum Bilirubin Total",
    urduName: "سیرم بلیروبن (یرقان ٹیسٹ)",
    category: "Kidney/Liver",
    normalRangeText: "0.1 - 1.2",
    normalRangeTextUrdu: "0.1 سے 1.2",
    unit: "mg/dL",
    minVal: 0.1,
    maxVal: 1.2,
    about: "Bilirubin is a yellowish substance produced during the breakdown of old red blood cells. Cleared by the liver. High levels cause Jaundice.",
    aboutUrdu: "بلیروبن ایک پیلے رنگ کا مادہ ہے جو سرخ خلیات کے ٹوٹنے سے بنتا ہے اور جگر اسے صاف کرتا ہے۔ اس کی زیادتی سے پیلا یرقان (Jaundice) ہوتا ہے۔",
    whatHighMeans: "High bilirubin (above 1.2) causes yellowing of eyes/skin, dark urine, and pale stools. Can point to Jaundice, bile duct blockage, or liver damage.",
    whatHighMeansUrdu: "زیادہ ہونا آنکھوں اور جلد کا رنگ پیلا ہونے، گہرے پیشاب اور جگر کی سوزش یا یرقان کو ظاہر کرتا ہے۔",
    whatLowMeans: "Low levels of bilirubin are generally safe and of no medical concern.",
    whatLowMeansUrdu: "بلیروبن کا کم ہونا محفوظ مانا جاتا ہے اور اس میں کسی پریشانی کی بات نہیں ہوتی۔"
  },
  {
    id: "lab-tsh",
    name: "Thyroid Stimulating Hormone (TSH)",
    urduName: "ٹی ایس ایچ (تھائیرائڈ ٹیسٹ)",
    category: "Heart/Lipids", // we can keep or group under general
    normalRangeText: "0.4 - 4.5",
    normalRangeTextUrdu: "0.4 سے 4.5",
    unit: "mIU/L",
    minVal: 0.4,
    maxVal: 4.5,
    about: "Measures thyroid activity. Extremely common in Pakistani women, presenting as unexplained weight gain, fatigue, or mood changes.",
    aboutUrdu: "یہ ہارمون گلے میں موجود غدود (Thyroid) کی کارکردگی کو ناپتا ہے۔ پاکستانی خواتین میں اس ہارمون کا بگڑنا وزن میں اضافے اور تھکاوٹ کی بڑی وجہ ہے۔",
    whatHighMeans: "High TSH (Hypothyroidism) means your thyroid is underactive. Causes sluggishness, weight gain, feeling cold, dry skin, and depression.",
    whatHighMeansUrdu: "زیادہ ہونا تھائیرائڈ کی سستی (Hypothyroidism) کو ظاہر کرتا ہے۔ اس سے وزن بڑھنا، تھکن، سردی لگنا اور جلد خشک ہونا عام علامات ہیں۔",
    whatLowMeans: "Low TSH (Hyperthyroidism) means your thyroid is overactive. Causes rapid heart rate, weight loss, heat sensitivity, and hand tremors.",
    whatLowMeansUrdu: "ٹی ایس ایچ کا کم ہونا تھائیرائڈ کی تیزی (Hyperthyroidism) کو ظاہر کرتا ہے۔ اس سے وزن کم ہونا، دھڑکن تیز ہونا اور ہاتھ کانپنا شامل ہیں۔"
  },
  {
    id: "lab-cholesterol",
    name: "Total Cholesterol",
    urduName: "ٹوٹل کولیسٹرول",
    category: "Heart/Lipids",
    normalRangeText: "Below 200",
    normalRangeTextUrdu: "200 سے کم",
    unit: "mg/dL",
    minVal: 100,
    maxVal: 200,
    about: "Measures the total amount of fats in your blood. High cholesterol is a leading risk factor for cardiac problems, especially with local diets high in ghee.",
    aboutUrdu: "یہ خون میں چربی کی کل مقدار کو ناپتا ہے۔ کولیسٹرول کا بڑھنا دل کی بیماریوں کی بنیادی وجہ ہے، بالخصوص پاکستان میں گھی والے کھانوں کی وجہ سے۔",
    whatHighMeans: "High cholesterol (above 200) increases risk of cardiovascular blockages or heart attacks. Exercise regularly, avoid trans-fats, and consult a doctor about lipid management.",
    whatHighMeansUrdu: "کولیسٹرول کا ۲۰۰ سے زائد ہونا دل کے دورے کے خطرے کو بڑھاتا ہے۔ روزانہ ورزش کریں، گھی اور تلی ہوئی چیزوں سے پرہیز کریں۔",
    whatLowMeans: "Very low cholesterol (below 120) is rare and can sometimes be linked to hyperthyroidism, severe liver disease, or malnutrition.",
    whatLowMeansUrdu: "کولیسٹرول کا بہت زیادہ کم ہونا غیر معمولی ہے اور جگر کی شدید بیماری یا غذائی نقص کو ظاہر کر سکتا ہے۔"
  },
  {
    id: "lab-urine-re",
    name: "Urine Pus Cells (Urine R/E)",
    urduName: "یورین پس سیلز (پیشاب کا تفصیلی ٹیسٹ)",
    category: "Infections",
    normalRangeText: "0 - 5",
    normalRangeTextUrdu: "0 سے 5",
    unit: "/HPF",
    minVal: 0,
    maxVal: 5,
    about: "Measures presence of white blood cells (pus cells) in urine. Highly useful for diagnosing Urinary Tract Infection (UTI).",
    aboutUrdu: "یہ پیشاب میں پس سیلز (پیپ کے خلیات) کی مقدار کو دیکھتا ہے۔ پیشاب میں پس سیلز کا آنا انفیکشن (UTI) کی بڑی علامت ہے۔",
    whatHighMeans: "High pus cells (above 5) indicate an active Urinary Tract Infection (UTI), kidney inflammation, or bladder infection. Symptoms include burning during urination and lower stomach pain. Drink lots of water and consult GP.",
    whatHighMeansUrdu: "۵ سے زیادہ پس سیلز پیشاب کی نالی میں شدید انفیکشن کو ظاہر کرتے ہیں۔ اس سے پیشاب میں جلن اور نچلے پیٹ میں درد ہوتا ہے۔ زیادہ پانی پئیں اور اینٹی بائیوٹک کے لیے ڈاکٹر سے ملیں۔",
    whatLowMeans: "Low levels (0-5) are healthy and indicate no bacterial infection in the urinary tract.",
    whatLowMeansUrdu: "زیرو سے پانچ پس سیلز کا آنا نارمل اور صحت مند ہونے کی علامت ہے۔"
  },
  {
    id: "lab-uric-acid",
    name: "Serum Uric Acid",
    urduName: "سیرم یورک ایسڈ (جوڑوں کا ٹیسٹ)",
    category: "Kidney/Liver",
    normalRangeText: "3.5 - 7.2 (Male: 3.5-7.2, Female: 2.6-6.0)",
    normalRangeTextUrdu: "3.5 سے 7.2 (مرد: 3.5-7.2، خواتین: 2.6-6.0)",
    unit: "mg/dL",
    minVal: 2.6,
    maxVal: 7.2,
    about: "Uric acid forms when the body breaks down purines found in red meat and lentils. Excess levels can crystallize in joints, leading to intense pain.",
    aboutUrdu: "یورک ایسڈ گوشت اور دالوں کے استعمال سے بنتا ہے۔ اگر جسم اسے مکمل طور پر خارج نہ کر سکے تو یہ جوڑوں میں جمع ہو کر شدید درد کا باعث بنتا ہے۔",
    whatHighMeans: "High uric acid (Hyperuricemia) causes Gout, presenting as severe joint pain (especially in big toes) and kidney stones. Avoid red meat, spinach, and drink lots of water.",
    whatHighMeansUrdu: "یورک ایسڈ بڑھنے سے جوڑوں میں سوجن اور درد (Gout) کا مرض لاحق ہوتا ہے۔ بڑا گوشت، ٹماٹر اور پالک کھانے سے گریز کریں۔",
    whatLowMeans: "Low levels are rare and generally harmless, sometimes seen with liver disease or low-protein diets.",
    whatLowMeansUrdu: "اس کا کم ہونا بے ضرر ہے اور عام طور پر کم پروٹین والی غذاؤں کے استعمال سے ہوتا ہے۔"
  },
  {
    id: "lab-vit-d",
    name: "Vitamin D (25-Hydroxy)",
    urduName: "وٹامن ڈی ٹیسٹ",
    category: "Heart/Lipids",
    normalRangeText: "30.0 - 100.0",
    normalRangeTextUrdu: "30.0 سے 100.0",
    unit: "ng/mL",
    minVal: 30.0,
    maxVal: 100.0,
    about: "Essential for calcium absorption, bone health, and immune system function. Deficiencies are highly widespread in Pakistan due to limited outdoor sun exposure.",
    aboutUrdu: "وٹامن ڈی ہڈیوں کی مضبوطی اور قوت مدافعت کے لیے بنیادی غذا ہے۔ پاکستان میں دھوپ کا معقول استعمال نہ ہونے سے اس کی کمی بہت عام ہے۔",
    whatHighMeans: "Levels above 100 are rare and represent toxicity, typically caused by taking excessive high-dose supplements over a long period. Can raise calcium levels in blood.",
    whatHighMeansUrdu: "سو سے زائد ہونا جسم میں وٹامن ڈی کی زہریلی مقدار کو ظاہر کرتا ہے، جو عام طور پر مسلسل ہائی ڈوز سپلیمنٹس لینے سے ہوتا ہے۔",
    whatLowMeans: "Low levels (below 30) represent Deficiency. Causes bone pain, backache, joint weakness, and muscle fatigue. Can be resolved with sunlight exposure and vitamin D supplements under doctor's guidance.",
    whatLowMeansUrdu: "۳۰ سے کم ہونا وٹامن ڈی کی کمی کو ظاہر کرتا ہے۔ اس سے ہڈیوں، پٹھوں اور جوڑوں میں مستقل درد کا مسئلہ رہتا ہے۔"
  },
  {
    id: "lab-dengue-ns1",
    name: "Dengue NS1 Antigen Test",
    urduName: "ڈینگی این ایس ون ٹیسٹ",
    category: "Infections",
    normalRangeText: "0 - 0.9 (Negative)",
    normalRangeTextUrdu: "0 سے 0.9 (منفی)",
    unit: "Index",
    minVal: 0,
    maxVal: 0.9,
    about: "Used to detect Dengue virus early during the first 1 to 5 days of high fever. Highly critical diagnostic test across Pakistan in monsoon seasons.",
    aboutUrdu: "یہ ٹیسٹ بخار کے پہلے سے پانچویں دن ڈینگی وائرس کا فوری پتہ لگانے کے لیے کیا جاتا ہے۔ برسات کے موسم میں اس ٹیسٹ کی اہمیت بہت زیادہ ہوتی ہے۔",
    whatHighMeans: "A positive result (value above 1.0) confirms active Dengue virus infection. Monitor platelet counts and hematocrit levels daily, drink ORS water, avoid Disprin/Ibuprofen, and consult a clinic immediately.",
    whatHighMeansUrdu: "ٹیسٹ کا مثبت (Positive) آنا ڈینگی وائرس کی تصدیق کرتا ہے۔ مریض کو او آر ایس والا پانی کثرت سے پلائیں، پیناڈول کے سوا کوئی دوا نہ دیں اور روزانہ پلیٹلیٹس چیک کروائیں۔",
    whatLowMeans: "A negative result (below 1.0) indicates that Dengue antigen is not detected. However, if fever continues, consult your doctor for a complete CBC test.",
    whatLowMeansUrdu: "منفی آنا ڈینگی وائرس کی غیر موجودگی کو ظاہر کرتا ہے؛ تاہم بخار برقرار رہنے پر ڈاکٹر سے معائنہ کروائیں۔"
  },
  {
    id: "lab-typhidot",
    name: "Typhidot IgM Antibody",
    urduName: "ٹائفائیڈ آئی جی ایم ٹیسٹ",
    category: "Infections",
    normalRangeText: "0 - 0.9 (Negative)",
    normalRangeTextUrdu: "0 سے 0.9 (منفی)",
    unit: "Index",
    minVal: 0,
    maxVal: 0.9,
    about: "Detects IgM antibodies against Salmonella typhi bacteria. Used to diagnose active Typhoid fever, which is highly common in summer due to contaminated water.",
    aboutUrdu: "ٹائفائیڈ بخار کی تشخیص کے لیے یہ اینٹی باڈی ٹیسٹ کیا جاتا ہے۔ گندے پانی یا آلودہ کھانے سے ٹائفائیڈ بخار کا پھیلنا پاکستان میں عام ہے۔",
    whatHighMeans: "A positive Typhidot IgM indicates an active, current Typhoid infection. Requires specific oral or IV antibiotic treatment for 7 to 14 days, plenty of fluids, and light, easily-digestible foods under doctor's prescription.",
    whatHighMeansUrdu: "مثبت آنا ٹائفائیڈ بخار کی تصدیق کرتا ہے۔ اس کے لیے ڈاکٹر کی ہدایت پر اینٹی بائیوٹک کا کورس اور ہلکی، نرم غذاؤں کا استعمال لازمی ہے۔",
    whatLowMeans: "A negative result indicates active Typhoid antibodies are not found. Seek medical advice if high fever continues to rule out other infections.",
    whatLowMeansUrdu: "منفی آنا ٹائفائیڈ اینٹی باڈیز نہ ہونے کو ظاہر کرتا ہے؛ تاہم بخار برقرار رہنے کی صورت میں دیگر وجوہات کا پتہ لگائیں۔"
  }
];

export const DOCTOR_SPECIALTIES_DATABASE: DoctorSpecialtyTemplate[] = [
  {
    specialty: "General Physician / Family Medicine",
    description: "For general adult health issues, mild fevers, coughs, gut infections, high blood pressure, and primary wellness care.",
    descriptionUrdu: "عام صحت کے مسائل، بخار، کھانسی، پیٹ کی خرابی، ہائی بلڈ پریشر اور ابتدائی طبی امداد کے لیے۔",
    suggestedQuestions: [
      "What is the most likely cause of my current symptoms?",
      "Are there any tests I need to undergo before my next appointment?",
      "What are the possible side effects of the medications being prescribed?",
      "Are there specific symptoms that mean I should go straight to the ER?",
      "Do I need to make any changes to my diet or physical activity?"
    ],
    suggestedQuestionsUrdu: [
      "میری موجودہ علامات کی سب سے بڑی وجہ کیا ہے؟",
      "اگلی ملاقات سے پہلے مجھے کون سے ٹیسٹ کروانے کی ضرورت ہے؟",
      "تجویز کردہ ادویات کے ممکنہ مضر اثرات (side effects) کیا ہیں؟",
      "ایسی کون سی علامات ہیں جن کے ظاہر ہونے پر مجھے براہ راست ایمرجنسی جانا چاہیے؟",
      "کیا مجھے اپنی غذا یا روزمرہ کی سرگرمیوں میں کوئی تبدیلیاں کرنے کی ضرورت ہے؟"
    ]
  },
  {
    specialty: "Pediatrician (Child Specialist)",
    description: "For infants, babies, and children's growth, vaccinations, childhood fevers, viral rashes, and feeding problems.",
    descriptionUrdu: "بچوں کی نشوونما، حفاظتی ٹیکوں، بچوں کے بخار، الرجی اور دودھ پلانے کے مسائل کے لیے۔",
    suggestedQuestions: [
      "Is my child's growth and weight normal for their age group?",
      "What is the exact dose of paracetamol or other fever syrups for my child's current weight?",
      "What signs of dehydration should I monitor in my child?",
      "Are there any critical vaccinations my child is missing?",
      "When is it safe for my child to return to school or play?"
    ],
    suggestedQuestionsUrdu: [
      "کیا میرے بچے کا وزن اور قد اس کی عمر کے لحاظ سے نارمل ہے؟",
      "میرے بچے کے وزن کے مطابق بخار کی دوا (پیناڈول وغیرہ) کی صحیح مقدار کیا ہے؟",
      "مجھے بچے میں پانی کی کمی (dehydration) کی کون سی علامات پر نظر رکھنی چاہیے؟",
      "کیا بچے کے حفاظتی ٹیکوں میں سے کوئی ٹیکہ رہ گیا ہے؟",
      "بچہ دوبارہ اسکول یا باہر کھیلنے کب جا سکتا ہے؟"
    ]
  },
  {
    specialty: "Gynecologist / Obstetrician",
    description: "For women's reproductive health, prenatal checkups during pregnancy, menstrual irregularities, and pregnancy care.",
    descriptionUrdu: "خواتین کے پوشیدہ امراض، حمل کے دوران معائنہ، اور زچگی کی دیکھ بھال کے لیے۔",
    suggestedQuestions: [
      "Are all the medications I am currently taking safe during this stage of pregnancy?",
      "What is my expected due date, and what routine scans are next?",
      "Are these symptoms (nausea, mild pain, discharge) normal or warning signs?",
      "What iron, calcium, or folic acid supplements should I be taking?",
      "What symptoms should trigger an immediate call to you or a trip to the maternity ER?"
    ],
    suggestedQuestionsUrdu: [
      "کیا میری موجودہ ادویات حمل کے اس مرحلے میں مکمل محفوظ ہیں؟",
      "میری زچگی کی متوقع تاریخ کیا ہے، اور اگلا ضروری الٹراساؤنڈ کب ہے؟",
      "کیا حمل کی موجودہ علامات نارمل ہیں یا خطرے کی علامت؟",
      "مجھے فولک ایسڈ، کیلشیم یا آئرن کی کون سی خوراک لینی چاہیے؟",
      "ایسی کون سی علامات ہیں جن میں مجھے فوری طور پر زچگی کے ہسپتال جانا چاہیے؟"
    ]
  },
  {
    specialty: "Cardiologist (Heart Specialist)",
    description: "For high blood pressure (Hypertension), chest heaviness, heart palpitations, past heart attacks, or high cardiovascular risk.",
    descriptionUrdu: "بلڈ پریشر، سینے میں بھاری پن، دل کی دھڑکن تیز ہونا، اور دل کی دیگر بیماریوں کے لیے۔",
    suggestedQuestions: [
      "What is my target Blood Pressure reading, and how often should I monitor it at home?",
      "Could my lifestyle or diet be contributing to my chest discomfort or palpitations?",
      "What is the exact purpose of each heart/BP medicine I'm taking?",
      "If I get sudden chest pressure or squeezing again, what should be my immediate first response?",
      "Is it safe for me to engage in light exercise or brisk walking?"
    ],
    suggestedQuestionsUrdu: [
      "میرا بلڈ پریشر کتنا ہونا چاہیے، اور مجھے گھر پر کتنی بار چیک کرنا چاہیے؟",
      "کیا میری خوراک یا طرزِ زندگی میرے دل کی تکلیف کا سبب بن رہی ہے؟",
      "میرے دل/بلڈ پریشر کی ہر گولی کا اصل مقصد کیا ہے؟",
      "اگر مجھے دوبارہ اچانک سینے پر شدید دباؤ محسوس ہو تو پہلا قدم کیا ہونا چاہیے؟",
      "کیا میرے لیے ہلکی ورزش یا تیز چلنا محفوظ ہے؟"
    ]
  },
  {
    specialty: "Endocrinologist (Diabetes & Hormone Specialist)",
    description: "For managing Type 1 or Type 2 Diabetes, thyroid imbalances, sudden weight fluctuations, and hormonal concerns.",
    descriptionUrdu: "ذیابیطس (شوگر)، تھائیرائڈ کی خرابی، اور دیگر ہارمونز کے مسائل کے علاج کے لیے۔",
    suggestedQuestions: [
      "What should be my target fasting and post-meal blood sugar levels?",
      "How does my HbA1c score translate to my long-term sugar control?",
      "What is the correct way to adjust my insulin/medication dose if my blood sugar is too high or low?",
      "What should I do to prevent or treat sudden low blood sugar (Hypoglycemia) at home?",
      "How often should I have my kidneys and eyes screened due to my diabetes?"
    ],
    suggestedQuestionsUrdu: [
      "میری نہار منہ اور کھانے کے بعد کی شوگر کا ہدف کیا ہونا چاہیے؟",
      "میرا HbA1c ٹیسٹ میرے شوگر کنٹرول کے بارے میں کیا بتاتا ہے؟",
      "اگر شوگر بہت زیادہ کم یا زیادہ ہو تو دوا کی مقدار کیسے درست کروں؟",
      "گھر پر شوگر اچانک کم ہو جانے (Hypoglycemia) کا علاج کیسے کروں؟",
      "ذیابیطس کی وجہ سے مجھے اپنے گردوں اور آنکھوں کا معائنہ کتنی بار کروانا چاہیے؟"
    ]
  }
];
