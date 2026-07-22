import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

dotenv.config({ override: true });

// Helper to read/write local JSON databases for robust local storage persistence
async function readLocalData(filename: string, defaultVal: any = []) {
  try {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) {
      await fs.promises.writeFile(filePath, JSON.stringify(defaultVal, null, 2), "utf-8");
      return defaultVal;
    }
    const content = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(content || JSON.stringify(defaultVal));
  } catch (err) {
    console.error(`Error reading local file ${filename}:`, err);
    return defaultVal;
  }
}

async function writeLocalData(filename: string, data: any) {
  try {
    const filePath = path.join(process.cwd(), filename);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing local file ${filename}:`, err);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Robust helper to perform Gemini content generation with retries and automatic model fallback
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
  primaryModel?: string;
}) {
  const modelsToTry = [
    params.primaryModel || "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let attempt = 0;
    const maxAttempts = 2; // Try each model up to 2 times

    while (attempt < maxAttempts) {
      try {
        console.log(`[Gemini API] Attempting generation with model ${modelName} (attempt ${attempt + 1})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          return response;
        }
        throw new Error("Empty text returned from model");
      } catch (err: any) {
        attempt++;
        lastError = err;
        const errMessage = err.message || String(err);
        console.warn(`[Gemini API] Failed with ${modelName} on attempt ${attempt}:`, errMessage);

        // Fast path: If service is unavailable or overloaded (503) or not found (404),
        // don't waste time with exponential backoff on this same model. Fallback immediately!
        const errStr = errMessage.toLowerCase();
        const isUnavailable = errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("overloaded") || errStr.includes("demand");
        const isNotFound = errStr.includes("404") || errStr.includes("not found");
        
        if (isUnavailable || isNotFound) {
          console.log(`[Gemini API] Model ${modelName} is currently busy, unavailable, or not found. Bypassing further retries to fallback instantly.`);
          break; // Break the while loop to move to the next model in modelsToTry
        }

        if (attempt < maxAttempts) {
          // Exponential backoff delay
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  throw lastError || new Error("All generative models failed or returned empty text");
}

// System instruction for HealTrust Pakistan following the safe guidelines and Master Assistant Prompt
const HEALTH_GUIDE_SYSTEM_INSTRUCTION = `You are "HealTrust Pakistan," a safe, compassionate, and practical digital health assistant for Pakistan and users worldwide.

Your mission is to help people understand health concerns, make safer decisions, prepare for medical care, and get clear next steps in English, Urdu, or Roman Urdu.
You provide health education and guidance only. You are NOT a replacement for a licensed doctor, emergency service (such as Rescue 1122), pharmacist, or mental-health professional. Never claim certainty, never impersonate a doctor, and never promise a cure.

If the user mentions any of the MAIN HOME OPTIONS or topics, handle them with specific, safe educational guidance:
1. Check Symptoms
2. Medicine Information
3. Understand Lab Reports
4. Women’s Health & Pregnancy
5. Child & Baby Care
6. Mental Health Support
7. Diabetes, BP & Heart Health
8. Skin, Hair & Allergy Help
9. Diet, Weight & Fitness
10. Dental & Oral Health
11. First Aid Guidance
12. Prepare for a Doctor Visit

Language and tone rules:
1. Always reply in the user's preferred language. If they ask in English, use English. If they ask in Urdu (in Arabic script), use Urdu. If they ask in Roman Urdu (Urdu written in Latin script, e.g., "meri tabiyat kharab hai"), respond in Roman Urdu.
2. Be calm, respectful, supportive, non-judgmental, and easy to understand.
3. Never make the user feel embarrassed about sensitive topics such as mental health, sexual health, periods, weight, addiction, or hygiene. Speak with clinical respect and kindness.

Core Response Method:
1. Briefly restate the user’s concern.
2. Ask only the most useful follow-up questions before making assumptions:
   - Age and sex, if relevant
   - Main symptom and exact location
   - When it started and whether it is worsening
   - Severity from 0–10
   - Fever, injury, pregnancy, chronic illnesses, medicines, and allergies where relevant
3. Explain 2–4 possible common causes in probability-neutral language. Never say "you have [disease]" or give a certain diagnosis. Use phrases like "might be related to," "can sometimes be caused by," or "could indicate."
4. Give safe, practical self-care steps the user can take now (e.g., resting, staying hydrated, applying a cool compress).
5. State clearly whether they should seek:
   - Emergency care now
   - Same-day medical care
   - A doctor visit soon
   - Routine monitoring/self-care
6. End with the most important follow-up question or next action.

Safety and Restriction Rules (CRITICAL):
1. Never diagnose with certainty.
2. Never prescribe medication, give prescription dosages, recommend antibiotics, or tell a user to stop prescribed medication.
3. Do not recommend unsafe treatments, unverified supplements, or dangerous home remedies.
4. For medicine questions, provide general safety info only and advise speaking with a doctor or pharmacist—especially for children, pregnancy, breastfeeding, elderly people, allergies, kidney/liver disease, and people taking multiple medicines.
5. Do not minimize symptoms simply because the person is young or appears healthy.
6. Protect privacy: remind users never to share CNIC numbers, full addresses, passwords, bank credentials, photos of private body parts, or other unnecessary personal details.

Emergency Escalation (Red Flags):
Explicitly instruct the user to call their local emergency service (such as Rescue 1122 in Pakistan) or go to the nearest emergency department immediately if they experience any of the following:
- Chest pain, severe pressure in the chest, or pain spreading to the arm, jaw, or back
- Trouble breathing, blue lips, choking, or severe asthma symptoms
- Signs of stroke: face drooping, arm weakness, speech difficulty, sudden confusion, or sudden severe headache
- Fainting, seizure, severe weakness, or new confusion
- Severe allergic reaction: swelling of lips/tongue/throat, wheezing, or difficulty breathing
- Heavy bleeding, vomiting blood, black stools, or serious injury
- Severe abdominal pain, especially during pregnancy
- Suicidal thoughts, self-harm urges, or danger from another person
- A very sick newborn/infant, severe dehydration, or rapidly worsening symptoms

Mental Health Support:
If self-harm, suicide, abuse, or danger is mentioned, respond with deep empathy and urgency, encourage contacting emergency services (1122), trusted family, or local helpline immediately. Ask if they are in immediate danger and encourage them not to stay alone.

Recommended Answer Format (You MUST follow this format in all your response structures):

Use these exact Markdown bold headers to structure your response. Fill each section appropriately:

**What this may be**
[Explain 2-4 possible causes in probability-neutral language]

**What you can do now**
[Give safe, simple self-care actions]

**Get urgent help now if**
[List relevant red flags and emergency instructions]

**When to see a doctor**
[State a clear level of care and timeframe, e.g., Same-day, soon, or routine monitoring]

**To help narrow this down**
[Ask 1-3 focused questions about age, symptoms, severity, fever, etc.]

Always include this exact note at the very end of your response:
"Online guidance cannot confirm a diagnosis. If symptoms are severe, sudden, worsening, or you are worried, please seek care from a qualified doctor or emergency service."`;

// Fallback response generator when Gemini API is unavailable or unconfigured
function generateFallbackResponse(message: string): string {
  const msgLower = message.toLowerCase();
  
  // Detect if user likely wants Roman Urdu / Urdu
  const isUrdu = /[\u0600-\u06FF]/.test(message) || 
                 /\b(bukhar|sir|dard|pet|dast|ultee|khansi|zukam|dawai|kamzori|khoon|dard|pait)\b/.test(msgLower);

  let possibleCauses = "";
  let actionsNow = "";
  let urgentHelpIf = "";
  let whenToSeeDoctor = "";
  let questions = "";

  if (/\b(fever|temp|bukhar|dengue|malaria|tap)\b/.test(msgLower)) {
    possibleCauses = isUrdu 
      ? "• Seasonal viral fever (Mausami bukhar)\n• Typhoid or Malaria (Pakistan mein aam infectious bemari)\n• Dengue virus infection (Agar tez bukhar ke sath jism aur aankhon mein dard ho)"
      : "• Seasonal viral flu / Influenza\n• Typhoid or Malaria (Common seasonal infections in Pakistan)\n• Dengue virus infection (indicated by high fever, body aches, behind-eye pain)";
    
    actionsNow = isUrdu
      ? "• Paracetamol (Panadol) lein dard aur bukhar ke liye. Rozana 4000mg (8 tablets of 500mg) se zyada hargiz na lein.\n• Jism ko geelay kapray se saaf karein (sponging).\n• ORS aur neem-garm pani ka baqaidgi se istamal karein hydration ke liye."
      : "• Rest and take Paracetamol (Panadol) for fever and pain. Never exceed 4000mg/day.\n• Do lukewarm water sponging to reduce core temperature.\n• Maintain robust fluid intake with ORS, coconut water, or fresh juices.";

    urgentHelpIf = isUrdu
      ? "• Masooron ya naak se khoon behta ho ya jism par surkh nishanat (spots) hoon.\n• Lagataar ultiyan (vomiting) ho rahi hoon aur pani hazam na ho raha ho.\n• Saans lene mein dushwari ho ya behoshi mehsoos ho."
      : "• Any active bleeding (gums, nose) or red/purple petechiae spots on skin.\n• Persistent vomiting preventing oral fluid intake.\n• High fever with neck stiffness, confusion, or severe breathing difficulties.";

    whenToSeeDoctor = isUrdu
      ? "• Agar bukhar 3 din se zyada rahay, to doctor se rabta karein taake CBC test kiya ja sakay.\n• Same-day visit is recommended if fever is persistent."
      : "• If fever persists beyond 3 days, a clinic visit is necessary for a CBC blood test (to rule out Dengue/Typhoid).\n• Seek a physician consultation soon.";

    questions = isUrdu
      ? "• Bukhar kab se hai aur kitna tez hai?\n• Kya jism par koi rash ya nishanat hain?\n• Kya ulti ya dast bhi hain?"
      : "• How many days has the fever lasted, and what is the highest reading?\n• Are there any joint aches, behind-eye pain, or rashes?\n• Are you experiencing chills or severe sweating?";
  } 
  else if (/\b(stomach|vomit|diarrhea|pet|dast|ultee|ultiyah|pain|pait|hazma)\b/.test(msgLower)) {
    possibleCauses = isUrdu
      ? "• Food poisoning (Khaane ki kharabi)\n• Acute Gastroenteritis (Aantoon ki sozish)\n• Amoebic dysentery ya haiza (unclean drinking water ki wajah se)"
      : "• Acute Gastroenteritis (stomach flu)\n• Foodborne illness / Food poisoning\n• Bacterial dysentery or cholera due to contaminated food/water.";

    actionsNow = isUrdu
      ? "• ORS ka pani thora thora kar ke piyein (hydrated rehna sab se ahem hai).\n• Naram aur sada ghiza khaayein (jaise dahi-chawal ya kela).\n• Oily aur mirch masalay dar khano se parhez karein."
      : "• Sip ORS solution slowly but continuously to prevent severe dehydration.\n• Consume soft, bland foods like white rice with yogurt, or bananas.\n• Strictly avoid dairy, oily, and spicy dishes for 48 hours.";

    urgentHelpIf = isUrdu
      ? "• Pakhane mein khoon araha ho (blood in stool).\n• Shadeed dard ho pet mein jo bardaasht se baahar ho.\n• Dehydration ke nishane hon: zabaan ka khushk hona, ya 8 ghantay tak peshab na aana."
      : "• Blood or black tarry material in the stool or vomit.\n• Inability to keep any liquids down for more than 12-24 hours.\n• Severe dehydration signs: dry mouth, extreme lethargy, or no urination for 8 hours.";

    whenToSeeDoctor = isUrdu
      ? "• Agar ultiyan aur dast 24 ghantay se ziyada chalein, to immediate clinic jayein IV fluids ke liye.\n• Same-day visit is required if dehydration is present."
      : "• Consult a general practitioner if diarrhea or vomiting lasts more than 24-48 hours.\n• Seek same-day medical care if signs of moderate dehydration emerge.";

    questions = isUrdu
      ? "• Kya aap ne haal hi mein baahar ka khana khaya tha?\n• Ek din mein kitni baar ulti ya dast ho rahe hain?\n• Kya bukhar bhi hai?"
      : "• Have you recently eaten street food or unboiled water?\n• How many episodes of vomiting or loose stools have you had today?\n• Is there any fever or severe abdominal cramps?";
  }
  else if (/\b(headache|sir|dard|migraine|head)\b/.test(msgLower)) {
    possibleCauses = isUrdu
      ? "• Tension headache (Ze hni tanaav / stress)\n• Dehydration (Pani ki kami ya dhoop mein rehna)\n• Migraine (Aadhay sir ka dard)\n• Lack of sleep ya thakawat"
      : "• Tension headache (due to stress or muscle tightness)\n• Dehydration or heat exhaustion (common during summer in Pakistan)\n• Migraine (one-sided throbbing pain with light/sound sensitivity)\n• Lack of restful sleep or eye strain.";

    actionsNow = isUrdu
      ? "• Andheray aur khamosh kamray mein aaraam karein.\n• Barray glass mein pani piyein aur peshani par geela kapra rakhein.\n• Panadol 500mg ki 1-2 goliyan lein dard ke liye."
      : "• Rest in a quiet, dark, and cool room.\n• Drink 1-2 large glasses of water immediately.\n• Apply a cool, damp compress across your forehead.\n• Consider taking Paracetamol/Panadol (1-2 tablets of 500mg).";

    urgentHelpIf = isUrdu
      ? "• Sir dard achanak aur boht tez ho (thunderclap headache).\n• Gardan mein khichao (neck stiffness) aur sath tez bukhar ho.\n• Bolne mein dushwari, behoshi, ya jism ke ek hissay mein kamzori ho."
      : "• Sudden, excruciating \"thunderclap\" headache (worst headache of your life).\n• Headache accompanied by high fever, stiff neck, or vomiting.\n• Slurred speech, sudden vision loss, or numbness/weakness in one side of the body.";

    whenToSeeDoctor = isUrdu
      ? "• Agar sir dard haftay mein 2-3 baar se zyada ho ya regular medicines se theek na ho raha ho.\n• Routine evaluation is suggested for recurring headaches."
      : "• See a general physician soon if headaches are frequent, increasing in severity, or interfere with daily activities.\n• Routine monitoring is safe for mild, transient headaches.";

    questions = isUrdu
      ? "• Kya dard sir ke dono taraf hai ya sirf ek taraf?\n• Kya dhoop mein kharay rehne ya kam sonay se dard barha?\n• Kya gardan mein akraan mehsoos ho rahi hai?"
      : "• Is the pain throbbing on one side, or a dull squeeze all over?\n• Are you experiencing sensitivity to light, sound, or nausea?\n• Does it feel like a sudden, severe explosion of pain?";
  }
  else if (/\b(cough|cold|flu|nazla|zukam|khansi|throat|gala)\b/.test(msgLower)) {
    possibleCauses = isUrdu
      ? "• Viral upper respiratory infection (Mausami nazla o zukam)\n• Acute pharyngitis / sore throat (Gale ki sozish)\n• Allergies (Allergic rhinitis)"
      : "• Viral upper respiratory tract infection (Common cold / Flu)\n• Acute pharyngitis (Sore throat from bacterial or viral cause)\n• Allergic rhinitis (environmental dust/pollen allergies).";

    actionsNow = isUrdu
      ? "• Neem-garm namak ke pani se ghargharay (gargles) karein din mein 3 martaba.\n• Steam inhalation lein band naak aur khansi mein relief ke liye.\n• Neem-garm pani aur qehwa piyein."
      : "• Gargle with warm salt water 2-3 times a day.\n• Try steam inhalation to relieve nasal congestion and cough.\n• Sip warm water, ginger tea, or honey-lemon water.";

    urgentHelpIf = isUrdu
      ? "• Saans lene mein shadeed takleef ho ya seene se seeti ki awaz (wheezing) aaye.\n• Gale mein shadeed sozish ho jis se thook ya pani nigalna na-mumkin ho.\n• Honton ka neela hona ya tez dhar bukhar."
      : "• Severe shortness of breath, continuous wheezing, or choking.\n• Inability to swallow liquids or open your mouth due to extreme throat pain.\n• Blue discoloration of lips or sudden chest pain.";

    whenToSeeDoctor = isUrdu
      ? "• Agar gala kharab ya khansi 7 din se zyada chalay ya sath tez bukhar behtari na dikhaye.\n• See a general practitioner if symptoms linger."
      : "• Consult a general physician if cough or throat pain persists beyond 5-7 days, or if high fever does not subside.";

    questions = isUrdu
      ? "• Khansi khushk hai ya sath balgham (phlegm) araha hai?\n• Kya saans lene mein seeti ki awaz ati hai?\n• Bukhar kab se hai?"
      : "• Is the cough dry or productive (with mucus/sputum)?\n• Are you experiencing chest tightness or wheezing?\n• How long has the throat irritation lasted?";
  }
  else {
    possibleCauses = isUrdu
      ? "• Mausami tabdeeli ya thakawat (seasonal fatigue)\n• Shuruyati viral infection\n• Be-shumaar aam aur ghair-shadeed awamil"
      : "• Early mild viral or respiratory infection\n• Physical fatigue or environmental stress\n• Standard transient muscle tension.";

    actionsNow = isUrdu
      ? "• Khub aaraam karein aur thanda pani peene se parhez karein.\n• Ghiza mein garam cheezein jaise ke yakhni ya neem-garam doodh piyein.\n• Hydrated rahein aur safe limits mein paracetamol le sakte hain."
      : "• Prioritize rest and sleep in a comfortable room.\n• Sip warm fluids like clear broth, herbal tea, or warm water.\n• Stay hydrated with standard water, and monitor your symptoms closely.";

    urgentHelpIf = isUrdu
      ? "• Saans lene mein shadeed takleef ho.\n• Seene mein dard ya dabao mehsoos ho jo baazu tak jaye.\n• Achanak shadeed kamzori ya behoshi ho jaye."
      : "• Severe, unexplained shortness of breath or choking.\n• Crushing chest pain or pressure that radiates to your arm, neck, or jaw.\n• Sudden severe weakness, confusion, or difficulty speaking.";

    whenToSeeDoctor = isUrdu
      ? "• Agar علامات 3 se 5 din mein behtar na hoon ya mazeed kharab hoon.\n• Routine monitoring is best unless symptoms worsen."
      : "• Consult a general practitioner soon if symptoms worsen, or if they fail to improve after 3 to 5 days of rest.\n• Routine monitoring is appropriate for mild transient concerns.";

    questions = isUrdu
      ? "• Kya aap ko bukhar, khansi, ya jism mein dard hai?\n• Ye takleef kab se hai aur kya ye barh rahi hai?"
      : "• What are the main symptoms you are experiencing right now?\n• How long have you had this concern, and is it getting better or worse?";
  }

  return `**What this may be**
${possibleCauses}

**What you can do now**
${actionsNow}

**Get urgent help now if**
${urgentHelpIf}

**When to see a doctor**
${whenToSeeDoctor}

**To help narrow this down**
${questions}

Online guidance cannot confirm a diagnosis. If symptoms are severe, sudden, worsening, or you are worried, please seek care from a qualified doctor or emergency service.`;
}

// API route to interact with Health Guide
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log(`[HealTrust API] Received query message: "${message.substring(0, 100)}..."`);
  console.log(`[HealTrust API] GEMINI_API_KEY status: ${apiKey ? "CONFIGURED" : "MISSING"}`);

  // Fallback triggers if API key is missing entirely
  if (!apiKey) {
    console.log("[HealTrust API] Falling back to robust rules-based generator (Key missing).");
    return res.json({ text: generateFallbackResponse(message) });
  }

  try {
    // Prepare contents array for generative API
    // We can map chat history to the format expected by GoogleGenAI
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      });
    }

    // Append current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Request generation using gemini-3.6-flash with robust fallback and retry
    const response = await generateContentWithFallback({
      contents: contents,
      config: {
        systemInstruction: HEALTH_GUIDE_SYSTEM_INSTRUCTION,
        temperature: 0.2, // lower temperature for more consistent medical information adherence
      },
    });

    const responseText = response.text || "";
    if (!responseText) {
      throw new Error("Empty response received from Gemini API.");
    }
    
    return res.json({ text: responseText });
  } catch (error: any) {
    console.error("Error in health guide Gemini API call:", error);
    console.log("[HealTrust API] Gracefully falling back to robust local response generator due to model error.");
    return res.json({ text: generateFallbackResponse(message) });
  }
});

// ==========================================
// SUPABASE BACKEND INTEGRATION SERVICE
// ==========================================

// Supabase connection client lazy initialization
let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    if (url && key && url.trim() !== "" && key.trim() !== "" && url.startsWith("http")) {
      try {
        console.log(`[Supabase Service] Initializing client with URL: ${url}`);
        supabaseClient = createClient(url, key);
      } catch (err) {
        console.error("[Supabase Service] Exception thrown during createClient initialization:", err);
        supabaseClient = null;
      }
    } else {
      console.warn("[Supabase Service] WARNING: SUPABASE_URL or SUPABASE_KEY environment variables are missing, empty, or invalid (must start with http).");
    }
  }
  return supabaseClient;
}

// Supabase sign up endpoint (supports local fallback saving)
app.post("/api/supabase/signup", async (req, res) => {
  const { id, name, email, password, age, sex, otherConditions, allergies } = req.body;
  const patientId = id || Math.random().toString(36).substring(2, 9);
  
  const newPatient = {
    id: patientId,
    name,
    email: email.toLowerCase().trim(),
    password, // Simple plain password storage for template design matching
    age: age || "",
    sex: sex || "Unspecified",
    other_conditions: otherConditions || "",
    allergies: allergies || "",
    created_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString()
  };

  try {
    // 1. Save to local fallback database file
    const localPatients = await readLocalData("patients.json", []);
    const localExists = localPatients.some((p: any) => p.email.toLowerCase() === newPatient.email);
    if (localExists) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    localPatients.push(newPatient);
    await writeLocalData("patients.json", localPatients);

    // 2. Sync to Supabase if configured
    const sb = getSupabase();
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { data: existingUser } = await sb
          .from("patients")
          .select("id")
          .eq("email", newPatient.email)
          .maybeSingle();

        if (existingUser) {
          console.warn("[Supabase Auth] Patient already exists in cloud, keeping local record.");
        } else {
          const sbPatient = { ...newPatient };
          delete (sbPatient as any).last_sign_in_at;
          const { error: insertErr } = await sb.from("patients").insert([sbPatient]);
          if (insertErr) {
            sbErrorMsg = insertErr.message;
          } else {
            console.log(`[Supabase Auth] Successfully registered patient in Supabase: ${newPatient.email}`);
          }
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Auth] Warning: Cloud insertion failed. Fallback to local success.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({ 
      success: true, 
      user: newPatient, 
      supabaseSaved: !sbErrorMsg, 
      supabaseError: sbErrorMsg 
    });
  } catch (err: any) {
    console.error("[Patient Auth] Sign up exception:", err);
    return res.status(500).json({ error: err.message || "Failed to process patient registration." });
  }
});

// Supabase sign in endpoint (supports local fallback matching)
app.post("/api/supabase/signin", async (req, res) => {
  const { email, password } = req.body;
  const loginEmail = email.toLowerCase().trim();

  try {
    // 1. Check local fallback file first
    const localPatients = await readLocalData("patients.json", []);
    let match = localPatients.find((p: any) => p.email.toLowerCase() === loginEmail && p.password === password);

    // 2. Check Supabase as backup if not found locally
    const sb = getSupabase();
    if (!match && sb) {
      try {
        const { data, error } = await sb
          .from("patients")
          .select("*")
          .eq("email", loginEmail)
          .eq("password", password)
          .maybeSingle();

        if (!error && data) {
          match = {
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            age: data.age,
            sex: data.sex,
            other_conditions: data.other_conditions,
            allergies: data.allergies,
            created_at: data.created_at || new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          };
          // Save locally so they exist next time
          localPatients.push(match);
          await writeLocalData("patients.json", localPatients);
        }
      } catch (sbErr) {
        console.error("[Supabase Auth Check] Error during signin fallback:", sbErr);
      }
    }

    if (!match) {
      return res.status(401).json({ error: "Incorrect email or password. Please try again." });
    }

    // Update last sign in time locally
    match.last_sign_in_at = new Date().toISOString();
    await writeLocalData("patients.json", localPatients);

    // Update last sign in time in Supabase (async non-blocking - skipped since last_sign_in_at is omitted from table schema)

    // Convert to client camelCase format
    const formattedUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      password: match.password,
      age: match.age,
      sex: match.sex,
      otherConditions: match.other_conditions,
      allergies: match.allergies
    };

    console.log(`[Patient Auth] Patient logged in successfully: ${loginEmail}`);
    return res.json({ success: true, user: formattedUser });
  } catch (err: any) {
    console.error("[Patient Auth] Sign in exception:", err);
    return res.status(500).json({ error: err.message || "Failed to authenticate." });
  }
});

// Supabase bulk sync endpoint for offline patients
app.post("/api/supabase/sync-patients-bulk", async (req, res) => {
  const { patients } = req.body;
  if (!patients || !Array.isArray(patients)) {
    return res.status(400).json({ error: "Invalid request parameters." });
  }

  try {
    // 1. Bulk save to local patients database
    const localPatients = await readLocalData("patients.json", []);
    patients.forEach(p => {
      const existsIdx = localPatients.findIndex((lp: any) => lp.email.toLowerCase() === p.email.toLowerCase());
      const formatted = {
        id: p.id,
        name: p.name,
        email: p.email.toLowerCase().trim(),
        password: p.password,
        age: p.age || "",
        sex: p.sex || "Unspecified",
        other_conditions: p.otherConditions || "",
        allergies: p.allergies || "",
        created_at: p.created_at || new Date().toISOString(),
        last_sign_in_at: p.last_sign_in_at || new Date().toISOString()
      };
      if (existsIdx >= 0) {
        localPatients[existsIdx] = formatted;
      } else {
        localPatients.push(formatted);
      }
    });
    await writeLocalData("patients.json", localPatients);

    // 2. Sync to Supabase cloud if active
    const sb = getSupabase();
    let sbSynced = false;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const formattedPatients = patients.map(p => ({
          id: p.id,
          name: p.name,
          email: p.email.toLowerCase().trim(),
          password: p.password,
          age: p.age || "",
          sex: p.sex || "Unspecified",
          other_conditions: p.otherConditions || "",
          allergies: p.allergies || "",
          created_at: p.created_at || new Date().toISOString()
        }));

        const { error } = await sb
          .from("patients")
          .upsert(formattedPatients, { onConflict: "email" });

        if (error) {
          console.warn("[Supabase Sync] Warning: Cloud bulk-sync failed. Local backup successfully saved. Detail:", error.message || error);
          sbErrorMsg = error.message;
        } else {
          console.log(`[Supabase Sync] Bulk synced ${patients.length} local patients to cloud.`);
          sbSynced = true;
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Sync] Cloud bulk-sync threw exception. Local backup successfully saved. Detail:", sbErr.message || sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({ success: true, supabaseSynced: sbSynced, supabaseError: sbErrorMsg });
  } catch (err: any) {
    console.error("[Local Storage Sync] Bulk sync patients error:", err);
    return res.status(500).json({ error: err.message || "Failed to bulk sync patients." });
  }
});

// Book appointment and save in Supabase or local backup fallback
app.post("/api/supabase/appointment", async (req, res) => {
  const { doctorName, specialty, appointmentDate, symptoms, medications, customQuestions, userId, userName, userEmail, aiSolutions } = req.body;
  const appointmentId = Math.random().toString(36).substring(2, 9) + "-" + Date.now();

  const newApp = {
    id: appointmentId,
    doctor_name: doctorName || "Unspecified Physician",
    specialty: specialty || "General Medicine",
    appointment_date: appointmentDate || "Not Scheduled",
    symptoms: symptoms || "",
    medications: medications || "",
    custom_questions: customQuestions || [],
    user_id: userId || "guest",
    user_name: userName || "Guest Session",
    user_email: userEmail || "guest@healtrust.pk",
    ai_solutions: aiSolutions || "",
    created_at: new Date().toISOString()
  };

  try {
    // 1. Save to local fallback appointments file
    const localApps = await readLocalData("appointments.json", []);
    localApps.push(newApp);
    await writeLocalData("appointments.json", localApps);

    // 2. Try inserting in Supabase
    const sb = getSupabase();
    let sbRecord = null;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { data, error } = await sb
          .from("appointments")
          .insert([newApp])
          .select();

        if (error) {
          console.warn("[Supabase Appointment] Warning: could not write to Supabase appointments table.", error);
          sbErrorMsg = error.message;
        } else {
          sbRecord = data ? data[0] : null;
          console.log(`[Supabase Appointment] Cloud inserted appointment for Dr: ${doctorName}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Appointment] Cloud insert exception. Saved locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    console.log(`[Local Appointment] Saved booking locally for Dr: ${doctorName}`);
    return res.json({ 
      success: true, 
      appointment: sbRecord || newApp, 
      supabaseSaved: !!sbRecord, 
      supabaseError: sbErrorMsg 
    });
  } catch (err: any) {
    console.error("[Appointment Book] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to book appointment." });
  }
});

// CREATE a diary log and save in Supabase or local backup fallback
app.post("/api/supabase/diary", async (req, res) => {
  const { userId, primarySymptom, painLevel, fever, duration, notes, assessmentText } = req.body;
  const diaryId = Math.random().toString(36).substring(2, 9) + "-" + Date.now();

  const newLog = {
    id: diaryId,
    user_id: userId || "guest",
    primary_symptom: primarySymptom || "Unspecified",
    pain_level: Number(painLevel) || 0,
    fever: fever || "No Fever",
    duration: duration || "Unspecified",
    notes: notes || "",
    assessment_text: assessmentText || "",
    created_at: new Date().toISOString()
  };

  try {
    // 1. Save to local fallback file
    const localLogs = await readLocalData("diary_logs.json", []);
    localLogs.push(newLog);
    await writeLocalData("diary_logs.json", localLogs);

    // 2. Try inserting in Supabase
    const sb = getSupabase();
    let sbRecord = null;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { data, error } = await sb
          .from("diary_logs")
          .insert([newLog])
          .select();

        if (error) {
          console.warn("[Supabase Diary] Warning: could not write to Supabase diary_logs table.", error);
          sbErrorMsg = error.message;
        } else {
          sbRecord = data ? data[0] : null;
          console.log(`[Supabase Diary] Cloud inserted diary log for: ${primarySymptom}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Diary] Cloud insert exception. Saved locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    console.log(`[Local Diary] Saved diary log locally: ${primarySymptom}`);
    return res.json({ 
      success: true, 
      log: sbRecord || newLog, 
      supabaseSaved: !!sbRecord, 
      supabaseError: sbErrorMsg 
    });
  } catch (err: any) {
    console.error("[Diary Add] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to save diary log." });
  }
});

// GET diary logs
app.get("/api/supabase/diary", async (req, res) => {
  const sb = getSupabase();
  let diaryLogs: any[] = [];

  try {
    if (sb) {
      const { data, error } = await sb
        .from("diary_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        diaryLogs = data;
      }
    }
  } catch (err: any) {
    console.error("[Supabase GET Diary] Error fetching:", err);
  }

  try {
    const localLogs = await readLocalData("diary_logs.json", []);
    if (diaryLogs.length === 0) {
      diaryLogs = localLogs;
    } else {
      const supabaseIds = new Set(diaryLogs.map(l => String(l.id)));
      localLogs.forEach((ll: any) => {
        if (!supabaseIds.has(ll.id)) {
          diaryLogs.push(ll);
        }
      });
      // Sort desc
      diaryLogs.sort((a, b) => new Date(b.created_at || b.timestamp || 0).getTime() - new Date(a.created_at || a.timestamp || 0).getTime());
    }
  } catch (err: any) {
    console.error("[Local Sync GET Diary] Error:", err);
  }

  return res.json({ success: true, diaryLogs });
});

// DELETE a diary log
app.post("/api/supabase/diary/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Diary log ID is required." });
  }

  try {
    // 1. Delete from local fallback file
    const localLogs = await readLocalData("diary_logs.json", []);
    const updatedLogs = localLogs.filter((l: any) => l.id !== id);
    await writeLocalData("diary_logs.json", updatedLogs);

    // 2. Try deleting from Supabase
    const sb = getSupabase();
    let sbDeleted = false;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { error } = await sb
          .from("diary_logs")
          .delete()
          .eq("id", id);

        if (error) {
          console.warn("[Supabase Diary] Could not delete from Supabase table:", error);
          sbErrorMsg = error.message;
        } else {
          sbDeleted = true;
          console.log(`[Supabase Diary] Deleted diary log with id: ${id}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Diary] Cloud delete exception. Deleted locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({ success: true, localDeleted: true, supabaseDeleted: sbDeleted, supabaseError: sbErrorMsg });
  } catch (err: any) {
    console.error("[Diary Delete] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete diary log." });
  }
});

// DELETE an appointment
app.post("/api/supabase/appointments/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Appointment ID is required." });
  }

  try {
    // 1. Delete from local fallback file
    const localApps = await readLocalData("appointments.json", []);
    const updatedApps = localApps.filter((a: any) => a.id !== id);
    await writeLocalData("appointments.json", updatedApps);

    // 2. Try deleting from Supabase
    const sb = getSupabase();
    let sbDeleted = false;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { error } = await sb
          .from("appointments")
          .delete()
          .eq("id", id);

        if (error) {
          console.warn("[Supabase Appointment] Could not delete from Supabase table:", error);
          sbErrorMsg = error.message;
        } else {
          sbDeleted = true;
          console.log(`[Supabase Appointment] Deleted appointment with id: ${id}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Appointment] Cloud delete exception. Deleted locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({ success: true, localDeleted: true, supabaseDeleted: sbDeleted, supabaseError: sbErrorMsg });
  } catch (err: any) {
    console.error("[Appointment Delete] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete appointment." });
  }
});

// REMOVE/CLEAR prescription (ai_solutions) from an appointment
app.post("/api/supabase/appointments/remove-prescription", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Appointment ID is required." });
  }

  try {
    // 1. Update in local fallback file
    const localApps = await readLocalData("appointments.json", []);
    const updatedApps = localApps.map((a: any) => {
      if (a.id === id) {
        return { ...a, ai_solutions: "" };
      }
      return a;
    });
    await writeLocalData("appointments.json", updatedApps);

    // 2. Try updating in Supabase
    const sb = getSupabase();
    let sbUpdated = false;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { error } = await sb
          .from("appointments")
          .update({ ai_solutions: "" })
          .eq("id", id);

        if (error) {
          console.warn("[Supabase Appointment] Could not clear prescriptions in Supabase table:", error);
          sbErrorMsg = error.message;
        } else {
          sbUpdated = true;
          console.log(`[Supabase Appointment] Cleared prescriptions for id: ${id}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Appointment] Cloud update exception. Updated locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({ success: true, localUpdated: true, supabaseUpdated: sbUpdated, supabaseError: sbErrorMsg });
  } catch (err: any) {
    console.error("[Appointment Prescription Clear] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to clear appointment prescriptions." });
  }
});

// GET endpoints to view Supabase or local merged activity
app.get("/api/supabase/appointments", async (req, res) => {
  const sb = getSupabase();
  let appointments: any[] = [];

  try {
    if (sb) {
      const { data, error } = await sb
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        appointments = data;
      }
    }
  } catch (err: any) {
    console.error("[Supabase GET Appointments] Error fetching:", err);
  }

  try {
    const localApps = await readLocalData("appointments.json", []);
    if (appointments.length === 0) {
      appointments = localApps;
    } else {
      const supabaseIds = new Set(appointments.map(a => String(a.id)));
      localApps.forEach((la: any) => {
        if (!supabaseIds.has(la.id)) {
          appointments.push(la);
        }
      });
      // Sort desc
      appointments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (err: any) {
    console.error("[Local Sync GET Appointments] Error:", err);
  }

  return res.json({ success: true, appointments });
});

app.get("/api/supabase/patients", async (req, res) => {
  const sb = getSupabase();
  let patients: any[] = [];

  try {
    if (sb) {
      const { data, error } = await sb
        .from("patients")
        .select("id, name, email, age, sex, other_conditions, allergies, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        patients = data;
      }
    }
  } catch (err: any) {
    console.error("[Supabase GET Patients] Error fetching:", err);
  }

  try {
    const localPatients = await readLocalData("patients.json", []);
    if (patients.length === 0) {
      patients = localPatients;
    } else {
      const supabaseEmails = new Set(patients.map(p => String(p.email).toLowerCase()));
      localPatients.forEach((lp: any) => {
        if (!supabaseEmails.has(String(lp.email).toLowerCase())) {
          patients.push(lp);
        }
      });
      patients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (err: any) {
    console.error("[Local Sync GET Patients] Error:", err);
  }

  return res.json({ success: true, patients });
});

app.get("/api/supabase/admins", async (req, res) => {
  const sb = getSupabase();
  let admins: any[] = [];

  try {
    if (sb) {
      const { data, error } = await sb
        .from("admins")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        admins = data;
      }
    }
  } catch (err: any) {
    console.error("[Supabase GET Admins] Error fetching:", err);
  }

  try {
    const localAdmins = await readLocalData("admins.json", []);
    if (admins.length === 0) {
      admins = localAdmins;
    } else {
      const supabaseEmails = new Set(admins.map(a => String(a.email).toLowerCase()));
      localAdmins.forEach((la: any) => {
        if (!supabaseEmails.has(String(la.email).toLowerCase())) {
          admins.push(la);
        }
      });
      admins.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (err: any) {
    console.error("[Local Sync GET Admins] Error:", err);
  }

  return res.json({ success: true, admins });
});

// ==========================================
// PATIENT REVIEWS & TESTIMONIALS ENDPOINTS
// ==========================================

const DEFAULT_SEED_REVIEWS = [
  {
    id: "rev-1",
    name: "Muhammad Hanif",
    location: "Islamabad",
    rating: 5,
    title: "Extremely Helpful & Bilingual",
    review_text: "HealTrust Pakistan is extremely useful! The bilingual Urdu option makes medicine information accessible to my parents. Highly recommended!",
    review_text_ur: "ہیل ٹرسٹ پاکستان بہت معلوماتی اور فائدہ مند پورٹل ہے۔ میرے والدین اردو کی وجہ سے دوائیوں کی معلومات آسانی سے سمجھ سکتے ہیں۔",
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "rev-2",
    name: "Dr. Amina Qureshi",
    location: "Karachi",
    rating: 5,
    title: "Saves Vital Consulting Time",
    review_text: "As a pediatrician, I am highly impressed by the clarity of child-care guides. The pre-visit planner compiles symptoms beautifully, allowing doctors to focus immediately on diagnosis.",
    review_text_ur: "بچوں کی ماہرِ طب ہونے کے ناطے، میں بچوں کی صحت کی معلومات سے بہت متاثر ہوں۔ یہ ڈاکٹر کے وقت کو بچاتا ہے۔",
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "rev-3",
    name: "Khadija Bibi",
    location: "Peshawar",
    rating: 4,
    title: "Accurate Symptom Guidance",
    review_text: "Used the symptom assessor for my throat pain and cough. It gave me highly sensible self-care tips (saltwater gargles) and let me know when to see a local physician.",
    review_text_ur: "گلے کی سوزش کے لیے علامات کا تجزیہ استعمال کیا۔ اس نے مجھے نمکین پانی کے غرغرے کی بہترین اور محفوظ تجویز دی۔",
    created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "rev-4",
    name: "Zainab Rashid",
    location: "Lahore",
    rating: 5,
    title: "Lab Report Explainer Is Beautiful",
    review_text: "The lab explainer gave me absolute peace of mind during a dengue scare. I entered our platelet counts and got clear explanation of safe boundaries instantly.",
    review_text_ur: "لیب رپورٹ ایکسپلینر نے ڈینگی بخار کے خوف کے دوران مجھے بہت تسلی دی۔ میں نے پلیٹلیٹس درج کیے اور درست رہنمائی ملی۔",
    created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString()
  }
];

// GET reviews
app.get("/api/supabase/reviews", async (req, res) => {
  const sb = getSupabase();
  let reviews: any[] = [];

  try {
    if (sb) {
      const { data, error } = await sb
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        reviews = data;
      }
    }
  } catch (err: any) {
    console.error("[Supabase GET Reviews] Error fetching:", err);
  }

  try {
    const localReviews = await readLocalData("reviews.json", DEFAULT_SEED_REVIEWS);
    if (reviews.length === 0) {
      reviews = localReviews;
    } else {
      const supabaseIds = new Set(reviews.map(r => String(r.id)));
      localReviews.forEach((lr: any) => {
        if (!supabaseIds.has(lr.id)) {
          reviews.push(lr);
        }
      });
      // Sort desc
      reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (err: any) {
    console.error("[Local Sync GET Reviews] Error:", err);
  }

  return res.json({ success: true, reviews });
});

// POST review
app.post("/api/supabase/reviews", async (req, res) => {
  const { name, location, rating, title, reviewText, reviewTextUr } = req.body;
  if (!name || !rating || !reviewText) {
    return res.status(400).json({ error: "Name, rating, and review text are required fields." });
  }

  const reviewId = "rev-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now();
  const newReview = {
    id: reviewId,
    name: name,
    location: location || "Pakistan",
    rating: Number(rating) || 5,
    title: title || "Highly Recommended",
    review_text: reviewText,
    review_text_ur: reviewTextUr || "",
    created_at: new Date().toISOString()
  };

  try {
    // 1. Save to local fallback reviews
    const localReviews = await readLocalData("reviews.json", DEFAULT_SEED_REVIEWS);
    localReviews.unshift(newReview);
    await writeLocalData("reviews.json", localReviews);

    // 2. Try saving to Supabase reviews table
    const sb = getSupabase();
    let sbRecord = null;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { data, error } = await sb
          .from("reviews")
          .insert([newReview])
          .select();

        if (error) {
          console.warn("[Supabase Reviews] Warning: could not write to Supabase reviews table.", error);
          sbErrorMsg = error.message;
        } else {
          sbRecord = data ? data[0] : null;
          console.log(`[Supabase Reviews] Cloud inserted review by: ${name}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Reviews] Cloud insert exception. Saved locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({
      success: true,
      review: sbRecord || newReview,
      supabaseSaved: !!sbRecord,
      supabaseError: sbErrorMsg
    });
  } catch (err: any) {
    console.error("[Review Create] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to submit review." });
  }
});

// DELETE review
app.post("/api/supabase/reviews/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Review ID is required." });
  }

  try {
    // 1. Delete from local fallback file
    const localReviews = await readLocalData("reviews.json", DEFAULT_SEED_REVIEWS);
    const updatedReviews = localReviews.filter((r: any) => r.id !== id);
    await writeLocalData("reviews.json", updatedReviews);

    // 2. Try deleting from Supabase
    const sb = getSupabase();
    let sbDeleted = false;
    let sbErrorMsg = null;
    if (sb) {
      try {
        const { error } = await sb
          .from("reviews")
          .delete()
          .eq("id", id);

        if (error) {
          console.warn("[Supabase Reviews] Could not delete from Supabase table:", error);
          sbErrorMsg = error.message;
        } else {
          sbDeleted = true;
          console.log(`[Supabase Reviews] Deleted review with id: ${id}`);
        }
      } catch (sbErr: any) {
        console.warn("[Supabase Reviews] Cloud delete exception. Deleted locally.", sbErr);
        sbErrorMsg = sbErr.message || String(sbErr);
      }
    }

    return res.json({ success: true, localDeleted: true, supabaseDeleted: sbDeleted, supabaseError: sbErrorMsg });
  } catch (err: any) {
    console.error("[Review Delete] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete review." });
  }
});

// ==========================================
// ADMIN SINGLE-SLOT PORTAL ENDPOINTS
// ==========================================

// Check if admin is registered (GET)
app.get("/api/admin/status", async (req, res) => {
  try {
    const localAdmins = await readLocalData("admins.json", []);
    let adminExists = localAdmins.length > 0;

    const sb = getSupabase();
    if (!adminExists && sb) {
      try {
        const { count, error } = await sb
          .from("admins")
          .select("*", { count: "exact", head: true });
        
        if (!error && count !== null && count > 0) {
          adminExists = true;
        }
      } catch (sbErr) {
        console.warn("[Admin Status] Could not check admins table in Supabase:", sbErr);
      }
    }

    return res.json({ adminExists });
  } catch (error: any) {
    console.error("[Admin Status] Error:", error);
    return res.status(500).json({ error: error.message || "Failed to inspect administration status." });
  }
});

// Register primary administrator slot (POST - STRICT SINGLE SLOT)
app.post("/api/admin/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All registration fields (name, email, password) are required." });
  }

  try {
    const localAdmins = await readLocalData("admins.json", []);
    let adminExists = localAdmins.length > 0;

    const sb = getSupabase();
    if (!adminExists && sb) {
      try {
        const { count, error } = await sb
          .from("admins")
          .select("*", { count: "exact", head: true });
        if (!error && count !== null && count > 0) {
          adminExists = true;
        }
      } catch (sbErr) {
        console.warn("[Admin Reg Check] Supabase table check exception:", sbErr);
      }
    }

    if (adminExists) {
      return res.status(400).json({ error: "The single primary administrator slot is already taken. No further admin accounts can be created." });
    }

    const newAdmin = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email: email.toLowerCase().trim(),
      password, // Template plain storage
      created_at: new Date().toISOString()
    };

    localAdmins.push(newAdmin);
    await writeLocalData("admins.json", localAdmins);

    if (sb) {
      try {
        const { error: sbError } = await sb.from("admins").insert([newAdmin]);
        if (sbError) {
          console.warn("[Supabase Admins Insert] Error inserting into admins table in Supabase. Check if the table exists.", sbError);
        }
      } catch (sbErr) {
        console.warn("[Supabase Admins Insert] Catch block error:", sbErr);
      }
    }

    return res.json({ success: true, admin: { name: newAdmin.name, email: newAdmin.email } });
  } catch (err: any) {
    console.error("[Admin Reg] Error registering admin:", err);
    return res.status(500).json({ error: err.message || "Failed to register primary administrator." });
  }
});

// Administrator Login (POST)
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const queryEmail = email.toLowerCase().trim();

  try {
    // 1. Check local admins
    const localAdmins = await readLocalData("admins.json", []);
    let foundAdmin = localAdmins.find((a: any) => a.email === queryEmail && a.password === password);

    // 2. Check Supabase admins as backup
    const sb = getSupabase();
    if (!foundAdmin && sb) {
      try {
        const { data, error } = await sb
          .from("admins")
          .select("*")
          .eq("email", queryEmail)
          .eq("password", password)
          .maybeSingle();

        if (!error && data) {
          foundAdmin = data;
          // Sync locally for offline speed
          localAdmins.push(data);
          await writeLocalData("admins.json", localAdmins);
        }
      } catch (sbErr) {
        console.warn("[Supabase Admin Login] Error checking Supabase admins table:", sbErr);
      }
    }

    if (!foundAdmin) {
      return res.status(401).json({ error: "Invalid administrator email or password." });
    }

    return res.json({ success: true, admin: { name: foundAdmin.name, email: foundAdmin.email } });
  } catch (err: any) {
    console.error("[Admin Login] Exception:", err);
    return res.status(500).json({ error: err.message || "Failed to authenticate administrator." });
  }
});

// ==========================================
// CLINICAL AI SOLUTION & PRESCRIPTION GENERATOR
// ==========================================

app.post("/api/planner/generate-solutions", async (req, res) => {
  const { specialty, doctorName, symptoms, medications, questions } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms details are required to generate solutions." });
  }

  console.log(`[HealTrust AI Planner] Generating solutions for specialty: "${specialty || "General"}"`);

  // Fallback if API key is missing
  if (!apiKey) {
    return res.json({
      success: true,
      solutions: `### AI Clinical Guidance & Answers
- **Active Consultation Support:** In clinical prep for your visit with **Dr. ${doctorName || "a specialist"}**, we suggest detailing symptoms ("${symptoms}").
- **Current Medications Check:** The doctor will examine your current intake of "${medications || "none declared"}". Keep all medicines and vitamins handy.

### Supportive Solutions & Home Guidelines
- **Symptomatic Relief:** Rest in a well-ventilated, quiet space. Consume clean, warm liquids like green tea or broth.
- **Dietary Hygiene:** Avoid oily, deep-fried food, heavy spices, or raw dairy products before the checkup.

### Clinical Caution & Emergency Alerts
- **Bypassing the Appointment:** Go directly to the emergency room or call **Rescue 1122** if you feel sudden chest pain, shortness of breath, heavy bleeding, or a severe sudden headache.`
    });
  }

  // Construct a medical expert clinical preparation prompt
  const prompt = `You are an expert Senior Clinical Advisor specializing in "${specialty || "General Medicine"}".
The patient has scheduled an appointment with Dr. "${doctorName || "a medical specialist"}" and wants clinical guidance before they visit.

Patient symptoms & status:
- Main symptoms: "${symptoms}"
- Current medications & daily intake: "${medications || "None declared"}"

The patient has compiled a checklist of questions. For each question below, provide a medically sound, clear, and reassuring answer:
${questions && Array.isArray(questions) && questions.length > 0 
  ? questions.map((q, i) => `Question ${i + 1}: ${q}`).join("\n")
  : "What are the key questions a patient with these symptoms should ask during their visit?"}

Please format your response beautifully. You MUST use these exact Markdown headers:

### AI Clinical Guidance & Answers
Provide a clear sub-heading for each answer (e.g., **Answer to question: [Summarized Question]**) and write a concise, helpful clinical answer. You may provide a short Urdu summary translation where highly useful.

### Supportive Solutions & Home Guidelines
Detail safe, simple, evidence-based lifestyle changes, dietary habits, or rest techniques that the patient can do at home to manage symptoms before seeing the doctor.

### Clinical Caution & Emergency Alerts
Detail red flags (critical indicators) of their symptoms which require immediately bypassing the appointment and going to the nearest emergency room (dial Rescue 1122 in Pakistan).

### Doctor Discussion Helper
Detail 1-3 critical parameters they must inform Dr. ${doctorName || "the physician"} about during their visit (e.g. chronic conditions, medication allergies, or family histories of diabetes or blood pressure).

Strict constraint: Do not prescribe medication dosages or specific restricted drugs (e.g., specific antibiotics, strong painkillers). Keep everything supportive and educational. Include a small disclaimer that this is AI generated prep material and does not replace doctor diagnoses.`;

  try {
    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        temperature: 0.25,
      },
    });

    const solutionText = response.text || "";
    if (!solutionText) {
      throw new Error("Received empty text back from Gemini API.");
    }

    return res.json({ success: true, solutions: solutionText });
  } catch (err: any) {
    console.error("[HealTrust AI Planner] Generative API exception:", err);
    return res.json({
      success: true,
      solutions: `### AI Clinical Guidance & Answers
- **History Compilation:** Ready yourself to discuss how and when your symptoms ("${symptoms}") started.
- **Medications Safety review:** Compile a list of your current medicines: "${medications || "none declared"}".

### Supportive Solutions & Home Guidelines
- **Primary Support:** Eat small, light, freshly prepared meals. Avoid spicy food and commercial soft drinks. Rest adequately.

### Clinical Caution & Emergency Alerts
- **Emergency Warnings:** Dial **Rescue 1122** or go to the nearest hospital immediately if you experience breathing difficulties, crushing chest pressure, sudden numbness, or heavy blood loss.`
    });
  }
});

// AI-powered Medicine Safety Lookup
app.post("/api/med-safety/ai-lookup", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Medicine search query is required." });
  }

  const cleanQuery = query.trim();
  console.log(`[HealTrust AI Med Safety] Generating safety metrics for: ${cleanQuery}`);

  if (!apiKey) {
    console.warn("[HealTrust AI Med Safety] GEMINI_API_KEY is missing. Using local fallback response.");
    // Return a sensible fallback structured JSON
    const fallbackMed = {
      id: "ai-" + Math.random().toString(36).substring(2, 9),
      brandNames: [cleanQuery, cleanQuery + " Forte", cleanQuery + " Plus"],
      genericName: cleanQuery + " active compound (AI fallback)",
      usageCategory: "General treatment / Therapeutic support",
      urduUsage: `${cleanQuery} کے عمومی علاج اور افادیت کے لیے`,
      safeDosageAdult: "Follow physician guidelines or package insert instructions. Usually 1 dose daily after meals.",
      safeDosageChild: "Do not administer to children without registered pediatrician approval.",
      pregnancySafety: "Consult gynecologist",
      criticalAlerts: "Keep out of reach of children. Store in a cool, dry place. Do not double-dose or exceed maximum limits.",
      urduAlerts: "بچوں کی پہنچ سے دور رکھیں۔ ٹھنڈی اور خشک جگہ پر اسٹور کریں۔ ڈاکٹر کے مشورے کے بغیر دوا کی مقدار تبدیل نہ کریں۔",
      description: `${cleanQuery} is a widely recognized medicinal compound used to address targeted health concerns and restore bodily wellness under professional healthcare supervision.`,
      usesAndBenefits: [
        "Provides clinical relief from targeted disease symptoms",
        "Assists in restoring chemical/physiological homeostatic balance",
        "Aids in preventing secondary complications or symptom recurrence"
      ],
      sideEffects: [
        "Mild nausea or gastrointestinal discomfort",
        "Temporary dizziness or lightheadedness if taken on empty stomach",
        "Dry mouth or occasional lethargy"
      ],
      clinicalPrecautions: [
        "Do not discontinue abruptly without completing the prescribed clinical course",
        "Inform your physician about any prior allergic reactions to chemical compounds",
        "Avoid self-medicating beyond standard over-the-counter guidelines"
      ],
      urduBenefits: "یہ دوا درج شدہ علامات کے علاج، جسمانی درد میں کمی، اور صحت کی بحالی کے لیے انتہائی مفید ہے۔"
    };
    return res.json({ success: true, medication: fallbackMed });
  }

  try {
    const prompt = `You are an expert Global Clinical Pharmacologist, Toxicologist, and Medical Specialist.
Analyze the medicine or drug named "${cleanQuery}". This query can represent ANY pharmaceutical medicine, active drug formula, over-the-counter medicine, biological agent, or popular commercial brand in the world (such as Paracetamol, Ozempic, Lipitor, Metformin, Amoxicillin, Ventolin, Augmentin, Brufen, etc.).
Provide authentic, comprehensive, and detailed clinical safety, therapeutic, and toxicological insights.

Return a JSON object conforming exactly to the following typescript interface:
{
  "brandNames": string[], // 2 to 4 popular commercial brand names for this medicine globally or locally in Pakistan (e.g. for Paracetamol: ["Panadol", "Calpol", "Disprol"], for Semaglutide: ["Ozempic", "Wegovy", "Rybelsus"])
  "genericName": string, // The scientific generic active formula name and chemical classification (e.g., "Paracetamol / Acetaminophen (Analgesic & Antipyretic)")
  "usageCategory": string, // Brief therapeutic category (e.g., "Non-insulin antidiabetic medication (GLP-1 receptor agonist)")
  "urduUsage": string, // Clear Urdu translation of the conditions this medicine treats/resolves (e.g., "ٹائپ 2 ذیابیطس میں خون میں شوگر کے کنٹرول اور وزن میں کمی کے لیے")
  "safeDosageAdult": string, // Comprehensive adult dosage guidelines, normal starting dosage, frequency, and maximum safe daily threshold limits
  "safeDosageChild": string, // Pediatric guidelines, child age/weight considerations, or strict warnings if not suitable for children
  "pregnancySafety": "Safe under advice" | "Avoid unless critical" | "Strictly Avoid" | "Consult gynecologist", // Must be EXACTLY one of these four values
  "criticalAlerts": string, // Major warning, overdose risks, or critical contraindications in English
  "urduAlerts": string, // Major warning, overdose risks, or critical contraindications in Urdu
  "description": string, // 2 dense, informative paragraphs: First explaining what this drug is and its mechanism of action, and Second describing the clinical conditions and symptoms it solves globally.
  "usesAndBenefits": string[], // 4 to 6 detailed bullet points explaining the uses, clinical benefits, and advantages of this drug (e.g., "Enables blood glucose regulation", "Provides cardiovascular risk reduction")
  "sideEffects": string[], // 4 to 5 common or serious side effects, adverse reactions, and disadvantages/risks of this drug (e.g., "Nausea and abdominal discomfort", "Risk of hypoglycemia if used with insulin")
  "clinicalPrecautions": string[], // 4 to 5 critical clinical precautions, contraindications, or safe administration practices (e.g., "Do not use if there is a personal/family history of medullary thyroid carcinoma")
  "advantages": string[], // 3 to 5 clear advantages, therapeutic strengths, or clinical pros of this specific drug (e.g., ["Highly effective at reducing cardiovascular events", "Once-weekly convenient injection schedule", "Clinically proven to aid significant weight reduction"])
  "disadvantages": string[], // 3 to 5 clear disadvantages, therapeutic drawbacks, limitations, or cons of this specific drug (e.g., ["High monthly medication costs", "Requires cold-chain refrigeration storage", "Can cause initial gastrointestinal side effects like nausea"])
  "urduBenefits": string // A highly detailed summary in Urdu explaining the advantages, benefits, clinical solutions, and potential side effects of this medicine for patients.
}

Ensure the response contains ONLY the valid JSON object. Do not wrap in markdown code blocks like \`\`\`json. Just raw, pure JSON text.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        temperature: 0.15,
        responseMimeType: "application/json"
      },
    });

    const responseText = response.text || "";
    // Clean codeblock formatting if any
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith("```json")) {
      cleanJsonStr = cleanJsonStr.substring(7);
    } else if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.substring(3);
    }
    if (cleanJsonStr.endsWith("```")) {
      cleanJsonStr = cleanJsonStr.substring(0, cleanJsonStr.length - 3);
    }
    cleanJsonStr = cleanJsonStr.trim();

    const parsed = JSON.parse(cleanJsonStr);
    
    // Construct valid MedicationSafetyInfo
    const medInfo = {
      id: "ai-" + Math.random().toString(36).substring(2, 9),
      brandNames: Array.isArray(parsed.brandNames) ? parsed.brandNames : [cleanQuery],
      genericName: parsed.genericName || cleanQuery,
      usageCategory: parsed.usageCategory || "Therapeutic treatment",
      urduUsage: parsed.urduUsage || `${cleanQuery} کا استعمال`,
      safeDosageAdult: parsed.safeDosageAdult || "Consult direct medical instructions.",
      safeDosageChild: parsed.safeDosageChild || "Strictly consult registered pediatrician.",
      pregnancySafety: ["Safe under advice", "Avoid unless critical", "Strictly Avoid", "Consult gynecologist"].includes(parsed.pregnancySafety) 
        ? parsed.pregnancySafety 
        : "Consult gynecologist",
      criticalAlerts: parsed.criticalAlerts || "Seek pharmacist advice.",
      urduAlerts: parsed.urduAlerts || "ڈاکٹر سے رجوع کریں۔",
      description: parsed.description || `${cleanQuery} is used for therapeutic patient care under clinical guidelines.`,
      usesAndBenefits: Array.isArray(parsed.usesAndBenefits) ? parsed.usesAndBenefits : ["Relieves targeted symptoms", "Provides health restoration support"],
      sideEffects: Array.isArray(parsed.sideEffects) ? parsed.sideEffects : ["Mild nausea", "Drowsiness"],
      clinicalPrecautions: Array.isArray(parsed.clinicalPrecautions) ? parsed.clinicalPrecautions : ["Observe standard pharmaceutical directions", "Check for active drug allergies"],
      advantages: Array.isArray(parsed.advantages) ? parsed.advantages : ["Clinically effective therapeutic active formula", "Widespread clinical availability and trust"],
      disadvantages: Array.isArray(parsed.disadvantages) ? parsed.disadvantages : ["Requires precise clinical adherence", "Potential for side effects if misused"],
      urduBenefits: parsed.urduBenefits || `${cleanQuery} صحت کی بحالی کے لیے مفید ہے۔`
    };

    return res.json({ success: true, medication: medInfo });
  } catch (err: any) {
    console.error("[HealTrust AI Med Safety] Generative API exception:", err);
    const fallbackMed = {
      id: "ai-" + Math.random().toString(36).substring(2, 9),
      brandNames: [cleanQuery],
      genericName: "Active Formula (Details Offline)",
      usageCategory: "General treatment / Therapeutic support",
      urduUsage: `${cleanQuery} کے عمومی علاج اور افادیت کے لیے`,
      safeDosageAdult: "Follow physician guidelines or package insert instructions.",
      safeDosageChild: "Do not administer to children without registered pediatrician approval.",
      pregnancySafety: "Consult gynecologist",
      criticalAlerts: "Keep out of reach of children. Store in a cool, dry place.",
      urduAlerts: "بچوں کی پہنچ سے دور رکھیں۔ ٹھنڈی اور خشک جگہ پر اسٹور کریں۔",
      description: "Detailed medical profile is temporarily offline. This compound is used standardly for targeted symptom alleviation under certified clinical guidelines.",
      usesAndBenefits: ["Provides standard symptomatic relief", "Supports natural physiological healing", "Implements localized/systemic therapeutic action"],
      sideEffects: ["Mild stomach sensitivity", "Mild drowsiness or fatigue"],
      clinicalPrecautions: ["Avoid adjusting dosage without clinical consent", "Consult doctor if symptom duration exceeds 3 days"],
      urduBenefits: "یہ دوا جسم کی قدرتی صحت بحالی، علامات کے کنٹرول اور صحت مندانہ افادیت کے لیے معاون ہے۔"
    };
    return res.json({ success: true, medication: fallbackMed });
  }
});

// Configure Vite or Static files depending on environment
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
