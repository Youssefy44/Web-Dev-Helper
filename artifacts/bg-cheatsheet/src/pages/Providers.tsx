import { useState } from "react";
import {
  Search,
  X,
  Users,
  Stethoscope,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProviderType = "MD" | "DO" | "NP" | "PA";
type Specialty =
  | "Gastroenterology"
  | "Allergist"
  | "Hepatology"
  | "GI & Hepatology"
  | "Bariatric & Weight Loss"
  | "Diabetes & Endocrinology";

interface Provider {
  name: string;
  title: ProviderType;
  specialty: Specialty;
  locations: string[];
  extenderOf?: string;
  schedulingNotes: string[];
  acceptsNew: boolean;
  telemedAvailable: boolean;
  dapAvailable: boolean;
  preferredApptLength?: string;
  warnings?: string[];
}

const providers: Provider[] = [
  // ── Gastroenterology ──
  {
    name: "Dr. Borland",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Downtown", "Riverside"],
    acceptsNew: true,
    telemedAvailable: false,
    dapAvailable: true,
    schedulingNotes: [
      "Check SharePoint cheat sheet for current open slots.",
      "New patients: use New Patient Consult event type.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Groover",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Southside", "Mandarin"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Telemedicine available for follow-up and long follow-up visits.",
      "DAP colonoscopies available — confirm eligibility before scheduling.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Patel",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Southside", "Fleming Island"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Accepts new GI patients with referral.",
      "Telemed available for established patients.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Shah",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Northside", "Nassau Crossing"],
    acceptsNew: true,
    telemedAvailable: false,
    dapAvailable: true,
    schedulingNotes: [
      "Strong preference for fax referrals before scheduling new patients.",
      "Nassau Crossing days: check schedule carefully.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Kim",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Southside", "St. Augustine"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "St. Augustine office — confirm days before booking.",
      "Telemed available for all visit types.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Martinez",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Riverside", "Orange Park"],
    acceptsNew: true,
    telemedAvailable: false,
    dapAvailable: true,
    schedulingNotes: [
      "Orange Park days: Tuesday and Thursday only.",
      "Verify day of week before booking at Orange Park.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Thompson",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Mandarin", "Fleming Island"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "No DAP — all colonoscopies must be scheduled after office visit.",
      "Telemed available for follow-up visits.",
    ],
    warnings: ["No DAP colonoscopies — OV required first."],
  },
  {
    name: "Dr. Williams",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Northside", "Amelia Island"],
    acceptsNew: true,
    telemedAvailable: false,
    dapAvailable: true,
    schedulingNotes: [
      "Amelia Island (Fernandina) — primary location for Georgia patients.",
      "DAP available — verify eligibility.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Anderson",
    title: "DO",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Volusia region provider — keep patients within Volusia entities.",
      "Long Follow-Up applies if seen 1–3 years ago (Volusia exception).",
    ],
    warnings: ["Volusia region — do NOT transfer to non-Volusia offices."],
  },
  {
    name: "Dr. Davis",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Deltona", "Port Orange"],
    acceptsNew: true,
    telemedAvailable: false,
    dapAvailable: true,
    schedulingNotes: [
      "Volusia South region — both Deltona and Port Orange locations.",
      "SCV (Surgery Center of Volusia) for all procedures.",
    ],
    warnings: ["Volusia region — do NOT transfer to non-Volusia offices."],
  },
  {
    name: "Dr. Watkins",
    title: "MD",
    specialty: "Allergist",
    locations: ["Allergy Clinic"],
    acceptsNew: false,
    telemedAvailable: false,
    dapAvailable: false,
    schedulingNotes: [
      "ALLERGY ONLY — this provider is NOT a GI provider.",
      "Do NOT reschedule, cancel, or touch appointments for Dr. Watkins.",
      "Any allergy-related calls → WARM TRANSFER to Allergy department.",
    ],
    warnings: [
      "NEVER reschedule or cancel appointments for Dr. Watkins.",
      "Warm transfer ALL calls to the Allergy department — do not schedule.",
    ],
  },

  // ── Hepatology ──
  {
    name: "Dr. Nguyen",
    title: "MD",
    specialty: "Hepatology",
    locations: ["Downtown", "Southside"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Liver/Hepatology specialist — use Liver/Specialty event type.",
      "Patient must bring all medical records to first visit.",
      "Accepts: Hepatitis B/C, Cirrhosis, Fatty Liver, NASH/MASLD, Elevated LFTs, Liver Lesions.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Jackson",
    title: "MD",
    specialty: "GI & Hepatology",
    locations: ["Southside", "Riverside"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Treats both general GI and liver conditions.",
      "Telemed available for follow-up and liver consults.",
      "For liver referrals: use Liver/Specialty event type.",
    ],
    warnings: [],
  },

  // ── Weight Loss / Bariatric ──
  {
    name: "Dr. Robinson",
    title: "MD",
    specialty: "Bariatric & Weight Loss",
    locations: ["Southside", "Mandarin"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Diabetes and Weight Loss program — falls under GI scope.",
      "Telemed widely available for this specialty.",
      "No DAP — procedure referrals go through office visit first.",
    ],
    warnings: [],
  },

  // ── Extenders (NPs / PAs) ──
  {
    name: "Sarah Mitchell, NP",
    title: "NP",
    specialty: "Gastroenterology",
    locations: ["Southside", "Mandarin"],
    extenderOf: "Dr. Groover",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Extender for Dr. Groover — appears in bold on the schedule.",
      "Can see established patients of Dr. Groover.",
      "Cannot schedule new patients independently.",
    ],
    warnings: [],
  },
  {
    name: "James Carter, PA-C",
    title: "PA",
    specialty: "Gastroenterology",
    locations: ["Riverside", "Orange Park"],
    extenderOf: "Dr. Martinez",
    acceptsNew: false,
    telemedAvailable: false,
    dapAvailable: false,
    schedulingNotes: [
      "Extender for Dr. Martinez — appears in bold on the schedule.",
      "Can see established patients of Dr. Martinez.",
      "Orange Park days only: Tuesday and Thursday.",
    ],
    warnings: [],
  },
  {
    name: "Lisa Chen, NP",
    title: "NP",
    specialty: "Gastroenterology",
    locations: ["Downtown", "Northside"],
    extenderOf: "Dr. Shah",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Extender for Dr. Shah — appears in bold on the schedule.",
      "Telemed available for established patients.",
    ],
    warnings: [],
  },
  {
    name: "Marcus Webb, PA-C",
    title: "PA",
    specialty: "GI & Hepatology",
    locations: ["Southside"],
    extenderOf: "Dr. Jackson",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Extender for Dr. Jackson — appears in bold on the schedule.",
      "Handles both GI and liver follow-up appointments.",
    ],
    warnings: [],
  },
];

const specialties: Specialty[] = [
  "Gastroenterology",
  "Hepatology",
  "GI & Hepatology",
  "Bariatric & Weight Loss",
  "Diabetes & Endocrinology",
];

const titleColors: Record<ProviderType, string> = {
  MD: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  DO: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
  NP: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  PA: "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200",
};

const specialtyColors: Record<string, string> = {
  Gastroenterology: "bg-primary/10 text-primary",
  Hepatology:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  "GI & Hepatology":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
  "Bariatric & Weight Loss":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  "Diabetes & Endocrinology":
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
};

function ProviderCard({ provider }: { provider: Provider }) {
  const [expanded, setExpanded] = useState(false);
  const isExtender = !!provider.extenderOf;
  const hasWarnings = provider.warnings && provider.warnings.length > 0;

  return (
    <Card
      className={cn(
        "border transition-all",
        hasWarnings
          ? "border-l-4 border-l-red-400"
          : isExtender
            ? "border-l-4 border-l-purple-400"
            : "border-l-4 border-l-primary",
      )}
      data-testid={`provider-${provider.name.toLowerCase().replace(/[\s.,]/g, "-")}`}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-foreground">
                {provider.name}
              </h3>
              <span
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded",
                  titleColors[provider.title],
                )}
              >
                {provider.title}
              </span>
              {isExtender && (
                <span className="text-xs text-muted-foreground italic">
                  Extender — {provider.extenderOf}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block",
                specialtyColors[provider.specialty] ??
                  "bg-muted text-muted-foreground",
              )}
            >
              {provider.specialty}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
            data-testid={`provider-expand-${provider.name.toLowerCase().replace(/[\s.,]/g, "-")}`}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Warnings */}
        {hasWarnings && (
          <div className="space-y-1 mb-3">
            {provider.warnings!.map((w, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded px-2 py-1.5"
              >
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                <span className="font-medium">{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Location + quick flags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{provider.locations.join(", ")}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {provider.telemedAvailable && (
              <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-200 font-medium">
                Telemed ✓
              </span>
            )}
            {provider.dapAvailable && (
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200 font-medium">
                DAP ✓
              </span>
            )}
            {provider.acceptsNew && (
              <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200 font-medium">
                New Pts ✓
              </span>
            )}
            {!provider.acceptsNew && (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium">
                Estab Only
              </span>
            )}
          </div>
        </div>

        {/* Expanded scheduling notes */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Scheduling Notes
            </p>
            {provider.schedulingNotes.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="text-primary mt-0.5">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Providers() {
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string>("All");
  const [showExtenders, setShowExtenders] = useState(true);

  const q = search.toLowerCase();

  const filtered = providers.filter((p) => {
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.locations.some((l) => l.toLowerCase().includes(q)) ||
      p.schedulingNotes.some((n) => n.toLowerCase().includes(q)) ||
      (p.extenderOf?.toLowerCase().includes(q) ?? false);

    const matchSpecialty =
      activeSpecialty === "All" || p.specialty === activeSpecialty;
    const matchExtender = showExtenders || !p.extenderOf;

    return matchSearch && matchSpecialty && matchExtender;
  });

  const physicians = filtered.filter(
    (p) => p.title === "MD" || p.title === "DO",
  );
  const extenders = filtered.filter(
    (p) => p.title === "NP" || p.title === "PA",
  );

  return (
    <div className="space-y-6" data-testid="providers-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Provider Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          BG physicians by specialty — locations, DAP availability, and
          scheduling preferences
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          {
            label: "Telemed ✓",
            cls: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-200",
          },
          {
            label: "DAP ✓",
            cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200",
          },
          {
            label: "New Pts ✓",
            cls: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200",
          },
          {
            label: "Estab Only",
            cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
          },
        ].map(({ label, cls }) => (
          <span
            key={label}
            className={cn("px-2 py-0.5 rounded font-medium", cls)}
          >
            {label}
          </span>
        ))}
        <span className="text-muted-foreground ml-1 self-center">
          — Click any card to expand scheduling notes
        </span>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by name, location, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
            data-testid="provider-search"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowExtenders(!showExtenders)}
          className={cn(
            "text-xs px-3 py-2 rounded-md border font-medium transition-colors whitespace-nowrap",
            showExtenders
              ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/60 dark:text-purple-200 dark:border-purple-700"
              : "bg-muted text-muted-foreground border-border",
          )}
          data-testid="toggle-extenders"
        >
          {showExtenders ? "Hide Extenders" : "Show Extenders"}
        </button>
      </div>

      {/* Specialty filters */}
      <div className="flex flex-wrap gap-2">
        {["All", ...specialties].map((s) => (
          <button
            key={s}
            onClick={() => setActiveSpecialty(s)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
              activeSpecialty === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
            )}
            data-testid={`specialty-filter-${s.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} provider{filtered.length !== 1 ? "s" : ""} matching
          "{search}"
        </p>
      )}

      {/* Physicians */}
      {physicians.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5" />
            Physicians ({physicians.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {physicians.map((p) => (
              <ProviderCard key={p.name} provider={p} />
            ))}
          </div>
        </div>
      )}

      {/* Extenders */}
      {showExtenders && extenders.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Extenders — NP / PA ({extenders.length})
          </h2>
          <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 rounded-lg mb-3">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Extender Rule:</span> Extenders
              appear in bold on the schedule. You can book established patients
              of their supervising physician with either the doctor or the
              extender.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {extenders.map((p) => (
              <ProviderCard key={p.name} provider={p} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No providers match your search</p>
          <p className="text-xs mt-1">
            Try a different name, location, or specialty
          </p>
        </div>
      )}
    </div>
  );
}
