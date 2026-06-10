import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, MousePointer, Eye, AlertCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import step1Img from "@assets/Gemini_Generated_Image_bilcfdbilcfdbilc_1781059806125.png";
import step2Img from "@assets/Gemini_Generated_Image_hivdjrhivdjrhivd_1781059806125.png";
import step3Img from "@assets/Gemini_Generated_Image_2hvn7i2hvn7i2hvn_1781059806124.png";
import step4Img from "@assets/Gemini_Generated_Image_h7p9ath7p9ath7p9_1781059806125.png";
import step5Img from "@assets/Screenshot_2026-06-09_165358_1781060416311.png";

interface StepAction {
  type: "do" | "why" | "action" | "tip";
  text: string;
}

interface Tab {
  label: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  intro: string;
  actions: StepAction[];
  tabs?: Tab[];
}

const steps: Step[] = [
  {
    number: 1,
    title: "Open Enterprise PM",
    subtitle: "Launch the Practice Management System",
    image: step1Img,
    imageAlt: "NextGen Application Launcher showing Enterprise PM option highlighted",
    intro: "When you open the NextGen Application Launcher, you will see a list of available platforms. This is your starting point for all scheduling, patient lookup, and demographics work.",
    actions: [
      { type: "do", text: "Locate and click on Enterprise PM — it has a blue globe icon and is highlighted in the launcher list." },
      { type: "why", text: "Enterprise PM is the Practice Management side of NextGen. All patient scheduling, lookup, and demographics are handled here." },
      { type: "tip", text: "If you see Enterprise EHR in the list too, make sure you pick Enterprise PM — not EHR. They are different modules." },
    ],
  },
  {
    number: 2,
    title: "Access the Chart Lookup",
    subtitle: "Open the Patient Search Window",
    image: step2Img,
    imageAlt: "NextGen Enterprise PM main toolbar with the Chart icon highlighted",
    intro: "Once Enterprise PM loads, you will see a blank gray screen with a blue icon toolbar running across the top of the screen.",
    actions: [
      { type: "do", text: "Look at the top toolbar (labeled A in the screenshot) and click the Chart icon — it looks like a clipboard with a magnifying glass." },
      { type: "why", text: "Clicking this icon opens the Patient Lookup pop-up window so you can search for any patient in the system." },
      { type: "tip", text: "The Chart icon is one of the first icons on the left side of the top toolbar. If you hover over it, a tooltip will say 'Chart' or 'Patient Lookup'." },
    ],
  },
  {
    number: 3,
    title: "Enter Patient Details",
    subtitle: "Search for the Patient",
    image: step3Img,
    imageAlt: "Patient Lookup search window with Last, First/Preferred, and Birth Date fields highlighted",
    intro: "The Patient Lookup search window will pop up in the center of your screen. You can search using any single field or a combination of fields — you do not need to fill in everything.",
    actions: [
      { type: "do", text: "Type the patient's last name in the 'Last' box (first red arrow)." },
      { type: "do", text: "Type the patient's first name in the 'First / Preferred' box." },
      { type: "do", text: "Type their date of birth in the 'Birth Date' box using format: MM/DD/YYYY (second red arrow)." },
      { type: "action", text: "Click the Find button at the bottom of the pop-up window to run the search." },
      { type: "tip", text: "You can search with just Last Name + Date of Birth if you don't know the full first name. The more fields you fill in, the more specific your results will be." },
    ],
  },
  {
    number: 4,
    title: "Select and Open Patient Chart",
    subtitle: "Verify Identity and Open the Record",
    image: step4Img,
    imageAlt: "Patient Lookup showing Matching Records list with a patient highlighted and Open button visible",
    intro: "After clicking Find, the system will display all matching results in the Matching Records section below the search fields. You may see one result or several — always verify before opening.",
    actions: [
      { type: "do", text: "Look at the Matching Records section (labeled B). Check that the Name, Birth Date, and Address match your patient." },
      { type: "do", text: "Click on the correct patient's row to highlight it in blue — as shown with 'Ellis, Taylor' in the screenshot." },
      { type: "action", text: "Click the Open button (labeled C) at the bottom right of the window to open the full patient chart." },
      { type: "tip", text: "Always verify name, DOB, and address before opening — there may be patients with similar names. 'Records Found: 1' shown bottom-right confirms only one match." },
    ],
  },
  {
    number: 5,
    title: "Navigate the Patient Chart",
    subtitle: "Explore the Chart Tabs",
    image: step5Img,
    imageAlt: "Patient chart for Ellis, Taylor showing Demographics tab and navigation tabs at the bottom",
    intro: "The patient's chart is now loaded! You are automatically brought to the primary information view. Use the tabs across the middle of the screen to navigate different parts of their record.",
    actions: [
      { type: "tip", text: "Each tab gives you a different section of the patient's account. Start with Demographics to confirm you have the right patient." },
    ],
    tabs: [
      { label: "Tab A — Demographics (Default)", description: "This is the view that opens first. It displays the patient's full address, primary care physician, age, telephone numbers, and preferred pharmacy details. Always confirm key info here first." },
      { label: "Tab B — Encounters", description: "Click this tab to view the patient's full appointment and visit history. You can see the facility location, rendering provider, and associated insurance for each encounter." },
      { label: "Tab C — Clinical History / Notes", description: "Opens the clinical tree on the left side. From here you can toggle through specialized categories including diagnoses, medications, test results, and clinical notes." },
      { label: "Tab D — Insurance / Account", description: "Displays the patient's active insurance plans, account balance, and billing information. Use this tab to verify coverage details or check for outstanding balances." },
    ],
  },
];

const actionConfig = {
  do: { icon: MousePointer, label: "Do this", color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200" },
  why: { icon: Eye, label: "Why", color: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-200" },
  action: { icon: CheckCircle, label: "Action", color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-200" },
  tip: { icon: AlertCircle, label: "Tip", color: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200" },
};

export default function SystemNav() {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  return (
    <div className="space-y-6" data-testid="systemnav-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary" />
          System Navigation Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Step-by-step walkthrough for NextGen Enterprise PM — finding and opening patient charts
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.number}
            onClick={() => setCurrent(i)}
            className="flex-1 group"
            data-testid={`step-nav-${i}`}
          >
            <div className={cn(
              "h-1.5 rounded-full transition-all",
              i < current ? "bg-primary" : i === current ? "bg-primary" : "bg-border"
            )} />
            <span className={cn(
              "text-xs mt-1.5 block text-center font-medium transition-colors",
              i === current ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Step Card */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Screenshot */}
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-muted/30">
            <img
              src={step.image}
              alt={step.imageAlt}
              className="w-full object-cover"
              data-testid={`step-image-${current}`}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center italic">{step.imageAlt}</p>
        </div>

        {/* Right — Instructions */}
        <div className="space-y-4">
          {/* Step badge + title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                {step.number}
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground leading-tight">{step.title}</h2>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.intro}</p>
          </div>

          {/* Action cards */}
          <div className="space-y-2">
            {step.actions.map((action, i) => {
              const cfg = actionConfig[action.type];
              const Icon = cfg.icon;
              return (
                <div key={i} className={cn("flex items-start gap-3 border rounded-lg px-3 py-2.5 text-sm", cfg.color)}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold mr-1">{cfg.label}:</span>
                    <span>{action.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs (Step 5 only) */}
          {step.tabs && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Chart Navigation Tabs</p>
              {step.tabs.map((tab, i) => (
                <div key={i} className="border border-border rounded-lg p-3 bg-card">
                  <p className="text-sm font-semibold text-foreground mb-1">{tab.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tab.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrent((c) => c - 1)}
              disabled={isFirst}
              className="gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Step {current + 1} of {steps.length}
            </span>
            <Button
              size="sm"
              onClick={() => setCurrent((c) => c + 1)}
              disabled={isLast}
              className="gap-1.5"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Step Overview Thumbnails */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">All Steps</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-md",
                i === current ? "border-primary shadow-md" : "border-border hover:border-primary/40"
              )}
              data-testid={`step-thumb-${i}`}
            >
              <div className="relative">
                <img src={s.image} alt={`Step ${s.number} thumbnail`} className="w-full aspect-video object-cover object-top" />
                {i < current && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                )}
                {i === current && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-xs bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded">Current</span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-card">
                <p className="text-xs font-semibold text-foreground truncate">Step {s.number}</p>
                <p className="text-xs text-muted-foreground truncate">{s.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
