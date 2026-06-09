import { Phone, Mail, ArrowRightLeft, AlertTriangle, MessageSquare, Building2, FileText, Stethoscope, Globe, CreditCard, HelpCircle, Activity, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Department {
  name: string;
  action: "warm" | "blind" | "email" | "clinical";
  icon: React.ElementType;
  overview: string;
  exceptions?: string[];
  notes?: string[];
}

const departments: Department[] = [
  {
    name: "Allergy",
    action: "warm",
    icon: Activity,
    overview: "Any calls related to allergy in reference to Dr. Watkins ONLY.",
    exceptions: ["NEVER touch (reschedule/cancel) appointments for Dr. Watkins."],
  },
  {
    name: "Collections / Billing",
    action: "warm",
    icon: CreditCard,
    overview: "Balance, credit, refunds, invoice, payment arrangements, or billing questions.",
    exceptions: ["Patient with balance over $1,000 CANNOT have procedure scheduled — warm transfer to collections.", "You CAN reschedule their procedure or office visit."],
  },
  {
    name: "Financial Counselor",
    action: "email",
    icon: FileText,
    overview: "Estimated cost questions for an upcoming scheduled procedure. EMAIL group — they will reach out to patient.",
    notes: ["Email: FinancialCounselors@borlandgroover.com", "Exception: Copay arrangement for future dated OV → Transfer to office."],
  },
  {
    name: "HIS (Medical Records)",
    action: "warm",
    icon: FileText,
    overview: "Obtaining or requesting patients' medical records.",
    notes: ["Medical Records only — NOT test results or labs (those are Clinical Messages)."],
  },
  {
    name: "Hospital Desk",
    action: "warm",
    icon: Building2,
    overview: "Any patient calling requesting a consult.",
    notes: [],
  },
  {
    name: "Human Resources",
    action: "blind",
    icon: Users,
    overview: "Employee verification or requesting career information.",
    notes: [],
  },
  {
    name: "Imaging",
    action: "blind",
    icon: Activity,
    overview: "Imaging tests or scheduling.",
    notes: [
      "Blind Transfer for: CT, MRI, Ultrasound, Gastric Emptying Study, Barium Swallow, Barium Esophagram, Dexa, HIDA, Sitz Marker, Small Bowel Follow Through, Barium Enema.",
      "Volusia South & Santa Rosa patients: Send message to Clinical Team (SLA 48hrs).",
      "Paracentesis, EUS, Fibroscans: Send message to Clinical Team (SLA 24hrs; Volusia South/Santa Rosa 48hrs).",
    ],
    exceptions: ["Volusia South & Santa Rosa imaging requests → clinical team instead of imaging dept."],
  },
  {
    name: "Infusion",
    action: "warm",
    icon: Activity,
    overview: "All calls related to infusion / Remicade or scheduling an infusion.",
    exceptions: ["B12/Iron Infusion → Send message to Clinical Team (SLA 24hrs; Volusia South/Santa Rosa 48hrs)."],
    notes: ["Transfer to appropriate office location (Infusion Department)."],
  },
  {
    name: "Pre-Cert / Insurance",
    action: "warm",
    icon: HelpCircle,
    overview: "Verify authorization, prior authorization, or insurance verification. If patient requests copay amount, call pre-cert.",
    notes: ["Insurance Chat (Pre-Cert Team) is for OFFICE VISIT-related insurance questions only."],
  },
  {
    name: "Clinical Messaging",
    action: "clinical",
    icon: MessageSquare,
    overview: "Send a clinical message for lab results, medication authorization, paracentesis, EUS/Fibroscan.",
    notes: [
      "Lab / Test / Imaging Results",
      "Medication Authorization",
      "Paracentesis Request",
      "EUS / Fibroscan Scheduling & Questions",
      "SLA: Clinical Team 24hrs | Volusia South & Santa Rosa: 48hrs",
    ],
  },
];

const actionConfig = {
  warm: { label: "Warm Transfer", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200", border: "border-teal-300 dark:border-teal-700" },
  blind: { label: "Blind Transfer", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200", border: "border-blue-300 dark:border-blue-700" },
  email: { label: "Email", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200", border: "border-purple-300 dark:border-purple-700" },
  clinical: { label: "Clinical Message", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200", border: "border-amber-300 dark:border-amber-700" },
};

const warmTransferSteps = [
  "Select Consult.",
  "Select Favorites and find the desired department (DO NOT select Queues or Contacts).",
  "Provide the department: Your name, Patient's name and DOB, Reason for the call.",
  "Connect the call once the receiving agent confirms they are ready.",
  "Add consultation to MERGE the call (DO NOT select Transfer).",
  "Introduce the patient to the agent.",
  "Select Transfer to end your call.",
];

const blindTransferSteps = [
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

export default function Routing() {
  return (
    <div className="space-y-8" data-testid="routing-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Department Routing</h1>
        <p className="text-sm text-muted-foreground mt-1">Transfer procedures and all department routing rules</p>
      </div>

      {/* Transfer Procedures */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-teal-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-teal-500" />
              Warm Transfer (3-Way Call)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 font-medium">
              Do NOT use for Interpreter Services
            </div>
            {warmTransferSteps.map((step, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              Blind Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blindTransferSteps.map((step, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              Interpreter / Translation Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {interpreterSteps.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Department Directory</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {departments.map((dept) => {
            const cfg = actionConfig[dept.action];
            const Icon = dept.icon;
            return (
              <Card key={dept.name} className={cn("border", cfg.border)} data-testid={`dept-${dept.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <h3 className="font-semibold text-sm text-foreground">{dept.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{dept.overview}</p>
                  {dept.exceptions && dept.exceptions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {dept.exceptions.map((ex, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {dept.notes && dept.notes.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {dept.notes.map((note, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span>
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

      {/* Insurance Reminder */}
      <Card className="border-l-4 border-l-red-400">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-foreground">Insurance Topics We Do NOT Discuss</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Benefits", "Coverage", "Copays", "Deductibles", "Coinsurance", "Payment arrangements"].map((t) => (
                  <span key={t} className="text-xs bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Warm transfer to Insurance Team or provide their contact information.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
