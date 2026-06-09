import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  items: Item[];
}

interface Item {
  title: string;
  content: string | string[];
  type?: "rule" | "warning" | "danger" | "step";
}

function RuleCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const isLong = Array.isArray(item.content) || (typeof item.content === "string" && item.content.length > 120);

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

  const t = item.type ?? "rule";

  return (
    <div className={cn("border border-border rounded-lg border-l-4 bg-card", borderMap[t])}>
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => isLong && setOpen(!open)}
        data-testid={`rule-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
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
                      <span className="text-primary mt-0.5">•</span>
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
              {Array.isArray(item.content) ? item.content[0] + "..." : item.content.substring(0, 80) + "..."}
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
      { title: "Follow-Up vs Long Follow-Up", content: ["Step 1: Check the patient's appointment history. Only count 'Kept' appointments (attended). Ignore cancelled or no-show.", "Follow-Up: Last kept appointment was LESS than 1 year ago.", "Long Follow-Up: Last kept appointment was MORE than 1 year ago, OR approved provider switch."], type: "step" },
    ],
  },
  {
    id: "appointment-types",
    title: "Office Visit Event Types",
    items: [
      { title: "New Patient Consult", content: "Has never seen a BG GI physician and is being referred for a specific problem. Always indicate symptoms or reason for visit in details.", type: "rule" },
      { title: "Follow-Up", content: "Last seen within 1 year. Always indicate symptoms or reason for visit.", type: "rule" },
      { title: "Long Follow-Up", content: "Last seen over 1 year ago, OR transferring from one BG provider to another. Volusia Exception: Use if patient was seen in-office between 1 and 3 years ago.", type: "rule" },
      { title: "Hospital Follow-Up (HFU)", content: "Seen in hospital (Inpatient or ER) by BG physician within last 90 days. Exception: Only enter event type in Details box (not symptoms).", type: "rule" },
      { title: "DAP Follow-Up", content: "Used only when a patient schedules an office visit after a Direct Access Procedure (DAP) or a Recall procedure.", type: "rule" },
      { title: "Liver/Specialty", content: "Can be used for liver referrals/issues. Patient must bring medical records. Check cheat sheet for provider-specific duration preferences.", type: "rule" },
      { title: "Interoffice Consult", content: "Established BG provider requests a second opinion from a different BG provider. Note: We usually reschedule these appointments.", type: "rule" },
      { title: "Telemedicine Visits", content: ["Not all providers offer Telemed — always verify participation.", "Telemedicine New Patient: Virtual for brand new patient.", "Telemedicine Follow-Up: Virtual for patient seen within 1 year.", "Long Follow-Up Telemedicine: Virtual for patient seen over 1 year ago.", "Telemedicine HFU: Virtual for patient seen in hospital by BG within 1 year."], type: "step" },
      { title: "WeCare Program", content: ["WeCare New Patient: New to BG with active WeCare Referral (charity for Jacksonville residents).", "WeCare Follow-Up: Established WeCare patient seen within 1 year. Must have WeCare Charity on chart.", "WeCare Long Follow-Up: Established WeCare seen over 1 year ago or transferring providers."], type: "step" },
    ],
  },
  {
    id: "procedures",
    title: "Procedures",
    items: [
      { title: "DAP Colonoscopy — Eligibility", content: ["Age 45–74 ONLY. Under 45 or over 74 → office visit first.", "Patient must pass screening questions.", "Patient must pass medical questionnaire.", "Referral must be complete and ready.", "Appropriate history required."], type: "warning" },
      { title: "Standard Colonoscopy — Do NOT Schedule Directly", content: ["We do NOT schedule initial standard colonoscopies.", "Step 1: Schedule an office visit.", "Step 2: Provider determines if colonoscopy is needed.", "Step 3: Office schedules the procedure."], type: "danger" },
      { title: "Colonoscopy Recall", content: "May be scheduled when patient has a previous colonoscopy history and is due for recall. Status must be Active or Stopped due to no contact. Always verify date under First Mailing in Recalls Tab or EHR notes.", type: "rule" },
      { title: "EGD / Upper Endoscopy — NEVER schedule directly", content: "Patient must first complete an office visit. No exceptions.", type: "danger" },
      { title: "EGD Recall Requirements", content: ["Established Patient ONLY (no new patients).", "Age 45–74 ONLY.", "Must have previous EGD in our system.", "Must have recall request from the doctor.", "NOT a Volusia patient (special rules apply)."], type: "warning" },
      { title: "Procedure Follow-Up Rule", content: ["If patient had Colonoscopy, Endoscopy, or Colonoscopy/Endoscopy — next appointment must be a Recall.", "Schedule OV instead if: age restriction, presenting a problem, referral problem, or failed questionnaire."], type: "rule" },
      { title: "EGD/Colonoscopy Recall (Combined)", content: "Requires an Office Visit AND must have both recalls on file.", type: "warning" },
    ],
  },
  {
    id: "scheduling-rules",
    title: "Scheduling Rules & Guardrails",
    items: [
      { title: "OV Timing Rule", content: "Book appointments 2 to 3 days out. Absolutely NO same-day or next-day appointments.", type: "danger" },
      { title: "Switching Doctors", content: "Established patients cannot switch doctors unless they have an approved reason (e.g., requesting a female physician).", type: "warning" },
      { title: "Extenders", content: "If a doctor has an extender, it will be listed in bold text. You can schedule established patients with either the doctor or the extender.", type: "rule" },
      { title: "Hospital Encounter Check", content: ["Before booking any Procedure or OV, check for a Hospital Encounter — must occur before the procedure/OV.", "Within 90 days: patient is eligible.", "Over 90 days: expired/invalid → schedule Follow-Up or Long Follow-Up instead.", "If patient was discharged within 90 days → likely due for HFU."], type: "warning" },
    ],
  },
  {
    id: "hfu-rules",
    title: "Hospital Follow-Up (HFU) Rules",
    items: [
      { title: "Established Patients", content: "Always schedule with their established provider.", type: "rule" },
      { title: "New Patients — Provider Listed", content: "If a provider is listed under the Hospital D/C Follow-Up field, schedule with that provider.", type: "rule" },
      { title: "New Patients — No Provider", content: "If no encounter is available, follow up through the HFU Teams Chat.", type: "warning" },
    ],
  },
  {
    id: "reschedule-cancel",
    title: "Rescheduling & Cancellations",
    items: [
      { title: "Reschedule OV — More Than 1 Hour Away", content: "Cancel the existing appointment. Create a new appointment.", type: "step" },
      { title: "Reschedule OV — Less Than 1 Hour Away", content: "Leave the existing appointment in place. Schedule the new appointment. Send a message to clinical team immediately after scheduling.", type: "warning" },
      { title: "Cancellation < 24 Hours", content: "If patient cancels within 24 hours and refuses to reschedule: Cancel appointment. Send message to Office Manager (OM) with exact text: 'patient called to cancel, and would not reschedule, <24 hours before appointment.'", type: "danger" },
      { title: "Procedure Reschedule — Before 3:00 PM", content: "Cancel old appointment, create new one. Send message to clinical team with BOTH old and new times.", type: "step" },
      { title: "Procedure Reschedule — After 3:00 PM (Same-Day/Next-Day)", content: "Do NOT cancel or reschedule. Warm Transfer patient directly to the appropriate ASC or office backline.", type: "danger" },
    ],
  },
  {
    id: "waitlist",
    title: "Waitlist Rules",
    items: [
      { title: "Eligible", content: "Office visits only.", type: "rule" },
      { title: "NOT Eligible", content: "Procedures (including colonoscopies and endoscopies).", type: "danger" },
      { title: "Requirement", content: "The patient must already have an office visit scheduled before being added to the waitlist.", type: "warning" },
    ],
  },
  {
    id: "referrals",
    title: "Referral Guidelines — Office Visit Required",
    items: [
      { title: "Liver & Hepatology Referrals", content: ["Liver Disease", "Liver Transplant", "Cirrhosis / Alcoholic Cirrhosis", "Hepatitis B or C", "Autoimmune Hepatitis", "Fatty Liver", "Liver Lesion", "Abnormal/Elevated LFTs", "Drug-Induced Liver Disease", "NASH / MASLD / MASH", "Hepatic Fibrosis / Hepatic Steatosis", "Sarcoidosis", "Primary Biliary Cholangitis (PBC)"], type: "rule" },
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
];

export default function Scheduling() {
  const [activeSection, setActiveSection] = useState("patient-types");

  return (
    <div className="space-y-6" data-testid="scheduling-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Scheduling Rules</h1>
        <p className="text-sm text-muted-foreground mt-1">Appointment types, workflows, and guardrails</p>
      </div>

      <div className="flex gap-6">
        {/* Section Nav */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1 sticky top-8">
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
                data-testid={`section-nav-${s.id}`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {sections.map((s) => (
            <div key={s.id} id={s.id} className={activeSection === s.id ? "block" : "hidden"}>
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
