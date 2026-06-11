import { useState } from "react";
import {
  Search,
  X,
  Users,
  Stethoscope,
  User,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { providers, specialties, type Provider, type Specialty } from "@/data/providers";

const titleColors: Record<string, string> = {
  MD: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, AGAF": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, FACP, CPI": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, FASGE": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, FACG, CPE": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, MPH": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, MS": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, JD": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, FRCP": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, MHS": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, MS, FASGE": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, MPH, FACP": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "MD, FACP, PGDCA, MBA": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  DO: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
  "DO, MS": "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
  "DO, MPH": "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
  NP: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  PA: "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200",
};

const specialtyColors: Record<string, string> = {
  Gastroenterology: "bg-primary/10 text-primary",
  Hepatology: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  "GI & Hepatology": "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
  "Bariatric & Weight Loss": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  "Diabetes & Endocrinology": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
  "Allergy & Asthma": "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
};

function getShortTitle(title: string): string {
  if (title.startsWith("MD")) return "MD";
  if (title.startsWith("DO")) return "DO";
  if (title === "NP") return "NP";
  if (title === "PA") return "PA";
  return title;
}

function ProviderCard({ provider }: { provider: Provider }) {
  const [expanded, setExpanded] = useState(false);
  const isExtender = !!provider.extenderOf;
  const hasWarnings = provider.warnings && provider.warnings.length > 0;
  const shortTitle = getShortTitle(provider.title);

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
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-foreground">{provider.name}</h3>
              <span
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded",
                  titleColors[provider.title] ?? titleColors[shortTitle] ?? "bg-muted text-muted-foreground",
                )}
              >
                {shortTitle}
              </span>
              {provider.title !== shortTitle && (
                <span className="text-xs text-muted-foreground hidden sm:inline">{provider.title.replace(/^(MD|DO), /, "")}</span>
              )}
              {isExtender && (
                <span className="text-xs text-muted-foreground italic">
                  Extender — {provider.extenderOf}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block",
                specialtyColors[provider.specialty] ?? "bg-muted text-muted-foreground",
              )}
            >
              {provider.specialty}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

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

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Scheduling Notes
            </p>
            {provider.schedulingNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
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

  const physicians = filtered.filter((p) => !p.extenderOf);
  const extenders = filtered.filter((p) => !!p.extenderOf);

  return (
    <div className="space-y-6" data-testid="providers-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          Provider Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {providers.filter(p => !p.extenderOf).length} physicians · {providers.filter(p => !!p.extenderOf).length} extenders — locations, DAP availability, and scheduling notes
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { label: "Telemed ✓", cls: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-200" },
          { label: "DAP ✓", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200" },
          { label: "New Pts ✓", cls: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200" },
          { label: "Estab Only", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
        ].map(({ label, cls }) => (
          <span key={label} className={cn("px-2 py-0.5 rounded font-medium", cls)}>{label}</span>
        ))}
        <span className="text-muted-foreground ml-1 self-center">— Click any card to expand scheduling notes</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by name, location, specialty…"
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
          >
            {s}
          </button>
        ))}
      </div>

      {search && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} provider{filtered.length !== 1 ? "s" : ""} matching "{search}"
        </p>
      )}

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

      {showExtenders && extenders.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Extenders — NP / PA ({extenders.length})
          </h2>
          <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 rounded-lg mb-3">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Extender Rule:</span> Extenders appear in bold on the schedule. You can book established patients of their supervising physician with either the doctor or the extender.
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
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No providers match "{search}"</p>
        </div>
      )}
    </div>
  );
}
