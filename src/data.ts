import { PresetSymptom } from "./types";

export const PRESET_SYMPTOMS: PresetSymptom[] = [
  // English presets
  {
    title: "Dengue & Malaria risk",
    description: "Fever, body aches, and joint pain during mosquito season.",
    prompt: "I have a sudden high fever, severe pain behind my eyes, and intense joint pain. Could this be Dengue? What should I do and when do I go to the hospital?",
    language: "english",
    category: "urgent"
  },
  {
    title: "Summer Dehydration",
    description: "Preventing heat exhaustion and dynamic rehydration.",
    prompt: "It's extremely hot outside and I'm feeling dizzy, have a dry mouth, and have dark urine. How can I safely rehydrate?",
    language: "english",
    category: "environmental"
  },
  {
    title: "Baby has a fever",
    description: "Safe care instructions for infants and young children.",
    prompt: "My 5-month-old baby has a mild fever (around 100.5 F). They are otherwise drinking milk but a bit fussy. What are safe home steps and warning signs?",
    language: "english",
    category: "pediatric"
  },
  {
    title: "Safe painkiller use",
    description: "Understanding safe dosages of Paracetamol / Panadol.",
    prompt: "I have a headache and muscle aches. Is it safe to take Panadol (paracetamol)? How much is a safe dose and what should I avoid?",
    language: "english",
    category: "general"
  },

  // Roman Urdu presets
  {
    title: "Dengue Ka Bukhar",
    description: "Tez bukhar, jism dard, aur machar ka mausam.",
    prompt: "Mujhe achanak tez bukhar hua hai, aankhon ke peeche dard hai aur joroon (joints) mein boht dard hai. Kya yeh dengue ho sakta hai? Mujhe ab kya karna chahiye?",
    language: "romanUrdu",
    category: "urgent"
  },
  {
    title: "Garmi aur Dehydration",
    description: "Safar aur dhoop mein chakkar ya kamzori.",
    prompt: "Garmi ki wajah se chakkar aa rahe hain, pyas boht lag rahi hai aur jism nidhal ho raha hai. ORS istemal karne ka sahi tarika kya hai?",
    language: "romanUrdu",
    category: "environmental"
  },
  {
    title: "Bache Ko Bukhar",
    description: "Chote bachon mein tez tapat ya thand.",
    prompt: "Mere 6 mahine ke bache ko bukhar hai. Wo thora chirchira ho raha hai. Mujhe ghar par kya ehtiyat karni chahiye aur kab doctor ke paas jana chahiye?",
    language: "romanUrdu",
    category: "pediatric"
  },
  {
    title: "Dawaon ka Istemal",
    description: "Ghar ki aam dawaein kab aur kaise lein.",
    prompt: "Mujhe jism mein dard hai. Kya main Panadol le sakta hoon? Aur kaunsi baatein hain jin ka dhyan rakhna chahiye?",
    language: "romanUrdu",
    category: "general"
  },

  // Urdu script presets
  {
    title: "ڈینگی بخار کی علامات",
    description: "تیز بخار، جوڑوں کا درد اور مچھروں کا موسم۔",
    prompt: "مجھے اچانک تیز بخار ہوا ہے، آنکھوں کے پیچھے اور جوڑوں میں شدید درد ہے۔ کیا یہ ڈینگی ہو سکتا ہے؟ مجھے کیا کرنا چاہیے؟",
    language: "urdu",
    category: "urgent"
  },
  {
    title: "گرمی اور پانی کی کمی",
    description: "شدید گرمی میں چکر آنا یا کمزوری ہونا۔",
    prompt: "شدید گرمی کی وجہ سے مجھے چکر آ رہے ہیں، منہ خشک ہو رہا ہے اور پیشاب کا رنگ گہرا ہے۔ پانی کی کمی کیسے دور کروں؟",
    language: "urdu",
    category: "environmental"
  },
  {
    title: "بچے کو بخار ہونا",
    description: "چھوٹے بچوں میں بخار اور احتیاطی تدابیر۔",
    prompt: "میرے ۵ ماہ کے بچے کو ہلکا بخار ہے۔ وہ دودھ پی رہا ہے لیکن چڑچڑا ہے۔ مجھے گھر پر کیا احتیاط کرنی چاہیے؟",
    language: "urdu",
    category: "pediatric"
  },
  {
    title: "ادویات کا محفوظ استعمال",
    description: "پیناڈول یا دیگر درد کش ادویات کے اصول۔",
    prompt: "میرے سر میں درد ہے۔ کیا پیناڈول لینا محفوظ ہے؟ اس کی محفوظ خوراک کیا ہے اور کس چیز سے پرہیز کرنا چاہیے؟",
    language: "urdu",
    category: "general"
  }
];

export const EMERGENCY_ALERT_LIST = [
  {
    condition: "Chest pain / Pressure",
    urdu: "سینے میں درد یا دباؤ",
    romanUrdu: "Seene mein dard ya dabao"
  },
  {
    condition: "Trouble breathing / Choking",
    urdu: "سانس لینے میں شدید دشواری",
    romanUrdu: "Sans lene mein shadeed dushwari"
  },
  {
    condition: "Signs of Stroke (drooping face, arm weakness, slurred speech)",
    urdu: "فالج کی علامات (چہرہ لٹکنا، بازو میں کمزوری، بولنے میں دشواری)",
    romanUrdu: "Falij ki alamat (face drooping, bolne mein dushwari)"
  },
  {
    condition: "Severe bleeding or vomiting blood",
    urdu: "شدید خون بہنا یا خون کی الٹی",
    romanUrdu: "Shadeed khoon behna ya khoon ki ulti"
  },
  {
    condition: "Severe allergic reaction with lip/throat swelling",
    urdu: "شدید الرجی، ہونٹوں یا گلے کا سوجنا",
    romanUrdu: "Shadeed allergy, honton ya gale ka soojna"
  },
  {
    condition: "Newborn/infant very sick or unresponsive",
    urdu: "نوزائیدہ بچے کا شدید بیمار ہونا یا بے ہوش ہونا",
    romanUrdu: "Navjaat bache ka shadeed bimar hona ya behosh hona"
  },
  {
    condition: "Suicidal thoughts or urges to self-harm",
    urdu: "خودکشی یا خود کو نقصان پہنچانے کے خیالات",
    romanUrdu: "Khudkushi ya khud ko nuqsaan pohanchane ke khayalat"
  }
];
