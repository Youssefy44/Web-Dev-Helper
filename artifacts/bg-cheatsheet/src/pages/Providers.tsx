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
  // ── Gastroenterology & Hepatology Physicians ──
  {
    name: "Dr. Vikram Gopal",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Southside"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Board-certified in Gastroenterology. Primary location is Southside.",
      "Catherine Bailey, PA-C serves as his dedicated clinic extender.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Emily Rostholder",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Riverside", "Orange Park"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Practices out of both Riverside and Orange Park regional clinics.",
      "Corrie Baker, PA-C serves as her dedicated clinic extender.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Daniel J. Gassert",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["St. Augustine"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "St. Augustine regional hub physician.",
      "Alice Carter, APRN serves as his dedicated clinic extender.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Nicholas Agresti",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Orange Park", "Riverside"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Shared practice coverage network in Clay and Duval counties.",
      "Supported by regional extender Sheri Hayes-Raulerson, APRN.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Andrew Brown",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Orange Park", "Riverside"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Shared practice coverage network across Orange Park and Riverside.",
      "Supported by regional extender Sheri Hayes-Raulerson, APRN.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Ali Lankarani",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Orange Park", "Riverside"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Advanced therapeutic endoscopy and general GI coverage.",
      "Supported by regional extender Sheri Hayes-Raulerson, APRN.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Louis Agnone",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Volusia County regional network provider.",
      "Shares dedicated extender team: Dottie Porter, Travis Satterfield, and Marika Walker.",
    ],
    warnings: [
      "Volusia county network — track local surgical center routing strictly.",
    ],
  },
  {
    name: "Dr. Ketul Patel",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Volusia County regional network provider.",
      "Shares dedicated extender team: Dottie Porter, Travis Satterfield, and Marika Walker.",
    ],
    warnings: [
      "Volusia county network — track local surgical center routing strictly.",
    ],
  },
  {
    name: "Dr. Vrushak Deshpande",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Volusia County regional network provider.",
      "Shares dedicated extender team: Dottie Porter, Travis Satterfield, and Marika Walker.",
    ],
    warnings: [
      "Volusia county network — track local surgical center routing strictly.",
    ],
  },
  {
    name: "Dr. Kyle Etzkorn",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Southside"],
    acceptsNew: true,
    telemedAvailable: false,
    dapAvailable: true,
    schedulingNotes: [
      "Chief Medical Officer / Clinical Research Director.",
      "Check specific trial parameters if routing for clinical research slots.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Ronald Racho",
    title: "DO",
    specialty: "Gastroenterology",
    locations: ["Durbin Crossing"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Serves St. Johns county community via Durbin Crossing office context.",
    ],
    warnings: [],
  },
  {
    name: "Dr. William J. Barlow",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["St. Augustine"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Provides core GI clinical and operative services in St. Augustine.",
    ],
    warnings: [],
  },
  {
    name: "Dr. Mary Barbara",
    title: "MD",
    specialty: "Gastroenterology",
    locations: ["Nassau Crossing"],
    acceptsNew: true,
    telemedAvailable: true,
    dapAvailable: true,
    schedulingNotes: [
      "Primary local hub routing covers northern Duval and Nassau counties.",
    ],
    warnings: [],
  },

  // ── Advanced Practice Providers / Extenders ──
  {
    name: "Catherine Bailey, PA-C",
    title: "PA",
    specialty: "Gastroenterology",
    locations: ["Southside"],
    extenderOf: "Dr. Vikram Gopal",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Clinic Extender for Dr. Vikram Gopal.",
      "Can book established patients of Dr. Gopal.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Vikram Gopal.",
    ],
  },
  {
    name: "Corrie Baker, PA-C",
    title: "PA",
    specialty: "Gastroenterology",
    locations: ["Riverside", "Orange Park"],
    extenderOf: "Dr. Emily Rostholder",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Clinic Extender for Dr. Emily Rostholder.",
      "Maintains clinic schedules across both Riverside and Orange Park locations.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Emily Rostholder.",
    ],
  },
  {
    name: "Alice Carter, APRN",
    title: "NP",
    specialty: "Gastroenterology",
    locations: ["St. Augustine"],
    extenderOf: "Dr. Daniel J. Gassert",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Clinic Extender for Dr. Daniel J. Gassert.",
      "Handles localized medical management and follow-ups in St. Augustine.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Daniel J. Gassert.",
    ],
  },
  {
    name: "Sheri Hayes-Raulerson, APRN",
    title: "NP",
    specialty: "Gastroenterology",
    locations: ["Orange Park", "Riverside"],
    extenderOf: "Dr. Agresti / Dr. Brown / Dr. Lankarani",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Serves as the shared regional clinic extender for three primary physicians.",
      "Coordinates cross-coverage cases between Orange Park and Riverside.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Nicholas Agresti, Dr. Andrew Brown, Dr. Ali Lankarani.",
    ],
  },
  {
    name: "Dottie Porter, PA-C",
    title: "PA",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    extenderOf: "Dr. Agnone / Dr. K. Patel / Dr. Deshpande",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Volusia County specialized team-based extender.",
      "Manages ongoing care plans for the regional pod.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Louis Agnone, Dr. Ketul Patel, Dr. Vrushak Deshpande.",
    ],
  },
  {
    name: "Travis Satterfield, PA-C",
    title: "PA",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    extenderOf: "Dr. Agnone / Dr. K. Patel / Dr. Deshpande",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Volusia County specialized team-based extender.",
      "Ensures clinic throughput and continuity of care for the regional pod.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Louis Agnone, Dr. Ketul Patel, Dr. Vrushak Deshpande.",
    ],
  },
  {
    name: "Marika Walker, PA-C",
    title: "PA",
    specialty: "Gastroenterology",
    locations: ["Port Orange", "Ormond Beach"],
    extenderOf: "Dr. Agnone / Dr. K. Patel / Dr. Deshpande",
    acceptsNew: false,
    telemedAvailable: true,
    dapAvailable: false,
    schedulingNotes: [
      "Volusia County specialized team-based extender.",
      "Manages follow-up evaluations and treatments for the regional pod.",
    ],
    warnings: [
      "Only affiliated with the following physician(s): Dr. Louis Agnone, Dr. Ketul Patel, Dr. Vrushak Deshpande.",
    ],
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
