export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  keywords: string[];
  answer: string;
}

const KB: KnowledgeEntry[] = [
  // ── PATIENT TYPES ──
  {
    id: "established-patient",
    category: "Scheduling",
    title: "Established Patient",
    keywords: ["established", "establish", "existing", "returning", "patient type", "kept"],
    answer: "An **Established Patient** is a patient who has had at least one gastro-related office visit with a **'Kept'** status (meaning they actually attended). No-shows and cancellations do NOT count.",
  },
  {
    id: "new-patient",
    category: "Scheduling",
    title: "New Patient",
    keywords: ["new patient", "new", "first time", "never seen", "never been"],
    answer: "A **New Patient** is a patient who has never had a gastro-related office visit with a 'Kept' status. This includes patients referred only for a 'Screening Colonoscopy' if an office visit is required first.",
  },
  {
    id: "follow-up-vs-long",
    category: "Scheduling",
    title: "Follow-Up vs Long Follow-Up",
    keywords: ["follow up", "follow-up", "long follow", "fu", "lfu", "when", "difference", "determine"],
    answer: `**Follow-Up vs Long Follow-Up** — How to determine:

1. Look at the patient's appointment history — only count **'Kept'** appointments. Ignore cancelled or no-show.
2. **Follow-Up (FU):** Last kept appointment was **LESS than 1 year ago**
3. **Long Follow-Up (LFU):** Last kept appointment was **MORE than 1 year ago** OR approved provider switch
4. **Volusia Exception:** Use Long Follow-Up if patient was seen in-office between 1 and 3 years ago

Always verify the doctor: use the provider listed on the most recent 'Kept' encounter.`,
  },

  // ── HFU ──
  {
    id: "hfu-rules",
    category: "Scheduling",
    title: "Hospital Follow-Up (HFU)",
    keywords: ["hfu", "hospital follow", "hospital", "discharge", "inpatient", "er", "emergency"],
    answer: `**Hospital Follow-Up (HFU) Rules:**

• Patient seen in hospital (Inpatient or ER) by a BG physician within **last 90 days**
• **90-day rule:** Within 90 days = eligible. Over 90 days = schedule FU or Long FU instead
• **Established patients:** Always schedule with their established provider
• **New patient + provider listed:** Schedule with provider listed in Hospital D/C Follow-Up field
• **New patient + NO provider:** Follow up through the **HFU Teams Chat**
• ⚠️ When entering HFU: put event type in Details box — do **NOT** enter symptoms`,
  },
  {
    id: "hfu-new-patient",
    category: "Scheduling",
    title: "HFU New Patient No Provider",
    keywords: ["hfu", "new patient", "no provider", "no doctor", "teams", "chat", "who to schedule"],
    answer: "If a new HFU patient has no provider listed in the Hospital D/C Follow-Up field, do **NOT** schedule them directly. Follow up through the **HFU Teams Chat** and the team will assign a provider.",
  },

  // ── DAP COLONOSCOPY ──
  {
    id: "dap-eligibility",
    category: "Scheduling",
    title: "DAP Colonoscopy Eligibility",
    keywords: ["dap", "direct access", "colonoscopy", "dap eligibility", "dap rules", "dap criteria"],
    answer: `**DAP (Direct Access Procedure) Colonoscopy** — ALL criteria must be met:

✅ Age **45–74** (under 45 or over 74 → office visit first)
✅ Patient **passes screening questions**
✅ Patient **passes medical questionnaire**
✅ **Referral is complete** and ready
✅ Appropriate history required

⛔ Standard Colonoscopy: We do **NOT** schedule initial standard colonoscopies. Process: 1) Schedule OV → 2) Provider determines if needed → 3) Office schedules it.`,
  },

  // ── EGD ──
  {
    id: "egd-rules",
    category: "Scheduling",
    title: "EGD / Upper Endoscopy Rules",
    keywords: ["egd", "endoscopy", "upper endoscopy", "pan", "scope"],
    answer: `**EGD Rules:**

⛔ **Initial EGD:** NEVER schedule directly — patient must complete an office visit first. No exceptions.

**EGD Recall Requirements** — ALL must be met:
• Established Patient ONLY (no new patients)
• Age **45–74**
• Must have a previous EGD in our system
• Must have a **recall request from the doctor**
• **NOT a Volusia patient** (Volusia has special rules)

**After any colonoscopy/endoscopy:** next appointment must be a **Recall** (unless age restriction, problem, failed questionnaire, or referral issue).`,
  },

  // ── PROCEDURE RESCHEDULING ──
  {
    id: "reschedule-procedure",
    category: "Scheduling",
    title: "Rescheduling Procedures",
    keywords: ["reschedule", "procedure", "colonoscopy reschedule", "cancel procedure", "3pm", "3 pm", "three"],
    answer: `**Rescheduling Procedures:**

• **Before 3:00 PM:** Cancel old appointment → create new one → send message to clinical team with **both old and new times**
• **After 3:00 PM (same-day or next-day):** Do **NOT** cancel or reschedule → Warm Transfer directly to the appropriate ASC or office backline`,
  },

  // ── OV RESCHEDULING ──
  {
    id: "reschedule-ov",
    category: "Scheduling",
    title: "Rescheduling Office Visits",
    keywords: ["reschedule", "office visit", "ov", "rescheduling", "cancel ov"],
    answer: `**Rescheduling Office Visits:**

• **OV must be in 'Expected' status** to reschedule. No-Show or Cancelled = create brand-new appointment.
• **More than 1 hour away:** Cancel existing → create new appointment
• **Less than 1 hour away:** Leave existing → schedule new one → send message to clinical team immediately
• **Cancellation < 24 hours (patient refuses to reschedule):** Cancel and message OM: _"patient called to cancel, and would not reschedule, <24 hours before appointment."_`,
  },

  // ── SCHEDULING GUARDRAILS ──
  {
    id: "ov-timing",
    category: "Scheduling",
    title: "OV Timing Rule",
    keywords: ["same day", "next day", "tomorrow", "timing", "how far out", "book", "when"],
    answer: "**OV Timing Rule:** Book appointments **2–3 days out**. Absolutely **NO same-day or next-day** appointments.",
  },
  {
    id: "switching-doctors",
    category: "Scheduling",
    title: "Switching Doctors",
    keywords: ["switch doctor", "change doctor", "different provider", "transfer patient", "female doctor"],
    answer: `**Switching Doctors:**
• Established patients **cannot switch** unless they have an approved reason (e.g., requesting a female physician)
• **New patients who haven't seen their assigned doctor yet** can switch to any doctor
• **Female provider request:** Narrow the search results to female doctors AND female extenders`,
  },
  {
    id: "extenders",
    category: "Scheduling",
    title: "Scheduling with Extenders",
    keywords: ["extender", "np", "pa", "nurse practitioner", "physician assistant", "bold", "extenders"],
    answer: `**Extenders (NP/PA):**
• If a doctor has an extender, it will appear in **bold text** on the schedule
• You can schedule established patients with **either the doctor or the extender**
• **Volusia Exception:** Volusia is the only practice where patients can see all 4 Volusia extenders (though they still cannot see all providers)
• Extenders can only see established patients of their supervising physician`,
  },
  {
    id: "double-booking",
    category: "Scheduling",
    title: "Double Booking Warning",
    keywords: ["double book", "double-book", "booking warning", "warning message"],
    answer: "If you receive a **double-booking warning message**, do **NOT** double-book the appointment. Find a different time slot.",
  },
  {
    id: "waitlist",
    category: "Scheduling",
    title: "Waitlist Rules",
    keywords: ["waitlist", "wait list", "sooner", "earlier", "wait"],
    answer: `**Waitlist Rules:**
• Eligible: **Office visits ONLY**
• NOT eligible: Procedures (including colonoscopies and endoscopies)
• Requirement: Patient must **already have an OV scheduled** before being added to the waitlist`,
  },
  {
    id: "no-show",
    category: "Scheduling",
    title: "No-Show / Cancelled Appointments",
    keywords: ["no show", "no-show", "cancelled", "cancel", "status", "expected"],
    answer: "You can only **reschedule** an OV that is in **'Expected'** status. If an appointment is a **No-Show** or **Cancelled**, you must create a **brand-new appointment** — you cannot reschedule it.",
  },

  // ── RECALL ──
  {
    id: "recall",
    category: "Scheduling",
    title: "Recall Procedures",
    keywords: ["recall", "recall status", "colonoscopy recall", "egd recall", "first mailing"],
    answer: `**Recall Rules:**
• Status must be **'Active' or 'Stopped due to no contact'** for all recalls
• Verify date under **'First Mailing'** in the Recalls Tab or check EHR notes
• **Colonoscopy Recall:** Patient has previous colonoscopy history and is due for recall
• **EGD Recall:** Established patient, 45–74, previous EGD in system, recall request from doctor, NOT Volusia
• **Combined EGD/Colonoscopy Recall:** Requires an OV AND both recalls on file`,
  },

  // ── ROUTING ──
  {
    id: "routing-allergy",
    category: "Routing",
    title: "Allergy Department",
    keywords: ["allergy", "dr. watkins", "watkins", "allergist", "asthma"],
    answer: "**Allergy:** Dr. Watkins calls ONLY. → **Warm Transfer**. ⚠️ **NEVER reschedule or cancel Dr. Watkins appointments** — always warm transfer to the Allergy department.",
  },
  {
    id: "routing-billing",
    category: "Routing",
    title: "Collections / Billing",
    keywords: ["billing", "balance", "collections", "refund", "credit", "invoice", "payment arrangement", "money"],
    answer: `**Collections/Billing:** Any calls related to balance, credit, refunds, invoice, payment arrangements. → **Warm Transfer**

⚠️ **Patient balance over $1,000:** Cannot schedule a **procedure**. However, you **CAN** reschedule their procedure or office visit. → Warm Transfer to Collections.`,
  },
  {
    id: "routing-financial",
    category: "Routing",
    title: "Financial Counselor",
    keywords: ["financial counselor", "estimated cost", "cost estimate", "procedure cost", "financial"],
    answer: "**Financial Counselor:** For estimated cost questions for an upcoming **scheduled procedure**. → **EMAIL** the group at **FinancialCounselors@borlandgroover.com** — they will reach out to the patient. Exception: Copay arrangement for a future-dated OV → Transfer to office.",
  },
  {
    id: "routing-medical-records",
    category: "Routing",
    title: "HIS / Medical Records",
    keywords: ["medical records", "his", "records", "obtain records", "requesting records"],
    answer: "**HIS (Medical Records):** Obtaining or requesting patient medical records. → **Warm Transfer**. ⚠️ Medical records ONLY — NOT test results or labs (those go to Clinical Messaging).",
  },
  {
    id: "routing-insurance",
    category: "Routing",
    title: "Pre-Cert / Insurance",
    keywords: ["insurance", "prior auth", "pre-cert", "authorization", "pre cert", "insurance verification", "copay amount"],
    answer: "**Pre-Cert/Insurance:** Authorization, prior auth, insurance verification, copay amounts. → **Warm Transfer**. ⚠️ Insurance topics we do NOT discuss: benefits, coverage, copays, deductibles, coinsurance, payment arrangements.",
  },
  {
    id: "routing-clinical",
    category: "Routing",
    title: "Clinical Messaging",
    keywords: ["clinical message", "clinical messaging", "lab results", "test results", "medication", "imaging results", "paracentesis", "fibroscan", "eus"],
    answer: `**Clinical Messaging** (SLA: 24 hrs; Volusia South & Santa Rosa: 48 hrs):
• Lab/test/imaging results
• Medication authorization
• Paracentesis, EUS, Fibroscans
• B12/Iron Infusion (send message, NOT warm transfer)`,
  },
  {
    id: "routing-imaging",
    category: "Routing",
    title: "Imaging Department",
    keywords: ["imaging", "mri", "ct", "ultrasound", "xray", "x-ray", "scan", "barium", "dexa", "hida"],
    answer: `**Imaging:** → **Blind Transfer** for: CT, MRI, Ultrasound, Gastric Emptying Study, Barium Swallow, Barium Esophagram, Dexa, HIDA, Sitz Marker, Small Bowel Follow Through, Barium Enema.

⚠️ **Volusia South & Santa Rosa patients:** Send **clinical message** instead (SLA: 48 hrs)
⚠️ **Paracentesis, EUS, Fibroscans:** Send **clinical message** (SLA: 24 hrs; Volusia/Santa Rosa: 48 hrs)`,
  },
  {
    id: "routing-infusion",
    category: "Routing",
    title: "Infusion / Remicade",
    keywords: ["infusion", "remicade", "remicade infusion", "biologic", "entyvio", "stelara", "b12", "iron infusion"],
    answer: `**Infusion/Remicade:** → **Warm Transfer** to appropriate office location (Infusion Department).

⚠️ Exception: **B12/Iron Infusion** → Send **clinical message** (SLA: 24 hrs; Volusia South/Santa Rosa: 48 hrs)`,
  },
  {
    id: "routing-hospital-desk",
    category: "Routing",
    title: "Hospital Desk",
    keywords: ["hospital desk", "consult", "hospital consult", "consult request"],
    answer: "**Hospital Desk:** Any patient calling to request a consult. → **Warm Transfer**.",
  },
  {
    id: "routing-hr",
    category: "Routing",
    title: "Human Resources",
    keywords: ["human resources", "hr", "employee", "career", "job", "employment"],
    answer: "**Human Resources:** Employee verification or requesting career information. → **Blind Transfer**.",
  },

  // ── TRANSFER PROCEDURES ──
  {
    id: "warm-transfer",
    category: "Routing",
    title: "How to Do a Warm Transfer",
    keywords: ["warm transfer", "warm", "3-way", "three way", "consult", "merge", "how to transfer"],
    answer: `**Warm Transfer (3-Way Call):**
1. Select **Consult**
2. Select **Favorites**, find department (NOT Queues/Contacts)
3. Provide: your name, patient name + DOB, reason for call
4. Connect when agent confirms ready
5. Select **Add Consultation to MERGE** (⚠️ do NOT select Transfer)
6. Introduce patient
7. Select **Transfer** to end your call`,
  },
  {
    id: "blind-transfer",
    category: "Routing",
    title: "How to Do a Blind Transfer",
    keywords: ["blind transfer", "blind", "how to blind"],
    answer: `**Blind Transfer:**
1. Inform patient of the transfer
2. Select **Blind Transfer**
3. Select **Favorites**, choose department`,
  },
  {
    id: "interpreter",
    category: "Routing",
    title: "Interpreter / Translation Services",
    keywords: ["interpreter", "translation", "translate", "language", "spanish", "interpreter services"],
    answer: `**Interpreter/Translation Services:**
1. Select **Add a Guest**
2. Select **Favorites**
3. Type **Translation Services**
4. Select language
5. Provide code: **"Patient Support Services"**
6. Begin call
⚠️ Do NOT use warm transfer for interpreter services.`,
  },

  // ── LOCATION RULES ──
  {
    id: "location-volusia",
    category: "Locations",
    title: "Volusia County Rules",
    keywords: ["volusia", "port orange", "ormond beach", "deltona", "volusia south"],
    answer: `**Volusia Rules:**
• Keep patients within Volusia entities (Port Orange, Ormond Beach, Deltona — all Volusia South umbrella)
• Insurance not accepted → **St. Augustine**
• Location change request → offer **St. Augustine**
• Surgery → **SCV (Surgery Center of Volusia)**
• Extenders: Volusia is the ONLY practice where patients can see all 4 Volusia extenders`,
  },
  {
    id: "location-santa-rosa",
    category: "Locations",
    title: "Santa Rosa / Destin Rules",
    keywords: ["santa rosa", "destin", "santa rosa beach", "destin surgery"],
    answer: `**Santa Rosa (Destin area) Rules:**
• Insurance not accepted → Jacksonville office
• Procedures not accepted → **Destin SC (DSC)**
• Surgery center: DSC (Destin Surgery Center/Santa Rosa Beach)`,
  },
  {
    id: "location-georgia",
    category: "Locations",
    title: "Georgia Patient Location",
    keywords: ["georgia", "georgia patient", "nassau", "amelia island", "fernandina"],
    answer: "**Georgia Patients:** Route to **Nassau Crossing** or **Amelia Island (Fernandina)**.",
  },
  {
    id: "location-new-patient",
    category: "Locations",
    title: "New Patient Location Rules",
    keywords: ["new patient location", "where to schedule", "zip code", "radius", "20 mile"],
    answer: `**New Patient Location Rules:**
• Schedule for the location listed on the **referral**
• Exception: Patient requests a different office → use **zip code, 20-mile radius rule**
• Established patients: Stay in current service area unless they explicitly request to switch`,
  },
  {
    id: "hospital-locations",
    category: "Locations",
    title: "Hospital Locations — Do Not Schedule",
    keywords: ["hospital location", "bmc", "baptist", "saint vincent", "do not schedule", "hospital employee"],
    answer: `**Hospital Locations:** Do **NOT** schedule except for:
• Hospital employees
• If there is a specific note

Hospital employees → send task to clinical team.

Hospital abbreviations: BMC C, BMC N, BMC D, BMC S (Baptist Medical Center), STV RS/SS/SJ/C (Saint Vincent), AH DB (Advent Health Daytona Beach), OPMC, SHEC, MMC.`,
  },

  // ── INSURANCE ──
  {
    id: "insurance-topics",
    category: "Insurance",
    title: "Insurance Topics We Do Not Discuss",
    keywords: ["insurance topics", "cannot discuss", "copay", "deductible", "coinsurance", "benefits", "coverage"],
    answer: `**Insurance Topics We Do NOT Discuss:**
Benefits, Coverage, Copays, Deductibles, Coinsurance, Payment arrangements.

→ **Action:** Warm transfer to Insurance Team or provide their contact info.
→ **Insurance Chat (Pre-Cert Team):** For OV-related insurance questions ONLY.`,
  },
  {
    id: "insurance-entry",
    category: "Insurance",
    title: "Insurance Entry Rules",
    keywords: ["insurance entry", "load insurance", "secondary insurance", "hmo", "ppo", "bcbs", "medicare", "self pay"],
    answer: `**Insurance Entry Rules:**
• Never load **secondary insurance** by yourself
• Future active date = process as **Self Pay**
• Always ask **HMO or PPO**
• **BCBS** = search "BCBS"
• **Dual Medicare** = "Medicare complete"
• Missing policy number = process as **Self Pay** + add SSN + note in Miscellaneous Notes
• Group number: mandatory to ask, may proceed without if patient doesn't have it
• Always get **customer service phone number** → enter in Contact Phone field`,
  },
  {
    id: "tricare",
    category: "Insurance",
    title: "Tricare Protocol",
    keywords: ["tricare", "military", "dod", "department of defense"],
    answer: "**TRICARE Protocol:** Insurance Program: TRICARE. Pharmacy Category: **DOD (Department of Defense)**.",
  },

  // ── DEMOGRAPHICS / HIPAA ──
  {
    id: "demographics",
    category: "HIPAA",
    title: "Patient Chart Lookup",
    keywords: ["demographics", "hipaa", "chart", "lookup", "verify", "identity", "dob"],
    answer: `**Patient Chart Lookup:** Need:
• First Name (**3 letters minimum**)
• Last Name (**3 letters minimum**)
• Date of Birth

**HIPAA:** 
• Name on HIPAA → proceed normally
• Name NOT on HIPAA → do not disclose clinical/financial info → get direct authorization from patient first
• Third-party commercial callers: Can schedule/cancel, do NOT disclose clinical info`,
  },
  {
    id: "verify-demographics",
    category: "HIPAA",
    title: "When to Verify Demographics",
    keywords: ["verify", "demographics", "verify phone", "verify email", "when to verify"],
    answer: `**Verify Phone + Email for:**
Reschedule, Cancel, Clinical message, Appointment confirmation, General inquiry

**Verify Phone + Email + Insurance + Pharmacy for:**
Medication renewal, Preps`,
  },
  {
    id: "new-patient-info",
    category: "HIPAA",
    title: "New Patient Required Info",
    keywords: ["new patient info", "required information", "new patient fields", "ssn", "what to collect"],
    answer: `**New Patient Required Info:**
Gender (Assigned Birth Sex), SSN, Address, Phone, Email, Notifications, Language, PCP, Pharmacy

**Insurance:** HMO/PPO, policy number, group number, customer service number

**SSN Exception:** If uncomfortable, enter **777-77-7777**. If asked why: "Required for billing and insurance reasons."
**Gender Exception:** If they refuse, enter "asked but declined"`,
  },

  // ── SCRIPTS ──
  {
    id: "opening-script",
    category: "Scripts",
    title: "Opening Script",
    keywords: ["opening", "open", "greeting", "how to answer", "answer phone"],
    answer: `**Opening Script:**
"Thank you for calling Borland Groover, my name is [your name], how can I help you today?"`,
  },
  {
    id: "closing-script",
    category: "Scripts",
    title: "Closing Script",
    keywords: ["closing", "close", "end call", "goodbye"],
    answer: `**Closing Script:**
"Thank you for calling Borland Groover, have a great day."`,
  },
  {
    id: "voicemail-script",
    category: "Scripts",
    title: "Voicemail / Answering Machine",
    keywords: ["voicemail", "answering machine", "machine", "leave message", "no answer"],
    answer: `**Voicemail Script:**
"Hello, this is [your name] calling regarding your callback request. Please call Borland Groover back at **904-398-7205**. Thank you."
→ Select **Option 1** when calling back.

**No Answer (can hear background):**
"Caller, if you can hear me, I can't hear you. Please give Borland a call back at 904-398-7205. Releasing line due to no response."`,
  },
  {
    id: "callback-script",
    category: "Scripts",
    title: "Callback Request Script",
    keywords: ["callback", "call back", "returning call", "follow up call"],
    answer: `**Callback Script:**
"Hi, this is [your name] following up on your callback request. How can I help you?"`,
  },
  {
    id: "warm-transfer-script",
    category: "Scripts",
    title: "Warm Transfer Scripts",
    keywords: ["warm transfer script", "introduce", "introducing", "hold script"],
    answer: `**Warm Transfer — To Department:**
"Thank you for holding, [department]. My name is [your name], I have [patient name], DOB [MM/DD/YYYY], calling regarding [reason for call]. I'm going to connect you now."

**Warm Transfer — To Patient:**
"[Patient name], I have [agent name] on the line from [department]. They will be able to assist you. Is there anything else I can help you with before I go?"`,
  },

  // ── DISPOSITION CODES ──
  {
    id: "disposition-codes",
    category: "Disposition",
    title: "All Disposition Codes",
    keywords: ["disposition", "code", "disposition code", "codes"],
    answer: `**All 14 Disposition Codes:**

• **Appointment Confirmation** — patient called to confirm or check a scheduled appointment
• **Canceled Appointment** — patient called to cancel
• **Appointment Scheduled** — new or established patient scheduled
• **Appointment Rescheduled** — patient called to change date/time
• **Sooner Appointment / Waitlist** — placed on waitlist for sooner appointment
• **Clinical Message** — patient called to speak to someone in office
• **Urgent Clinical Transfer** — transferred to office based on Urgent List
• **Non Urgent Transfer** — non-clinical intervention or insurance inquiry
• **Demographics** — called to update demographics
• **Left Message** — left message for callback request
• **Call Back - No Answer** — callback with no response from patient
• **Other** — any call not listed (requires notes)
• **General Inquiry** — fax/office number, address, directions, provider lookup
• **Decline to Schedule** — referral patient declined to schedule`,
  },

  // ── SYSTEMS ──
  {
    id: "nextgen-pm",
    category: "Systems",
    title: "NextGen PM Uses",
    keywords: ["nextgen pm", "nextgen", "pm", "practice management", "schedule", "system"],
    answer: `**NextGen PM Primary Uses:**
Schedule Office Visits and Procedures, Confirm Appointments, Update Demographics, Check for Hospital Encounters/Recalls, Bad Debt, Verification of HIPAA.

**To book an appointment:** Go to PM → Tasks tab → Appt Book`,
  },
  {
    id: "nextgen-ehr",
    category: "Systems",
    title: "NextGen EHR Uses",
    keywords: ["nextgen ehr", "ehr", "electronic health record", "clinical", "medication renewal", "clinical messages"],
    answer: `**NextGen EHR Primary Uses:**
Medication Renewals, Telephone Communications, Referrals, Medical Questionnaire, Patient Correspondence, Create New Patient Encounters, Imaging/Lab Orders, Verification of HIPAA.`,
  },
  {
    id: "phreesia",
    category: "Systems",
    title: "Phreesia",
    keywords: ["phreesia", "pre-registration", "registration", "forms", "link"],
    answer: `**Phreesia:** Used to send patients pre-registration links and appointment documents/forms.
• **EHR:** Click the **blue planet button**
• **Chart:** 4th tab from the left → Patient Chart
• **Create/view appointment:** Go to Task → App Search
• ⚠️ **CRUCIAL:** Do not open anything else in Phreesia under any circumstances.`,
  },

  // ── GENERAL ──
  {
    id: "kpi-goals",
    category: "General",
    title: "KPI Goals",
    keywords: ["kpi", "goals", "performance", "aht", "adherence", "quality", "calls per day"],
    answer: `**Daily KPI Goals:**
• Calls Per Day: **60+**
• Adherence: **90%**
• AHT: **6 minutes**
• Quality: **90%**

High volume days: **Monday and Tuesday**. AI calls occur on Mondays.`,
  },
  {
    id: "bg-main-line",
    category: "General",
    title: "BG Main Line",
    keywords: ["phone number", "main line", "main number", "bg phone", "call back number"],
    answer: "**BG Main Line:** 904-398-7205. Select **Option 1** for callbacks.",
  },
  {
    id: "balance-over-1000",
    category: "Scheduling",
    title: "Patient Balance Over $1,000",
    keywords: ["balance", "1000", "thousand", "$1000", "debt", "collection", "cannot schedule"],
    answer: `**Patient Balance Over $1,000:**
• Cannot schedule a **procedure**
• However, you **CAN** reschedule their procedure or office visit
• → Warm Transfer to **Collections/Billing**`,
  },
  {
    id: "medical-questionnaire",
    category: "Scheduling",
    title: "Medical Questionnaire",
    keywords: ["medical questionnaire", "questionnaire", "mq", "questions"],
    answer: `**Medical Questionnaire:**
• **Required for:** Procedures (clear Yes/No answers only)
• **NOT required for:** Office visits`,
  },
  {
    id: "referral-liver",
    category: "Scheduling",
    title: "Referral — OV Required (Liver)",
    keywords: ["liver", "hepatitis", "cirrhosis", "fatty liver", "nash", "masld", "mash", "liver referral", "hepatology", "autoimmune"],
    answer: `**OV Required for these referrals** (never schedule procedure directly):
Liver Disease, Liver Transplant, Cirrhosis, Alcoholic Cirrhosis, Hepatitis B or C, Autoimmune Hepatitis, Fatty Liver, Liver Lesion, Abnormal/Elevated LFTs, Drug-Induced Liver Disease, NASH, MASLD, MASH, Hepatic Fibrosis, Hepatic Steatosis, Sarcoidosis, Primary Biliary Cholangitis (PBC).`,
  },
  {
    id: "teams-channels",
    category: "General",
    title: "Teams Channels",
    keywords: ["teams", "teams chat", "theta", "general chat", "post"],
    answer: `**Teams Channels:**
• **Theta Chat:** Post your questions here
• **General Chat:** Read-only — do NOT post here
• **HFU Chat:** For new HFU patients with no assigned provider`,
  },
  {
    id: "medical-titles",
    category: "General",
    title: "Medical Title Abbreviations",
    keywords: ["md", "do", "aprn", "pa", "np", "title", "abbreviation", "credential"],
    answer: `**Medical Title Abbreviations:**
• **MD** — Medical Doctor
• **DO** — Doctor of Osteopathic Medicine
• **APRN** — Advanced Practice Registered Nurse (Nurse Practitioner/Specialist)
• **PA** — Physician Assistant`,
  },
  {
    id: "cologuard",
    category: "General",
    title: "Cologuard",
    keywords: ["cologuard", "stool test", "colorectal screening", "stool-based"],
    answer: "**Cologuard:** A stool-based colorectal cancer screening test. It is not a procedure we schedule — it is ordered by the physician.",
  },
  {
    id: "wecare",
    category: "Scheduling",
    title: "WeCare Charity Program",
    keywords: ["wecare", "we care", "charity", "wecare new patient", "wecare follow up"],
    answer: `**WeCare Charity Program:**
• **WeCare New Patient:** New to BG + active WeCare Referral. WeCare is for qualified Jacksonville residents.
• **WeCare Follow-Up:** Established WeCare patient seen within 1 year. Must have WeCare Charity on chart.
• **WeCare Long Follow-Up:** Established WeCare patient seen over 1 year ago OR transferring providers.`,
  },
  {
    id: "surgery-centers",
    category: "Locations",
    title: "Surgery / Endoscopy Center Abbreviations",
    keywords: ["jce", "saec", "opec", "dsc", "scv", "dcec", "ncec", "surgery center", "endoscopy center", "asc"],
    answer: `**Surgery & Endoscopy Center Abbreviations:**
• **JCE SS** — Jacksonville Center for Endoscopy Southside
• **JCE RS** — Jacksonville Center for Endoscopy Riverside
• **SAEC** — Saint Augustine Endoscopy Center
• **OPEC** — Orange Park Endoscopy Center
• **DSC** — Destin Surgery Center / Santa Rosa Beach
• **SCV** — Surgery Center of Volusia
• **DCEC** — Durbin Crossing Endo Center
• **NCEC** — Nassau Crossing Endo Center`,
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreEntry(entry: KnowledgeEntry, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;

  const titleLower = entry.title.toLowerCase();
  const categoryLower = entry.category.toLowerCase();
  const allKeywords = entry.keywords.map((k) => k.toLowerCase());
  const answerLower = entry.answer.toLowerCase();

  let score = 0;

  for (const token of queryTokens) {
    if (token.length < 3) continue;

    if (titleLower.includes(token)) score += 3;
    else if (allKeywords.some((k) => k.includes(token) || token.includes(k))) score += 2;
    else if (categoryLower.includes(token)) score += 1;
    else if (answerLower.includes(token)) score += 0.5;
  }

  return score;
}

function findProviderAnswer(query: string): string | null {
  const q = query.toLowerCase();

  const doctorMatch = q.match(/dr\.?\s+([a-z]+)/i);
  const nameTokens = tokenize(q);

  const providerNames = [
    { name: "Vikram Gopal", location: "Southside/Orange Park", extender: "Catherine Bailey, PA-C", specialty: "Gastroenterology" },
    { name: "Emily Rostholder", location: "Southside/Orange Park", extender: "Corrie Baker, PA-C", specialty: "Gastroenterology" },
    { name: "Daniel Gassert", location: "St. Augustine", extender: "Alice Carter, APRN", specialty: "Gastroenterology" },
    { name: "Nicholas Agresti", location: "Riverside/Orange Park", extender: "Sheri Hayes-Raulerson, APRN", specialty: "Gastroenterology" },
    { name: "Andrew Brown", location: "Riverside/Orange Park", extender: "Sheri Hayes-Raulerson, APRN", specialty: "Gastroenterology" },
    { name: "Ali Lankarani", location: "Riverside/Orange Park", extender: "Sheri Hayes-Raulerson, APRN", specialty: "Gastroenterology" },
    { name: "Louis Agnone", location: "Port Orange/Ormond Beach", extender: "Dottie Porter, Travis Satterfield, Marika Walker (PA-C)", specialty: "Gastroenterology" },
    { name: "Ketul Patel", location: "Port Orange/Ormond Beach", extender: "Dottie Porter, Travis Satterfield, Marika Walker (PA-C)", specialty: "Gastroenterology" },
    { name: "Vrushak Deshpande", location: "Port Orange/Ormond Beach", extender: "Dottie Porter, Travis Satterfield, Marika Walker (PA-C)", specialty: "Gastroenterology" },
    { name: "Raquel Watkins", location: "Bartram Park", extender: "None — Allergy dept only", specialty: "Allergy & Asthma" },
    { name: "Kyle Etzkorn", location: "Southside/Santa Rosa Beach", extender: "None listed", specialty: "Gastroenterology — CMO/Research Director" },
    { name: "Ronald Racho", location: "Durbin Crossing", extender: "None listed", specialty: "Gastroenterology" },
    { name: "William Barlow", location: "St. Augustine", extender: "None listed", specialty: "Gastroenterology" },
    { name: "Mary Barbara", location: "Nassau Crossing", extender: "None listed", specialty: "Gastroenterology" },
  ];

  for (const p of providerNames) {
    const nameParts = p.name.toLowerCase().split(" ");
    if (nameParts.some((part) => nameTokens.some((t) => t.includes(part) || part.includes(t)))) {
      let answer = `**Dr. ${p.name}**\n• Specialty: ${p.specialty}\n• Location(s): ${p.location}\n• Extender: ${p.extender}`;
      if (p.name.includes("Watkins")) {
        answer += "\n\n⚠️ **Never reschedule or cancel Dr. Watkins appointments** — always warm transfer to Allergy.";
      }
      return answer;
    }
  }
  return null;
}

export function getAnswer(question: string, history: Message[]): string {
  const q = question.trim();
  if (!q) return "Please ask a question and I'll help you!";

  const tokens = tokenize(q);

  const providerAnswer = findProviderAnswer(q);
  if (providerAnswer) return providerAnswer;

  const scored = KB.map((entry) => ({
    entry,
    score: scoreEntry(entry, tokens),
  })).sort((a, b) => b.score - a.score);

  const topMatches = scored.filter((s) => s.score > 0).slice(0, 3);

  if (topMatches.length === 0) {
    const lcq = q.toLowerCase();
    if (lcq.includes("hello") || lcq.includes("hi") || lcq.includes("hey")) {
      return "Hi! I'm your BG reference assistant. Ask me about scheduling rules, routing, scripts, providers, disposition codes, or any other BG policy. What do you need help with?";
    }
    return `I don't have specific information about that in my knowledge base. Here are some things to try:\n\n• Check the **SharePoint Scheduling Cheat Sheet** for the latest policies\n• Ask in the **Theta Teams Chat** for team guidance\n• If it's a provider question, check the **Provider Directory** section\n\nYou can also ask me about: scheduling rules, HFU, DAP colonoscopy, rescheduling, routing/transfers, call scripts, insurance topics, or location rules.`;
  }

  if (topMatches.length === 1 || topMatches[0].score > topMatches[1].score * 2) {
    return topMatches[0].entry.answer;
  }

  const [first, ...rest] = topMatches;
  let combined = first.entry.answer;

  if (rest[0] && rest[0].score >= first.score * 0.5) {
    combined += `\n\n---\n**Related — ${rest[0].entry.title}:**\n${rest[0].entry.answer}`;
  }

  return combined;
}
