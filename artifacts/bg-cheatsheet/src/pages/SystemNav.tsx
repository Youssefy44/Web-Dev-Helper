import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, MousePointer, Eye, AlertCircle, Monitor, Phone, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import step1Img from "@assets/Gemini_Generated_Image_bilcfdbilcfdbilc_1781059806125.png";
import step2Img from "@assets/Gemini_Generated_Image_hivdjrhivdjrhivd_1781059806125.png";
import step3Img from "@assets/Gemini_Generated_Image_2hvn7i2hvn7i2hvn_1781059806124.png";
import step4Img from "@assets/Gemini_Generated_Image_h7p9ath7p9ath7p9_1781059806125.png";
import step5Img from "@assets/Screenshot_2026-06-09_165358_1781060416311.png";

const BASE = import.meta.env.BASE_URL;
const navImg = (name: string) => `${BASE}nav-screenshots/${name}`;

interface StepAction {
  type: "do" | "why" | "action" | "tip" | "warning";
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

const actionConfig = {
  do: { icon: MousePointer, label: "Do this", color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200" },
  why: { icon: Eye, label: "Why", color: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-200" },
  action: { icon: CheckCircle, label: "Action", color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-200" },
  tip: { icon: AlertCircle, label: "Tip", color: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200" },
  warning: { icon: AlertCircle, label: "Warning", color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200" },
};

// ── NextGen Steps ────────────────────────────────────────────────────────────
const nextgenSteps: Step[] = [
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

// ── Talkdesk Steps ───────────────────────────────────────────────────────────
const talkdeskSteps: Step[] = [
  {
    number: 1,
    title: "Open Talkdesk & Log In",
    subtitle: "Launch the Talkdesk Agent Desktop",
    image: navImg("talkdesk_Screenshot_2026-06-09_163052.png"),
    imageAlt: "Talkdesk login screen — enter your credentials to access the agent desktop",
    intro: "Talkdesk is BG's cloud-based call center platform. You must be logged in and set to 'Available' status before you can receive calls. Open Talkdesk from your Citrix desktop or browser shortcut.",
    actions: [
      { type: "do", text: "Navigate to the Talkdesk URL or click the Talkdesk shortcut on your Citrix desktop." },
      { type: "do", text: "Enter your Talkdesk email and password credentials, then click Sign In." },
      { type: "tip", text: "Use your BG-provided Talkdesk credentials — do not share your login with anyone." },
      { type: "warning", text: "If you cannot log in, contact your supervisor — do not attempt multiple failed logins as this may lock your account." },
    ],
  },
  {
    number: 2,
    title: "Navigate the Agent Desktop",
    subtitle: "Understand the Main Interface",
    image: navImg("talkdesk_Screenshot_2026-06-09_163124.png"),
    imageAlt: "Talkdesk agent desktop showing the main interface panels",
    intro: "Once logged in, you'll see the Talkdesk Agent Desktop. The main interface has several key areas: the status bar at the top, the call queue panel on the left, and the active call area in the center.",
    actions: [
      { type: "do", text: "Familiarize yourself with the top status bar — this shows your current availability status and your name." },
      { type: "do", text: "Locate the left navigation panel — this includes Calls, Contacts, and Activity feeds." },
      { type: "why", text: "Understanding the interface layout helps you navigate quickly during live calls without putting patients on hold." },
      { type: "tip", text: "The softphone dial pad is accessible from the phone icon. You'll use this for outbound calls and transfers." },
    ],
  },
  {
    number: 3,
    title: "Set Your Status to Available",
    subtitle: "Go Ready to Receive Calls",
    image: navImg("talkdesk_Screenshot_2026-06-09_163219.png"),
    imageAlt: "Talkdesk status dropdown showing Available, Busy, Break, and other status options",
    intro: "Your status controls whether calls route to you. You must be set to 'Available' to receive inbound calls. Always set your status appropriately — this directly impacts queue wait times and adherence metrics.",
    actions: [
      { type: "do", text: "Click your current status indicator (usually showing 'Offline' or 'Away' at login) at the top of the screen." },
      { type: "do", text: "Select 'Available' from the dropdown to go ready for calls." },
      { type: "action", text: "Confirm your status shows green/Available before the start of your shift." },
      { type: "warning", text: "Never stay in 'Away' or 'Break' status when you are actually ready to take calls — this reduces the team's call capacity and affects your adherence score." },
    ],
  },
  {
    number: 4,
    title: "Answer an Incoming Call",
    subtitle: "Respond to Inbound Calls",
    image: navImg("talkdesk_Screenshot_2026-06-09_163238.png"),
    imageAlt: "Talkdesk incoming call popup showing patient caller info and Accept/Decline buttons",
    intro: "When a call comes in, a notification will pop up on your screen with the caller's phone number and queue name. Answer within the target ring time to maintain your response metrics.",
    actions: [
      { type: "do", text: "When the incoming call popup appears, click the green 'Accept' button to answer." },
      { type: "do", text: "Greet the caller immediately with your opening script: 'Thank you for calling Borland Groover, this is [name]. How can I assist you today?'" },
      { type: "tip", text: "Pull up NextGen PM before or immediately after answering so you can search the patient chart while speaking." },
      { type: "warning", text: "Do NOT let calls ring to voicemail unless you are in a status that allows it (Break, Lunch, etc.)." },
    ],
  },
  {
    number: 5,
    title: "Use Hold & Mute During Calls",
    subtitle: "Manage Active Call Controls",
    image: navImg("talkdesk_Screenshot_2026-06-09_163731.png"),
    imageAlt: "Talkdesk active call screen showing Hold, Mute, Transfer, and Keypad buttons",
    intro: "During an active call, you have several controls available at the bottom of the call panel. Know when and how to use Hold vs. Mute — they behave differently and patients experience them differently.",
    actions: [
      { type: "do", text: "Click 'Hold' to place a patient on hold with hold music — use when you need to research something or consult a supervisor." },
      { type: "do", text: "Click 'Mute' to silence your microphone — the patient can still hear hold music or silence but you can speak freely." },
      { type: "action", text: "Always tell the patient before placing them on hold: 'I'm going to place you on a brief hold — I'll be back with you in just a moment.'" },
      { type: "tip", text: "Check back with the patient every 2 minutes if on hold — never leave someone on hold more than 3 minutes without checking in." },
      { type: "warning", text: "Do NOT use Mute as a substitute for Hold — the patient may still hear background noise. Use Hold for extended pauses." },
    ],
  },
  {
    number: 6,
    title: "Transfer a Call (Warm Transfer)",
    subtitle: "Hand Off a Call to Another Department",
    image: navImg("talkdesk_Screenshot_2026-06-09_163824.png"),
    imageAlt: "Talkdesk transfer screen showing warm transfer and blind transfer options with department search",
    intro: "Warm transfers are the standard at BG. This means you call the receiving department, introduce the patient, and ensure they're connected before you drop off. Never blind transfer (send without announcing) unless explicitly required.",
    actions: [
      { type: "do", text: "Click the 'Transfer' button on the active call panel." },
      { type: "do", text: "Search for the destination (department name, extension, or queue) in the transfer search box." },
      { type: "do", text: "Select the destination and click 'Call' to ring the receiving agent while the patient is on hold." },
      { type: "action", text: "When the receiving agent answers, introduce the patient: 'Hi, I have [Patient Name] on the line calling about [reason]. I'm transferring them to you now.'" },
      { type: "action", text: "Click 'Complete Transfer' (or 'Merge + Leave') to connect the patient and drop off the call." },
      { type: "tip", text: "If the receiving department doesn't answer within 30 seconds, return to the patient and let them know — do not abandon the call." },
    ],
  },
  {
    number: 7,
    title: "View Caller History & Notes",
    subtitle: "Review Past Interactions",
    image: navImg("talkdesk_Screenshot_2026-06-09_163840.png"),
    imageAlt: "Talkdesk contact history panel showing previous call records and notes for a contact",
    intro: "Talkdesk keeps a history of previous calls for each phone number. You can view past interactions and any notes added by other agents. This helps you understand if a patient has called before and what their previous issue was.",
    actions: [
      { type: "do", text: "During or before an active call, click the caller's name or number to open their contact profile." },
      { type: "do", text: "Review the call history panel for recent interactions with that phone number." },
      { type: "do", text: "Read any notes left by previous agents — this gives context before you ask the patient to repeat themselves." },
      { type: "tip", text: "Cross-reference the Talkdesk contact history with the patient chart in NextGen for a complete picture of recent activity." },
    ],
  },
  {
    number: 8,
    title: "Add Call Notes in Talkdesk",
    subtitle: "Document the Call While Active",
    image: navImg("talkdesk_Screenshot_2026-06-09_163850.png"),
    imageAlt: "Talkdesk notes field visible during active call for adding real-time documentation",
    intro: "You can add notes to a call while it's active or after it ends. Notes are tied to the call record and are visible to supervisors and QA teams. Always document key call details — reason for call, action taken, and any transfers.",
    actions: [
      { type: "do", text: "Locate the 'Notes' or 'Call Notes' field in the active call panel (usually below the call controls)." },
      { type: "do", text: "Type brief, professional notes: reason for call, action taken, any patient concerns, transfers made." },
      { type: "action", text: "Save or submit notes before ending the call or during wrap-up." },
      { type: "tip", text: "Keep notes factual and professional — they are part of the permanent call record and visible to supervisors." },
      { type: "warning", text: "Do NOT include PHI (Protected Health Information) in Talkdesk notes beyond what is minimally necessary. Detailed clinical notes go in NextGen, not Talkdesk." },
    ],
  },
  {
    number: 9,
    title: "End the Call Properly",
    subtitle: "Hang Up and Enter Wrap-Up Mode",
    image: navImg("talkdesk_Screenshot_2026-06-09_163858.png"),
    imageAlt: "Talkdesk end call button and wrap-up mode screen showing disposition options",
    intro: "After the patient hangs up (or you end the call with their permission), Talkdesk enters Wrap-Up mode. This gives you a short window to finalize notes and select a disposition before your status returns to Available.",
    actions: [
      { type: "do", text: "Click the red 'End Call' button to terminate the active call." },
      { type: "do", text: "You will enter Wrap-Up mode automatically — a countdown timer may appear showing your wrap-up window." },
      { type: "action", text: "Use wrap-up time to: finalize Talkdesk notes, update NextGen chart, and select your disposition code." },
      { type: "warning", text: "Do not extend wrap-up time unnecessarily — prolonged ACW (After Call Work) impacts your AHT metric." },
    ],
  },
  {
    number: 10,
    title: "Select a Disposition Code",
    subtitle: "Log the Call Outcome",
    image: navImg("talkdesk_Screenshot_2026-06-09_163913.png"),
    imageAlt: "Talkdesk disposition code dropdown showing all available call outcome options",
    intro: "A disposition code classifies the outcome of each call. Selecting the correct code is essential for accurate reporting, quality assurance, and understanding call patterns. Select BEFORE you exit wrap-up mode.",
    actions: [
      { type: "do", text: "In the Wrap-Up screen, locate the 'Disposition' or 'Call Result' dropdown." },
      { type: "do", text: "Select the code that BEST describes the primary outcome of the call (e.g., Appointment Scheduled, Transferred to Billing, Patient Inquiry, Voicemail Left)." },
      { type: "action", text: "Click Save or Submit to log the disposition and close out the call record." },
      { type: "tip", text: "When in doubt about which code to use, refer to the Disposition Codes page in this app for full definitions of all 13 codes." },
      { type: "warning", text: "Do not always default to a generic 'General Inquiry' code — be specific. Accurate dispositions improve reporting and QA scoring." },
    ],
  },
  {
    number: 11,
    title: "Make an Outbound Call",
    subtitle: "Dial Out for Callbacks",
    image: navImg("talkdesk_Screenshot_2026-06-09_163925.png"),
    imageAlt: "Talkdesk dialpad for making outbound calls",
    intro: "Use Talkdesk to make outbound calls for callbacks, confirmations, or follow-ups. All outbound calls should be made through Talkdesk — not personal phones — to ensure calls are logged and recorded properly.",
    actions: [
      { type: "do", text: "Click the phone/dialpad icon in Talkdesk to open the outbound dial screen." },
      { type: "do", text: "Enter the patient's phone number (10 digits, no dashes) or search by contact name." },
      { type: "action", text: "Click the green 'Call' button to initiate the outbound call." },
      { type: "do", text: "When patient answers, identify yourself: 'Hello, this is [Name] calling from Borland Groover returning your call...'" },
      { type: "tip", text: "Always review the patient's chart in NextGen before calling back so you know the context of their previous call." },
    ],
  },
  {
    number: 12,
    title: "View Your Activity & Metrics",
    subtitle: "Monitor Your Daily Performance",
    image: navImg("talkdesk_Screenshot_2026-06-09_163946.png"),
    imageAlt: "Talkdesk activity dashboard showing call count, AHT, handle time, and availability metrics",
    intro: "Talkdesk provides a real-time dashboard of your call activity and performance metrics. Check this regularly to monitor your AHT (Average Handle Time), calls handled, and availability time.",
    actions: [
      { type: "do", text: "Click on the 'Activity' or 'My Stats' section in the left navigation panel." },
      { type: "do", text: "Review: total calls handled, average handle time (goal: 6 minutes), availability percentage (goal: 90%+)." },
      { type: "tip", text: "If your AHT is trending high, identify whether it's talk time or ACW (after-call work) that's the driver and adjust accordingly." },
      { type: "tip", text: "Your supervisor can see these metrics in real time — keeping them green keeps your QA and adherence scores strong." },
    ],
  },
];

// ── Citrix Steps ─────────────────────────────────────────────────────────────
const citrixSteps: Step[] = [
  {
    number: 1,
    title: "Open Citrix Workspace",
    subtitle: "Launch the Virtual Desktop Environment",
    image: navImg("citrix_Screenshot_2026-06-09_164337.png"),
    imageAlt: "Citrix Workspace login and launch screen",
    intro: "Citrix Workspace is the virtual desktop environment that hosts your BG applications including NextGen and Talkdesk. You must be connected to Citrix before you can access any BG systems. Open Citrix from your local desktop shortcut or browser.",
    actions: [
      { type: "do", text: "Click the Citrix Workspace icon on your desktop or navigate to the BG Citrix web URL in your browser." },
      { type: "do", text: "Enter your BG Active Directory username and password on the login screen." },
      { type: "action", text: "Click Log On / Sign In to authenticate and load your virtual desktop." },
      { type: "tip", text: "If your Citrix session has timed out, close the browser tab, reopen, and log in fresh — don't try to refresh a disconnected session." },
      { type: "warning", text: "Never share your Citrix login credentials. Each agent has their own unique login tied to HIPAA audit trails." },
    ],
  },
  {
    number: 2,
    title: "Launch Applications from Citrix",
    subtitle: "Open NextGen, Talkdesk, and Other Tools",
    image: navImg("citrix_Screenshot_2026-06-09_164504.png"),
    imageAlt: "Citrix application launcher showing BG applications including NextGen Enterprise PM",
    intro: "Once logged into Citrix, you'll see the application launcher or virtual desktop. This is where you access all your BG work applications. You will need to open NextGen Enterprise PM and Talkdesk from here to begin working.",
    actions: [
      { type: "do", text: "Locate NextGen Enterprise PM in the Citrix app launcher (it may appear as a shortcut icon labeled 'NextGen PM' or 'Enterprise PM')." },
      { type: "do", text: "Double-click the NextGen PM icon to launch the application in a new Citrix window." },
      { type: "do", text: "If Talkdesk is also accessed through Citrix, locate and open it the same way." },
      { type: "tip", text: "Arrange your Citrix windows side-by-side: NextGen on one side, Talkdesk on the other — this allows you to work in both simultaneously without constant switching." },
      { type: "tip", text: "If an application fails to launch, close it and try again. If it still fails, try logging out of Citrix and back in." },
    ],
  },
  {
    number: 3,
    title: "Handle Citrix Screen & Display Settings",
    subtitle: "Optimize Your Virtual Desktop View",
    image: navImg("citrix_Screenshot_2026-06-09_164614.png"),
    imageAlt: "Citrix virtual desktop showing fullscreen mode and display options toolbar",
    intro: "The Citrix virtual desktop can run in window mode or full-screen mode. Full-screen is usually best for productivity, as it gives you the maximum screen real estate for NextGen and Talkdesk. The Citrix toolbar appears at the top when you hover near the screen edge.",
    actions: [
      { type: "do", text: "To enter full-screen mode: hover at the very top of the screen to reveal the Citrix toolbar, then click the full-screen icon." },
      { type: "do", text: "To exit full-screen: hover at the top again and click the restore/windowed icon, or press Ctrl+F2." },
      { type: "tip", text: "If your Citrix session appears frozen or unresponsive, try moving the mouse — sometimes it's just a display refresh lag." },
      { type: "tip", text: "Use the Citrix toolbar at the top to disconnect or minimize the session without fully logging out." },
      { type: "warning", text: "Do NOT click the X to close the Citrix window unless you intend to end your session — use Disconnect to keep your session active in the background." },
    ],
  },
  {
    number: 4,
    title: "Disconnect vs. Log Off Citrix",
    subtitle: "Properly End Your Session",
    image: navImg("citrix_Screenshot_2026-06-09_164824.png"),
    imageAlt: "Citrix session end options showing Disconnect and Log Off choices",
    intro: "There's an important difference between Disconnecting and Logging Off in Citrix. Disconnect leaves your session running in the background (you can reconnect and pick up where you left off). Log Off ends your session completely.",
    actions: [
      { type: "do", text: "At the END of your shift or when fully done working: Log Off completely from the Start Menu inside the Citrix desktop." },
      { type: "do", text: "For short breaks (lunch, 15-min break): Disconnect from the Citrix toolbar — your session stays active and resumes when you return." },
      { type: "action", text: "Before disconnecting/logging off: make sure Talkdesk status is set to 'Away' or 'Break' — do NOT leave yourself as 'Available' if you're stepping away." },
      { type: "tip", text: "If you log off and leave work open in NextGen, you may lose unsaved changes — always save your work in NextGen before ending the Citrix session." },
      { type: "warning", text: "Do not leave your Citrix session connected and unattended overnight — always log off completely at the end of your shift for security compliance." },
    ],
  },
];

type SystemTab = "nextgen" | "talkdesk" | "citrix";

const tabs: { id: SystemTab; label: string; icon: typeof Monitor; steps: Step[]; desc: string }[] = [
  { id: "nextgen", label: "NextGen PM", icon: Monitor, steps: nextgenSteps, desc: "Find & open patient charts in NextGen Enterprise PM" },
  { id: "talkdesk", label: "Talkdesk", icon: Phone, steps: talkdeskSteps, desc: "Call center platform — calls, transfers, dispositions" },
  { id: "citrix", label: "Citrix", icon: Server, steps: citrixSteps, desc: "Virtual desktop access — launch and manage BG apps" },
];

function StepViewer({ steps }: { steps: Step[] }) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  return (
    <div className="space-y-4">
      {/* Step Progress Bar */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <button key={s.number} onClick={() => setCurrent(i)} className="flex-1 group">
            <div className={cn("h-1.5 rounded-full transition-all", i <= current ? "bg-primary" : "bg-border")} />
            <span className={cn("text-xs mt-1.5 block text-center font-medium transition-colors", i === current ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
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
            <img src={step.image} alt={step.imageAlt} className="w-full object-cover" />
          </div>
          <p className="text-xs text-muted-foreground text-center italic">{step.imageAlt}</p>
        </div>

        {/* Right — Instructions */}
        <div className="space-y-4">
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

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => setCurrent((c) => c - 1)} disabled={isFirst} className="gap-1.5">
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">Step {current + 1} of {steps.length}</span>
            <Button size="sm" onClick={() => setCurrent((c) => c + 1)} disabled={isLast} className="gap-1.5">
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">All Steps</p>
        <div className={cn("grid gap-3", steps.length <= 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6")}>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn("rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-md", i === current ? "border-primary shadow-md" : "border-border hover:border-primary/40")}
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
                    <span className="text-xs bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded">Now</span>
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

export default function SystemNav() {
  const [activeTab, setActiveTab] = useState<SystemTab>("nextgen");
  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6" data-testid="systemnav-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary" />
          System Navigation Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Step-by-step visual guides for NextGen PM, Talkdesk, and Citrix
        </p>
      </div>

      {/* System Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-bold",
                activeTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {tab.steps.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Description */}
      <p className="text-sm text-muted-foreground">{activeTabData.desc}</p>

      {/* Step Viewer — re-mount on tab change to reset state */}
      <StepViewer key={activeTab} steps={activeTabData.steps} />
    </div>
  );
}
