import { useState } from "react";
import { MapPin, AlertTriangle, Info, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const surgeryCenters = [
  { abbr: "JCE SS", name: "Jacksonville Center for Endoscopy — Southside" },
  { abbr: "JCE RS", name: "Jacksonville Center for Endoscopy — Riverside" },
  { abbr: "SAEC", name: "Saint Augustine Endoscopy Center" },
  { abbr: "OPEC", name: "Orange Park Endoscopy Center" },
  { abbr: "DSC", name: "Destin Surgery Center (Santa Rosa Beach)" },
  { abbr: "SCV", name: "Surgery Center of Volusia" },
  { abbr: "DCEC", name: "Durbin Crossing Endo Center" },
  { abbr: "NCEC", name: "Nassau Crossing Endo Center" },
];

const hospitalLocations = [
  { abbr: "BMC C", name: "Baptist Medical Center Clay" },
  { abbr: "BMC N", name: "Baptist Medical Center Nassau (Fernandina)" },
  { abbr: "BMC D", name: "Baptist Medical Center Downtown" },
  { abbr: "BMC S", name: "Baptist Medical Center South" },
  { abbr: "STV RS", name: "Saint Vincent Riverside" },
  { abbr: "STV SS", name: "Saint Vincent Southside" },
  { abbr: "STV SJ", name: "Saint Vincent Saint John" },
  { abbr: "STV C", name: "Saint Vincent Clay" },
  { abbr: "AH DB", name: "Advent Health Daytona Beach (Volusia)" },
  { abbr: "OPMC", name: "Orange Park Medical Center" },
  { abbr: "SHEC", name: "Sacred Heart Emerald Coast" },
  { abbr: "MMC", name: "Memorial Medical Center" },
];

export default function Locations() {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();

  const filteredSC = surgeryCenters.filter(
    (l) => l.abbr.toLowerCase().includes(q) || l.name.toLowerCase().includes(q)
  );
  const filteredHL = hospitalLocations.filter(
    (l) => l.abbr.toLowerCase().includes(q) || l.name.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-8" data-testid="locations-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Locations</h1>
        <p className="text-sm text-muted-foreground mt-1">Location rules, regional exceptions, and facility abbreviations</p>
      </div>

      {/* Scheduling Location Rules */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              New Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Always schedule for the location specified in the referral.</p>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs dark:bg-blue-950/40 dark:border-blue-800">
              <span className="font-semibold text-blue-800 dark:text-blue-200">Exception:</span>
              <span className="text-blue-700 dark:text-blue-300"> If patient requests a different office, schedule at alternate location. Use patient's zip code to find a convenient location within a 20-mile radius.</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-500" />
              Established Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>By default, established patients must stay in their current/existing service area.</p>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs dark:bg-blue-950/40 dark:border-blue-800">
              <span className="font-semibold text-blue-800 dark:text-blue-200">Exception:</span>
              <span className="text-blue-700 dark:text-blue-300"> You may change their location ONLY if the patient explicitly requests to switch to a different office.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Rules */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Regional Rules</h2>
        <div className="space-y-3">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Volusia Region (Port Orange, Ormond Beach, Deltona)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">All 3 practices fall under the <span className="font-medium text-foreground">Volusia South umbrella</span>. Patients must be kept within Volusia entities only.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs dark:bg-amber-950/40 dark:border-amber-800">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">Insurance Exception</p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">If insurance not accepted at Volusia → schedule at St. Augustine (if St. Augustine accepts it).</p>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs dark:bg-blue-950/40 dark:border-blue-800">
                  <p className="font-semibold text-blue-800 dark:text-blue-200">Location Change</p>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">If Volusia patient requests location change → offer St. Augustine (closest office).</p>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs dark:bg-purple-950/40 dark:border-purple-800">
                  <p className="font-semibold text-purple-800 dark:text-purple-200">Surgery Center</p>
                  <p className="text-purple-700 dark:text-purple-300 mt-1">Patients assigned to Volusia → Surgery Center of Volusia (SCV).</p>
                </div>
                <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs dark:bg-teal-950/40 dark:border-teal-800">
                  <p className="font-semibold text-teal-800 dark:text-teal-200">Long FU Exception</p>
                  <p className="text-teal-700 dark:text-teal-300 mt-1">Use Long Follow-Up if patient seen in-office between 1 and 3 years ago.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Santa Rosa Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid sm:grid-cols-2 gap-2">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs dark:bg-amber-950/40 dark:border-amber-800">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">Insurance Exception</p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">If insurance not accepted at Santa Rosa → schedule at Jacksonville office instead.</p>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs dark:bg-purple-950/40 dark:border-purple-800">
                  <p className="font-semibold text-purple-800 dark:text-purple-200">Surgery Center</p>
                  <p className="text-purple-700 dark:text-purple-300 mt-1">If insurance not accepted at Santa Rosa for procedures → Destin SC (Destin Surgery Center).</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Georgia Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Schedule at either the <span className="font-medium text-foreground">Nassau Crossing office</span> or the <span className="font-medium text-foreground">Amelia Island office (Fernandina)</span>.</p>
              <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">Proximity tip: See nearest office by mileage listed on the right side of the office name/location.</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Hospital Locations — Do NOT Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Do NOT schedule at hospital locations except for hospital employees or if there is a note.</p>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs mt-2 dark:bg-amber-950/40 dark:border-amber-800">
                <span className="font-semibold text-amber-800 dark:text-amber-200">Hospital Employees:</span>
                <span className="text-amber-700 dark:text-amber-300"> If appointment is booked at the hospital, send a task to the clinical team.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Abbreviations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Facility Abbreviations</h2>
          <input
            type="search"
            placeholder="Filter locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs border border-border rounded-md px-3 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="location-search"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Surgery / Endoscopy Centers
            </h3>
            <div className="space-y-1.5">
              {filteredSC.map(({ abbr, name }) => (
                <div key={abbr} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors" data-testid={`sc-${abbr}`}>
                  <span className="text-xs font-mono font-bold text-primary w-16 shrink-0">{abbr}</span>
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Hospital Locations
            </h3>
            <div className="space-y-1.5">
              {filteredHL.map(({ abbr, name }) => (
                <div key={abbr} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors" data-testid={`hl-${abbr}`}>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 w-16 shrink-0">{abbr}</span>
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How to Look Up Address */}
      <Card className="border-l-4 border-l-teal-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">How to Look Up Patient Address / Zip Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "From the Appointment Search Ahead screen, click on Patient (newspaper icon).",
            "Access Previous Patient.",
            "Locate the patient's Zip Code.",
            "Click on patient's name and click Find.",
            "Return to Service Location and select the convenient office based on 20-mile radius rule or mileage listed.",
          ].map((step, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-200 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
              <p className="text-muted-foreground">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
