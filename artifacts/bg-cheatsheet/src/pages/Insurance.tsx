import { useState } from "react";
import { Search, DollarSign, Shield, HelpCircle, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Info, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Term {
  id: string;
  term: string;
  category: string;
  short: string;
  definition: string;
  example?: string;
  tips?: string[];
  related?: string[];
}

const terms: Term[] = [
  {
    id: "premium",
    term: "Premium",
    category: "Cost Basics",
    short: "Monthly cost to maintain coverage",
    definition: "The amount you or your employer pays each month to keep your health insurance active — regardless of whether you use any medical services. Think of it like a subscription fee for your coverage.",
    example: "A patient pays $320/month in premiums. Even if they never see a doctor that month, the $320 is still due.",
    tips: ["Premiums are separate from what you pay at the doctor's office", "Most employer plans split the premium between employer and employee", "Patients often confuse premium with deductible — clarify if needed"],
    related: ["Deductible", "Copay", "Benefits"],
  },
  {
    id: "deductible",
    term: "Deductible",
    category: "Cost Sharing",
    short: "Amount you pay before insurance starts covering costs",
    definition: "The amount a patient pays out-of-pocket for covered health care services before their insurance plan starts to pay. Once the deductible is met, insurance typically begins sharing costs through copays or coinsurance. Deductibles reset each plan year (usually January 1).",
    example: "Plan has a $1,500 deductible. Patient has paid $800 so far this year toward medical bills. They still have $700 left to pay before insurance kicks in for most services.",
    tips: ["Preventive care (colonoscopy screening for average-risk patients) is usually NOT subject to the deductible under ACA plans", "Diagnostic procedures (e.g., colonoscopy for symptoms or known history) ARE usually subject to the deductible", "Always ask if the patient has met their deductible — affects their out-of-pocket responsibility"],
    related: ["Copay", "Coinsurance", "Out-of-Pocket Maximum"],
  },
  {
    id: "copay",
    term: "Copay (Copayment)",
    category: "Cost Sharing",
    short: "Fixed dollar amount paid per visit/service",
    definition: "A fixed, predetermined amount that a patient pays at the time of a medical service, regardless of the total cost of the service. Copays are typically specified in the insurance card and plan documents. Common for office visits, specialist visits, and prescriptions.",
    example: "Patient's insurance card says: PCP Visit $25, Specialist $50, ER $250. Patient visiting a BG GI specialist would pay $50 at check-in.",
    tips: ["Copays may or may not count toward the deductible — depends on the plan", "Some plans have no copay once deductible is met (pure coinsurance plan)", "Procedure copays are often separate from and higher than office visit copays", "Ask patients to check their insurance card for specialist copay amounts"],
    related: ["Deductible", "Coinsurance", "Explanation of Benefits"],
  },
  {
    id: "coinsurance",
    term: "Coinsurance",
    category: "Cost Sharing",
    short: "Percentage you pay AFTER meeting your deductible",
    definition: "The percentage of costs that you pay after meeting your deductible. For example, if your plan has 20% coinsurance, you pay 20% of the approved cost for a covered service, and your insurance pays the remaining 80%. Coinsurance continues until you reach your out-of-pocket maximum.",
    example: "Patient's deductible is met. A procedure costs $2,000. With 80/20 plan: patient pays 20% ($400), insurance pays 80% ($1,600).",
    tips: ["Coinsurance is always a percentage, not a flat dollar amount (that would be a copay)", "Patients are often surprised by coinsurance for procedures — it can be substantial", "In-network coinsurance is always lower than out-of-network", "Always encourage patients to verify their coinsurance rate before scheduling procedures"],
    related: ["Deductible", "Out-of-Pocket Maximum", "In-Network vs. Out-of-Network"],
  },
  {
    id: "oop-max",
    term: "Out-of-Pocket Maximum (OOP Max)",
    category: "Cost Sharing",
    short: "The most you'll ever pay in a plan year",
    definition: "The maximum amount a patient will have to pay for covered services in a plan year. Once this amount is reached (through deductibles, copays, and coinsurance), the insurance company pays 100% of covered services for the rest of the year. 2024 ACA limits: $9,450 individual / $18,900 family.",
    example: "Patient has a $5,000 OOP max. After paying $3,500 toward deductible + coinsurance, they get a $2,500 procedure. They pay $1,500 (which brings them to their $5,000 OOP max). Any subsequent covered services that year are fully paid by insurance.",
    tips: ["OOP max only applies to in-network, covered services — out-of-network costs may not count", "Premiums do NOT count toward OOP max", "When a patient has met their OOP max, it's a great time to schedule upcoming procedures before year-end", "Patients near OOP max should try to schedule needed procedures before plan year resets"],
    related: ["Deductible", "Coinsurance", "Copay"],
  },
  {
    id: "benefits",
    term: "Benefits / Plan Benefits",
    category: "Coverage",
    short: "What services your insurance plan covers",
    definition: "The specific health care services and items that are covered under an insurance plan. Each plan has a Summary of Benefits and Coverage (SBC) that outlines what is covered, at what cost, and any limitations. ACA-compliant plans must cover 10 essential health benefits including preventive care, emergency services, and prescription drugs.",
    example: "Plan benefits may include: colonoscopy screening (covered at 100%), specialist visits (covered after deductible), brand-name drugs (covered with 30% coinsurance after deductible).",
    tips: ["Preventive colonoscopy (average-risk, no symptoms, age 45+) is typically a covered benefit at 100%", "If a polyp is found and removed during a screening colonoscopy, some plans reclassify it as diagnostic — patient may then owe cost-sharing", "Always encourage patients to call their insurance to confirm their specific benefits for procedures"],
    related: ["Coverage", "Prior Authorization", "Explanation of Benefits"],
  },
  {
    id: "coverage",
    term: "Coverage / Covered Services",
    category: "Coverage",
    short: "Whether your insurance will pay for a specific service",
    definition: "Whether a particular health care service, drug, or item is included in a patient's insurance plan and eligible for payment. Services can be fully covered (100%), covered after cost-sharing, covered only in-network, covered only with prior authorization, or not covered at all.",
    example: "A patient calls asking if their colonoscopy is covered. You would tell them: 'For your safety and accuracy, please call the number on the back of your insurance card and confirm your coverage for a colonoscopy before your appointment.'",
    tips: ["BG staff do not verify insurance coverage on behalf of patients — direct patients to call their insurer", "Insurance Team at BG handles billing questions — warm transfer patients who need coverage clarification", "Coverage can vary by network tier, so always mention the importance of in-network verification"],
    related: ["Benefits", "Prior Authorization", "In-Network vs. Out-of-Network"],
  },
  {
    id: "prior-auth",
    term: "Prior Authorization (Pre-Auth / PA)",
    category: "Coverage",
    short: "Insurance approval required before certain services",
    definition: "A requirement by some insurance plans that a provider must obtain approval from the insurance company before performing certain services, procedures, or prescribing certain medications. Without prior authorization, the insurance may deny the claim and the patient could be responsible for the full cost.",
    example: "A patient is scheduled for an infusion (IV biologic like Remicade). BG's infusion team must obtain prior authorization from insurance before the appointment. If auth is denied, the appointment may need to be rescheduled or the patient appeals.",
    tips: ["Common procedures requiring PA: infusion therapy, MRIs, CT scans, certain high-cost procedures", "Allow 3–10 business days for PA processing", "If a patient asks about prior authorization status, transfer to the appropriate department (scheduling or infusion team)", "Emergency services do NOT require prior authorization"],
    related: ["Coverage", "Benefits", "Claims"],
  },
  {
    id: "in-out-network",
    term: "In-Network vs. Out-of-Network",
    category: "Coverage",
    short: "Whether your provider has a contract with your insurer",
    definition: "In-network providers have contracted with a patient's insurance company to provide services at negotiated rates. Out-of-network providers have no such contract. Patients almost always pay significantly more (or 100%) for out-of-network care. Always verify that Borland Groover participates with the patient's specific insurance plan.",
    example: "Patient has BlueCross HMO. BG is in-network for BCBS PPO plans but may not be in-network for HMO plans in all cases. Patient should call BCBS to verify BG is in-network for their specific plan.",
    tips: ["HMO plans typically require in-network only and may need a PCP referral", "PPO plans allow out-of-network (at higher cost) without referral", "EPO plans are like PPOs but require in-network except for emergencies", "BG accepts most major insurance — but patients must verify their specific plan"],
    related: ["Coverage", "Benefits", "Referral"],
  },
  {
    id: "eob",
    term: "Explanation of Benefits (EOB)",
    category: "Claims & Billing",
    short: "Statement from insurer detailing what was paid for a claim",
    definition: "A statement sent by an insurance company to a policyholder explaining what medical treatments and/or services were paid for on their behalf after a claim is processed. An EOB is NOT a bill — it's a summary of how the claim was processed. It shows: what was billed, the negotiated rate, what insurance paid, and what the patient owes.",
    example: "Patient receives an EOB for their colonoscopy: Billed: $3,200 | Negotiated rate: $1,800 | Insurance paid: $1,440 (80%) | Patient owes: $360 (20% coinsurance).",
    tips: ["An EOB can be confusing — many patients think it's a bill. Reassure them it's a summary, and to wait for the actual bill from BG", "If a patient disputes an EOB, they should call their insurance company, not BG billing initially", "Transfer all billing/EOB questions to BG's billing/insurance team"],
    related: ["Claims", "Coinsurance", "Copay"],
  },
  {
    id: "claims",
    term: "Claims",
    category: "Claims & Billing",
    short: "Requests submitted to insurance for payment",
    definition: "A formal request submitted by a health care provider (like BG) to a patient's insurance company requesting payment for medical services rendered. Claims include procedure codes (CPT codes), diagnosis codes (ICD-10 codes), and provider/patient information.",
    example: "BG submits a claim to BlueCross after a patient's colonoscopy. BCBS processes the claim, applies the patient's deductible/coinsurance, and pays BG the appropriate amount. The patient is billed for their share.",
    tips: ["Billing questions about claims should always be transferred to the BG Insurance/Billing team", "Denied claims can often be appealed — direct patients to call their insurance or BG billing"],
    related: ["EOB", "Prior Authorization", "Copay"],
  },
  {
    id: "referral",
    term: "Referral",
    category: "Coverage",
    short: "PCP's written permission to see a specialist",
    definition: "An authorization from a patient's primary care physician (PCP) for the patient to see a specialist. Required by HMO and some POS plans. Without a referral, the insurance may deny coverage for the specialist visit. PPO and EPO plans typically do NOT require referrals.",
    example: "Patient has an HMO plan and needs to see a BG gastroenterologist. Their PCP must send a referral to BG. If the patient doesn't have a referral, remind them to contact their PCP before the appointment.",
    tips: ["When scheduling for HMO patients, always ask: 'Do you have a referral from your primary care doctor?'", "Referrals typically have a validity period (30–90 days) and a set number of visits", "Medicare patients do NOT need referrals for specialist visits (Original Medicare)"],
    related: ["In-Network vs. Out-of-Network", "Benefits", "Prior Authorization"],
  },
  {
    id: "payment-arrangement",
    term: "Payment Arrangement / Payment Plan",
    category: "Billing",
    short: "Agreement to pay a balance in installments",
    definition: "An agreement between a patient and the medical provider (BG) to pay an outstanding balance in multiple smaller payments over time rather than all at once. BG's billing department handles payment arrangements. Scheduling reps should NOT set up payment arrangements — transfer these calls.",
    example: "Patient owes $1,200 after insurance. They can't pay all at once. BG's billing team can set up a monthly payment plan. Rep should warm transfer to the billing/collections department.",
    tips: ["Transfer ALL payment arrangement requests to BG's billing/financial team", "If patient has a balance OVER $1,000, BG policy may prevent scheduling new procedures until resolved — check and transfer to collections", "Do not promise specific payment terms to patients — this must be handled by billing"],
    related: ["Balance Due", "Out-of-Pocket Maximum", "Financial Assistance"],
  },
  {
    id: "financial-assistance",
    term: "Financial Assistance / Charity Care",
    category: "Billing",
    short: "Programs to help patients who can't afford care",
    definition: "Programs offered by healthcare providers to assist patients who demonstrate financial hardship. Can include discounted services, sliding scale fees, or complete write-off of charges based on income. Patients must typically apply and provide income documentation.",
    example: "Uninsured patient needs a colonoscopy but can't afford it. They may qualify for BG's charity care program. Transfer to BG billing for an application.",
    tips: ["Transfer financial hardship inquiries to the billing department", "Nonprofit hospitals like those within BG's network may have charity care programs", "Patients may also qualify for Medicaid if they don't have insurance"],
    related: ["Payment Arrangement", "Medicaid", "Coverage"],
  },
  {
    id: "medicare",
    term: "Medicare",
    category: "Government Insurance",
    short: "Federal health insurance for ages 65+ and disabled",
    definition: "Federal health insurance program for people 65 and older, and for some younger people with certain disabilities or conditions. Key parts: Part A (hospital), Part B (outpatient/physician — covers colonoscopy screening), Part C (Medicare Advantage — private plans), Part D (prescription drugs). BG accepts Medicare.",
    example: "Part B covers colorectal cancer screening colonoscopy at 100% every 10 years (or every 2 years for high-risk) for Medicare beneficiaries. If a polyp is found, it may become a 'diagnostic' procedure with cost-sharing.",
    tips: ["Medicare patients do NOT need referrals", "Medicare does NOT have a general deductible for screening colonoscopies (if billed as screening)", "Medicare Advantage plans have their own rules — verify with the specific plan", "Be aware of the 'switching to diagnostic' coding issue — patients should know this possibility"],
    related: ["Medicaid", "Coverage", "Deductible"],
  },
  {
    id: "medicaid",
    term: "Medicaid",
    category: "Government Insurance",
    short: "State/federal insurance for low-income individuals",
    definition: "A joint federal and state program that provides health coverage to low-income people, including families, pregnant women, children, elderly, and disabled individuals. Florida's Medicaid program is called Florida Medicaid. Eligibility and benefits vary by state. Some Medicaid plans are managed care (like Florida's Statewide Medicaid Managed Care).",
    example: "Patient says they have 'Medicaid' — ask for the specific plan name. In Florida, they may be enrolled in a managed care plan like Molina Healthcare, WellCare, or Sunshine Health. BG may or may not be in-network for their specific Medicaid plan.",
    tips: ["Always confirm specific Medicaid plan name — not all plans are the same", "Verify BG participation with the patient's specific managed care plan", "Medicaid prior authorizations are common for procedures", "Some Medicaid patients may have dual coverage (Medicare + Medicaid = Dual Eligible)"],
    related: ["Medicare", "Coverage", "In-Network vs. Out-of-Network"],
  },
  {
    id: "hsa-fsa",
    term: "HSA / FSA (Health Savings / Flexible Spending Account)",
    category: "Billing",
    short: "Tax-advantaged accounts for medical expenses",
    definition: "HSA (Health Savings Account): A tax-advantaged savings account paired with a high-deductible health plan (HDHP) to pay for medical expenses. Funds roll over year to year. FSA (Flexible Spending Account): Employer-established account for medical expenses — must be used within the plan year (use-it-or-lose-it). Both can be used to pay for copays, deductibles, and other qualified medical expenses at BG.",
    example: "Patient has an HSA card and wants to use it for their copay. This is acceptable — BG's payment system accepts HSA/FSA debit cards.",
    tips: ["HSA funds roll over; FSA funds typically expire December 31 — patients with FSA funds should use them before year-end", "High-deductible plan patients often have large out-of-pocket exposure before insurance kicks in", "Patients with HSAs may ask about payment options — direct to billing"],
    related: ["Deductible", "Out-of-Pocket Maximum", "Payment Arrangement"],
  },
  {
    id: "cobra",
    term: "COBRA",
    category: "Coverage",
    short: "Continuation of employer coverage after job loss",
    definition: "The Consolidated Omnibus Budget Reconciliation Act (COBRA) allows people who lose their job-based health insurance to continue their employer's plan for a limited time (usually 18–36 months). COBRA is expensive — patients pay the full premium including the portion their employer previously paid, plus a 2% administrative fee.",
    example: "Patient recently left their job and is using COBRA to maintain their BlueCross plan while job hunting. Their coverage is the same plan, just now they're paying the full cost themselves.",
    tips: ["COBRA coverage is the SAME plan as the employer plan — benefits, network, and providers are the same", "COBRA is expensive and often results in patients being underinsured or having coverage gaps", "If a patient says they 'lost their insurance,' ask if they're on COBRA or have another plan now"],
    related: ["Premium", "Coverage", "Benefits"],
  },
  {
    id: "coordination-of-benefits",
    term: "Coordination of Benefits (COB)",
    category: "Claims & Billing",
    short: "How multiple insurance plans work together",
    definition: "Rules that determine which insurance plan pays first (primary) and which pays second (secondary) when a patient has more than one health insurance plan. The primary plan pays first up to its limits; the secondary plan may then cover some or all of the remaining balance.",
    example: "Patient has both BlueCross (through their employer) and their spouse's Cigna plan. BlueCross is primary and pays first. Cigna is secondary and may cover the patient's remaining out-of-pocket costs.",
    tips: ["Ask patients if they have more than one insurance when scheduling — this affects billing", "Medicare is usually secondary to employer insurance if the employer has 20+ employees", "COB situations should be handled by BG billing — just flag it when scheduling"],
    related: ["Claims", "EOB", "Medicare"],
  },
  {
    id: "formulary",
    term: "Formulary",
    category: "Pharmacy",
    short: "List of prescription drugs covered by the insurance plan",
    definition: "A list of prescription drugs covered by an insurance plan, often organized into tiers. Tier 1: generic drugs (lowest cost-share). Tier 2: preferred brand. Tier 3: non-preferred brand. Tier 4: specialty drugs (highest cost-share). Biologics like infliximab (Remicade) are typically Tier 4 specialty drugs.",
    example: "Patient's Remicade infusion requires prior authorization AND may be subject to Tier 4 specialty drug cost-sharing, which could be significant.",
    tips: ["Formulary matters for infusion center patients on biologics", "Non-formulary drugs may require exception/PA requests or biosimilar substitution", "Direct prescription/formulary questions to the prescribing provider or BG's nursing team"],
    related: ["Prior Authorization", "Coverage", "Benefits"],
  },
];

const categories = ["All", ...Array.from(new Set(terms.map((t) => t.category)))];

const faqs = [
  { q: "Patient asks: 'Is my colonoscopy covered?'", a: "You cannot verify coverage for patients. Respond: 'For the most accurate information about your coverage, please call the member services number on the back of your insurance card before your appointment. Ask specifically whether your colonoscopy is covered as a preventive screening or diagnostic procedure — the cost difference can be significant.' If they have specific billing questions, warm transfer to the BG Insurance Team." },
  { q: "Patient asks: 'Why do I have a bill if I have insurance?'", a: "Explain cost-sharing: 'Your insurance plan includes a deductible and/or coinsurance, which means you share in the cost of care. The amount you owe represents your portion after your insurance paid their share. For detailed questions about your bill, I can connect you with our billing team.' Then warm transfer to Billing." },
  { q: "Patient asks: 'What is my balance?'", a: "You do not have access to patient financial balances in the scheduling system. Respond: 'For your current account balance, I'd need to transfer you to our billing department. They can give you the exact amount and discuss payment options.' Warm transfer to Billing/Collections." },
  { q: "Patient says: 'I can't afford my bill — can I set up a payment plan?'", a: "Respond: 'Absolutely, our billing team handles payment arrangements and can work with you on a plan that fits your situation. Let me connect you with them now.' Warm transfer to Billing." },
  { q: "Patient asks: 'Do you accept [specific insurance]?'", a: "You can confirm which major insurances BG generally accepts. For specific plan verification (especially HMO, Medicaid, Medicare Advantage), advise: 'I'd recommend calling the member services number on your insurance card to confirm that Borland Groover is in-network for your specific plan, as coverage can vary by plan type.'" },
  { q: "Patient says their deductible 'just reset' or it's early in the year", a: "Be empathetic. Note that at the start of a plan year, patients may owe more out-of-pocket until their deductible is met. If scheduling a procedure, give the patient a heads-up: 'Since it's early in your plan year, your deductible may not be met yet — you may want to check your cost-sharing responsibility with your insurer before your procedure.'" },
  { q: "Patient says they have Medicare and asks about colonoscopy coverage", a: "Medicare Part B covers colorectal cancer screening colonoscopy at 100% (no deductible/coinsurance) every 10 years for average-risk patients, or every 2 years for high-risk. However, if a polyp is removed, the claim may be reclassified as diagnostic, and cost-sharing may apply. Advise the patient to confirm this nuance with Medicare before their procedure." },
];

export default function Insurance() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const filtered = terms.filter((t) => {
    const matchCat = selectedCategory === "All" || t.category === selectedCategory;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      t.term.toLowerCase().includes(q) ||
      t.short.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      (t.example?.toLowerCase().includes(q) ?? false);
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-6" data-testid="insurance-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Insurance Terms Reference
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Key insurance concepts, billing terms, and patient FAQ guidance for scheduling reps
        </p>
        <a
          href="https://borlandgroover.com/for-patients/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
        >
          <ExternalLink className="w-3 h-3" /> BG Billing & Insurance FAQ
        </a>
      </div>

      {/* Quick Cost-Sharing Visual */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How Cost-Sharing Works (In Order)</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {["1. Pay Premium (monthly)", "→", "2. Meet Deductible (pay 100% until met)", "→", "3. Pay Coinsurance or Copay (% or flat $)", "→", "4. Reach Out-of-Pocket Max (insurance pays 100%)"].map((item, i) => (
            <span key={i} className={cn("text-xs", item === "→" ? "text-muted-foreground font-bold" : "bg-background border border-border rounded-md px-2.5 py-1.5 font-medium text-foreground")}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search terms, definitions, examples..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} term{filtered.length !== 1 ? "s" : ""} shown</p>

      {/* Terms Grid */}
      <div className="space-y-2">
        {filtered.map((term) => {
          const isOpen = expanded === term.id;
          return (
            <div key={term.id} className="border border-border rounded-xl overflow-hidden bg-card">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setExpanded(isOpen ? null : term.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">{term.term}</span>
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">{term.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{term.short}</p>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
                  <p className="text-sm text-foreground leading-relaxed">{term.definition}</p>

                  {term.example && (
                    <div className="bg-muted/40 border border-border rounded-lg p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Example</p>
                      <p className="text-sm text-foreground">{term.example}</p>
                    </div>
                  )}

                  {term.tips && term.tips.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Rep Tips
                      </p>
                      <ul className="space-y-1.5">
                        {term.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {term.related && term.related.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Related:</span>
                      {term.related.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            const found = terms.find((t) => t.term === r);
                            if (found) { setExpanded(found.id); setQuery(""); setSelectedCategory("All"); }
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No terms match your search.</p>
          <p className="text-xs mt-1">Try a different keyword or category.</p>
        </div>
      )}

      {/* Patient FAQ Section */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-foreground">Common Insurance Questions &amp; Suggested Responses</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = faqOpen === i;
            return (
              <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                  onClick={() => setFaqOpen(isOpen ? null : i)}
                >
                  <Info className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-foreground">{faq.q}</span>
                  {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <p className="text-sm text-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> All insurance billing questions should be handled by BG's Insurance/Billing team. Scheduling reps should not quote specific coverage or cost estimates. When in doubt, warm transfer to the Insurance Team.
        </p>
      </div>
    </div>
  );
}
