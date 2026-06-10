import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  content: string | string[];
  type?: "rule" | "warning" | "danger" | "step";
}

interface Section {
  id: string;
  title: string;
  items: Item[];
}

function RuleCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const isLong = Array.isArray(item.content) || (typeof item.content === "string" && item.content.length > 120);
  const t = item.type ?? "rule";

  const iconMap = {
    rule: <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
    danger: <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
    step: <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />,
  };
  const borderMap = {
    rule: "border-l-primary",
    warning: "border-l-amber-400",
    danger: "border-l-red-400",
    step: "border-l-teal-400",
  };

  return (
    <div className={cn("border border-border rounded-lg border-l-4 bg-card", borderMap[t])}>
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => isLong && setOpen(!open)}
      >
        {iconMap[t]}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{item.title}</p>
          {(!isLong || open) && (
            <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {Array.isArray(item.content) ? (
                <ul className="space-y-1">
                  {item.content.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{item.content}</p>
              )}
            </div>
          )}
          {isLong && !open && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {Array.isArray(item.content) ? item.content[0] + "…" : item.content.substring(0, 90) + "…"}
            </p>
          )}
        </div>
        {isLong && (
          <span className="text-muted-foreground shrink-0 mt-0.5">
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
      </button>
    </div>
  );
}

const sections: Section[] = [
  {
    id: "patient-types",
    title: "Patient Types",
    items: [
      { title: "Established Patient", content: "A patient who has had at least one gastro-related office visit with a 'Kept' status.", type: "rule" },
      { title: "New Patient", content: "A patient who has never had a gastro-related office visit with a 'Kept' status.", type: "rule" },
      {
        title: "Follow-Up vs Long Follow-Up — How to Determine",
        content: [
          "Step 1: Look at the patient's appointment history. Only count 'Kept' appointments (attended). Ignore cancelled or no-show.",
          "Follow-Up: Last kept appointment was LESS than 1 year ago.",
          "Long Follow-Up: Last kept appointment was MORE than 1 year ago OR approved provider switch.",
          "Volusia Exception: Use Long Follow-Up if patient was seen in-office between 1 and 3 years ago.",
          "Always verify the doctor: Identify and use the provider listed on the most recent 'Kept' encounter.",
        ],
        type: "step",
      },
    ],
  },
  {
    id: "ov-event-types",
    title: "Office Visit Event Types",
    items: [
      { title: "Note — Always Required", content: "Always indicate symptoms or the reason for the visit in the Details field for ALL office visits. Exception: Only enter the event type in Details when scheduling a Hospital Follow-Up (HFU).", type: "warning" },
      { title: "New Patient", content: "Has never seen a BG provider and has no referral. Includes patients referred only for a 'Screening Colonoscopy' if an office visit is required first.", type: "rule" },
      { title: "New Patient Consult", content: "Has never seen a BG GI physician and is being referred for a specific problem. Always indicate symptoms or reason for visit.", type: "rule" },
      { title: "Follow-Up", content: "Last seen within 1 year. Always indicate symptoms or reason for visit.", type: "rule" },
      { title: "Long Follow-Up", content: "Last seen over 1 year ago OR transferring from one BG provider to another. Volusia Exception: Use if patient was seen in-office between 1 and 3 years ago.", type: "rule" },
      { title: "Hospital Follow-Up (HFU)", content: "Seen in hospital (Inpatient or ER) by a BG physician within the last 90 days. Exception: Only enter the event type in the Details box — do NOT enter symptoms.", type: "rule" },
      { title: "DAP Follow-Up", content: "Used ONLY when a patient schedules an office visit after a Direct Access Procedure (DAP) or a Recall procedure.", type: "rule" },
      { title: "Liver/Specialty", content: "Can be used for liver referrals/issues. Patient must bring all medical records. Check the cheat sheet for provider-specific duration preferences.", type: "rule" },
      { title: "Interoffice Consult", content: "An established BG provider requests a second opinion from a different BG provider. Note: We usually reschedule these appointments.", type: "rule" },
      { title: "Liver Center Interoffice", content: "Patient is referred to, or requesting a second opinion with, a liver physician. Remind the patient to bring all necessary medical records for review.", type: "rule" },
    ],
  },
  {
    id: "telemedicine",
    title: "Telemedicine Visits",
    items: [
      { title: "Verification Required", content: "Not all providers offer Telemed. Always verify provider participation before booking a telehealth visit.", type: "warning" },
      { title: "Telemedicine New Patient", content: "Virtual appointment for a brand new patient.", type: "rule" },
      { title: "Telemedicine Follow-Up", content: "Virtual appointment for a patient seen within 1 year.", type: "rule" },
      { title: "Long Follow-Up Telemedicine", content: "Virtual appointment for a patient seen over 1 year ago.", type: "rule" },
      { title: "Telemedicine Hospital Follow-Up", content: "Virtual appointment for a patient seen in the hospital (Inpatient or ER) by a BG physician within 1 year.", type: "rule" },
    ],
  },
  {
    id: "wecare",
    title: "WeCare & Charity Programs",
    items: [
      { title: "WeCare New Patient", content: "New to BG and has an active WeCare Referral. WeCare Charity is a separate organization providing specialty care support to qualified Jacksonville residents.", type: "rule" },
      { title: "WeCare Follow-Up", content: "An established WeCare patient seen within 1 year. Must have WeCare Charity attached to their chart.", type: "rule" },
      { title: "WeCare Long Follow-Up", content: "An established WeCare patient seen over 1 year ago OR transferring from one BG provider to another. Must have WeCare Charity on chart.", type: "rule" },
    ],
  },
  {
    id: "procedures",
    title: "Procedure Event Types",
    items: [
      { title: "Recall Status Rule", content: "For ALL Recalls, the status must be 'Active' or 'Stopped' due to no contact. Always verify the date under 'First Mailing' in the Recalls Tab or check EHR notes.", type: "warning" },
      { title: "Colonoscopy Direct Access (DAP)", content: "Colonoscopy ONLY. For new patients only who meet specific DAP requirements (age 45–74, pass screening + questionnaire, referral complete).", type: "rule" },
      { title: "Colonoscopy Recall", content: "Colonoscopy ONLY. Requires an applicable recall on file. Status must be Active or Stopped due to no contact.", type: "rule" },
      { title: "EGD Recall", content: "Endoscopy ONLY. Requires an applicable recall on file. Patient must be established, age 45–74, have previous EGD in system, have doctor's recall request, and NOT be a Volusia patient.", type: "rule" },
      { title: "EGD/Colonoscopy Recall (Combined)", content: "Combined Endoscopy and Colonoscopy. Requires an Office Visit (OV) AND both recalls on file.", type: "warning" },
    ],
  },
  {
    id: "dap-rules",
    title: "DAP Colonoscopy Rules",
    items: [
      {
        title: "DAP Eligibility — ALL must be met",
        content: [
          "Age 45–74 ONLY. Under 45 or over 74 → office visit first.",
          "Patient passes screening questions.",
          "Patient passes the medical questionnaire.",
          "Referral is complete and ready.",
          "Appropriate history required.",
        ],
        type: "warning",
      },
      { title: "Standard Colonoscopy — DO NOT Schedule Directly", content: ["We do NOT schedule initial standard colonoscopies.", "Step 1: Schedule an office visit.", "Step 2: Provider determines if colonoscopy is needed.", "Step 3: The office schedules the procedure."], type: "danger" },
    ],
  },
  {
    id: "egd-rules",
    title: "EGD / Upper Endoscopy Rules",
    items: [
      { title: "Initial EGD — NEVER Schedule Directly", content: "Patient must first complete an office visit. No exceptions. This includes Upper Endoscopy and PAN.", type: "danger" },
      {
        title: "EGD Recall Requirements — ALL must be met",
        content: [
          "Established Patient ONLY (no new patients).",
          "Age 45–74 ONLY.",
          "Must have a previous EGD in our system.",
          "Must have a recall request from the doctor.",
          "NOT a Volusia patient (special rules apply for Volusia).",
        ],
        type: "warning",
      },
    ],
  },
  {
    id: "procedure-followup",
    title: "Procedure Follow-Up Rule",
    items: [
      { title: "After Procedure → Next Must Be Recall", content: "If patient had Colonoscopy, Endoscopy, or Colonoscopy/Endoscopy — the next appointment type must be scheduled as a Recall.", type: "rule" },
      {
        title: "Exceptions — Schedule OV Instead",
        content: [
          "Age Restriction: Patient is not eligible due to age limits.",
          "Presenting a Problem: Patient currently has active symptoms or medical issues.",
          "Referral Problem: Patient has a specific problem outlined in their referral.",
          "Failed Questionnaire: Patient did not pass the screening questionnaire.",
        ],
        type: "warning",
      },
    ],
  },
  {
    id: "hfu-rules",
    title: "Hospital Follow-Up (HFU) Rules",
    items: [
      { title: "Hospital Encounter Check — Pre-Scheduling", content: "Before booking any Procedure or OV, check for a Hospital Encounter. This encounter must be scheduled to occur BEFORE the procedure or OV.", type: "warning" },
      { title: "90-Day Validity", content: "Within 90 days = eligible to be scheduled. Over 90 days = encounter is expired/invalid → schedule Follow-Up or Long Follow-Up instead. Patient discharged within 90 days → likely due for HFU.", type: "warning" },
      { title: "HFU — Established Patients", content: "Always schedule with their established provider.", type: "rule" },
      { title: "HFU — New Patient, Provider Listed", content: "If a provider is listed under the Hospital D/C Follow-Up field, schedule with that provider.", type: "rule" },
      { title: "HFU — New Patient, No Provider", content: "If no encounter is available or no provider listed, follow up through the HFU Teams Chat.", type: "warning" },
    ],
  },
  {
    id: "scheduling-guardrails",
    title: "Scheduling Rules & Guardrails",
    items: [
      { title: "OV Timing Rule", content: "Book appointments 2 to 3 days out. Absolutely NO same-day or next-day appointments.", type: "danger" },
      { title: "Switching Doctors", content: "Established patients cannot switch doctors unless they have an approved reason (e.g., requesting a female physician).", type: "warning" },
      { title: "Extenders", content: "If a doctor has an extender, it will be listed in bold text. You can schedule established patients with either the doctor or the extender.", type: "rule" },
      { title: "Volusia Extender Exception", content: "Volusia is the ONLY practice where a patient can see all 4 Volusia extenders, though they still cannot see all providers.", type: "rule" },
      { title: "No-Shows & Cancellations", content: "You can only reschedule an OV in 'Expected' status. If the appointment is a No-Show or Cancelled, you must create a brand-new appointment — you cannot reschedule it.", type: "danger" },
      { title: "Double-Booking Warning", content: "If you receive a double-booking warning message, do NOT double-book the appointment.", type: "danger" },
      { title: "New Patient Who Hasn't Seen Assigned Doctor Yet", content: "If a New Patient hasn't seen their assigned doctor yet, they can switch to any doctor. If they want to keep the same doctor, keep them.", type: "rule" },
      { title: "Female Provider Request", content: "If a patient requests a female physician, narrow the search results to female doctors and female extenders.", type: "rule" },
    ],
  },
  {
    id: "reschedule-ov",
    title: "Rescheduling Office Visits",
    items: [
      {
        title: "Step-by-Step OV Reschedule Process",
        content: [
          "1. Verify Patient Identity: Ensure correct patient chart. Verify phone number and email.",
          "2. Check Appointment Status: Verify the OV is in 'Expected' status.",
          "3. Open Both Windows: Double-click original appt to open Edit Appointment. Also open Task → Appointment Search.",
          "4. Align Windows: Ensure Insurance is attached. Verify Event Type matches exactly on both windows. Verify Service Location matches exactly.",
          "5. Search for Availability: Ask patient when they want to reschedule. Input desired date, click Find. Do NOT add zip code for reschedules.",
          "6. Input Details: Review available appointments in search window. DO NOT double-click them. Manually input date, time, and provider into the Edit Appointment window.",
          "7. Adjust Resources/Rendering if switching between doctor and extender.",
          "8. Recap and Confirm: Review all new details with the patient.",
        ],
        type: "step",
      },
      { title: "More Than 1 Hour Away", content: "Cancel the existing appointment. Create a new appointment.", type: "step" },
      { title: "Less Than 1 Hour Away", content: "Leave the existing appointment in place. Schedule the new appointment. Send a message to the clinical team immediately after scheduling.", type: "warning" },
      { title: "Cancellation < 24 Hours", content: "If patient cancels within 24 hours and refuses to reschedule: Cancel appointment. Send message to Office Manager (OM): 'patient called to cancel, and would not reschedule, <24 hours before appointment.'", type: "danger" },
    ],
  },
  {
    id: "reschedule-procedure",
    title: "Rescheduling Procedures",
    items: [
      { title: "Before 3:00 PM", content: "Cancel the old appointment and create the new one. Send a message to the clinical team containing both the old and new times.", type: "step" },
      { title: "After 3:00 PM (Same-Day or Next-Day Procedure)", content: "Do NOT cancel or reschedule. Perform a Warm Transfer of the patient directly to the appropriate ASC (Ambulatory Surgery Center) or office backline.", type: "danger" },
    ],
  },
  {
    id: "waitlist",
    title: "Waitlist Rules",
    items: [
      { title: "Eligible", content: "Office visits ONLY.", type: "rule" },
      { title: "NOT Eligible", content: "Procedures (including colonoscopies and endoscopies).", type: "danger" },
      { title: "Requirement", content: "The patient must already have an office visit scheduled before being added to the waitlist.", type: "warning" },
    ],
  },
  {
    id: "referrals",
    title: "Referral Guidelines — OV Required",
    items: [
      {
        title: "Schedule an OV if referral includes any of the following",
        content: [
          "Liver Disease", "Liver Transplant", "Cirrhosis", "Alcoholic Cirrhosis",
          "Hepatitis B or C", "Autoimmune Hepatitis", "Fatty Liver", "Liver Lesion",
          "Abnormal/Elevated Liver Function Tests (LFTs)", "Drug-Induced Liver Disease",
          "NASH", "MASLD", "MASH", "Hepatic Fibrosis", "Hepatic Steatosis",
          "Sarcoidosis", "Primary Biliary Cholangitis (PBC)",
        ],
        type: "rule",
      },
      { title: "Always Review", content: ["Reason for Referral", "Diagnoses/Problems"], type: "step" },
    ],
  },
  {
    id: "questionnaire",
    title: "Medical Questionnaire",
    items: [
      { title: "Required For", content: "Procedures — clear Yes or No answers only.", type: "rule" },
      { title: "NOT Required For", content: "Office visits.", type: "rule" },
    ],
  },
  {
    id: "tricare",
    title: "TRICARE (Military Insurance)",
    items: [
      { title: "Entry Format", content: ["Insurance Program: TRICARE", "Pharmacy Category: DOD (Department of Defense)"], type: "rule" },
    ],
  },
  {
    id: "new-patient-info",
    title: "New Patient Required Info",
    items: [
      { title: "NP Required Fields", content: ["Gender (Assigned Birth Sex)", "SSN", "Address", "Phone Number", "Email", "Notifications preference", "Language", "PCP", "Pharmacy", "Insurance: HMO/PPO, Policy Number, Group Number, Customer Service Number"], type: "step" },
      { title: "SSN Exception", content: "If patient is uncomfortable, enter 777-77-7777. If asked why: 'Required for billing and insurance reasons.'", type: "warning" },
      { title: "Gender Exception", content: "If patient refuses to provide current gender, enter 'asked but declined'.", type: "rule" },
    ],
  },
  {
    id: "insurance-entry",
    title: "Insurance Entry Rules",
    items: [
      { title: "Never Load Secondary Insurance Yourself", content: "Never load secondary insurance by yourself.", type: "danger" },
      { title: "Future Active Date", content: "If patient states their insurance is not active until a future date, process them as Self Pay.", type: "warning" },
      { title: "HMO vs PPO", content: "Always ask the patient if their plan is HMO or PPO to locate it in the payer lookup.", type: "rule" },
      { title: "BCBS Search", content: "When searching for Blue Cross Blue Shield, type 'BCBS' into the search field.", type: "rule" },
      { title: "Dual Medicare", content: "Enter as 'Medicare complete'.", type: "rule" },
      { title: "Missing Policy Number", content: ["Process the account as Self Pay.", "Add the patient's SSN instead.", "Enter the self-pay amount in the Miscellaneous Notes field."], type: "warning" },
      { title: "Group Number", content: "Mandatory to ask. If patient doesn't have it during the call, you may proceed without it.", type: "rule" },
      { title: "Customer Service Number", content: "Must obtain the insurance customer service phone number and enter it in the Contact Phone field in Insurance Maintenance. If it does not auto-fill, ask the patient for it.", type: "rule" },
    ],
  },
  {
    id: "hipaa",
    title: "HIPAA & Third-Party Callers",
    items: [
      { title: "Name Listed on HIPAA", content: "Proceed with the call normally.", type: "rule" },
      { title: "Name NOT Listed on HIPAA", content: "Do not disclose any clinical or financial details. Request direct authorization from the patient first.", type: "danger" },
      { title: "Commercial/Company Exception", content: "If a commercial entity calls to schedule or cancel on behalf of a patient: Allowed to schedule or cancel. Strict Restriction: Do NOT disclose any clinical information.", type: "warning" },
      { title: "Policy Holder Mini-Chart", content: ["If patient is NOT the primary policy holder, check Relations/Role.", "Search for the primary policy holder in the system first.", "If not in the system, create a mini-chart filling out only the red mandatory fields."], type: "step" },
      { title: "Patient Chart Lookup Requirements", content: ["First Name (3 letters minimum)", "Last Name (3 letters minimum)", "Date of Birth"], type: "rule" },
    ],
  },
];

export default function Scheduling() {
  const [activeSection, setActiveSection] = useState("patient-types");

  return (
    <div className="space-y-6" data-testid="scheduling-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Scheduling Rules</h1>
        <p className="text-sm text-muted-foreground mt-1">Appointment types, workflows, guardrails, and system procedures</p>
      </div>

      <div className="flex gap-6">
        <div className="w-52 shrink-0">
          <nav className="space-y-1 sticky top-8 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "w-full text-left text-xs px-3 py-2 rounded-md transition-colors font-medium",
                  activeSection === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {sections.map((s) => (
            <div key={s.id} className={activeSection === s.id ? "block" : "hidden"}>
              <h2 className="text-base font-semibold text-foreground mb-4">{s.title}</h2>
              <div className="space-y-3">
                {s.items.map((item) => (
                  <RuleCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
