import { Phone, Mail, ArrowRightLeft, AlertTriangle, Globe, CreditCard, FileText, Building2, Users, Activity, HelpCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Department {
  name: string;
  action: "warm" | "blind" | "email" | "clinical";
  icon: React.ElementType;
  overview: string;
  notes?: string[];
  warnings?: string[];
}

const departments: Department[] = [
  {
    name: "Allergy",
    action: "warm",
    icon: Activity,
    overview: "Any calls related to allergy in reference to Dr. Watkins ONLY.",
    warnings: ["NEVER reschedule or cancel appointments for Dr. Watkins."],
  },
  {
    name: "Collections / Billing",
    action: "warm",
    icon: CreditCard,
    overview: "Any calls related to balance, credit, refunds, invoice, payment arrangements, or billing questions.",
    notes: [
      "Patient balance over $1,000 → cannot schedule a procedure. Warm transfer to collections.",
      "However, you CAN reschedule their procedure or office visit.",
    ],
  },
  {
    name: "Financial Counselor",
    action: "email",
    icon: FileText,
    overview: "Estimated cost questions for an upcoming scheduled procedure. EMAIL the group and they will reach out to the patient.",
    notes: [
      "Email: FinancialCounselors@borlandgroover.com",
      "Exception: Copay arrangement for a future dated OV → Transfer to office.",
    ],
  },
  {
    name: "HIS (Medical Records)",
    action: "warm",
    icon: FileText,
    overview: "Obtaining or requesting patients' medical records.",
    notes: ["Medical Records ONLY — NOT test results or labs (those go to Clinical Messaging)."],
  },
  {
    name: "Hospital Desk",
    action: "warm",
    icon: Building2,
    overview: "Any patient calling to request a consult.",
  },
  {
    name: "Human Resources",
    action: "blind",
    icon: Users,
    overview: "Employee verification or requesting career information.",
  },
  {
    name: "Imaging",
    action: "blind",
    icon: Activity,
    overview: "Calls related to imaging tests or scheduling an imaging test.",
    notes: [
      "Blind Transfer for: CT, MRI, Ultrasound, Gastric Emptying Study, Barium Swallow, Barium Esophagram, Dexa, HIDA, Sitz Marker, Small Bowel Follow Through, Barium Enema.",
      "Volusia South & Santa Rosa patients: Send clinical message instead (SLA: 48 hrs).",
      "Paracentesis, EUS, Fibroscans: Send clinical message (SLA: 24 hrs; Volusia South/Santa Rosa: 48 hrs).",
    ],
  },
  {
    name: "Infusion / Remicade",
    action: "warm",
    icon: Activity,
    overview: "All calls related to infusion or Remicade or scheduling an infusion.",
    notes: [
      "Transfer to the appropriate office location (Infusion Department).",
      "Exception: B12/Iron Infusion → Send clinical message (SLA: 24 hrs; Volusia South/Santa Rosa: 48 hrs).",
    ],
  },
  {
    name: "Pre-Cert / Insurance",
    action: "warm",
    icon: HelpCircle,
    overview: "Authorization, prior authorization, insurance verification, or copay amount.",
    notes: [
      "If patient requests their copay amount, call Pre-Cert for that amount.",
      "Insurance Chat (Pre-Cert Team) is for OV-related insurance questions ONLY.",
    ],
  },
  {
    name: "Clinical Messaging",
    action: "clinical",
    icon: MessageSquare,
    overview: "Send a clinical message — do NOT transfer — for the items below.",
    notes: [
      "Lab / Test / Imaging Results",
      "Medication Authorization / Prior Authorization",
      "Paracentesis Request",
      "EUS / Fibroscan Scheduling & Questions",
      "B12 / Iron Infusion Requests",
      "SLA: Clinical Team 24 hrs | Volusia South & Santa Rosa: 48 hrs",
    ],
  },
];

const actionConfig = {
  warm: { label: "Warm Transfer", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200", border: "border-teal-300 dark:border-teal-700" },
  blind: { label: "Blind Transfer", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200", border: "border-blue-300 dark:border-blue-700" },
  email: { label: "Email Group", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200", border: "border-purple-300 dark:border-purple-700" },
  clinical: { label: "Clinical Message", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200", border: "border-amber-300 dark:border-amber-700" },
};

const warmSteps = [
  "Select Consult.",
  "Select Favorites and find the desired department (DO NOT select Queues or Contacts).",
  "Provide your name, patient's name and DOB, and reason for the call.",
  "Connect the call once the receiving agent confirms they are ready.",
  "Select Add Consultation to MERGE the call (DO NOT select Transfer).",
  "Introduce the patient to the agent.",
  "Select Transfer to end your call.",
];

const blindSteps = [
  "Inform the patient of the pending transfer and offer further assistance before proceeding.",
  "Select Blind Transfer.",
  "Select Favorites and choose the appropriate department.",
];

const interpreterSteps = [
  "DO NOT use 3-Way Call / Warm Transfer for interpreter services.",
  "Select Add a Guest.",
  "Select Favorites.",
  "Type in Translation Services.",
  "Select the language needed.",
  "Provide the translator with the code: 'Patient Support Services'.",
  "Begin call.",
];

const warmTransferScripts = [
  {
    label: "To Department",
    script: '"Thank you for holding, [department]. My name is [your name], I have [patient name], DOB [MM/DD/YYYY], calling regarding [reason for call]. I\'m going to connect you now."',
  },
  {
    label: "Introducing Patient",
    script: '"[Patient name], I have [agent name] on the line from [department]. They will be able to assist you. Is there anything else I can help you with before I go?"',
  },
];

export default function Routing() {
  return (
    <div className="space-y-8" data-testid="routing-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Department Routing</h1>
        <p className="text-sm text-muted-foreground mt-1">Transfer procedures, scripts, and all department routing rules</p>
      </div>

      {/* Insurance reminder */}
      <Card className="border-l-4 border-l-red-400">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">Insurance Topics We Do NOT Discuss</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Benefits", "Coverage", "Copays", "Deductibles", "Coinsurance", "Payment arrangements"].map((t) => (
                  <span key={t} className="text-xs bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Warm transfer to Insurance Team (Pre-Cert) or provide their contact information.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer procedures */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-teal-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-teal-500" />
              Warm Transfer (3-Way Call)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 font-medium">
              ⚠ DO NOT use for Interpreter Services
            </div>
            {warmSteps.map((step, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                Blind Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              {blindSteps.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                Interpreter / Translation Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              {interpreterSteps.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warm Transfer Scripts */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Warm Transfer Scripts</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {warmTransferScripts.map((s, i) => (
            <Card key={i} className="border border-border">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{s.label}</p>
                <blockquote className="text-sm text-foreground bg-muted/50 rounded-lg p-3 border-l-2 border-primary/30 italic leading-relaxed">{s.script}</blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Department Directory */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Department Directory</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {departments.map((dept) => {
            const cfg = actionConfig[dept.action];
            const Icon = dept.icon;
            return (
              <Card key={dept.name} className={cn("border", cfg.border)} data-testid={`dept-${dept.name.toLowerCase().replace(/[\s/()]/g, "-")}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <h3 className="font-semibold text-sm text-foreground">{dept.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{dept.overview}</p>
                  {dept.warnings?.map((w, i) => (
                    <div key={i} className="mt-2 flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded px-2 py-1.5">
                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span className="font-medium">{w}</span>
                    </div>
                  ))}
                  {dept.notes && dept.notes.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {dept.notes.map((note, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-0.5 shrink-0">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick routing table */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Quick Routing Table</h2>
        <div className="space-y-1.5">
          {[
            { situation: "Balance / billing question", action: "Collections → Warm Transfer" },
            { situation: "Balance over $1,000 + wants procedure", action: "Cannot schedule → Warm Transfer to Collections" },
            { situation: "Estimated procedure cost", action: "Email Financial Counselors group" },
            { situation: "Copay for future OV", action: "Transfer to Office" },
            { situation: "Medical records request", action: "HIS → Warm Transfer" },
            { situation: "Lab / test results", action: "Clinical Message (24hr SLA)" },
            { situation: "Medication authorization", action: "Clinical Message (24hr SLA)" },
            { situation: "Paracentesis request", action: "Clinical Message (24hr SLA)" },
            { situation: "EUS / Fibroscan", action: "Clinical Message (24hr SLA)" },
            { situation: "CT / MRI / Ultrasound scheduling", action: "Imaging → Blind Transfer (except Volusia/Santa Rosa → clinical msg)" },
            { situation: "Infusion / Remicade", action: "Infusion Dept → Warm Transfer" },
            { situation: "B12 / Iron infusion", action: "Clinical Message (24hr SLA)" },
            { situation: "Insurance / prior auth / copay amount", action: "Pre-Cert → Warm Transfer" },
            { situation: "Hospital consult request", action: "Hospital Desk → Warm Transfer" },
            { situation: "Dr. Watkins / allergy call", action: "Allergy Dept → Warm Transfer (NEVER touch his appts)" },
            { situation: "Career / HR inquiry", action: "Human Resources → Blind Transfer" },
            { situation: "Non-English speaker", action: "Translation Services → Add a Guest (NOT warm transfer)" },
          ].map(({ situation, action }) => (
            <div key={situation} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card text-xs">
              <span className="text-foreground font-medium flex-1">{situation}</span>
              <span className="text-primary font-semibold shrink-0">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
