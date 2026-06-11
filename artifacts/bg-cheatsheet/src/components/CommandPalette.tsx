import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, Calendar, PhoneForwarded, FileText, MapPin, Tags, Activity, Shield, Phone, User, Stethoscope, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { providers } from "@/data/providers";

interface SearchResult {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ElementType;
}

const STATIC_RESULTS: SearchResult[] = [
  // Navigation
  { id: "nav-dashboard", category: "Navigation", title: "Dashboard", subtitle: "Command center overview", href: "/", icon: FileText },
  { id: "nav-call-flow", category: "Navigation", title: "Call Flow Builder", subtitle: "Step-by-step guides with AHT timer", href: "/call-flow", icon: Phone },
  { id: "nav-digestive", category: "Navigation", title: "Digestive System", subtitle: "GI conditions, symptoms, treatments", href: "/digestive", icon: Activity },
  { id: "nav-insurance", category: "Navigation", title: "Insurance Terms", subtitle: "Copays, deductibles, coverage, FAQ", href: "/insurance", icon: Shield },
  { id: "nav-scheduling", category: "Navigation", title: "Scheduling Rules", subtitle: "Appointment types, workflows", href: "/scheduling", icon: Calendar },
  { id: "nav-routing", category: "Navigation", title: "Department Routing", subtitle: "Warm/blind transfers, all departments", href: "/routing", icon: PhoneForwarded },
  { id: "nav-scripts", category: "Navigation", title: "Call Scripts", subtitle: "Opening, closing, callbacks, voicemail", href: "/scripts", icon: FileText },
  { id: "nav-locations", category: "Navigation", title: "Locations", subtitle: "Region rules, abbreviations", href: "/locations", icon: MapPin },
  { id: "nav-disposition", category: "Navigation", title: "Disposition Codes", subtitle: "All 14 disposition code definitions", href: "/disposition", icon: Tags },
  { id: "nav-providers", category: "Navigation", title: "Provider Directory", subtitle: "Physicians, extenders, scheduling notes", href: "/providers", icon: Stethoscope },
  { id: "nav-system-nav", category: "Navigation", title: "System Navigation", subtitle: "NextGen, Talkdesk, Citrix guides", href: "/system-nav", icon: FileText },
  { id: "nav-notes", category: "Navigation", title: "My Notes", subtitle: "Personal reference notes", href: "/notes", icon: FileText },
  { id: "nav-assistant", category: "Navigation", title: "BG Assistant", subtitle: "Local knowledge base Q&A", href: "/assistant", icon: FileText },

  // Quick Reference — Scheduling
  { id: "sched-follow-up", category: "Scheduling", title: "Follow-Up vs Long Follow-Up", subtitle: "< 1 yr = FU, > 1 yr = LFU", href: "/scheduling", icon: Calendar },
  { id: "sched-dap", category: "Scheduling", title: "DAP Colonoscopy Rules", subtitle: "Age 45–74, screening, questionnaire, referral", href: "/scheduling", icon: Calendar },
  { id: "sched-egd", category: "Scheduling", title: "EGD / Upper Endoscopy Rules", subtitle: "Never schedule initial EGD directly", href: "/scheduling", icon: Calendar },
  { id: "sched-hfu", category: "Scheduling", title: "Hospital Follow-Up (HFU)", subtitle: "90-day rule, established vs new patient", href: "/scheduling", icon: Calendar },
  { id: "sched-waitlist", category: "Scheduling", title: "Waitlist Rules", subtitle: "OV only, must already have appt", href: "/scheduling", icon: Calendar },
  { id: "sched-reschedule-ov", category: "Scheduling", title: "Rescheduling OV", subtitle: "Expected status, 1-hour rule, <24hr cancel", href: "/scheduling", icon: Calendar },
  { id: "sched-reschedule-proc", category: "Scheduling", title: "Rescheduling Procedures", subtitle: "Before vs after 3:00 PM rule", href: "/scheduling", icon: Calendar },
  { id: "sched-recall", category: "Scheduling", title: "Recall Rules", subtitle: "Colonoscopy & EGD recall requirements", href: "/scheduling", icon: Calendar },

  // Routing
  { id: "route-billing", category: "Routing", title: "Collections / Billing", subtitle: "Balance, refunds, $1K+ rule → Warm Transfer", href: "/routing", icon: PhoneForwarded },
  { id: "route-allergy", category: "Routing", title: "Allergy Dept (Dr. Watkins)", subtitle: "NEVER reschedule/cancel → Warm Transfer", href: "/routing", icon: PhoneForwarded },
  { id: "route-insurance", category: "Routing", title: "Pre-Cert / Insurance", subtitle: "Auth, prior auth, insurance → Warm Transfer", href: "/routing", icon: PhoneForwarded },
  { id: "route-imaging", category: "Routing", title: "Imaging", subtitle: "MRI, CT, Ultrasound → Blind Transfer", href: "/routing", icon: PhoneForwarded },
  { id: "route-infusion", category: "Routing", title: "Infusion / Remicade", subtitle: "Warm Transfer; B12/Iron → Clinical Message", href: "/routing", icon: PhoneForwarded },
  { id: "route-clinical", category: "Routing", title: "Clinical Messaging", subtitle: "Lab results, meds (SLA: 24hr)", href: "/routing", icon: PhoneForwarded },
  { id: "route-financial", category: "Routing", title: "Financial Counselor", subtitle: "Email FinancialCounselors@borlandgroover.com", href: "/routing", icon: PhoneForwarded },

  // Scripts
  { id: "script-opening", category: "Scripts", title: "Opening Script", subtitle: "Thank you for calling Borland Groover…", href: "/scripts", icon: FileText },
  { id: "script-closing", category: "Scripts", title: "Closing Script", subtitle: "Thank you for calling Borland Groover…", href: "/scripts", icon: FileText },
  { id: "script-voicemail", category: "Scripts", title: "Voicemail Script", subtitle: "…call back at 904-398-7205…", href: "/scripts", icon: FileText },
  { id: "script-warm-transfer", category: "Scripts", title: "Warm Transfer Script", subtitle: "Intro to department & patient", href: "/scripts", icon: FileText },

  // Disposition Codes
  { id: "disp-scheduled", category: "Disposition", title: "Appointment Scheduled", subtitle: "New or established patient scheduled", href: "/disposition", icon: Tags },
  { id: "disp-rescheduled", category: "Disposition", title: "Appointment Rescheduled", subtitle: "Patient changed date or time", href: "/disposition", icon: Tags },
  { id: "disp-cancelled", category: "Disposition", title: "Canceled Appointment", subtitle: "Patient called to cancel", href: "/disposition", icon: Tags },
  { id: "disp-clinical", category: "Disposition", title: "Clinical Message", subtitle: "Patient called to speak to office", href: "/disposition", icon: Tags },
  { id: "disp-non-urgent", category: "Disposition", title: "Non Urgent Transfer", subtitle: "Insurance inquiry or non-clinical", href: "/disposition", icon: Tags },
  { id: "disp-demographics", category: "Disposition", title: "Demographics", subtitle: "Update demographics in chart", href: "/disposition", icon: Tags },
  { id: "disp-general", category: "Disposition", title: "General Inquiry", subtitle: "Fax/office number, directions, provider lookup", href: "/disposition", icon: Tags },

  // GI Conditions
  { id: "cond-gerd", category: "Conditions", title: "GERD", subtitle: "Gastroesophageal Reflux Disease", href: "/digestive", icon: Activity },
  { id: "cond-ibd", category: "Conditions", title: "IBD — Crohn's & UC", subtitle: "Inflammatory Bowel Disease", href: "/digestive", icon: Activity },
  { id: "cond-colorectal", category: "Conditions", title: "Colorectal Cancer", subtitle: "Screening, DAP eligibility, procedures", href: "/digestive", icon: Activity },
  { id: "cond-hepatitis", category: "Conditions", title: "Hepatitis (B & C)", subtitle: "Requires OV first — liver referral", href: "/digestive", icon: Activity },
  { id: "cond-celiac", category: "Conditions", title: "Celiac Disease", subtitle: "Gluten-related autoimmune disorder", href: "/digestive", icon: Activity },
  { id: "cond-cirrhosis", category: "Conditions", title: "Cirrhosis / Fatty Liver", subtitle: "NASH, MASLD — requires OV first", href: "/digestive", icon: Activity },
  { id: "cond-ibs", category: "Conditions", title: "IBS / Functional Bowel", subtitle: "Irritable Bowel Syndrome", href: "/digestive", icon: Activity },
  { id: "cond-polyps", category: "Conditions", title: "Colorectal Polyps", subtitle: "Recall after colonoscopy", href: "/digestive", icon: Activity },

  // Insurance Terms
  { id: "ins-deductible", category: "Insurance Terms", title: "Deductible", subtitle: "Amount paid before insurance starts", href: "/insurance", icon: Shield },
  { id: "ins-copay", category: "Insurance Terms", title: "Copay (Copayment)", subtitle: "Fixed dollar amount per visit", href: "/insurance", icon: Shield },
  { id: "ins-coinsurance", category: "Insurance Terms", title: "Coinsurance", subtitle: "% you pay AFTER meeting deductible", href: "/insurance", icon: Shield },
  { id: "ins-oop", category: "Insurance Terms", title: "Out-of-Pocket Maximum", subtitle: "Most you'll pay in a year", href: "/insurance", icon: Shield },
  { id: "ins-prior-auth", category: "Insurance Terms", title: "Prior Authorization", subtitle: "Pre-approval required for services", href: "/insurance", icon: Shield },
  { id: "ins-hmo", category: "Insurance Terms", title: "HMO vs PPO", subtitle: "Network and referral requirements", href: "/insurance", icon: Shield },

  // Call Flows
  { id: "flow-new-patient", category: "Call Flows", title: "New Patient Call Flow", subtitle: "5–7 min, collect demographics + schedule", href: "/call-flow", icon: Phone },
  { id: "flow-hfu", category: "Call Flows", title: "Hospital Follow-Up (HFU) Flow", subtitle: "5–8 min, check hospital encounter first", href: "/call-flow", icon: Phone },
  { id: "flow-insurance", category: "Call Flows", title: "Insurance Question Flow", subtitle: "3–5 min, warm transfer to Pre-Cert", href: "/call-flow", icon: Phone },
  { id: "flow-cancel", category: "Call Flows", title: "Cancel / Reschedule Flow", subtitle: "3–5 min, check status before rescheduling", href: "/call-flow", icon: Phone },
  { id: "flow-billing", category: "Call Flows", title: "Billing / Payment Flow", subtitle: "3–5 min, $1K+ rule, warm transfer", href: "/call-flow", icon: Phone },
];

function buildProviderResults(): SearchResult[] {
  return providers.map((p) => ({
    id: `provider-${p.name.toLowerCase().replace(/[\s.,]/g, "-")}`,
    category: "Providers",
    title: p.name,
    subtitle: `${p.title} — ${p.locations.join(", ")}${p.extenderOf ? ` (Extender: ${p.extenderOf})` : ""}`,
    href: "/providers",
    icon: p.extenderOf ? User : Stethoscope,
  }));
}

const ALL_RESULTS: SearchResult[] = [...STATIC_RESULTS, ...buildProviderResults()];

function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  const words = q.split(/\s+/);
  let score = 0;
  for (const w of words) {
    if (w.length > 1 && t.includes(w)) score += 30;
  }
  return score;
}

function searchResults(query: string): SearchResult[] {
  if (!query.trim()) return ALL_RESULTS.slice(0, 12);
  const q = query.toLowerCase().trim();
  return ALL_RESULTS
    .map((r) => {
      const titleScore = fuzzyScore(r.title, q) * 2;
      const subtitleScore = r.subtitle ? fuzzyScore(r.subtitle, q) : 0;
      const categoryScore = fuzzyScore(r.category, q) * 0.5;
      return { result: r, score: titleScore + subtitleScore + categoryScore };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((x) => x.result);
}

const CATEGORY_ORDER = ["Navigation", "Providers", "Scheduling", "Call Flows", "Routing", "Scripts", "Conditions", "Insurance Terms", "Disposition"];

const CATEGORY_COLORS: Record<string, string> = {
  Navigation: "text-primary bg-primary/10",
  Providers: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  Scheduling: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  "Call Flows": "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
  Routing: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40",
  Scripts: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/40",
  Conditions: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40",
  "Insurance Terms": "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40",
  Disposition: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40",
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = searchResults(query);

  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const items = results.filter((r) => r.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  const flatResults = Object.values(grouped).flat();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      navigate(href);
      onClose();
    },
    [navigate, onClose],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = flatResults[activeIdx];
        if (target) handleSelect(target.href);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flatResults, activeIdx, handleSelect, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  let flatIdx = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
      onClick={onClose}
      data-testid="command-palette"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl mx-4 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search providers, rules, scripts, conditions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            data-testid="cmd-input"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono hidden sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {flatResults.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No results for "{query}"
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-1">
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {category}
                </span>
              </div>
              {items.map((item) => {
                const currentIdx = flatIdx++;
                const isActive = currentIdx === activeIdx;
                const Icon = item.icon;
                const colorClass = CATEGORY_COLORS[item.category] ?? "text-muted-foreground bg-muted";
                return (
                  <button
                    key={item.id}
                    data-idx={currentIdx}
                    onClick={() => handleSelect(item.href)}
                    onMouseEnter={() => setActiveIdx(currentIdx)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      isActive ? "bg-primary/8 dark:bg-primary/15" : "hover:bg-muted/50",
                    )}
                    data-testid={`cmd-result-${item.id}`}
                  >
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                      )}
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span><kbd className="font-mono border border-border rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono border border-border rounded px-1">↵</kbd> open</span>
          <span><kbd className="font-mono border border-border rounded px-1">ESC</kbd> close</span>
          <span className="ml-auto">{flatResults.length} results</span>
        </div>
      </div>
    </div>
  );
}
