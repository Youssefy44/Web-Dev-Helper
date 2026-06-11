import { useState, useEffect, useRef, useCallback } from "react";
import { Phone, Timer, FileText, CheckCircle, ChevronRight, RotateCcw, Send, Trash2, Plus, Play, Pause, AlertCircle, Info, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCreateNote, useGetNotes, getGetNotesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface CallStep {
  title: string;
  script?: string;
  actions: string[];
  tips?: string[];
  warning?: string;
  info?: string;
  disposition?: boolean;
}

interface CallScenario {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
  avgTime: string;
  steps: CallStep[];
}

const scenarios: CallScenario[] = [
  {
    id: "new-patient",
    label: "New Patient",
    icon: "👤",
    desc: "Patient calling to schedule their first appointment with BG",
    color: "blue",
    avgTime: "5–7 min",
    steps: [
      {
        title: "Opening / Greeting",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: ["State your name and department", "Listen to the patient's reason for calling", "Confirm this is a new patient call"],
      },
      {
        title: "Collect Patient Information",
        actions: [
          "Full legal name (first, last)",
          "Date of birth",
          "Phone number and preferred contact method",
          "Home address",
          "Email address (for Phreesia intake)",
          "Insurance information: plan name, member ID, group number",
          "Primary Care Physician (PCP) name",
        ],
        tips: ["Ask: 'Have you ever been a patient at Borland Groover before?' to confirm new patient status", "Enter all information into NextGen PM as you collect it"],
        info: "For HMO patients — ask if they have a referral from their PCP before proceeding.",
      },
      {
        title: "Determine Reason for Visit",
        actions: [
          "Ask: 'What brings you in today / what is the reason for your visit?'",
          "Listen for specific symptoms, conditions, or referral reasons",
          "Identify the appropriate service: GI, Allergy, Infusion, etc.",
          "Determine if referral is needed (HMO plans)",
        ],
        tips: ["Never make clinical recommendations — if unsure, ask: 'Let me note your concerns and the provider's team will review them'"],
        warning: "Do NOT schedule a new EGD/upper endoscopy without an office visit first. Office visit MUST come before a new EGD.",
      },
      {
        title: "Verify Insurance / Check for Referral",
        actions: [
          "Confirm insurance plan name and whether BG is in-network",
          "For HMO plans: confirm referral is on file or will be sent",
          "Note insurance ID and group number in system",
          "If patient has secondary insurance, capture that too",
        ],
        info: "BG does not verify insurance benefits for patients. If asked about coverage, advise patient to call the member services number on their card.",
      },
      {
        title: "Find & Offer Appointment Slot",
        actions: [
          "Check NextGen for available slots based on service and location",
          "Offer 2–3 date options if available",
          "Book 2–3 days out minimum — NO same-day or next-day",
          "Confirm patient's preferred location (BG has multiple locations)",
          "Assign to correct provider or next available based on reason for visit",
        ],
        warning: "Check SharePoint scheduling cheat sheet before confirming any appointment type. Do not schedule outside of approved windows.",
      },
      {
        title: "Confirm & Give Pre-Visit Instructions",
        actions: [
          "Confirm: date, time, location, and provider",
          "Tell patient to bring: insurance card, photo ID, copay, medication list",
          "Advise patient to arrive 15 minutes early to complete paperwork",
          "Mention Phreesia online check-in (email will be sent)",
          "If colonoscopy: confirm prep instructions will be provided separately",
        ],
        script: "\"Your appointment is confirmed for [Date] at [Time] at our [Location] office with [Provider]. Please bring your insurance card, photo ID, and arrive 15 minutes early. You'll receive an email for online check-in — please complete it before your visit.\"",
      },
      {
        title: "Closing & Disposition",
        script: "\"Is there anything else I can help you with today? We look forward to seeing you! Have a great day!\"",
        actions: [
          "Ask if patient has any remaining questions",
          "Log the call in Talkdesk",
          "Select correct disposition code",
          "Document any special notes in patient chart",
        ],
        disposition: true,
      },
    ],
  },
  {
    id: "recall",
    label: "Recall / Return Visit",
    icon: "🔁",
    desc: "Established patient returning for follow-up or recurring appointment",
    color: "teal",
    avgTime: "4–6 min",
    steps: [
      {
        title: "Opening / Greeting",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: ["Greet the patient warmly", "Confirm this is a recall/return visit call", "Pull up patient chart in NextGen PM"],
      },
      {
        title: "Verify Patient Identity",
        actions: [
          "Confirm full name and date of birth",
          "Verify address or last 4 of SSN if needed",
          "Open chart — confirm Demographics tab shows correct patient",
        ],
        warning: "Always verify two identifiers before making any changes to or scheduling for a patient's account.",
      },
      {
        title: "Review Chart & Recall Reason",
        actions: [
          "Check Encounters tab for last visit and provider",
          "Review any recall/recall notes left by the clinical team",
          "Identify reason for recall (post-procedure follow-up, annual visit, specialist recall)",
          "Confirm provider preference or established provider",
        ],
        tips: ["If a provider is listed on the recall, schedule with that provider", "If no provider listed and patient is established, schedule with their established provider"],
      },
      {
        title: "Confirm Insurance Is Current",
        actions: [
          "Ask: 'Has your insurance changed since your last visit?'",
          "If yes: collect new insurance information and update in NextGen",
          "If HMO: confirm referral status",
        ],
        info: "Insurance changes should be updated at every visit to prevent billing issues.",
      },
      {
        title: "Schedule Appointment",
        actions: [
          "Find appropriate slot (minimum 2–3 days out)",
          "Schedule with established provider where possible",
          "Offer 2–3 time/date options",
          "Confirm appointment type matches recall reason",
        ],
        warning: "For DAP (Direct Access Procedure) colonoscopy recalls — verify patient meets DAP criteria: established BG patient, prior colonoscopy on record, physician order on file.",
      },
      {
        title: "Confirm & Wrap Up",
        script: "\"I've scheduled your appointment for [Date] at [Time] at [Location] with [Provider]. Please bring your insurance card and arrive 15 minutes early. Is there anything else I can help you with?\"",
        actions: ["Read back appointment details", "Remind patient to bring insurance card and ID", "Log disposition and notes in Talkdesk"],
        disposition: true,
      },
    ],
  },
  {
    id: "hfu",
    label: "Hospital Follow-Up (HFU)",
    icon: "🏥",
    desc: "Patient discharged from hospital needing a follow-up appointment",
    color: "purple",
    avgTime: "5–8 min",
    steps: [
      {
        title: "Opening / Identify as HFU",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: [
          "Patient or hospital calls requesting a post-hospital follow-up",
          "Ask: 'Were you recently discharged from the hospital?'",
          "Confirm this is a Hospital Follow-Up (HFU) call",
        ],
        info: "HFU calls are high-priority — patients recently discharged from the hospital need to be seen promptly.",
      },
      {
        title: "Gather Patient & Hospital Information",
        actions: [
          "Full patient name and date of birth",
          "Hospital where they were admitted",
          "Discharge date",
          "Reason for hospitalization (GI-related)",
          "Name of attending or consulting physician",
          "Provider listed on discharge paperwork",
        ],
        tips: ["Ask: 'Was a specific Borland Groover doctor listed on your discharge paperwork as your follow-up provider?'"],
      },
      {
        title: "Determine Provider Assignment",
        actions: [
          "If a specific BG provider is listed on discharge: schedule with that provider",
          "If the patient is an established BG patient: schedule with established provider",
          "If NO provider listed and patient is NEW to BG: contact Hospital Follow-Up Team",
        ],
        warning: "If patient is NEW to BG with no provider listed — do NOT attempt to assign a provider yourself. Transfer to the Hospital Follow-Up Team.",
      },
      {
        title: "Verify Insurance",
        actions: [
          "Confirm current insurance (may have changed during hospitalization)",
          "Verify HMO status — does patient need a referral?",
          "Note any Medicaid/Medicare or secondary insurance",
        ],
      },
      {
        title: "Schedule the Follow-Up",
        actions: [
          "Schedule within the timeframe specified on discharge orders (often 7–14 days)",
          "Prioritize earliest available appointment",
          "Use correct appointment type for HFU",
          "Note the hospital name and discharge date in scheduling notes",
        ],
        warning: "Do NOT apply the 2–3 day out rule for HFU — if patient needs to be seen sooner and a slot is available, schedule it. Clinical urgency takes priority.",
      },
      {
        title: "Confirm & Instruct",
        script: "\"Your follow-up appointment is confirmed for [Date] at [Time] with Dr. [Provider] at [Location]. Please bring your hospital discharge paperwork, insurance card, and a list of any new medications. Is there anything else?\"",
        actions: [
          "Confirm appointment details",
          "Ask patient to bring discharge paperwork",
          "Log in Talkdesk and select HFU disposition",
          "Note hospital name and discharge date in call notes",
        ],
        disposition: true,
      },
    ],
  },
  {
    id: "insurance-question",
    label: "Insurance Question",
    icon: "🛡️",
    desc: "Patient calling about insurance, billing, or coverage questions",
    color: "amber",
    avgTime: "3–5 min",
    steps: [
      {
        title: "Opening & Identify the Issue",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: [
          "Listen carefully to the patient's question",
          "Determine if it's: a billing dispute, coverage question, payment plan, or general insurance question",
          "Pull up patient chart in NextGen PM to reference their insurance on file",
        ],
      },
      {
        title: "Triage the Question Type",
        actions: [
          "Coverage question (is X covered?): Advise patient to call their insurance directly",
          "Billing/statement question: Transfer to Billing Team",
          "Payment arrangement: Transfer to Billing Team",
          "Balance inquiry: Transfer to Billing Team",
          "Update insurance information: Collect new info and update in NextGen",
        ],
        warning: "You cannot quote insurance coverage, costs, or verify benefits. Always direct patients to call their insurance carrier for coverage questions.",
        info: "BG Insurance Team handles all billing and coverage disputes. Scheduling reps should not try to answer insurance/billing questions beyond basic information.",
      },
      {
        title: "If Insurance Update Needed",
        actions: [
          "Ask patient to provide: Insurance plan name, Member ID, Group number, Policy holder name and DOB",
          "Update NextGen PM demographics with new insurance information",
          "Note any secondary insurance",
          "Confirm: 'Is Borland Groover in-network on your new plan?'",
        ],
        tips: ["If patient is unsure if BG is in-network, advise them to call the member services number on their card before their appointment"],
      },
      {
        title: "If Transfer to Insurance Team",
        actions: [
          "Warm transfer to BG Insurance/Billing Team",
          "Introduce the patient: 'I have [Patient Name] on the line calling about [brief reason]. I'll be transferring you now.'",
          "Confirm patient is connected before releasing",
        ],
        script: "\"I'm going to connect you with our billing and insurance specialists who will be best able to help you with that. One moment while I transfer you — please hold.\"",
      },
      {
        title: "Wrap Up & Disposition",
        actions: [
          "If resolved: confirm resolution and close call",
          "If transferred: log transfer details",
          "Select correct disposition code for insurance/billing call",
        ],
        disposition: true,
      },
    ],
  },
  {
    id: "prescription-refill",
    label: "Prescription Refill",
    icon: "💊",
    desc: "Patient requesting a medication refill",
    color: "green",
    avgTime: "3–4 min",
    steps: [
      {
        title: "Opening & Identify Request",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: ["Patient is requesting a prescription refill", "Pull up patient chart in NextGen PM"],
      },
      {
        title: "Verify Patient Identity",
        actions: [
          "Confirm full name and date of birth",
          "Verify the patient is a current BG patient with an established provider",
        ],
        warning: "Prescription refill requests must go to the clinical team/nursing staff — scheduling reps do NOT process refills.",
      },
      {
        title: "Collect Refill Information",
        actions: [
          "Medication name and dosage",
          "Preferred pharmacy name and phone number",
          "When did they last refill?",
          "Name of the BG provider who prescribes the medication",
        ],
      },
      {
        title: "Transfer or Message Clinical Team",
        script: "\"I'll be transferring your refill request to our clinical team. They will review and process it — you should hear back within 1–2 business days. Is there anything else I can help you with?\"",
        actions: [
          "Transfer to nursing/clinical team OR",
          "Submit refill request message to provider's team in NextGen",
          "Let patient know expected response time (1–2 business days)",
        ],
        info: "Do not promise same-day refills. Clinical team manages all medication requests.",
        disposition: true,
      },
    ],
  },
  {
    id: "cancel-reschedule",
    label: "Cancel / Reschedule",
    icon: "📅",
    desc: "Patient calling to cancel or change an existing appointment",
    color: "rose",
    avgTime: "3–5 min",
    steps: [
      {
        title: "Opening & Identify Request",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: ["Patient wants to cancel or reschedule", "Ask: 'Would you like to reschedule, or just cancel?'", "Pull up patient chart and find the appointment"],
      },
      {
        title: "Verify Patient & Appointment",
        actions: [
          "Confirm patient name and DOB",
          "Locate the appointment in NextGen (Encounters tab)",
          "Confirm appointment date, time, provider, and location",
        ],
      },
      {
        title: "Cancellation Process",
        actions: [
          "Ask: 'Is there a reason for the cancellation?' (document but don't pressure)",
          "Cancel the appointment in NextGen with the correct cancellation reason code",
          "If it's a procedure: notify the appropriate department (endoscopy team, etc.)",
          "If less than 24 hours notice: note as late cancellation",
        ],
        tips: ["For colonoscopy cancellations less than 24 hours out — flag for the scheduling team lead"],
      },
      {
        title: "Offer to Reschedule",
        script: "\"I've cancelled your appointment. Would you like to reschedule at this time? I can find you a new slot with the same provider.\"",
        actions: [
          "Offer reschedule immediately if patient is willing",
          "If rescheduling: follow the scheduling steps (2–3 days out minimum)",
          "If not rescheduling now: note in chart that patient may call back",
        ],
      },
      {
        title: "Wrap Up & Disposition",
        script: "\"Your appointment has been cancelled / rescheduled for [Date] at [Time]. Is there anything else I can help you with today?\"",
        actions: ["Confirm cancellation or new appointment details", "Log in Talkdesk", "Select cancel or reschedule disposition code"],
        disposition: true,
      },
    ],
  },
  {
    id: "voicemail-callback",
    label: "Voicemail Callback",
    icon: "📞",
    desc: "Returning a patient's voicemail message",
    color: "indigo",
    avgTime: "4–6 min",
    steps: [
      {
        title: "Review Voicemail Before Calling",
        actions: [
          "Listen to the voicemail completely",
          "Note: patient name, callback number, reason for call",
          "Pull up patient chart in NextGen before dialing back",
          "Identify which department/issue the callback is related to",
        ],
        tips: ["Never call a patient back without reviewing their chart first — you'll sound more prepared and professional"],
      },
      {
        title: "Place the Return Call",
        script: "\"Hello, may I speak with [Patient Name]? ... Hi [Name], this is [Your Name] calling from Borland Groover returning your call. I have a few moments — is now a good time to speak?\"",
        actions: [
          "Call from Talkdesk — ensure you're in Ready status",
          "If patient doesn't answer: leave a brief voicemail with your name, BG's number, and best callback hours",
          "Document the callback attempt in Talkdesk",
        ],
      },
      {
        title: "Handle the Patient's Request",
        actions: [
          "Address their reason for calling",
          "Follow the appropriate flow (scheduling, insurance, prescription, etc.)",
          "If issue requires another department: warm transfer",
        ],
      },
      {
        title: "Disposition & Document",
        actions: [
          "Log call in Talkdesk with callback notation",
          "Note outcome: reached patient, left voicemail, issue resolved, transferred",
          "Select correct disposition code",
        ],
        disposition: true,
      },
    ],
  },
  {
    id: "billing-payment",
    label: "Billing / Payment",
    icon: "💳",
    desc: "Patient calling about a bill, statement, or to make a payment",
    color: "orange",
    avgTime: "3–5 min",
    steps: [
      {
        title: "Opening & Identify Issue",
        script: "\"Thank you for calling Borland Groover, this is [your name]. How can I assist you today?\"",
        actions: ["Patient is calling about billing, a statement, or to pay", "Pull up patient chart"],
      },
      {
        title: "Identify Specific Request",
        actions: [
          "Making a payment → Provide online payment link: borlandgroover.com or transfer to billing",
          "Disputing a charge → Transfer to billing team",
          "Setting up payment plan → Transfer to billing team",
          "General balance question → Transfer to billing team",
          "Insurance didn't pay → Transfer to billing team",
        ],
        warning: "IMPORTANT: If the patient has a balance over $1,000, you CANNOT schedule new procedures. Transfer to the Collections/Billing team before any scheduling.",
      },
      {
        title: "Transfer to Billing Team",
        script: "\"I'm going to connect you with our billing specialists right now. They'll be able to access your full account details and resolve this for you. One moment, please.\"",
        actions: [
          "Warm transfer to billing",
          "Introduce patient: 'I have [Name] calling about [billing issue]. Transferring now.'",
          "Do NOT put patient on hold without telling them",
        ],
      },
      {
        title: "Disposition",
        actions: ["Log call as billing/payment inquiry", "Note that transfer was made to billing team", "Select correct disposition code"],
        disposition: true,
      },
    ],
  },
];

const colorVariants: Record<string, { card: string; badge: string; step: string }> = {
  blue: { card: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", step: "bg-blue-500" },
  teal: { card: "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30", badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300", step: "bg-teal-500" },
  purple: { card: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", step: "bg-purple-500" },
  amber: { card: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", step: "bg-amber-500" },
  green: { card: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30", badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", step: "bg-green-500" },
  rose: { card: "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", step: "bg-rose-500" },
  indigo: { card: "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", step: "bg-indigo-500" },
  orange: { card: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", step: "bg-orange-500" },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CallFlow() {
  const [selected, setSelected] = useState<CallScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNoteContent, setSavedNoteContent] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const queryClient = useQueryClient();
  const createNote = useCreateNote();

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const startScenario = useCallback((scenario: CallScenario) => {
    setSelected(scenario);
    setCurrentStep(0);
    setCheckedActions({});
    setTimerSeconds(0);
    setTimerRunning(true);
    setNotes("");
    setSavedNoteContent("");
  }, []);

  const resetAll = useCallback(() => {
    setSelected(null);
    setCurrentStep(0);
    setCheckedActions({});
    setTimerSeconds(0);
    setTimerRunning(false);
    setNotes("");
    setSavedNoteContent("");
  }, []);

  const toggleAction = useCallback((key: string) => {
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const saveNoteToApp = useCallback(() => {
    if (!notes.trim() || !selected) return;
    const content = `[Call Flow: ${selected.label}] [AHT: ${formatTime(timerSeconds)}]\n${notes.trim()}`;
    createNote.mutate(
      { data: { content } },
      {
        onSuccess: () => {
          setSavedNoteContent(content);
          queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        },
      }
    );
  }, [notes, selected, timerSeconds, createNote, queryClient]);

  const step = selected ? selected.steps[currentStep] : null;
  const isLastStep = selected ? currentStep === selected.steps.length - 1 : false;
  const isFirstStep = currentStep === 0;
  const colors = selected ? colorVariants[selected.color] : null;

  const allStepActionsDone = step
    ? step.actions.every((_, i) => checkedActions[`${currentStep}-${i}`])
    : false;

  return (
    <div className="space-y-6" data-testid="callflow-page">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Call Flow Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a scenario to get a step-by-step guide with live AHT tracking
          </p>
        </div>
        {selected && (
          <Button variant="outline" size="sm" onClick={resetAll} className="gap-1.5 shrink-0">
            <RotateCcw className="w-3.5 h-3.5" />
            New Call
          </Button>
        )}
      </div>

      {/* Scenario Selector */}
      {!selected && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Select Call Scenario</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => startScenario(s)}
                className={cn(
                  "border-2 rounded-xl p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5",
                  colorVariants[s.color].card
                )}
                data-testid={`scenario-${s.id}`}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="font-bold text-sm text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Timer className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{s.avgTime}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Call Flow */}
      {selected && step && colors && (
        <div className="grid xl:grid-cols-3 gap-5">
          {/* Main Flow Panel */}
          <div className="xl:col-span-2 space-y-4">
            {/* Scenario Header */}
            <div className={cn("border-2 rounded-xl p-4 flex items-center gap-3", colors.card)}>
              <span className="text-3xl">{selected.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-foreground">{selected.label}</h2>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", colors.badge)}>
                    Step {currentStep + 1} of {selected.steps.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selected.desc}</p>
              </div>
            </div>

            {/* Step Progress */}
            <div className="flex gap-1.5">
              {selected.steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className="flex-1 group"
                >
                  <div className={cn(
                    "h-1.5 rounded-full transition-all",
                    i < currentStep ? colors.step : i === currentStep ? colors.step : "bg-border"
                  )} />
                  <span className={cn(
                    "text-xs mt-1 block text-center truncate transition-colors",
                    i === currentStep ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}>
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Current Step Card */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0", colors.step)}>
                  {currentStep + 1}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{step.title}</h3>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Script */}
                {step.script && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">📢 Script</p>
                    <p className="text-sm text-foreground italic leading-relaxed">{step.script}</p>
                  </div>
                )}

                {/* Warning */}
                {step.warning && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-950/40 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800 dark:text-red-300 font-medium">{step.warning}</p>
                  </div>
                )}

                {/* Info */}
                {step.info && (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-950/40 dark:border-blue-800">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 dark:text-blue-300">{step.info}</p>
                  </div>
                )}

                {/* Actions Checklist */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Actions</p>
                  <div className="space-y-2">
                    {step.actions.map((action, i) => {
                      const key = `${currentStep}-${i}`;
                      const done = checkedActions[key];
                      return (
                        <button
                          key={i}
                          onClick={() => toggleAction(key)}
                          className={cn(
                            "w-full flex items-start gap-3 p-2.5 rounded-lg border text-left transition-all text-sm",
                            done
                              ? "bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800"
                              : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                            done ? "bg-green-500 border-green-500" : "border-border"
                          )}>
                            {done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={cn("leading-relaxed", done && "line-through text-muted-foreground")}>{action}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                {step.tips && step.tips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 dark:bg-amber-950/40 dark:border-amber-800">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5 uppercase tracking-wide">💡 Tips</p>
                    <ul className="space-y-1">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep((c) => c - 1)} disabled={isFirstStep} className="gap-1.5">
                  Back
                </Button>
                {allStepActionsDone && !isLastStep && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> All done
                  </span>
                )}
                {isLastStep ? (
                  <Button size="sm" onClick={resetAll} className="gap-1.5 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Complete Call
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setCurrentStep((c) => c + 1)} className="gap-1.5">
                    Next Step
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Timer + Notes */}
          <div className="space-y-4">
            {/* Live AHT Timer */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <Timer className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-foreground">AHT Timer</span>
                <span className="text-xs text-muted-foreground ml-auto">Goal: &lt; 6:00</span>
              </div>
              <div className="p-4 text-center space-y-3">
                <div className={cn(
                  "text-5xl font-mono font-bold transition-colors",
                  timerSeconds > 360 ? "text-red-500" : timerSeconds > 300 ? "text-amber-500" : "text-foreground"
                )}>
                  {formatTime(timerSeconds)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="gap-1.5"
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {timerRunning ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setTimerSeconds(0); setTimerRunning(true); }}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                </div>
                {timerSeconds > 360 && (
                  <p className="text-xs text-red-500 font-medium">⚠️ Over 6-minute AHT target</p>
                )}
                {timerSeconds > 300 && timerSeconds <= 360 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">⏱️ Approaching AHT limit</p>
                )}
              </div>
            </div>

            {/* Call Notes Panel */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-foreground">Call Notes</span>
                <span className="text-xs text-muted-foreground ml-auto">Saves to My Notes</span>
              </div>
              <div className="p-4 space-y-3">
                <Textarea
                  placeholder="Jot notes here... Patient concerns, special requests, transfer reasons, disposition details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="resize-none text-sm"
                  data-testid="call-notes-input"
                />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">Saves with scenario name + AHT</p>
                  <Button
                    size="sm"
                    onClick={saveNoteToApp}
                    disabled={!notes.trim() || createNote.isPending}
                    className="gap-1.5 shrink-0"
                    data-testid="save-call-note"
                  >
                    {createNote.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Save to Notes
                  </Button>
                </div>
                {savedNoteContent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 dark:bg-green-950/40 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Note saved to My Notes!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step Overview */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">All Steps</p>
              </div>
              <div className="p-3 space-y-1">
                {selected.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm",
                      i === currentStep ? "bg-primary/10 text-primary font-medium" : i < currentStep ? "text-muted-foreground" : "text-foreground hover:bg-muted/40"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      i < currentStep ? "bg-green-500 text-white" : i === currentStep ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                    )}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span className="truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
