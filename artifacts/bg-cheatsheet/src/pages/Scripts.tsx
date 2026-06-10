import { useState } from "react";
import { Copy, Check, Phone, PhoneOff, PhoneMissed, PhoneCall, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Script {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  script: string;
  note?: string;
}

const scripts: Script[] = [
  {
    id: "opening",
    title: "Opening",
    icon: Phone,
    color: "border-l-primary",
    script: "Thank you for calling Borland Groover, my name is [your name], how can I help you today?",
  },
  {
    id: "closing",
    title: "Closing",
    icon: PhoneOff,
    color: "border-l-teal-400",
    script: "Thank you for calling Borland Groover, have a great day.",
  },
  {
    id: "callback",
    title: "Callback Request",
    icon: PhoneCall,
    color: "border-l-blue-400",
    script: "Hi, this is [your name] following up on your callback request. How can I help you?",
  },
  {
    id: "voicemail",
    title: "Answering Machine / Voicemail",
    icon: Volume2,
    color: "border-l-purple-400",
    script: "Hello, this is [your name] calling regarding your callback request. Please call Borland Groover back at 904-398-7205. Thank you.",
    note: "Select Option 1 when calling back.",
  },
  {
    id: "no-answer",
    title: "No Answer (Can Hear Background)",
    icon: PhoneMissed,
    color: "border-l-amber-400",
    script: "Caller, if you can hear me, I can't hear you. Please give Borland a call back at 904-398-7205. Releasing line due to no response.",
  },
];

const warmTransferScripts = [
  {
    label: "To Department — Intro",
    script: "Thank you for holding, [department]. My name is [your name], I have [patient name], DOB [MM/DD/YYYY], calling regarding [reason for call]. I'm going to connect you now.",
  },
  {
    label: "To Patient — Intro",
    script: "[Patient name], I have [agent name] on the line from [department]. They will be able to assist you. Is there anything else I can help you with before I go?",
  },
];

function CopyButton({ text, id }: { text: string; id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="gap-1.5 h-8 text-xs shrink-0"
      data-testid={`copy-${id}`}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

const verifyRows = [
  { call: "Reschedule / Cancel", verify: "Phone number + Email" },
  { call: "Clinical Message", verify: "Phone number + Email" },
  { call: "Medication Renewal / Preps", verify: "Phone, Email, Insurance + Pharmacy" },
  { call: "Appointment Confirmation", verify: "Phone number + Email" },
  { call: "General Inquiry", verify: "Phone number + Email" },
];

export default function Scripts() {
  return (
    <div className="space-y-8" data-testid="scripts-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Call Scripts</h1>
        <p className="text-sm text-muted-foreground mt-1">Click copy to use any script instantly</p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">BG Main Line: 904-398-7205</p>
      </div>

      {/* Main Scripts */}
      <div className="grid gap-4">
        {scripts.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.id} className={cn("border-l-4", s.color)} data-testid={`script-${s.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {s.title}
                  </CardTitle>
                  <CopyButton text={s.script} id={s.id} />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <blockquote className="text-sm text-foreground bg-muted/50 rounded-lg p-4 border-l-2 border-primary/30 font-medium leading-relaxed italic">
                  "{s.script}"
                </blockquote>
                {s.note && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="text-amber-500 font-medium">Note:</span> {s.note}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Warm Transfer Scripts */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Warm Transfer Scripts</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {warmTransferScripts.map((s, i) => (
            <Card key={i} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{s.label}</CardTitle>
                  <CopyButton text={s.script} id={`transfer-${i}`} />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <blockquote className="text-sm text-foreground bg-muted/50 rounded-lg p-4 border-l-2 border-primary/30 italic leading-relaxed">
                  "{s.script}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demographics Verification */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Verification Requirements by Call Type</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {verifyRows.map(({ call, verify }) => (
            <div key={call} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
              <span className="text-sm font-medium text-foreground">{call}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{verify}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phone number rules */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Phone Number Entry Rules</h2>
        <div className="space-y-2">
          {[
            { rule: "Cellphone", action: "Enter in both Home AND Cell sections" },
            { rule: "Home Phone Only", action: "Enter in Home section only" },
            { rule: "Email", action: "Always ask for email. If none provided, check the N/A box." },
          ].map(({ rule, action }) => (
            <div key={rule} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card text-sm">
              <span className="font-medium text-foreground w-36 shrink-0">{rule}</span>
              <span className="text-muted-foreground">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
