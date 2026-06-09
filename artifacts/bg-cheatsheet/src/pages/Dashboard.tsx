import { Link } from "wouter";
import { CalendarDays, PhoneForwarded, MessageSquare, MapPin, Tags, FileText, Phone, TrendingUp, Clock, Star, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const kpiGoals = [
  { metric: "Calls Per Day", goal: "60+", icon: Phone },
  { metric: "Adherence", goal: "90%", icon: TrendingUp },
  { metric: "AHT", goal: "6 min", icon: Clock },
  { metric: "Quality", goal: "90%", icon: Star },
];

const quickRules = [
  { situation: "New patient + HFU + provider listed", action: "Schedule with listed provider", type: "info" },
  { situation: "New patient + HFU + no provider", action: "Contact Hospital Follow-Up Team", type: "warning" },
  { situation: "Established patient + HFU", action: "Schedule with established provider", type: "info" },
  { situation: "Insurance questions", action: "Transfer to Insurance Team", type: "transfer" },
  { situation: "Initial colonoscopy", action: "Only schedule DAP if eligible", type: "warning" },
  { situation: "Initial endoscopy (EGD)", action: "Schedule office visit first", type: "warning" },
  { situation: "Waitlist request", action: "Office visits only; patient must already have appt", type: "info" },
  { situation: "Balance over $1,000", action: "Cannot schedule procedure — warm transfer collections", type: "danger" },
];

const navCards = [
  { href: "/scheduling", label: "Scheduling Rules", icon: CalendarDays, desc: "Appointment types, workflows, rescheduling" },
  { href: "/routing", label: "Department Routing", icon: PhoneForwarded, desc: "Warm/blind transfers, all departments" },
  { href: "/scripts", label: "Call Scripts", icon: MessageSquare, desc: "Opening, closing, callbacks, voicemail" },
  { href: "/locations", label: "Locations", icon: MapPin, desc: "Region rules, abbreviations" },
  { href: "/disposition", label: "Disposition Codes", icon: Tags, desc: "All 13 disposition code definitions" },
  { href: "/notes", label: "My Notes", icon: FileText, desc: "Personal reference notes" },
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
  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Borland Groover — Patient Support Services</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">BG Main Line: 904-398-7205</p>
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

      {/* Quick Reference */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Quick Reference</h2>
        <div className="space-y-2">
          {quickRules.map(({ situation, action, type }) => (
            <div key={situation} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${typeColors[type]}`} data-testid="quick-rule">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <span className="text-foreground font-medium">{situation}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className={`font-semibold ${actionColors[type]}`}>{action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notices */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Always Remember</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-300">OV Timing Rule</p>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">Book appointments 2–3 days out. Absolutely no same-day or next-day appointments.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-300">Check SharePoint First</p>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">Always check the Scheduling Cheat Sheet in SharePoint before scheduling any appointment.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-800 dark:text-blue-300">Phreesia Crucial Rule</p>
              <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">Do not open anything else in Phreesia under any circumstances.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-800 dark:text-blue-300">We Support GI Only</p>
              <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">Gastroenterology and Hepatology only. Including Diabetes and Weight Loss.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Reference Sections</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {navCards.map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <Card className="border border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group" data-testid={`nav-card-${label.toLowerCase().replace(/\s/g, "-")}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">{label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
