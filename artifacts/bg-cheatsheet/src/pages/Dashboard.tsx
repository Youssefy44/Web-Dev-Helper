import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  CalendarDays,
  PhoneForwarded,
  MessageSquare,
  MapPin,
  Tags,
  FileText,
  Phone,
  TrendingUp,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield,
  Users,
  Monitor,
  Search,
  Sparkles,
  XCircle,
  ArrowRight,
  Banknote,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function useClock(timeZone: string) {
  const [display, setDisplay] = useState({ time: "", period: "", date: "" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        weekday: "short",
        month: "short",
        day: "numeric",
      }).formatToParts(now);
      const hour = parts.find((p) => p.type === "hour")?.value ?? "";
      const min = parts.find((p) => p.type === "minute")?.value ?? "";
      const period = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
      const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
      const month = parts.find((p) => p.type === "month")?.value ?? "";
      const day = parts.find((p) => p.type === "day")?.value ?? "";
      setDisplay({ time: `${hour}:${min}`, period, date: `${weekday}, ${month} ${day}` });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return display;
}

const kpiGoals = [
  { metric: "Calls Per Day", goal: "60+", icon: Phone },
  { metric: "Adherence", goal: "90%", icon: TrendingUp },
  { metric: "AHT", goal: "6 min", icon: Clock },
  { metric: "Quality", goal: "90%", icon: Star },
];

const criticalRules = [
  { icon: XCircle, color: "red", label: "Balance >$1,000", action: "Cannot schedule procedure → warm transfer Collections" },
  { icon: XCircle, color: "red", label: "EGD with MiVu", action: "Do NOT cancel → warm transfer Financial Counselor" },
  { icon: XCircle, color: "red", label: "Non-DAP hospital procedure", action: "Do NOT reschedule → task clinical staff" },
  { icon: AlertTriangle, color: "amber", label: "After 3PM reschedule", action: "Warm transfer directly to the ASC" },
  { icon: AlertTriangle, color: "amber", label: "ASC cancellation", action: "Must cancel 72+ hours prior — $200 fee if late" },
  { icon: AlertTriangle, color: "amber", label: "Phreesia warning", action: "Do NOT open anything else in Phreesia" },
];

const quickRules = [
  { situation: "New patient HFU — no provider listed", action: "Post to HFU Teams Chat", type: "warning" },
  { situation: "Established HFU", action: "Schedule with established provider", type: "info" },
  { situation: "Initial EGD request", action: "Schedule office visit first", type: "warning" },
  { situation: "Initial colonoscopy — age 45–74", action: "DAP eligible — check all criteria", type: "info" },
  { situation: "Age under 45 or over 74", action: "Office visit required first", type: "warning" },
  { situation: "WeCare patients (Jax)", action: "Hoffman / Merrell / Sack / Tek only", type: "info" },
  { situation: "Wildflower charity (St. Aug)", action: "Dr. Soroka only at St. Augustine", type: "info" },
  { situation: "Waitlist request (sooner)", action: "Patient must already have appt — use Luma", type: "info" },
  { situation: "Hospital employee procedure", action: "Must schedule at their own hospital system", type: "warning" },
  { situation: "Volusia self-pay patient", action: "No new self-pay without approval + local PCP", type: "danger" },
];

const keyNumbers = [
  { label: "BG Main Line", number: "904-398-7205" },
  { label: "DAP Nurse — Sapresa", number: "904-385-5884" },
  { label: "DAP Nurse — April S.", number: "904-925-0753" },
  { label: "St. Augustine Office", number: "904-819-3800" },
  { label: "Orange Park Office", number: "904-276-5700" },
  { label: "Nocatee Office", number: "904-280-1199" },
  { label: "Santa Rosa Beach", number: "850-267-2273" },
  { label: "JCE Southside ASC", number: "904-739-0333" },
  { label: "JCE Riverside ASC", number: "904-387-6006" },
  { label: "Surgery Ctr Volusia", number: "386-760-8151" },
];

const navCards = [
  { href: "/call-flow", label: "Call Flow Builder", icon: Phone, desc: "Step-by-step guides with live AHT timer & notes", highlight: true },
  { href: "/assistant", label: "BG Assistant", icon: Sparkles, desc: "Ask any scheduling or policy question instantly", highlight: true },
  { href: "/digestive", label: "Digestive System", icon: Activity, desc: "GI conditions, symptoms, treatments & procedures", highlight: true },
  { href: "/insurance", label: "Insurance Terms", icon: Shield, desc: "Copays, deductibles, coverage, payment terms & FAQ" },
  { href: "/providers", label: "Provider Directory", icon: Users, desc: "All providers with locations, DAP status & extenders" },
  { href: "/scheduling", label: "Scheduling Rules", icon: CalendarDays, desc: "Appointment types, DAP, HFU, recall workflows" },
  { href: "/routing", label: "Department Routing", icon: PhoneForwarded, desc: "Warm/blind transfers, all departments" },
  { href: "/scripts", label: "Call Scripts", icon: MessageSquare, desc: "Opening, closing, callbacks, voicemail" },
  { href: "/locations", label: "Locations", icon: MapPin, desc: "All offices, ASCs, hospitals with addresses" },
  { href: "/system-nav", label: "System Navigation", icon: Monitor, desc: "NextGen, Talkdesk, Phreesia step-by-step guides" },
  { href: "/search", label: "Global Search", icon: Search, desc: "Search all reference content at once" },
  { href: "/disposition", label: "Disposition Codes", icon: Tags, desc: "All 14 disposition code definitions" },
  { href: "/notes", label: "My Notes", icon: FileText, desc: "Personal call notes with undo on delete" },
];

const typeColors: Record<string, string> = {
  info: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
  warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
  transfer: "bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:border-teal-800",
  danger: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800",
};

const actionColors: Record<string, string> = {
  info: "text-blue-700 dark:text-blue-300",
  warning: "text-amber-700 dark:text-amber-300",
  transfer: "text-teal-700 dark:text-teal-300",
  danger: "text-red-700 dark:text-red-300",
};

export default function Dashboard() {
  const est = useClock("America/New_York");
  const cairo = useClock("Africa/Cairo");

  return (
    <div className="space-y-8" data-testid="dashboard-page">

      {/* Header + Clocks */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Borland Groover — Patient Support Services</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">BG Main Line: 904-398-7205</p>
        </div>
        <div className="flex gap-3">
          <div className="text-right rounded-lg border border-border bg-card px-4 py-2.5 min-w-[120px]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">🇺🇸 EST</p>
            <p className="text-xl font-bold font-mono text-foreground leading-tight">
              {est.time}
              <span className="text-xs font-normal text-muted-foreground ml-1">{est.period}</span>
            </p>
            <p className="text-[11px] text-muted-foreground">{est.date}</p>
          </div>
          <div className="text-right rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 min-w-[120px]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">🇪🇬 Cairo</p>
            <p className="text-xl font-bold font-mono text-primary leading-tight">
              {cairo.time}
              <span className="text-xs font-normal text-muted-foreground ml-1">{cairo.period}</span>
            </p>
            <p className="text-[11px] text-muted-foreground">{cairo.date}</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Daily KPI Goals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiGoals.map(({ metric, goal, icon: Icon }) => (
            <Card key={metric} className="border border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground leading-none">{metric}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{goal}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">High volume days: Monday & Tuesday. AI calls occur on Mondays.</p>
      </div>

      {/* Critical Rules — Red & Amber */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-red-500" /> Critical Rules — Never Forget
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {criticalRules.map(({ icon: Icon, color, label, action }) => (
            <div
              key={label}
              className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                color === "red"
                  ? "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800"
                  : "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color === "red" ? "text-red-500" : "text-amber-500"}`} />
              <div>
                <p className={`font-semibold text-sm ${color === "red" ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300"}`}>
                  {label}
                </p>
                <p className={`text-xs mt-0.5 ${color === "red" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>
                  {action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns: Quick Rules + Key Numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Reference */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Quick Reference</h2>
          <div className="space-y-1.5">
            {quickRules.map(({ situation, action, type }) => (
              <div
                key={situation}
                className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${typeColors[type]}`}
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <span className="text-foreground font-medium text-xs">{situation}</span>
                  <span className="mx-1.5 text-muted-foreground">→</span>
                  <span className={`font-semibold text-xs ${actionColors[type]}`}>{action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Phone Numbers */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
            <Phone className="w-3 h-3" /> Key Numbers
          </h2>
          <Card className="border border-border">
            <CardContent className="p-0">
              {keyNumbers.map(({ label, number }, i) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-3 py-2 text-xs ${i < keyNumbers.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold text-foreground">{number}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Always Remember */}
          <div className="mt-4 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Always Remember</h2>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 text-xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300">Offer BG ASCs First</p>
                <p className="text-blue-700 dark:text-blue-400 mt-0.5">JCE SS/RS, SAEC, OPEC, DSC — always offer before hospital</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 text-xs">
              <Banknote className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300">ASC No-Show Fee: $200</p>
                <p className="text-blue-700 dark:text-blue-400 mt-0.5">72 hrs cancel required or fee applies</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 text-xs">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300">OV: 2–3 Days Out Min</p>
                <p className="text-blue-700 dark:text-blue-400 mt-0.5">No same-day or next-day OV appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Reference Sections</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {navCards.map(({ href, label, icon: Icon, desc, highlight }) => (
            <Link key={href} href={href}>
              <Card
                className={`border transition-all cursor-pointer group hover:shadow-md h-full ${highlight ? "border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10" : "border-border hover:border-primary/40"}`}
                data-testid={`nav-card-${label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors ${highlight ? "bg-primary/20" : "bg-primary/10"}`}>
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-xs text-foreground leading-tight">{label}</span>
                    {highlight && <Badge className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20 hidden sm:inline-flex px-1.5 py-0">New</Badge>}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
