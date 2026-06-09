import { Router } from "express";
import { SearchContentQueryParams } from "@workspace/api-zod";

const router = Router();

const CONTENT_INDEX = [
  {
    section: "Patient Types",
    title: "Established Patient",
    content: "A patient who has had at least one gastro-related office visit with a 'Kept' status.",
    tags: ["patient", "established", "kept", "gastro"],
  },
  {
    section: "Patient Types",
    title: "New Patient",
    content: "A patient who has never had a gastro-related office visit with a 'Kept' status.",
    tags: ["patient", "new", "gastro"],
  },
  {
    section: "Appointment Types",
    title: "New Patient Consult",
    content: "Office visit for a patient who has never had a gastro-related kept appointment. Has never seen a BG provider and has no referral, or is being referred for a specific problem.",
    tags: ["appointment", "new patient", "consult", "office visit", "NP"],
  },
  {
    section: "Appointment Types",
    title: "Follow-Up",
    content: "Last kept appointment was LESS than 1 year ago. Standard follow-up visit.",
    tags: ["appointment", "follow up", "FU", "established", "1 year"],
  },
  {
    section: "Appointment Types",
    title: "Long Follow-Up",
    content: "Last kept appointment was MORE than 1 year ago, OR patient is transferring from one BG provider to another. Volusia Exception: Use this if patient was seen in-office between 1 and 3 years ago.",
    tags: ["appointment", "long follow up", "LFU", "established", "1 year", "provider switch"],
  },
  {
    section: "Appointment Types",
    title: "Hospital Follow-Up (HFU)",
    content: "Seen in the hospital (Inpatient or ER) by a BG physician within the last 90 days. Established patients: schedule with their established provider. New patients: schedule with provider listed under Hospital D/C Follow-Up field; if none, follow up through HFU Teams Chat.",
    tags: ["appointment", "HFU", "hospital", "follow up", "discharge", "90 days"],
  },
  {
    section: "Appointment Types",
    title: "DAP (Direct Access Procedure) Colonoscopy",
    content: "Schedule only if: Patient passes screening questions AND medical questionnaire AND meets eligibility (age 45-74, appropriate history, referral complete). Patients younger than 45 or older than 74 require an office visit first.",
    tags: ["appointment", "DAP", "colonoscopy", "procedure", "direct access", "45", "74"],
  },
  {
    section: "Appointment Types",
    title: "Colonoscopy Recall",
    content: "May be scheduled when the patient has a previous colonoscopy history and is due for recall. Status must be Active or Stopped due to no contact. Always verify date under First Mailing in Recalls Tab or check EHR notes.",
    tags: ["appointment", "colonoscopy", "recall", "procedure"],
  },
  {
    section: "Appointment Types",
    title: "EGD Recall",
    content: "Schedule as Recall only if: Established patient only, age 45-74, has previous EGD in system, has recall request from doctor, NOT a Volusia patient. Never schedule initial EGD directly — patient must first complete an office visit.",
    tags: ["appointment", "EGD", "endoscopy", "recall", "established", "45", "74", "Volusia"],
  },
  {
    section: "Scheduling Rules",
    title: "Office Visit Timing",
    content: "Book appointments 2 to 3 days out. Absolutely no same-day or next-day appointments.",
    tags: ["scheduling", "timing", "office visit", "OV", "2-3 days"],
  },
  {
    section: "Scheduling Rules",
    title: "Switching Doctors",
    content: "Established patients cannot switch doctors unless they have an approved reason (e.g., requesting a female physician).",
    tags: ["scheduling", "switching", "doctor", "provider", "established"],
  },
  {
    section: "Scheduling Rules",
    title: "New Patient Location",
    content: "Always schedule for the location specified in the referral. Exception: If the patient requests a different office, you can schedule at an alternate location using patient's zip code to find a convenient location within a 20-mile radius.",
    tags: ["scheduling", "location", "new patient", "referral", "zip code", "20 miles"],
  },
  {
    section: "Scheduling Rules",
    title: "Established Patient Location",
    content: "By default, established patients must stay in their current/existing service area. Exception: You may change their location only if the patient explicitly requests to switch to a different office.",
    tags: ["scheduling", "location", "established", "service area"],
  },
  {
    section: "Scheduling Rules",
    title: "Rescheduling Office Visits",
    content: "More than 1 hour away: Cancel existing appointment, create new one. Less than 1 hour away: Leave existing appointment, schedule new one, and send message to clinical team immediately.",
    tags: ["scheduling", "reschedule", "office visit", "cancel", "1 hour"],
  },
  {
    section: "Scheduling Rules",
    title: "Cancellation < 24 Hours",
    content: "If patient cancels within 24 hours and refuses to reschedule: Cancel appointment and send message to Office Manager (OM) with exact text: 'patient called to cancel, and would not reschedule, <24 hours before appointment.'",
    tags: ["scheduling", "cancellation", "24 hours", "office manager", "OM"],
  },
  {
    section: "Scheduling Rules",
    title: "Procedure Rescheduling",
    content: "Before 3:00 PM: Cancel old appointment, create new one, send message to clinical team with both old and new times. After 3:00 PM (same-day or next-day): Do NOT cancel or reschedule. Warm transfer to appropriate ASC or office backline.",
    tags: ["scheduling", "procedure", "reschedule", "3pm", "ASC", "warm transfer"],
  },
  {
    section: "Scheduling Rules",
    title: "Procedure Follow-Up Rule",
    content: "If the patient had Colonoscopy, Endoscopy, or Colonoscopy/Endoscopy, the next appointment must be scheduled as a Recall. Schedule OV instead if: age restriction, presenting a problem, referral problem, or failed questionnaire.",
    tags: ["scheduling", "procedure", "follow up", "recall", "colonoscopy", "endoscopy"],
  },
  {
    section: "Scheduling Rules",
    title: "Hospital Encounter Check",
    content: "Before booking any Procedure or OV, check for a Hospital Encounter. Must occur before the procedure or OV. Within 90 days: patient is eligible. Over 90 days: expired/invalid, schedule Follow-Up or Long Follow-Up instead.",
    tags: ["scheduling", "hospital", "encounter", "90 days", "eligibility"],
  },
  {
    section: "Location Rules",
    title: "Volusia Region",
    content: "Volusia has 3 practices: Port Orange, Ormond Beach, Deltona — all under Volusia South umbrella. Patients must stay within Volusia entities only. Insurance exception: If insurance not accepted at Volusia, schedule at St. Augustine office. Location change: Can offer St. Augustine as it's the closest.",
    tags: ["location", "Volusia", "Port Orange", "Ormond Beach", "Deltona", "St Augustine"],
  },
  {
    section: "Location Rules",
    title: "Santa Rosa Location",
    content: "Insurance exception: If patient's insurance is not accepted at Santa Rosa, schedule at Jacksonville office instead. Surgery: If insurance not accepted at Santa Rosa for procedures, they go to Destin SC (Destin Surgery Center).",
    tags: ["location", "Santa Rosa", "Jacksonville", "Destin", "surgery center"],
  },
  {
    section: "Location Rules",
    title: "Georgia Patients",
    content: "Schedule Georgia patients at either the Nassau Crossing office or the Amelia Island office (Fernandina). Proximity Tip: See nearest office by mileage on right side of office name/location.",
    tags: ["location", "Georgia", "Nassau Crossing", "Amelia Island", "Fernandina"],
  },
  {
    section: "Location Abbreviations",
    title: "Surgery Centers",
    content: "JCE SS: Jacksonville Center for Endoscopy Southside | JCE RS: Jacksonville Center for Endoscopy Riverside | SAEC: Saint Augustine Endoscopy Center | OPEC: Orange Park Endoscopy Center | DSC: Destin Surgery Center (Santa Rosa Beach) | SCV: Surgery Center of Volusia | DCEC: Durbin Crossing Endo Center | NCEC: Nassau Crossing Endo Center",
    tags: ["location", "abbreviation", "surgery center", "JCE", "SAEC", "OPEC", "DSC", "SCV", "DCEC", "NCEC"],
  },
  {
    section: "Location Abbreviations",
    title: "Hospital Locations",
    content: "BMC C: Baptist Medical Center Clay | BMC N: Baptist Medical Center Nassau (Fernandina) | BMC D: Baptist Medical Center Downtown | BMC S: Baptist Medical Center South | STV RS: Saint Vincent Riverside | STV SS: Saint Vincent Southside | STV SJ: Saint Vincent Saint John | STV C: Saint Vincent Clay | AH DB: Advent Health Daytona Beach (Volusia) | OPMC: Orange Park Medical Center | SHEC: Sacred Heart Emerald Coast | MMC: Memorial Medical Center. Do NOT schedule at hospital except for hospital employees or if there is a note. For hospital employees, send task to clinical team.",
    tags: ["location", "abbreviation", "hospital", "BMC", "STV", "Baptist", "Saint Vincent", "Advent Health"],
  },
  {
    section: "Department Routing",
    title: "Allergy",
    content: "Any calls related to allergy in reference to Dr. Watkins ONLY. Never touch (reschedule/cancel) appointments for Dr. Watkins. Action: Warm Transfer.",
    tags: ["routing", "allergy", "Dr Watkins", "warm transfer"],
  },
  {
    section: "Department Routing",
    title: "Collections / Billing",
    content: "Any calls related to balance, credit, refunds, invoice, payment arrangements, or billing questions. Any patient with a balance over $1,000 cannot have a procedure scheduled — warm transfer to collections. However you CAN reschedule their procedure or office visit. Action: Warm Transfer.",
    tags: ["routing", "collections", "billing", "balance", "refund", "1000", "warm transfer"],
  },
  {
    section: "Department Routing",
    title: "Financial Counselor",
    content: "Calls regarding estimated cost questions for an upcoming scheduled procedure. EMAIL Financial Counselor group and they will reach out. Email: FinancialCounselors@borlandgroover.com. Exception: Copay arrangement for future dated OV, transfer to office. Action: Email / Warm Transfer.",
    tags: ["routing", "financial counselor", "cost", "procedure", "email", "copay"],
  },
  {
    section: "Department Routing",
    title: "HIS (Medical Records)",
    content: "Any calls related to obtaining or requesting patients' medical records. Action: Warm Transfer.",
    tags: ["routing", "HIS", "medical records", "warm transfer"],
  },
  {
    section: "Department Routing",
    title: "Hospital Desk",
    content: "Any patient calling requesting a consult. Action: Warm Transfer.",
    tags: ["routing", "hospital desk", "consult", "warm transfer"],
  },
  {
    section: "Department Routing",
    title: "Imaging",
    content: "Calls related to imaging tests or scheduling. Blind Transfer for: CT, MRI, Ultrasound, Gastric Emptying Study, Barium Swallow, Barium Esophagram, Dexa, HIDA, Sitz Marker, Small Bowel Follow Through, Barium Enema. Volusia South and Santa Rosa patients: send message to clinical team (SLA 48hrs). Paracentesis, EUS, Fibroscans: Send message to clinical team (SLA 24hrs, Volusia South/Santa Rosa 48hrs).",
    tags: ["routing", "imaging", "CT", "MRI", "ultrasound", "blind transfer", "Volusia", "clinical team"],
  },
  {
    section: "Department Routing",
    title: "Infusion",
    content: "All calls related to infusion/Remicade or scheduling an infusion. Transfer to appropriate office location (Infusion Department). Exception: B12/Iron Infusion — send message to clinical team (SLA 24hrs, Volusia South/Santa Rosa 48hrs). Action: Warm Transfer.",
    tags: ["routing", "infusion", "Remicade", "B12", "iron", "warm transfer", "clinical team"],
  },
  {
    section: "Department Routing",
    title: "Pre-Cert / Insurance",
    content: "Any calls to verify authorization, prior authorization, or insurance verification. If patient requesting copay amount, call pre-cert for that amount. Action: Warm Transfer.",
    tags: ["routing", "pre-cert", "insurance", "authorization", "prior auth", "copay", "warm transfer"],
  },
  {
    section: "Department Routing",
    title: "Clinical Messaging",
    content: "Send clinical message for: Lab/Test/Imaging results, Medication Authorization, Paracentesis Request, EUS/Fibroscan Scheduling & Questions. SLA: Clinical Team 24hrs. Volusia South and Santa Rosa: 48hrs.",
    tags: ["routing", "clinical message", "lab results", "medication", "paracentesis", "EUS", "fibroscan", "24hr", "48hr"],
  },
  {
    section: "Department Routing",
    title: "Human Resources",
    content: "Calls indicating employee verification or requesting career information. Action: Email / Blind Transfer.",
    tags: ["routing", "HR", "human resources", "employee", "career", "blind transfer"],
  },
  {
    section: "Insurance",
    title: "Insurance Topics We Do NOT Discuss",
    content: "We do not discuss: Benefits, Coverage, Copays, Deductibles, Coinsurance, Payment arrangements. Warm transfer to Insurance Team or provide their contact info. Insurance Chat (Pre-Cert Team) is for office-visit-related insurance questions only.",
    tags: ["insurance", "do not discuss", "benefits", "coverage", "copay", "deductible", "coinsurance", "warm transfer"],
  },
  {
    section: "Insurance",
    title: "Insurance Information to Collect",
    content: "Collect: Member ID / Policy Number, Group Number (if applicable), Payor ID (if applicable), Provider Contact Number (back of insurance card). Medicare: May also collect Medicare Number. Always ask HMO or PPO. BCBS: type 'BCBS' in search. Dual Medicare: Enter as 'Medicare complete'.",
    tags: ["insurance", "collect", "member ID", "policy number", "group number", "HMO", "PPO", "BCBS", "Medicare"],
  },
  {
    section: "Insurance",
    title: "TRICARE Protocol",
    content: "When a patient has TRICARE insurance, enter: Insurance Program: TRICARE. Pharmacy Category: DOD (Department of Defense).",
    tags: ["insurance", "TRICARE", "military", "DOD"],
  },
  {
    section: "Insurance",
    title: "Secondary Insurance",
    content: "Never load secondary insurance by yourself. If a patient states their insurance is not active until a future date, they must be processed as Self Pay.",
    tags: ["insurance", "secondary", "self pay", "future date"],
  },
  {
    section: "Insurance",
    title: "Missing Policy Number",
    content: "If patient cannot provide policy number: Process account as Self Pay, add patient's SSN instead, enter self-pay amount in Miscellaneous Notes field.",
    tags: ["insurance", "policy number", "self pay", "SSN"],
  },
  {
    section: "Waitlist",
    title: "Waitlist Rules",
    content: "Eligible: Office visits only. NOT eligible: Procedures (including colonoscopies and endoscopies). Requirement: Patient must already have an office visit scheduled before being added to the waitlist.",
    tags: ["waitlist", "sooner appointment", "office visit", "procedure", "eligibility"],
  },
  {
    section: "Medical Questionnaire",
    title: "Medical Questionnaire",
    content: "Required for: Procedures. NOT required for: Office visits. Responses must be clear Yes or No answers.",
    tags: ["questionnaire", "medical", "procedure", "required"],
  },
  {
    section: "Call Scripts",
    title: "Opening Script",
    content: "Thank you for calling Borland Groover, my name is [your name], how can I help you today?",
    tags: ["script", "opening", "greeting", "call"],
  },
  {
    section: "Call Scripts",
    title: "Closing Script",
    content: "Thank you for calling Borland Groover, have a great day.",
    tags: ["script", "closing", "goodbye", "call"],
  },
  {
    section: "Call Scripts",
    title: "Callback Request",
    content: "Hi, this is [your name] following up on your callback request. How can I help you?",
    tags: ["script", "callback", "follow up", "call"],
  },
  {
    section: "Call Scripts",
    title: "Answering Machine",
    content: "Hello, this is [your name] calling regarding your callback request. Please call Borland Groover back at 904-398-7205. Thank you. (Option 1)",
    tags: ["script", "voicemail", "answering machine", "callback", "904-398-7205"],
  },
  {
    section: "Call Scripts",
    title: "No Answer",
    content: "Caller if you can hear me, I can't hear you, please give Borland a call back at 904-398-7205, releasing line due to no response.",
    tags: ["script", "no answer", "callback", "releasing line"],
  },
  {
    section: "Call Procedures",
    title: "Warm Transfer (3-Way Call)",
    content: "1. Select Consult. 2. Select Favorites, find desired department (DO NOT select Queues or Contacts). 3. Provide: your name, patient name and DOB, reason for call. 4. Connect call once receiving agent confirms ready. 5. Add consultation to MERGE the call (DO NOT select Transfer). 6. Introduce patient to agent. 7. Select Transfer to end your call. NOTE: Do NOT use for interpreter services.",
    tags: ["transfer", "warm transfer", "3-way call", "consult", "merge"],
  },
  {
    section: "Call Procedures",
    title: "Blind Transfer",
    content: "Inform patient of the pending transfer and offer further assistance before proceeding. 1. Select Blind Transfer. 2. Select Favorites and choose the appropriate department.",
    tags: ["transfer", "blind transfer", "department"],
  },
  {
    section: "Call Procedures",
    title: "Interpreter / Translation Services",
    content: "Do NOT use 3-Way Call/Warm Transfer for interpreter services. 1. Select Add a Guest. 2. Select Favorites. 3. Type in Translation Services. 4. Select the language needed. 5. Provide translator with code: 'Patient Support Services'. Begin call.",
    tags: ["interpreter", "translation", "language", "add a guest"],
  },
  {
    section: "Demographics",
    title: "New Patient Required Info",
    content: "Required: Gender (Assigned Birth Sex), SSN, address, phone number, email, notifications, language, PCP, pharmacy. Insurance: HMO/PPO, policy number, group number, customer service number. Gender Exception: If they refuse current gender, enter 'asked but declined'. SSN Exception: If uncomfortable, enter 777-77-7777 (required for billing/insurance reasons).",
    tags: ["demographics", "new patient", "SSN", "gender", "required info", "NP"],
  },
  {
    section: "Demographics",
    title: "Established Patient Required Info",
    content: "Required: Full demographics (address, phone number, email, notifications, language), PCP, pharmacy. Insurance: HMO/PPO, policy number, group number, customer service number.",
    tags: ["demographics", "established patient", "required info", "EST"],
  },
  {
    section: "Demographics",
    title: "Verification by Call Type",
    content: "Reschedule/Cancel: Verify phone and email. Clinical Msg: Verify phone and email. Medication Renewal/Preps: Verify phone, email, insurance, and pharmacy. Appointment Confirmation: Verify phone and email. General Inquiry: Verify phone and email.",
    tags: ["demographics", "verification", "reschedule", "cancel", "clinical", "medication", "confirmation"],
  },
  {
    section: "Demographics",
    title: "Phone Number Entry",
    content: "Cellphone: Enter in both Home and Cell sections. Home Phone Only: Enter in Home section only. Emails: Always ask for email. If none provided, check the N/A box.",
    tags: ["demographics", "phone", "cell", "home", "email"],
  },
  {
    section: "Demographics",
    title: "Patient Chart Lookup",
    content: "Required: First Name (3 Letters minimum), Last Name (3 Letters minimum), Date of Birth. Verify demographics when sending clinical team message — ONLY as last resort and with permission from Lead.",
    tags: ["demographics", "chart lookup", "first name", "last name", "DOB"],
  },
  {
    section: "HIPAA",
    title: "HIPAA & Third-Party Caller Protocol",
    content: "Name on HIPAA: Proceed normally. Name NOT on HIPAA: Do not disclose any clinical or financial details. Request direct authorization from patient first. Commercial/Company Exception: Can schedule or cancel appointment — but NEVER disclose clinical information.",
    tags: ["HIPAA", "third party", "clinical", "financial", "authorization"],
  },
  {
    section: "HIPAA",
    title: "Policy Holder & Mini-Chart Protocol",
    content: "If caller is NOT the primary policy holder: Search first for the primary policy holder in system. If not in system, create a mini-chart for the primary policy holder by filling out only the red mandatory fields.",
    tags: ["HIPAA", "policy holder", "mini-chart", "mandatory fields"],
  },
  {
    section: "Disposition Codes",
    title: "Appointment Confirmation",
    content: "Patient called to confirm or find out about an already scheduled appointment.",
    tags: ["disposition", "code", "appointment confirmation"],
  },
  {
    section: "Disposition Codes",
    title: "Canceled Appointment",
    content: "Patient called to cancel their appointment or procedure.",
    tags: ["disposition", "code", "canceled", "cancellation"],
  },
  {
    section: "Disposition Codes",
    title: "Appointment Scheduled",
    content: "New or Established patient scheduled an appointment.",
    tags: ["disposition", "code", "scheduled", "new", "established"],
  },
  {
    section: "Disposition Codes",
    title: "Appointment Rescheduled",
    content: "Patient called to change date or time of previously scheduled appointment.",
    tags: ["disposition", "code", "rescheduled"],
  },
  {
    section: "Disposition Codes",
    title: "Sooner Appointment / Waitlist",
    content: "Patient called to request being placed on the waitlist for a sooner appointment.",
    tags: ["disposition", "code", "waitlist", "sooner"],
  },
  {
    section: "Disposition Codes",
    title: "Clinical Message",
    content: "Patient called to speak to someone in the office.",
    tags: ["disposition", "code", "clinical message", "office"],
  },
  {
    section: "Disposition Codes",
    title: "Urgent Clinical Transfer",
    content: "Patient transferred to Office based on Urgent List.",
    tags: ["disposition", "code", "urgent", "clinical", "transfer"],
  },
  {
    section: "Disposition Codes",
    title: "Non Urgent Transfer",
    content: "Patient requires non-clinical intervention from practice or other outside department, insurance inquiry. (When transferring to any department other than office or clinical.)",
    tags: ["disposition", "code", "non urgent", "transfer", "insurance"],
  },
  {
    section: "Disposition Codes",
    title: "Demographics",
    content: "Patient called to update any item in their demographics (name, address, insurance, HIPAA, Contact preferences, email or phone number).",
    tags: ["disposition", "code", "demographics", "update"],
  },
  {
    section: "Disposition Codes",
    title: "Left Message",
    content: "Left message for patient to call back from a call back request.",
    tags: ["disposition", "code", "left message", "voicemail"],
  },
  {
    section: "Disposition Codes",
    title: "Call Back - No Answer",
    content: "Call Back request with no response or answer from patient.",
    tags: ["disposition", "code", "no answer", "callback"],
  },
  {
    section: "Disposition Codes",
    title: "Other",
    content: "Any call not listed above; requires notes to describe the issue the patient called about.",
    tags: ["disposition", "code", "other", "notes"],
  },
  {
    section: "Disposition Codes",
    title: "General Inquiry",
    content: "Patient called for fax or office number, address, directions, provider look up with no appointment booked, or 3rd party called inquiring about patient appointment status.",
    tags: ["disposition", "code", "general inquiry", "fax", "address", "directions"],
  },
  {
    section: "Disposition Codes",
    title: "Decline to Schedule",
    content: "Referral patient declined to schedule an appointment.",
    tags: ["disposition", "code", "decline", "schedule", "referral"],
  },
  {
    section: "Tools",
    title: "Main Tools",
    content: "Talkdesk (phone system), Teams (internal communication), Outlook (email), SharePoint (Cheat Sheet — always check before scheduling), Phreesia (patient pre-registration and forms).",
    tags: ["tools", "Talkdesk", "Teams", "Outlook", "SharePoint", "Phreesia"],
  },
  {
    section: "Tools",
    title: "Phreesia",
    content: "Used to send patients: Pre-registration links, Appointment documents/forms. EHR: Click blue planet button. Chart: 4th tab from left > Patient Chart. To create or view appointment: Go to Task > App Search. CRUCIAL RULE: Do not open anything else under any circumstances.",
    tags: ["tools", "Phreesia", "EHR", "chart", "task", "appointment search"],
  },
  {
    section: "Tools",
    title: "Nextgen PM Primary Uses",
    content: "Schedule Office Visits and Procedures, Confirm Appointments, Update Demographics, Check for Hospital Encounters / Recalls, Bad Debt, Verification of HIPAA.",
    tags: ["tools", "Nextgen", "PM", "schedule", "demographics", "HIPAA"],
  },
  {
    section: "Tools",
    title: "Nextgen EHR Primary Uses",
    content: "Medication Renewals, Telephone Communications, Referrals, Medical Questionnaire, Patient Correspondence, Create New Patient Encounters, Imaging/Lab Orders, Verification of HIPAA.",
    tags: ["tools", "Nextgen", "EHR", "medication", "referrals", "questionnaire", "imaging"],
  },
  {
    section: "Tools",
    title: "How to Book an Appointment",
    content: "1. Go to PM. 2. Click on the Tasks tab (third tab from the top). 3. Click on Appt Book.",
    tags: ["tools", "how to", "book", "appointment", "PM", "tasks"],
  },
  {
    section: "Tools",
    title: "How to Schedule an Appointment",
    content: "1. Navigate: Click Task > Appt Search. 2. Enter Event Type based on patient history. 3. Select Service Location & Provider. For NP: Start with referral location; use All Providers if patient doesn't care and office accepts insurance. For EST: Book with established doctor or extender. 4. Finalize Details: correct day and time, enter symptoms in Details box (Exception: only enter event type for HFU).",
    tags: ["tools", "how to", "schedule", "appointment", "event type", "service location", "extender"],
  },
  {
    section: "Referral Guidelines",
    title: "Referral Conditions Requiring Office Visit",
    content: "Always schedule an OV for referrals involving: Liver Disease, Liver Transplant, Cirrhosis, Alcoholic Cirrhosis, Hepatitis B or C, Autoimmune Hepatitis, Fatty Liver, Liver Lesion, Abnormal/Elevated LFTs, Drug-Induced Liver Disease, NASH, MASLD, MASH, Hepatic Fibrosis, Hepatic Steatosis, Sarcoidosis, Primary Biliary Cholangitis (PBC).",
    tags: ["referral", "liver", "hepatitis", "cirrhosis", "NASH", "MASLD", "office visit"],
  },
  {
    section: "KPI Goals",
    title: "KPI Goals",
    content: "Calls Per Day: 60+. Adherence: 90%. AHT (Average Handle Time): 6 Minutes. Quality: 90%. High Volume Days: Monday and Tuesday are typically busiest. AI calls occur on Mondays.",
    tags: ["KPI", "goals", "calls per day", "adherence", "AHT", "quality", "Monday"],
  },
  {
    section: "Quick Reference",
    title: "Situation Action Quick Reference",
    content: "New patient + HFU + provider listed → Schedule with listed provider. New patient + HFU + no provider → Contact Hospital Follow-Up Team. Established patient + HFU → Schedule with established provider. Insurance questions → Transfer to Insurance Team. Initial colonoscopy → Only schedule DAP if eligible. Initial endoscopy → Schedule office visit first. Waitlist request → Office visits only; patient must already have appointment.",
    tags: ["quick reference", "HFU", "insurance", "colonoscopy", "endoscopy", "waitlist"],
  },
  {
    section: "Medical Titles",
    title: "Medical Titles & Abbreviations",
    content: "MD: Medical Doctor (Doctor). DO: Doctor of Osteopathic Medicine (Doctor). APRN: Advanced Practice Registered Nurse (Nurse Practitioner/Specialist). PA: Physician Assistant (Doctor Assistant).",
    tags: ["abbreviation", "title", "MD", "DO", "APRN", "PA", "doctor", "nurse"],
  },
  {
    section: "Event Types",
    title: "Telemedicine Visits",
    content: "Not all providers offer Telemed — always verify. Telemedicine New Patient: Virtual appointment for brand new patient. Telemedicine Follow Up: Virtual appointment for patient seen within 1 year. Long Follow Up Telemedicine: Virtual for patient seen over 1 year ago. Telemedicine Hospital Follow Up: Virtual for patient seen in hospital by BG physician within 1 year.",
    tags: ["event type", "telemedicine", "virtual", "telemed", "new patient", "follow up"],
  },
  {
    section: "Event Types",
    title: "Specialty Programs",
    content: "Liver Center Interoffice: Patient referred to or requesting second opinion with liver physician — remind to bring all medical records. WeCare New Patient: New to BG with active WeCare Referral (charity providing specialty care to Jacksonville residents). WeCare Follow Up: Established WeCare patient seen within 1 year. WeCare Long Follow Up: Established WeCare patient seen over 1 year ago or transferring providers.",
    tags: ["event type", "specialty", "liver center", "WeCare", "charity", "Jacksonville"],
  },
  {
    section: "Event Types",
    title: "DAP Follow Up",
    content: "Used only when a patient schedules an office visit after a Direct Access Procedure (DAP) or a Recall procedure.",
    tags: ["event type", "DAP follow up", "direct access", "recall"],
  },
  {
    section: "Event Types",
    title: "Interoffice Consult",
    content: "An established BG provider requests a second opinion from a different BG provider. Note: We usually reschedule these appointments.",
    tags: ["event type", "interoffice consult", "second opinion", "BG provider"],
  },
  {
    section: "Additional Info",
    title: "Cologuard",
    content: "Stool-based colorectal cancer screening test.",
    tags: ["Cologuard", "colorectal", "cancer screening", "stool test"],
  },
  {
    section: "Additional Info",
    title: "Contact Number",
    content: "BG Main Number: 904-398-7205",
    tags: ["contact", "phone", "number", "BG", "904-398-7205"],
  },
];

router.get("/search", (req, res) => {
  const parseResult = SearchContentQueryParams.safeParse({ q: req.query.q });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid query parameter" });
    return;
  }

  const { q } = parseResult.data;
  const query = q.toLowerCase().trim();
  const words = query.split(/\s+/);

  const scored = CONTENT_INDEX.map((item) => {
    const searchable = `${item.section} ${item.title} ${item.content} ${item.tags.join(" ")}`.toLowerCase();
    const score = words.reduce((acc, word) => {
      if (item.title.toLowerCase().includes(word)) return acc + 3;
      if (item.tags.some((t) => t.includes(word))) return acc + 2;
      if (searchable.includes(word)) return acc + 1;
      return acc;
    }, 0);
    return { item, score };
  });

  const results = scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((r) => r.item);

  res.json(results);
});

export default router;
