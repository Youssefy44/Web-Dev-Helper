import { useState } from "react";
import { Tags, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const codes = [
  { code: "Appointment Confirmation", definition: "Patient called to confirm or find out about an already scheduled appointment.", color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200" },
  { code: "Canceled Appointment", definition: "Patient called to cancel their appointment or procedure.", color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200" },
  { code: "Appointment Scheduled", definition: "New or Established patient scheduled an appointment.", color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-200" },
  { code: "Appointment Rescheduled", definition: "Patient called to change date or time of a previously scheduled appointment.", color: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200" },
  { code: "Sooner Appointment / Waitlist", definition: "Patient called to request being placed on the waitlist for a sooner appointment.", color: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-200" },
  { code: "Clinical Message", definition: "Patient called to speak to someone in the office.", color: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-200" },
  { code: "Urgent Clinical Transfer", definition: "Patient transferred to Office based on Urgent List.", color: "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200" },
  { code: "Non Urgent Transfer", definition: "Patient requires non-clinical intervention from practice or other outside department, insurance inquiry. (When transferring to any department other than office or clinical.)", color: "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-200" },
  { code: "Demographics", definition: "Patient called to update any item in their demographics (name, address, insurance, HIPAA, contact preferences, email, or phone number).", color: "bg-violet-50 border-violet-200 text-violet-800 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-200" },
  { code: "Left Message", definition: "Left message for patient to call back from a call back request.", color: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-200" },
  { code: "Call Back - No Answer", definition: "Call Back request with no response or answer from patient.", color: "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-950/40 dark:border-slate-700 dark:text-slate-300" },
  { code: "Other", definition: "Any call not listed above; requires notes to describe the issue the patient called about.", color: "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/60 dark:border-gray-700 dark:text-gray-300" },
  { code: "General Inquiry", definition: "Patient called for fax or office number, address, directions, provider look up with no appointment booked; or 3rd party called inquiring about patient appointment status.", color: "bg-cyan-50 border-cyan-200 text-cyan-800 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-200" },
  { code: "Decline to Schedule", definition: "Referral patient declined to schedule an appointment.", color: "bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-950/40 dark:border-pink-800 dark:text-pink-200" },
];

export default function Disposition() {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? codes.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()) || c.definition.toLowerCase().includes(search.toLowerCase()))
    : codes;

  return (
    <div className="space-y-6" data-testid="disposition-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Disposition Codes</h1>
        <p className="text-sm text-muted-foreground mt-1">All {codes.length} disposition codes with definitions</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Filter disposition codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
          data-testid="disposition-search"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(({ code, definition, color }) => (
          <Card key={code} className={cn("border", color)} data-testid={`disposition-${code.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Tags className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                <div>
                  <p className="font-semibold text-sm leading-tight">{code}</p>
                  <p className="text-xs mt-1.5 opacity-80 leading-relaxed">{definition}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <Tags className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No codes match "{search}"</p>
        </div>
      )}
    </div>
  );
}
