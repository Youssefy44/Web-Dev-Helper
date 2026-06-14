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

  // ── DAP NURSES ──
  {
    id: "dap-nurses",
    category: "Contacts",
    title: "DAP Nurse Team — Direct Lines",
    keywords: ["dap nurse", "nurse", "direct line", "dap team", "clinical nurse", "sapresa", "april", "silcox", "wiggins", "dap phone"],
    answer: `**DAP Nurse Team — Direct Lines:**
• **Sapresa Smith** (DAP Nurse Lead) — 📞 904-385-5884
• **April Silcox** — 📞 904-925-0753
• **Jodi Wiggins** — 📞 904-342-5877

Contact DAP nurses for:
- Pre-procedure clinical questions
- DAP eligibility clarification
- Medical questionnaire follow-up
- Complex DAP patient issues`,
  },

  // ── HOSPITAL PROCEDURE RULES ──
  {
    id: "hospital-procedure-reschedule",
    category: "Scheduling",
    title: "Hospital Procedure Reschedule / Cancel Rules",
    keywords: ["hospital procedure", "hospital reschedule", "hospital cancel", "pss hospital", "hospital colonoscopy", "reschedule hospital"],
    answer: `**Hospital Procedure — Reschedule/Cancel Rules:**

| Type | Reschedule? | Cancel? | Task Needed? |
|---|---|---|---|
| DAP (incl. Flex) | Yes | Yes | Only if within 8 days |
| Non-DAP | No | Yes | Yes — task clinical staff |
| Advanced | No | No | Yes — task clinical staff |
| HBT / Hemorrhoid Banding | No | Yes | Yes — task clinical staff |

• **DAP colonoscopies scheduled by PSS** (us) may be rescheduled
• All other hospital procedures: task to clinical staff
• Hospital employee procedures → must be at their own hospital system
• Always offer BG-owned ASCs first before any hospital`,
  },

  // ── TELEMEDICINE GEORGIA ──
  {
    id: "telemedicine-georgia",
    category: "Scheduling",
    title: "Telemedicine — Georgia-Licensed Providers",
    keywords: ["telemedicine", "georgia", "telemed", "virtual", "telehealth", "virtual visit", "ga patient", "georgia patient"],
    answer: `**Telemedicine — Georgia-Licensed Providers (can see GA patients via telehealth):**
• Dr. Manolakis
• Dr. Thompson
• Dr. Whittaker
• Dr. Phillips
• Dr. Changela
• Kelli Lamb, PA
• Corrie Baker, PA-C

⚠️ For Georgia patients needing telehealth, ONLY these providers are eligible.`,
  },

  // ── ASC NO-SHOW POLICY ──
  {
    id: "asc-no-show-policy",
    category: "Scheduling",
    title: "ASC No-Show / Late Cancellation Policy",
    keywords: ["no show", "no-show", "asc no show", "procedure no show", "200", "fee", "72 hour", "cancellation policy", "late cancel"],
    answer: `**ASC No-Show / Late Cancellation Policy:**
• Fee: **$200** for procedure no-shows OR late cancellations
• Cancellation must be made **at least 72 hours prior** to procedure to avoid the fee
• If procedure is cancelled or no-show: **restart the scheduling process from scratch**
• After 3PM: warm transfer to the ASC directly — do not handle yourself
• Policy applies to all BG-owned ASCs (JCE SS, JCE RS, SAEC, OPEC, DSC)`,
  },

  // ── EGD WITH MIVU ──
  {
    id: "egd-mivu",
    category: "Scheduling",
    title: "EGD with MiVu — Do NOT Cancel",
    keywords: ["mivu", "mivु", "egd mivu", "capsule", "mivu egd", "financial counselor", "capsule endoscopy"],
    answer: `**EGD with MiVu Policy:**
• Do **NOT** cancel an EGD with MiVu procedure yourself
• If patient needs to cancel, has concerns, or questions about cost:
  → **Warm transfer to Financial Counselor**
• The Financial Counselor handles all MiVu-related scheduling changes
• MiVu = capsule endoscopy device (patient swallows a pill-sized camera)`,
  },

  // ── LUMA WAITLIST ──
  {
    id: "luma-waitlist",
    category: "Scheduling",
    title: "Luma Waitlist System",
    keywords: ["luma", "waitlist", "sooner appointment", "sooner", "luma health", "next available", "wait list"],
    answer: `**Luma Waitlist System:**
• Website: **next.lumahealth.io**
• Used to add patients requesting a sooner appointment
• Patient must **already have an appointment scheduled** to be added
• **Office visits ONLY** — procedures are NOT added to Luma waitlist
• Disposition code when adding: **Sooner Appointment / Waitlist**
• System automatically texts patients when earlier slots open`,
  },

  // ── INTERPRETER WORKFLOW ──
  {
    id: "interpreter-workflow",
    category: "Protocols",
    title: "Interpreter / Language Line Workflow",
    keywords: ["interpreter", "language", "spanish", "french", "translation", "language line", "language barrier", "arabic", "hindi", "vietnamese"],
    answer: `**Interpreter Workflow:**

**For Office Visits (OV):**
1. Identify language need
2. Connect language line interpreter before proceeding
3. Document language preference in appointment notes

**For ASC Procedures:**
1. Note language need when scheduling
2. ASC arranges their own interpreter for procedure day
3. If patient has personal interpreter: document name and relationship

**For Hospital Procedures:**
1. Contact hospital interpreter services
2. Document in procedure order notes

⚠️ Language barrier is a valid reason to switch providers (to one who speaks the patient's language).

**Providers with language skills:**
• Spanish: Corregidor, Cortes, Feagans, Merritt, Munoz, Sanchez
• French/Arabic: El Hajj, Khoury, Nassar, Pineau
• Hindi: Butt, Changela, Comar, Misra, Rai
• Vietnamese: Chau
• Farsi: Lankarani
• Russian: Norkina
• Dutch: Hoogerwerf`,
  },

  // ── WILDFLOWER CHARITY ──
  {
    id: "wildflower-charity",
    category: "Scheduling",
    title: "Wildflower Charity Program",
    keywords: ["wildflower", "charity", "st augustine charity", "soroka", "free care", "sliding scale", "wildflower health"],
    answer: `**Wildflower Charity Program:**
• Located at: **St. Augustine office ONLY**
• Provider: **Dr. Soroka ONLY**
• For qualifying low-income patients in the St. Augustine area
• ⚠️ Do NOT schedule Wildflower patients with any other provider
• ⚠️ Do NOT schedule Wildflower patients at any other location
• Different from WeCare Jax — Wildflower is St. Augustine area only`,
  },

  // ── WECARE EXPANDED ──
  {
    id: "wecare-locations",
    category: "Scheduling",
    title: "WeCare Jax — Providers & Locations",
    keywords: ["wecare", "we care jax", "wecare location", "wecare provider", "hoffman", "merrell", "sack", "tek", "we care providers"],
    answer: `**WeCare Jax Program:**
• For qualifying Jacksonville residents
• Uses locations: St. Vincent's Riverside, Southside, and Memorial (MMC)

**WE CARE ONLY Providers — Do NOT schedule regular patients with these doctors:**
• Dr. Hoffman (Southside)
• Dr. Merrell (Southside)
• Dr. Sack (Southside)
• Dr. Tek (Southside)

These providers see WeCare patients EXCLUSIVELY.

**Appointment Types:**
• WeCare New Patient — new to BG + active WeCare referral
• WeCare Follow-Up — established WeCare, seen within 1 year
• WeCare Long Follow-Up — established WeCare, seen over 1 year ago OR transferring providers`,
  },

  // ── LATE PROCEDURE RESCHEDULE (3PM) ──
  {
    id: "late-procedure-reschedule",
    category: "Scheduling",
    title: "Late Procedure Reschedule (After 3PM Rule)",
    keywords: ["3pm", "late reschedule", "late procedure", "after hours", "warm transfer asc", "same day reschedule", "after 3", "3 pm"],
    answer: `**Late Procedure Reschedule — After 3PM Rule:**
• If patient calls **after 3:00 PM** to reschedule or cancel a procedure:
  → **Warm transfer directly to the ASC** — do NOT handle yourself
• The ASC staff handles all late-notice procedure changes

**BG-owned ASCs (transfer here after 3PM):**
• JCE Southside — 904-739-0333
• JCE Riverside — 904-387-6006
• SAEC (St. Augustine) — 904-819-3803
• OPEC (Orange Park) — call Orange Park office
• DSC/SHEC (Santa Rosa Beach) — 850-267-2273

• **Before 3PM:** you can reschedule normally through NextGen`,
  },

  // ── RECALL SCHEDULING ──
  {
    id: "recall-scheduling",
    category: "Scheduling",
    title: "Recall Scheduling Process",
    keywords: ["recall", "recall scheduling", "recall call", "outbound", "outreach", "recall patient"],
    answer: `**Recall Scheduling Process:**

1. Verify patient identity (name + DOB)
2. Confirm patient is still with BG (not transferred/left)
3. Check patient age — meets provider minimum age
4. Verify insurance is active and par with provider
5. Confirm reason for recall (procedure type, follow-up type)
6. Check DAP eligibility if colonoscopy recall
7. Verify correct provider (same as last kept visit)
8. Schedule appropriate appointment type (FU, LFU, DAP, etc.)
9. Document the scheduled appointment
10. Set next recall date if applicable

**Reasons to STOP recall / not schedule:**
• Patient deceased
• Patient moved out of area
• Patient on hospice / DNR
• Provider retired
• Insurance no longer participates`,
  },

  // ── PROVIDER SWITCH REASONS ──
  {
    id: "provider-switch-reasons",
    category: "Scheduling",
    title: "Valid Reasons to Switch Providers",
    keywords: ["switch provider", "change provider", "transfer provider", "provider change", "new provider", "different doctor"],
    answer: `**Valid Reasons to Switch Providers:**
• Hospital move (patient now at different hospital system)
• Within 8 days of prior appointment
• Gender preference
• Insurance change (new insurance not par with current provider)
• Language barrier (patient needs provider who speaks their language)
• Last visit more than 3 years ago
• Location preference (closer office)
• PCP request (referring doctor specifies different provider)
• Provider dissatisfaction
• Provider retired

When switching providers, treat patient as **Long Follow-Up (LFU)** unless establishing new.`,
  },

  // ── HOSPITAL EMPLOYEE RULE ──
  {
    id: "hospital-employee-rule",
    category: "Scheduling",
    title: "Hospital Employee Procedure Rule",
    keywords: ["hospital employee", "employee procedure", "hca employee", "bmc employee", "ascension employee", "baptist employee"],
    answer: `**Hospital Employee Procedure Rule:**
• Hospital employees must have procedures scheduled at **their own hospital system**
• BMC (Baptist) employee → BMC facility (Beaches, Clay, Downtown, Nassau, or South)
• HCA employee → HCA Memorial (MMC) or Orange Park Medical Center (OPMC)
• Ascension employee → St. Vincent's Riverside, Southside, or St. Johns

Always ask: "Do you work for a hospital?" if it seems relevant.`,
  },

  // ── AGE 45-49 RULE ──
  {
    id: "age-45-49-rule",
    category: "Scheduling",
    title: "Age 45–49 Screening Colonoscopy Rules",
    keywords: ["45", "49", "screening", "45 to 49", "age rule", "ov required", "45-49", "age 45", "45 year"],
    answer: `**Age 45–49 Screening Colonoscopy:**
• **Volusia county providers:** OV (office visit) required BEFORE procedure for ages 45–49
• **Jax DAP providers:** Ages 45–74 are DAP eligible — 45 is fine for DAP Jax
• Age under 45: always OV first — not DAP eligible
• Age over 74: OV first — not standard DAP

**Minimum ages by selected providers:**
• Min age 14: Costrini (BMC Nassau), Misra (HCA Memorial), Reid (BMC South)
• Min age 15: Changela (BMC Downtown)
• Min age 16: Feagans (Santa Rosa), Madhok (OP), Maniatis (Riverside), Merritt (Nocatee), Roychowdhury (OP)
• Min age 17: Nassar
• Min age 18: All others`,
  },

  // ── DAP FOLLOW-UP ──
  {
    id: "dap-follow-up",
    category: "Scheduling",
    title: "DAP Follow-Up (DAP F/U)",
    keywords: ["dap follow", "dap fu", "dap follow-up", "post procedure follow up", "procedure follow up", "dap f/u"],
    answer: `**DAP Follow-Up (DAP F/U):**
• A post-procedure follow-up that can be scheduled without a prior OV
• Only available if provider has **DAP F/U = YES** in scheduling guide
• Some providers require an extender: "YES w/[Extender Name]"

**Providers with DAP F/U (examples):**
• Barlow, Cabi (w/Paulson), Comar (w/Parker or Barrett), Cooper (w/Taylor)
• Di Teodoro, Etzkorn, Gopal (w/Dixon), Herman (w/Raymer)
• Joseph (w/Parker), Manolakis (w/Johnson), Merritt, Munoz
• Phillips (w/Johnson), Poland (w/Barrett), Reid (w/Kessenich)
• Rostholder (w/Smith), Sanchez, Whittaker (w/Johnson)

⚠️ If provider doesn't have DAP F/U, schedule regular Follow-Up instead`,
  },

  // ── BG ABBREVIATIONS ──
  {
    id: "bg-abbreviations",
    category: "General",
    title: "BG Approved Abbreviations",
    keywords: ["abbreviation", "abbreviations", "abbr", "short form", "acronym", "what does", "stand for", "meaning"],
    answer: `**BG Approved Abbreviations:**
• **DAP** — Direct Access Procedure (procedure without prior OV)
• **HFU** — Hospital Follow-Up
• **FU** — Follow-Up (seen < 1 year ago)
• **LFU** — Long Follow-Up (seen > 1 year ago)
• **OV** — Office Visit
• **NP** — New Patient
• **EP** — Established Patient
• **EGD** — Esophagogastroduodenoscopy (upper endoscopy)
• **ASC** — Ambulatory Surgery Center
• **PSS** — Patient Support Services (us — the call center)
• **PCP** — Primary Care Physician
• **BMC** — Baptist Medical Center
• **HCA** — Hospital Corporation of America
• **STV / ASN** — St. Vincent's / Ascension
• **JCE** — Jacksonville Center for Endoscopy
• **SAEC** — St. Augustine Endoscopy Center
• **OPEC** — Orange Park Endoscopy Center
• **DSC** — Destin Surgery Center
• **SHEC** — Santa Rosa Beach procedure center
• **SCV** — Surgery Center of Volusia
• **MiVu** — Capsule endoscopy device (pill camera)
• **D/C** — Discharge
• **par** — Participating (in-network)
• **non-par** — Non-Participating (out-of-network)
• **AHT** — Average Handle Time
• **HBT** — Hemorrhoid Banding Treatment`,
  },

  // ── SELF PAY ──
  {
    id: "self-pay-rates",
    category: "Scheduling",
    title: "Self-Pay / Uninsured Patients",
    keywords: ["self pay", "self-pay", "uninsured", "no insurance", "cash pay", "self pay rate", "no coverage"],
    answer: `**Self-Pay / Uninsured Patients:**
• Document the self-pay rate quoted in appointment notes
• Check the Self Pay box when scheduling in NextGen
• **Volusia:** No new self-pay patients without approval — patient MUST have a local PCP
• If patient asks about specific rates or payment plans: warm transfer to Financial Counselor
• Self-pay rates vary by procedure — refer to the Self Pay Rates guide in SharePoint`,
  },

  // ── INSURANCE NAMES 2026 ──
  {
    id: "insurance-names-2026",
    category: "Insurance",
    title: "Insurance Plan Names & Networks 2026",
    keywords: ["insurance name", "plan name", "bcbs", "aetna", "uhc", "united", "humana", "medicare", "medicaid", "blue cross", "cigna", "ambetter", "insurance list", "oscar", "molina", "sunshine", "wellcare", "tricare", "fep"],
    answer: `**Common Insurance Plans (2026):**

**Blue Cross Blue Shield (BCBS):**
BCBS of Florida, BCBS Federal (FEP/BlueCard), Florida Blue, Florida Blue Medicare, Blue Options, Blue Select, Blue Care HMO, Healthy Blue Medicaid

**United Healthcare (UHC):**
UnitedHealthcare, UHC Choice Plus, UHC Options PPO, UHC Medicare Advantage
⚠️ HCA facilities use UHC NPI: 730152

**Aetna:** Aetna HMO, Aetna PPO, Aetna Medicare Advantage, Aetna CVS Health

**Humana:** Humana HMO, Humana PPO, Humana Gold Plus, Humana Medicare Advantage

**Cigna / Evernorth:** Cigna HMO, Cigna PPO, Cigna Connect

**Government Programs:**
Medicare Part B, Medicare Advantage, Florida Medicaid, Ambetter (Centene/Sunshine), Molina Healthcare, WellCare, Sunshine Health

**Other:** Tricare (military), VA/Veterans, Oscar Health, Workers Compensation, Marketplace/ACA plans

⚠️ **Volusia office is NON-PAR with Medicaid and Ambetter**
⚠️ Always verify par status BEFORE scheduling`,
  },

  // ── VOICEMAIL WORKFLOW ──
  {
    id: "voicemail-workflow",
    category: "Protocols",
    title: "Voicemail / Talkdesk Callback Workflow",
    keywords: ["voicemail", "callback", "talkdesk", "call back", "voicemail box", "return call", "left message"],
    answer: `**Voicemail / Talkdesk Callback Workflow:**
1. Listen to the full voicemail message
2. Document caller name, phone number, and reason
3. Attempt callback within the callback window
4. If no answer: leave a message → Disposition: **Left Message**
5. If second attempt with no answer → Disposition: **Call Back — No Answer**
6. Document ALL attempts in call log
7. Clinical voicemails route to office — do not attempt to handle clinical issues

**Disposition codes for callbacks:**
• Patient reached and helped → appropriate scheduling disposition
• No answer after leaving message → "Left Message"
• No answer, no message left (subsequent attempt) → "Call Back — No Answer"`,
  },

  // ── RUNNING ELIGIBILITY ──
  {
    id: "running-eligibility",
    category: "Systems",
    title: "Running Eligibility in NextGen",
    keywords: ["eligibility", "run eligibility", "nextgen eligibility", "insurance verification", "verify insurance", "eligibility verification"],
    answer: `**Running Eligibility in NextGen:**
1. **Demographics tab** — verify name and DOB match insurance card
2. **Load Insurance** — collect: policy name, policy number (mandatory), group number, eligibility phone, policyholder relationship, any secondary
3. Right-click on insurance → Select "Eligibility Verification"
4. Choose: payer, any requesting physician, Type of Service: "Health Benefit Plan Coverage" → Submit

**If response is Inactive:**
• Research and correct the information
• Check if insurance is par before scheduling
• Inform patient follow-up may be required

**Cannot run eligibility electronically for some plans** — verify manually
**Patient wants to discuss benefits** → warm transfer to Precert or Financial Counselor`,
  },

  // ── INSURANCE TO APPOINTMENT ──
  {
    id: "insurance-appointment",
    category: "Systems",
    title: "Adding Insurance to Appointments",
    keywords: ["add insurance", "insurance appointment", "attach insurance", "insurance level", "insurance tab"],
    answer: `**Adding Insurance to an Appointment (NextGen):**
1. Open appointment → go to **Insurance/Diagnosis tab**
2. Select patient insurance from listing box (must have green check = Active)
3. Use the arrow button to move insurance over
4. Attach **primary AND secondary** if both provided
5. Self Pay: document quoted rate and check the Self Pay box

**When to attach:**
• ONLY when scheduling or rescheduling office visits or procedures
• When scheduling procedure + required FU: attach insurance to BOTH appointments

**Alerts:**
• "This visit requires authorization" → bypass with "No" or "Close"
• "Medicare should be attached" → bypass with "No" or "Close"
• Green check missing → add check in "Available" or "Active" field
• If still won't attach → notify your Team Lead`,
  },

  // ── DISPOSITION CODES ALL 14 ──
  {
    id: "all-disposition-codes",
    category: "Disposition",
    title: "All Disposition Codes — Complete List",
    keywords: ["disposition", "code", "call type", "appointment confirmation", "general inquiry", "clinical message", "decline to schedule", "all codes"],
    answer: `**All 14 Disposition Codes:**
1. **Appointment Confirmation** — patient confirming/asking about existing appointment
2. **Canceled Appointment** — patient calling to cancel
3. **Appointment Scheduled** — new or established patient scheduled an appointment
4. **Appointment Rescheduled** — patient changing date/time of existing appointment
5. **Sooner Appointment / Waitlist** — patient wants a sooner slot (add to Luma)
6. **Clinical Message** — patient needs to speak to clinical office staff
7. **Urgent Clinical Transfer** — transferred to office based on urgent criteria
8. **Non-Urgent Transfer** — non-clinical: insurance inquiry, demographics
9. **Demographics** — updating name, address, insurance, HIPAA, contact prefs, email
10. **Left Message** — left callback voicemail for patient
11. **Call Back - No Answer** — callback attempt, no response from patient
12. **Other** — any call not listed above (REQUIRES notes explaining the issue)
13. **General Inquiry** — fax/office number, address, directions, provider lookup, no appointment booked; 3rd party checking appointment status
14. **Decline to Schedule** — referral patient declined to schedule an appointment`,
  },

  // ── BALANCE RULES ──
  {
    id: "balance-rules",
    category: "Scheduling",
    title: "Outstanding Balance Rules",
    keywords: ["balance", "outstanding balance", "collections", "debt", "owes money", "unpaid", "1000", "thousand"],
    answer: `**Outstanding Balance Rules:**
• Balance **over $1,000**: Cannot schedule a procedure → warm transfer to **Collections**
• Smaller balances: May still schedule, document in notes
• Patient disputes balance → warm transfer to Financial Services / Billing
• ⚠️ Do NOT discuss specific balance amounts or payment arrangements — always transfer

**Warm transfer to Collections — announce:**
"I have [patient name] on the line. They have an outstanding balance that exceeds our scheduling threshold and need assistance."`,
  },

  // ── PROCEDURE CENTER ROUTING ──
  {
    id: "procedure-center-routing",
    category: "Locations",
    title: "Procedure Center Routing by Hospital Network",
    keywords: ["procedure center", "routing", "asc routing", "which center", "bmc", "stv", "hca", "ascension", "hospital network", "procedure location"],
    answer: `**Procedure Center Routing by Hospital Network:**

**BMC (Baptist Medical Center) — BEAH network:**
BMC Beaches (BMC B) | BMC Clay (BMC C) | BMC Downtown (BMC D) | BMC Nassau (BMC N) | BMC South (BMC S)

**Ascension St. Vincent's — IOI network:**
STV Riverside (STV RS) | STV Southside (STV SS) | STV St. Johns (STV SJ) | STV Clay (STV C)

**HCA — UHC NPI 730152:**
HCA Memorial (MMC) | HCA Orange Park (OPMC)

**BG-Owned ASCs (offer these FIRST):**
JCE SS (Southside) | JCE RS (Riverside) | SAEC (St. Augustine) | OPEC (Orange Park) | DSC/SHEC (Santa Rosa Beach)

**Volusia:**
Surgery Center of Volusia (arrive 1 hour prior — 386-760-8151)
Advent/Florida Hospital Ormond Beach (arrive 2 hours prior)`,
  },

  // ── NO HOSPITAL PROCEDURES ──
  {
    id: "no-hospital-procedures",
    category: "Scheduling",
    title: "Providers — No Hospital Procedures",
    keywords: ["no hospital", "hospital procedure", "corregidor", "etzkorn", "fleisher", "kohm", "sanchez", "hospital request", "no hospital procedure"],
    answer: `**Providers Who Do NOT Perform Hospital Procedures:**
• Dr. Corregidor (Southside)
• Dr. Etzkorn (Southside)
• Dr. Fleisher (BMC Downtown)
• Dr. Kohm (Southside)
• Dr. Sanchez (Southside)

If a patient with one of these providers requests or requires a hospital procedure, they cannot be accommodated — discuss options with the patient and task clinical staff if needed.`,
  },

  // ── HEMORRHOID BANDING ──
  {
    id: "hemorrhoid-banding",
    category: "Scheduling",
    title: "Hemorrhoid Banding (HBT) Providers",
    keywords: ["hemorrhoid", "banding", "hbt", "rubber band", "hemorrhoid banding", "hemorrhoid treatment"],
    answer: `**Providers Who Perform Hemorrhoid Banding (HBT):**
• Dr. Ahmadi (St. Augustine / Palatka)
• Dr. Cortes (St. Augustine)
• Dr. Manolakis (BMC Nassau)
• Dr. Whittaker (BMC Nassau)

**HBT Scheduling rules:**
• HBT: No reschedule without task to clinical staff
• Do NOT reschedule or cancel HBT without notifying clinical team`,
  },

  // ── KEY OFFICE CONTACTS ──
  {
    id: "key-office-contacts",
    category: "Contacts",
    title: "Key Office Phone Numbers & Contacts",
    keywords: ["office number", "office phone", "contact", "call office", "reach office", "fax", "address", "phone number", "office contact"],
    answer: `**Key BG Office Phone Numbers:**
• **BG Main Line:** 904-398-7205
• **Southside Office:** 904-398-7205
• **St. Augustine Office:** 904-819-3800
• **Orange Park Office:** 904-276-5700
• **BMC Nassau / Nassau Crossing:** 904-261-2694
• **BMC Beaches Office:** 904-241-8677
• **Nocatee Office:** 904-280-1199
• **Santa Rosa Beach Office:** 850-267-2273
• **Port Orange / Volusia:** 386-760-1500
• **JCE Riverside ASC:** 904-387-6006
• **JCE Southside ASC:** 904-739-0333
• **SAEC (St. Augustine ASC):** 904-819-3803
• **Surgery Center of Volusia:** 386-760-8151

**DAP Nurse Direct Lines:**
• Sapresa Smith: 904-385-5884
• April Silcox: 904-925-0753
• Jodi Wiggins: 904-342-5877`,
  },

  // ── PATIENT PORTAL / PHREESIA ──
  {
    id: "patient-portal-phreesia",
    category: "Systems",
    title: "Patient Portal & Phreesia",
    keywords: ["patient portal", "phreesia", "portal", "online checkin", "intake", "online forms", "check in"],
    answer: `**Patient Portal & Phreesia:**
• **Phreesia:** Online intake/check-in system — send intake link to new patients via email at time of scheduling
• ⚠️ **CRITICAL:** Do NOT open anything else in Phreesia under any circumstances
• Patient Portal: Patients can view records, send messages, pay bills online
• For portal access questions or technical issues: warm transfer to appropriate department
• Phreesia link goes to patient's email — confirm email address is correct when scheduling`,
  },

  // ── HFU $100 FEE ──
  {
    id: "hfu-non-par-fee",
    category: "Scheduling",
    title: "Hospital Follow-Up Non-Par Insurance Fee",
    keywords: ["hfu fee", "100 dollar", "non-par fee", "hospital follow up fee", "100", "fee hospital"],
    answer: `**Hospital Follow-Up — Non-Par Insurance Fee:**
• A **$100 fee** applies for hospital follow-up appointments when the patient has non-participating (out-of-network) insurance
• Inform the patient of the fee before scheduling
• Document the disclosure in appointment notes`,
  },

  // ── GI SPECIALTY ONLY ──
  {
    id: "gi-specialty-only",
    category: "General",
    title: "What BG Treats — Specialty Scope",
    keywords: ["what do we treat", "specialty", "scope", "what does bg", "gastro only", "allergy", "diabetes", "weight loss", "hepatology"],
    answer: `**BG Treats (Specialty Scope):**
✅ Gastroenterology (GI)
✅ Hepatology (Liver)
✅ GI & Hepatology combined
✅ Diabetes & Endocrinology (limited)
✅ Weight Loss / Bariatric (limited)
✅ Allergy & Asthma (Bartram Park — Dr. Watkins's team only)

⚠️ We do NOT handle: General medicine, cardiology, orthopedics, or other specialties
⚠️ **Dr. Watkins (Allergy):** Never reschedule or cancel — always warm transfer to Allergy department

**Referrals that ALWAYS need OV first (never direct-to-procedure):**
Liver disease, cirrhosis, hepatitis B or C, fatty liver, NASH/MASLD/MASH, autoimmune hepatitis, abnormal LFTs, liver lesion, hepatic fibrosis, PBC`,
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

interface ProviderInfo {
  lastName: string;
  displayName: string;
  office: string;
  procedure: string;
  dapColon: string;
  dapEGD: string;
  dapFU: string;
  minAge: number;
  extender: string;
  languages: string;
  notes: string;
  isAlert?: boolean;
  alertMsg?: string;
}

const PROVIDER_DIRECTORY: ProviderInfo[] = [
  // JAX CORE
  { lastName: "agresti", displayName: "Nicholas Agresti", office: "ASN SV Riverside / Orange Park", procedure: "JCE RS, OPEC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Sheri Hayes-Raulerson", languages: "", notes: "" },
  { lastName: "ahmadi", displayName: "Anis Ahmadi", office: "St. Augustine / Palatka", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "Does Hemorrhoid Banding" },
  { lastName: "barlow", displayName: "William Barlow", office: "St. Augustine / Palatka", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "YES", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "brown", displayName: "Andrew Brown", office: "ASN SV Riverside / Orange Park", procedure: "JCE RS, OPEC, STV RS", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Jori Taylor & Sheri Hayes-Raulerson", languages: "", notes: "" },
  { lastName: "butt", displayName: "Aamir Butt", office: "Orange Park", procedure: "OPEC, OPMC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Garcia", languages: "Hindi, Urdu, Punjabi", notes: "" },
  { lastName: "cabi", displayName: "M. Akin Cabi", office: "ASN SV Riverside", procedure: "JCE RS, STV RS", dapColon: "YES", dapEGD: "NO", dapFU: "YES w/Paulson", minAge: 18, extender: "Shenelle Paulson", languages: "", notes: "" },
  { lastName: "cavacini", displayName: "Cavacini", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "changela", displayName: "Changela", office: "BMC Downtown", procedure: "JCE RS, BMC D", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 15, extender: "Kelli Lamb, PA", languages: "Hindi, Gujarati", notes: "" },
  { lastName: "chau", displayName: "Chau", office: "Southside", procedure: "JCE SS, STV SS", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "Vietnamese", notes: "" },
  { lastName: "chisholm", displayName: "Chisholm", office: "BMC Clay", procedure: "OPEC, STV C, BMC C", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "comar", displayName: "Comar", office: "BMC South", procedure: "JCE SS, BMC S", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Parker or Barrett", minAge: 18, extender: "Parker & Barrett", languages: "Hindi, Punjabi", notes: "" },
  { lastName: "cooper", displayName: "Scott Cooper", office: "Southside / ASN SV Riverside", procedure: "JCE SS, STV RS", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Taylor", minAge: 18, extender: "Jori Taylor", languages: "", notes: "" },
  { lastName: "corregidor", displayName: "Ana Corregidor", office: "Southside", procedure: "JCE SS, STV SS", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "Spanish", notes: "No hospital procedures" },
  { lastName: "cortes", displayName: "Rafael Cortes", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "Spanish, Italian", notes: "Does Hemorrhoid Banding" },
  { lastName: "costrini", displayName: "Costrini", office: "BMC Nassau", procedure: "JCE RS, BMC N", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 14, extender: "None", languages: "", notes: "" },
  { lastName: "desai", displayName: "Desai", office: "Santa Rosa Beach", procedure: "DSC, SHEC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Miles", languages: "", notes: "" },
  { lastName: "di teodoro", displayName: "Linda Di Teodoro", office: "Southside", procedure: "JCE SS, BMC D", dapColon: "YES", dapEGD: "YES", dapFU: "YES", minAge: 18, extender: "Gonzalez", languages: "", notes: "" },
  { lastName: "el hajj", displayName: "Nassim El Hajj", office: "HCA Memorial / Southside", procedure: "JCE SS, MMC", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "French, Arabic", notes: "" },
  { lastName: "etzkorn", displayName: "Kyle Etzkorn", office: "Southside", procedure: "JCE SS", dapColon: "YES", dapEGD: "NO", dapFU: "YES", minAge: 18, extender: "None", languages: "", notes: "No hospital procedures. CMO/Research Director." },
  { lastName: "feagans", displayName: "Feagans", office: "Santa Rosa Beach", procedure: "DSC, SHEC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 16, extender: "Miles", languages: "Spanish", notes: "" },
  { lastName: "fleisher", displayName: "Fleisher", office: "BMC Downtown", procedure: "JCE SS", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "No hospital procedures" },
  { lastName: "foody", displayName: "William Foody", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "gassert", displayName: "Daniel Gassert", office: "St. Augustine / Palatka", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "gopal", displayName: "Vikram Gopal", office: "Southside", procedure: "JCE SS, BMC D", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Dixon", minAge: 18, extender: "Dixon", languages: "", notes: "" },
  { lastName: "gorrepati", displayName: "Gorrepati", office: "Orange Park", procedure: "BMC C, OPMC", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "goyal", displayName: "Goyal", office: "BMC Downtown", procedure: "JCE RS, BMC D", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "gupta", displayName: "Gupta", office: "HCA Memorial", procedure: "JCE SS, MMC", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "harvey", displayName: "Harvey", office: "Santa Rosa Beach", procedure: "DSC, SHEC", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Miles", languages: "", notes: "⚠️ Doctor retiring — do not schedule" },
  { lastName: "herman", displayName: "Herman", office: "BMC Clay", procedure: "OPEC, STV C, BMC C", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Raymer", minAge: 18, extender: "Rachel Raymer", languages: "", notes: "" },
  { lastName: "hoffman", displayName: "Hoffman", office: "Southside", procedure: "N/A", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "WE CARE PATIENTS ONLY — do NOT schedule regular patients", isAlert: true, alertMsg: "WE CARE ONLY — Do not schedule regular patients" },
  { lastName: "hoogerwerf", displayName: "Sandra Hoogerwerf", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "Dutch", notes: "" },
  { lastName: "ibach", displayName: "Ibach", office: "BMC Beaches", procedure: "JCE SS, BMC B", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Roche (No new patients)", languages: "", notes: "" },
  { lastName: "joseph", displayName: "Joseph", office: "BMC South", procedure: "JCE SS, BMC S", dapColon: "YES", dapEGD: "NO", dapFU: "YES w/Parker", minAge: 18, extender: "Parker", languages: "", notes: "" },
  { lastName: "khoury", displayName: "Khoury", office: "BMC Beaches", procedure: "JCE SS, BMC B", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "None", languages: "Lebanese, Arabic, French", notes: "" },
  { lastName: "kimberly", displayName: "Kimberly", office: "Orange Park", procedure: "OPEC, OPMC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "knox", displayName: "Knox", office: "BMC Clay", procedure: "OPEC, BMC C, STV C", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "kohm", displayName: "Kohm", office: "Southside", procedure: "JCE SS", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Dixon", languages: "", notes: "No hospital procedures" },
  { lastName: "lankarani", displayName: "Ali Lankarani", office: "ASN SV Riverside", procedure: "JCE RS, OPEC, STV RS, BMC S", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Jori Taylor & Sheri Hayes-Raulerson", languages: "Farsi", notes: "" },
  { lastName: "madhok", displayName: "Madhok", office: "Orange Park", procedure: "OPEC, OPMC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 16, extender: "None", languages: "Hindi, Punjabi", notes: "" },
  { lastName: "maniatis", displayName: "Maniatis", office: "ASN SV Riverside", procedure: "JCE RS, STV RS", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 16, extender: "None", languages: "", notes: "" },
  { lastName: "manolakis", displayName: "Manolakis", office: "BMC Nassau", procedure: "JCE RS, BMC N", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Johnson", minAge: 18, extender: "Johnson", languages: "", notes: "Does Hemorrhoid Banding. Georgia telehealth eligible." },
  { lastName: "mcgaw", displayName: "Camille McGaw", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "merrell", displayName: "Merrell", office: "Southside", procedure: "N/A", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "WE CARE PATIENTS ONLY", isAlert: true, alertMsg: "WE CARE ONLY — Do not schedule regular patients" },
  { lastName: "merritt", displayName: "Merritt", office: "Nocatee", procedure: "JCE SS, BMC S, STV SJ", dapColon: "YES", dapEGD: "YES", dapFU: "YES", minAge: 16, extender: "None", languages: "Spanish", notes: "" },
  { lastName: "misra", displayName: "Misra", office: "HCA Memorial", procedure: "JCE SS, MMC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 14, extender: "None", languages: "Hindi", notes: "" },
  { lastName: "munoz", displayName: "Munoz", office: "Southside", procedure: "JCE SS, STV SS", dapColon: "YES", dapEGD: "YES", dapFU: "YES", minAge: 18, extender: "None", languages: "Spanish", notes: "" },
  { lastName: "naseemuddin", displayName: "Naseemuddin", office: "BMC Downtown", procedure: "JCE SS, BMC D", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "nassar", displayName: "Nassar", office: "HCA Memorial / Southside", procedure: "JCE SS, MMC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 17, extender: "None", languages: "French, Arabic", notes: "" },
  { lastName: "navas", displayName: "Navas", office: "Nocatee", procedure: "SAEC, STV SJ", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "norkina", displayName: "Norkina", office: "BMC Beaches", procedure: "JCE SS, BMC B", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Roche (No new patients)", languages: "Russian", notes: "" },
  { lastName: "patel a", displayName: "Patel, A.", office: "ASN SV Riverside", procedure: "JCE RS, STV RS", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Jennifer Marzoug", languages: "", notes: "" },
  { lastName: "patel kr", displayName: "Patel, Kr.", office: "Southside / HCA Memorial", procedure: "JCE SS, MMC", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "patel v", displayName: "Patel, V.", office: "BMC Clay", procedure: "OPEC, STV C, BMC C", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "patel y", displayName: "Patel, Y.", office: "Nocatee", procedure: "SAEC, STV SJ", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "phillips", displayName: "Phillips", office: "BMC Nassau", procedure: "JCE RS, BMC N", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Johnson", minAge: 18, extender: "Johnson", languages: "", notes: "Georgia telehealth eligible." },
  { lastName: "pineau", displayName: "Pineau", office: "St. Augustine", procedure: "SAEC, JCE SS, Flagler", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "None", languages: "French", notes: "" },
  { lastName: "poland", displayName: "Poland", office: "BMC South", procedure: "JCE SS, BMC S", dapColon: "YES", dapEGD: "YES", dapFU: "YES w/Barrett", minAge: 18, extender: "Barrett", languages: "", notes: "" },
  { lastName: "racho", displayName: "Ronald Racho", office: "BMC South", procedure: "JCE SS, BMC S", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "rai", displayName: "Rai", office: "Orange Park", procedure: "OPEC, OPMC", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "None", languages: "Hindi", notes: "" },
  { lastName: "rawls", displayName: "Rawls", office: "ASN SV Riverside", procedure: "JCE RS, STV RS", dapColon: "YES", dapEGD: "YES", dapFU: "NO", minAge: 18, extender: "Shenelle Paulson", languages: "", notes: "" },
  { lastName: "reid", displayName: "Marie Reid", office: "BMC South", procedure: "JCE SS, BMC S", dapColon: "YES", dapEGD: "NO", dapFU: "YES w/Kessenich", minAge: 14, extender: "Kessenich", languages: "", notes: "" },
  { lastName: "ross", displayName: "Ross", office: "Southside", procedure: "JCE SS, STV SS", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "rostholder", displayName: "Emily Rostholder", office: "Southside", procedure: "JCE SS, BMC D", dapColon: "YES", dapEGD: "NO", dapFU: "YES w/Smith", minAge: 18, extender: "Smith (Corrie Baker PA-C)", languages: "", notes: "" },
  { lastName: "roychowdhury", displayName: "Roychowdhury", office: "Orange Park", procedure: "OPEC, OPMC", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 16, extender: "Garcia", languages: "Hindi, Bengali", notes: "" },
  { lastName: "sack", displayName: "Sack", office: "Southside", procedure: "N/A", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "WE CARE PATIENTS ONLY", isAlert: true, alertMsg: "WE CARE ONLY — Do not schedule regular patients" },
  { lastName: "sanchez", displayName: "Sanchez", office: "Southside", procedure: "JCE SS", dapColon: "YES", dapEGD: "NO", dapFU: "YES", minAge: 18, extender: "None", languages: "Spanish", notes: "No hospital procedures" },
  { lastName: "soroka", displayName: "Soroka", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "Wildflower charity provider (St. Augustine only)" },
  { lastName: "tek", displayName: "Tek", office: "Southside", procedure: "N/A", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "WE CARE PATIENTS ONLY", isAlert: true, alertMsg: "WE CARE ONLY — Do not schedule regular patients" },
  { lastName: "villanueva", displayName: "Steven Villanueva", office: "St. Augustine", procedure: "SAEC, Flagler", dapColon: "YES", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "westerveld", displayName: "Westerveld", office: "Nocatee", procedure: "SAEC, JCE SS, BMC S, STV SJ", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "None", languages: "", notes: "" },
  { lastName: "whittaker", displayName: "Whittaker", office: "BMC Nassau", procedure: "JCE RS, BMC N", dapColon: "YES", dapEGD: "NO", dapFU: "YES w/Johnson", minAge: 18, extender: "Johnson", languages: "", notes: "Does Hemorrhoid Banding. Georgia telehealth eligible." },
  // VOLUSIA
  { lastName: "agnone", displayName: "Louis Agnone", office: "Port Orange / Ormond Beach (Volusia)", procedure: "Surgery Center of Volusia, Advent Ormond Beach", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Cremata, Porter, Satterfield", languages: "", notes: "No new self-pay without approval. Must have local PCP." },
  { lastName: "deshpande", displayName: "Vrushak Deshpande", office: "Port Orange / Ormond Beach (Volusia)", procedure: "Surgery Center of Volusia, Advent Ormond Beach", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Cremata, Porter, Satterfield", languages: "", notes: "45–49 require OV before procedure" },
  { lastName: "jinjuvadia", displayName: "Jinjuvadia", office: "Port Orange / Ormond Beach (Volusia)", procedure: "Surgery Center of Volusia", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Cremata, Porter, Satterfield", languages: "Hindi, Gujarati", notes: "No new self-pay without approval. OV req 45–49." },
  { lastName: "ricci", displayName: "Ricci", office: "Port Orange / Ormond Beach (Volusia)", procedure: "Surgery Center of Volusia", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Cremata, Porter, Satterfield", languages: "Italian", notes: "No new self-pay without approval. OV req 45–49." },
  { lastName: "sorathia", displayName: "Sorathia", office: "Port Orange / Ormond Beach (Volusia)", procedure: "Surgery Center of Volusia", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 18, extender: "Cremata, Porter, Satterfield", languages: "Hindi, Urdu", notes: "No new self-pay without approval. OV req 45–49." },
  // SPECIAL
  { lastName: "watkins", displayName: "Raquel Watkins", office: "Bartram Park", procedure: "N/A — Allergy only", dapColon: "NO", dapEGD: "NO", dapFU: "NO", minAge: 0, extender: "Allergy team", languages: "", notes: "ALLERGY DEPT ONLY", isAlert: true, alertMsg: "⚠️ NEVER reschedule or cancel — ALWAYS warm transfer to Allergy" },
];

function findProviderAnswer(query: string): string | null {
  const nameTokens = tokenize(query);
  if (nameTokens.length === 0) return null;

  const match = PROVIDER_DIRECTORY.find((p) => {
    const lastParts = p.lastName.split(" ");
    const displayParts = p.displayName.toLowerCase().split(" ");
    return [...lastParts, ...displayParts].some((part) =>
      nameTokens.some((t) => t.length >= 3 && (t.includes(part) || part.includes(t)))
    );
  });

  if (!match) return null;

  const title = match.displayName.includes(",") ? match.displayName : `Dr. ${match.displayName}`;

  let answer = `**${title}**\n`;
  answer += `• Office: ${match.office}\n`;
  answer += `• Procedure Centers: ${match.procedure}\n`;
  answer += `• DAP Colonoscopy: **${match.dapColon}** | DAP EGD: **${match.dapEGD}** | DAP F/U: **${match.dapFU}**\n`;
  answer += `• Min Age: ${match.minAge}\n`;
  answer += `• Extender: ${match.extender || "None"}\n`;
  if (match.languages) answer += `• Languages: ${match.languages}\n`;
  if (match.notes) answer += `• Notes: ${match.notes}\n`;
  if (match.isAlert && match.alertMsg) {
    answer += `\n⚠️ **${match.alertMsg}**`;
  }

  return answer;
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
