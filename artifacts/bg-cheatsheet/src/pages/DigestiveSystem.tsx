import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Activity, Stethoscope, FlaskConical, Heart, AlertCircle, Info, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Condition {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  bgProcedures: string[];
  urgency: "routine" | "urgent" | "emergency";
  icdNote?: string;
}

const conditions: Condition[] = [
  {
    id: "gerd",
    name: "GERD (Gastroesophageal Reflux Disease)",
    category: "Esophageal",
    description: "A chronic condition where stomach acid flows back into the esophagus, causing irritation and damage to the esophageal lining.",
    symptoms: ["Heartburn (burning in chest/throat)", "Regurgitation of food or liquid", "Difficulty swallowing (dysphagia)", "Chest pain", "Chronic cough or hoarseness", "Feeling of lump in throat"],
    treatments: ["Lifestyle changes (diet, weight loss, elevate head of bed)", "Antacids (Tums, Maalox)", "H2 blockers (famotidine/Pepcid)", "Proton pump inhibitors (omeprazole, pantoprazole)", "Surgery (Nissen fundoplication) for severe cases"],
    bgProcedures: ["Upper Endoscopy (EGD) — to visualize esophagus and check for Barrett's", "pH Monitoring — measures acid levels over 24–48 hours", "Esophageal Manometry — measures pressure/motility"],
    urgency: "routine",
  },
  {
    id: "barretts",
    name: "Barrett's Esophagus",
    category: "Esophageal",
    description: "A condition where the normal esophageal lining is replaced by tissue similar to the intestinal lining, usually caused by long-term GERD. Increases risk of esophageal cancer.",
    symptoms: ["Often no symptoms itself", "Chronic heartburn", "Difficulty swallowing", "Chest pain"],
    treatments: ["Proton pump inhibitors to control acid", "Endoscopic ablation (RFA — Radiofrequency Ablation)", "Endoscopic mucosal resection (EMR)", "Surgery if cancer develops", "Surveillance endoscopies every 1–3 years"],
    bgProcedures: ["Surveillance EGD with biopsies", "Radiofrequency Ablation (RFA)", "Endoscopic Mucosal Resection (EMR)"],
    urgency: "routine",
  },
  {
    id: "ibs",
    name: "IBS (Irritable Bowel Syndrome)",
    category: "Functional Bowel",
    description: "A common functional disorder affecting the large intestine. Characterized by a group of symptoms without visible structural damage. Includes IBS-C (constipation), IBS-D (diarrhea), and IBS-M (mixed).",
    symptoms: ["Abdominal pain or cramping", "Bloating and gas", "Diarrhea, constipation, or alternating both", "Mucus in stool", "Urgency to have a bowel movement", "Incomplete feeling after bowel movement"],
    treatments: ["Diet changes (low-FODMAP diet)", "Fiber supplements or laxatives (IBS-C)", "Anti-diarrheal medications like loperamide (IBS-D)", "Antispasmodics (dicyclomine, hyoscyamine)", "Antidepressants (TCAs or SSRIs) for pain", "Rifaximin (Xifaxan) for IBS-D", "Linzess (linaclotide) or Amitiza (lubiprostone) for IBS-C", "Stress management, CBT"],
    bgProcedures: ["Colonoscopy — to rule out IBD, cancer, or infection", "Flexible Sigmoidoscopy", "Lab work and stool tests"],
    urgency: "routine",
  },
  {
    id: "crohns",
    name: "Crohn's Disease",
    category: "Inflammatory Bowel Disease (IBD)",
    description: "A chronic inflammatory bowel disease that can affect any part of the GI tract from mouth to anus, but most commonly the end of the small intestine (ileum) and the beginning of the colon. Causes inflammation that may extend through all layers of the bowel wall.",
    symptoms: ["Persistent diarrhea (sometimes bloody)", "Abdominal pain and cramping", "Fatigue and weight loss", "Fever", "Mouth sores", "Reduced appetite", "Perianal disease (fistulas, abscesses)", "Joint pain, skin issues (extraintestinal)"],
    treatments: ["Aminosalicylates (mesalamine) — mild cases", "Corticosteroids (prednisone) — for flares", "Immunomodulators (azathioprine, 6-MP, methotrexate)", "Biologics: anti-TNF (infliximab/Remicade, adalimumab/Humira)", "Biologics: anti-integrin (vedolizumab/Entyvio)", "Biologics: anti-IL-12/23 (ustekinumab/Stelara)", "Surgery to remove damaged bowel sections"],
    bgProcedures: ["Colonoscopy with biopsies", "Upper Endoscopy (EGD)", "Small bowel capsule endoscopy", "Imaging: CT/MRI enterography", "Infusion Center: IV biologic therapy (Remicade, Entyvio, Stelara)", "Flexible Sigmoidoscopy"],
    urgency: "urgent",
  },
  {
    id: "uc",
    name: "Ulcerative Colitis (UC)",
    category: "Inflammatory Bowel Disease (IBD)",
    description: "A chronic IBD that causes long-lasting inflammation and ulcers (sores) in the innermost lining of the large intestine (colon) and rectum. Unlike Crohn's, UC only affects the colon and is limited to the mucosal layer.",
    symptoms: ["Rectal bleeding or blood in stool", "Diarrhea, often with pus or blood", "Rectal pain and urgency", "Abdominal cramping", "Inability to defecate despite urgency (tenesmus)", "Weight loss, fatigue", "Fever (during flares)"],
    treatments: ["Aminosalicylates (mesalamine/Lialda, Apriso, Delzicol) — first-line", "Corticosteroids for flares", "Immunomodulators (azathioprine, 6-MP)", "Biologics: anti-TNF (infliximab, adalimumab, golimumab/Simponi)", "Biologics: vedolizumab (Entyvio)", "JAK inhibitors: tofacitinib (Xeljanz), upadacitinib (Rinvoq)", "Surgery: colectomy (curative)"],
    bgProcedures: ["Colonoscopy with biopsies — diagnosis and surveillance", "Flexible Sigmoidoscopy", "Infusion Center: IV biologic therapy", "Pathology: biopsy analysis"],
    urgency: "urgent",
  },
  {
    id: "colorectal",
    name: "Colorectal Cancer",
    category: "Colorectal",
    description: "Cancer that starts in the colon (large intestine) or rectum. Most colorectal cancers begin as polyps — small clumps of cells that grow on the inner wall of the colon. Colonoscopy can detect and remove polyps before they become cancerous.",
    symptoms: ["Change in bowel habits (diarrhea, constipation)", "Rectal bleeding or blood in stool", "Persistent abdominal discomfort", "Feeling bowel doesn't empty completely", "Weakness or fatigue", "Unexplained weight loss", "Narrow stools"],
    treatments: ["Surgery (colectomy, low anterior resection)", "Chemotherapy", "Radiation therapy", "Targeted therapy (bevacizumab, cetuximab)", "Immunotherapy for MSI-H/dMMR tumors"],
    bgProcedures: ["Colonoscopy — gold standard screening, polyp removal", "Pathology: biopsy and polyp analysis", "Imaging Center: CT scan, PET scan staging", "Research & Clinical Trials: access to novel treatments"],
    urgency: "urgent",
    icdNote: "Screening begins at age 45. High-risk patients (family history, prior polyps) may start earlier.",
  },
  {
    id: "polyps",
    name: "Colon Polyps",
    category: "Colorectal",
    description: "Small growths that form on the inner lining of the colon or rectum. Most are benign, but adenomatous polyps can become cancerous if not removed. Found and removed during colonoscopy.",
    symptoms: ["Usually no symptoms", "Rectal bleeding", "Change in stool color or consistency", "Iron deficiency anemia (from slow bleeding)"],
    treatments: ["Polypectomy during colonoscopy (snare, forceps, or EMR)", "Surveillance colonoscopies based on polyp type/number", "High-risk polyps: repeat colonoscopy in 1–3 years"],
    bgProcedures: ["Colonoscopy with polypectomy", "Pathology: polyp analysis to determine type", "Direct Access Procedure (DAP) — for established patients returning for surveillance"],
    urgency: "routine",
    icdNote: "DAP eligible: established BG patient, prior colonoscopy on record, physician order on file.",
  },
  {
    id: "hepatitis",
    name: "Hepatitis (B & C)",
    category: "Liver Disease",
    description: "Viral infections that cause liver inflammation. Hepatitis B is spread through blood and body fluids; Hepatitis C through blood contact. Both can become chronic and lead to cirrhosis or liver cancer if untreated.",
    symptoms: ["Fatigue and weakness", "Nausea, vomiting, loss of appetite", "Abdominal pain (right upper quadrant)", "Dark urine and pale stools", "Jaundice (yellowing of skin/eyes)", "Fever (acute phase)", "Joint pain"],
    treatments: ["Hepatitis B: antiviral therapy (entecavir, tenofovir), monitoring", "Hepatitis C: Direct-acting antivirals (DAAs) — Harvoni, Epclusa, Mavyret (8–12 week cure", "Regular liver monitoring: LFTs, viral load", "Liver transplant for end-stage disease"],
    bgProcedures: ["Lab monitoring and blood work", "Liver biopsy if needed", "Imaging Center: ultrasound, FibroScan (elastography)", "Infusion Center: IV antiviral therapy if needed"],
    urgency: "urgent",
  },
  {
    id: "fatty-liver",
    name: "Non-Alcoholic Fatty Liver Disease (NAFLD/NASH)",
    category: "Liver Disease",
    description: "Accumulation of excess fat in the liver not caused by alcohol. NAFLD is the simple fat accumulation; NASH (Non-Alcoholic Steatohepatitis) involves inflammation and damage — can progress to cirrhosis. Strongly linked to obesity, diabetes, and metabolic syndrome.",
    symptoms: ["Often no symptoms (silent disease)", "Fatigue", "Mild right upper abdominal discomfort", "Enlarged liver (hepatomegaly)", "Jaundice and ascites in advanced cirrhosis"],
    treatments: ["Weight loss (most effective — even 7–10% body weight helps)", "Control blood sugar, cholesterol, triglycerides", "Vitamin E and pioglitazone (specific cases)", "Avoid alcohol entirely", "Bariatric surgery consideration for obese patients", "New: resmetirom (Rezdiffra) — first FDA-approved NASH treatment 2024"],
    bgProcedures: ["Liver biopsy — gold standard for staging", "Imaging Center: ultrasound, FibroScan/elastography, MRI", "Lab monitoring: LFTs, lipid panel, HbA1c"],
    urgency: "routine",
  },
  {
    id: "celiac",
    name: "Celiac Disease",
    category: "Small Intestine",
    description: "An autoimmune disorder where eating gluten (found in wheat, barley, rye) triggers an immune response that damages the small intestine's villi, impairing nutrient absorption.",
    symptoms: ["Diarrhea, often with foul-smelling stools", "Bloating and gas", "Abdominal pain", "Weight loss and failure to thrive", "Fatigue and anemia", "Skin rash (dermatitis herpetiformis)", "Joint pain, bone loss", "Brain fog, headaches", "Mouth sores"],
    treatments: ["Strict lifelong gluten-free diet (only proven treatment)", "Nutritional supplementation (iron, B12, folate, vitamin D, calcium)", "Corticosteroids for refractory celiac disease", "Follow-up endoscopies to confirm healing"],
    bgProcedures: ["Upper Endoscopy (EGD) with small bowel biopsies — diagnosis standard", "Lab: anti-tTG IgA, total IgA, anti-endomysial antibodies", "Pathology: villous atrophy grading (Marsh classification)"],
    urgency: "routine",
  },
  {
    id: "pancreatitis",
    name: "Pancreatitis (Acute & Chronic)",
    category: "Pancreatic",
    description: "Inflammation of the pancreas. Acute pancreatitis comes on suddenly and is usually short-lived. Chronic pancreatitis is long-lasting inflammation that leads to permanent damage and affects digestion and insulin production.",
    symptoms: ["Severe upper abdominal pain (often radiating to back)", "Nausea and vomiting", "Fever and rapid pulse", "Tender abdomen", "Chronic: steatorrhea (fatty/oily stools)", "Chronic: diabetes (if islet cells damaged)", "Weight loss and malnutrition"],
    treatments: ["Acute: hospitalization, IV fluids, NPO, pain management", "Treat underlying cause (gallstones — ERCP; alcohol — abstinence)", "Chronic: enzyme replacement (Creon), fat-soluble vitamins", "Pain management: non-opioid preferred", "ERCP for duct blockages", "Surgery for complications"],
    bgProcedures: ["ERCP (Endoscopic Retrograde Cholangiopancreatography)", "EUS (Endoscopic Ultrasound)", "Imaging Center: CT scan, MRI/MRCP", "Pathology: biopsy if mass suspected"],
    urgency: "urgent",
  },
  {
    id: "diverticular",
    name: "Diverticular Disease (Diverticulosis/Diverticulitis)",
    category: "Colorectal",
    description: "Diverticulosis is the presence of small pouches (diverticula) in the colon wall — very common over age 60. Diverticulitis is when these pouches become inflamed or infected.",
    symptoms: ["Diverticulosis: usually no symptoms, occasionally cramping or bloating", "Diverticulitis: severe abdominal pain (usually lower left)", "Diverticulitis: fever and chills", "Nausea and vomiting", "Change in bowel habits", "Rectal bleeding (diverticular bleeding)"],
    treatments: ["Diverticulosis: high-fiber diet, stay hydrated", "Mild diverticulitis: clear liquid diet + oral antibiotics", "Severe: hospitalization, IV antibiotics, possible surgery", "Recurrent: elective colectomy", "Diverticular bleeding: colonoscopy with hemostasis"],
    bgProcedures: ["Colonoscopy — diagnosis and management of bleeding", "Imaging Center: CT scan (preferred for diverticulitis diagnosis)", "Pathology: biopsy if concerning"],
    urgency: "routine",
  },
  {
    id: "hpylori",
    name: "H. pylori (Helicobacter pylori)",
    category: "Stomach",
    description: "A spiral-shaped bacterium that lives in the stomach lining. A major cause of peptic ulcers, chronic gastritis, and increases risk of stomach cancer. Very common — affects ~50% of the world's population.",
    symptoms: ["Burning stomach pain (often worse when stomach is empty)", "Nausea", "Loss of appetite", "Frequent burping", "Bloating", "Unintentional weight loss", "Dark or tarry stools (if ulcer bleeding)"],
    treatments: ["Triple therapy: PPI + clarithromycin + amoxicillin (7–14 days)", "Quadruple therapy: PPI + bismuth + metronidazole + tetracycline", "Confirm eradication with urea breath test or stool antigen test (4+ weeks after treatment)", "Avoid NSAIDs and alcohol during treatment"],
    bgProcedures: ["Upper Endoscopy (EGD) with biopsies — rapid urease test", "Non-invasive: urea breath test, stool H. pylori antigen", "Lab: H. pylori serology (less preferred — can't confirm active infection)"],
    urgency: "routine",
  },
  {
    id: "peptic-ulcer",
    name: "Peptic Ulcer Disease (PUD)",
    category: "Stomach",
    description: "Open sores that develop on the inner lining of the stomach (gastric ulcer) or the upper part of the small intestine (duodenal ulcer). Most caused by H. pylori infection or NSAID use.",
    symptoms: ["Burning stomach pain (worse with empty stomach — duodenal; worse after eating — gastric)", "Heartburn and acid reflux", "Nausea", "Dark or tarry stools (GI bleed)", "Vomiting blood or coffee-ground material (emergency)", "Weight loss"],
    treatments: ["Eradicate H. pylori if present (antibiotic regimens)", "Stop NSAIDs if possible", "PPIs: omeprazole, pantoprazole, esomeprazole (4–8 weeks)", "H2 blockers: famotidine (maintenance)", "Endoscopic therapy for actively bleeding ulcers"],
    bgProcedures: ["Upper Endoscopy (EGD) — diagnosis and treatment of bleeding", "Pathology: biopsies to rule out malignancy (gastric ulcers)", "H. pylori testing and eradication confirmation"],
    urgency: "urgent",
  },
  {
    id: "hemorrhoids",
    name: "Hemorrhoids",
    category: "Anorectal",
    description: "Swollen veins in the rectum or around the anus. Internal hemorrhoids form inside the rectum; external hemorrhoids form under skin around the anus. Very common — affects 3 in 4 adults at some point.",
    symptoms: ["Rectal bleeding (bright red blood on toilet paper or in bowl)", "Itching or irritation around anus", "Pain or discomfort", "Swelling around anus", "Prolapse (internal hemorrhoid bulging out)", "Leakage of feces"],
    treatments: ["Sitz baths (warm water soaks)", "Over-the-counter creams (hydrocortisone, witch hazel)", "High-fiber diet and adequate hydration", "Stool softeners", "Rubber band ligation (most effective office procedure)", "Sclerotherapy injection", "Hemorrhoidectomy (surgery) for severe cases", "Stapled hemorrhoidopexy"],
    bgProcedures: ["Flexible Sigmoidoscopy or Anoscopy", "Colonoscopy — to rule out other causes of rectal bleeding", "Rubber band ligation procedure"],
    urgency: "routine",
  },
  {
    id: "eosinophilic",
    name: "Eosinophilic Esophagitis (EoE)",
    category: "Esophageal",
    description: "A chronic immune-mediated esophageal disease characterized by eosinophil buildup in the esophagus, causing difficulty swallowing. Closely linked to food allergies and environmental allergens — BG's Allergy-Immunology team plays a key role.",
    symptoms: ["Difficulty swallowing (dysphagia)", "Food getting stuck in esophagus (food impaction)", "Chest pain", "Heartburn that doesn't respond to acid medication", "Nausea and vomiting (especially in children)", "Failure to thrive (children)"],
    treatments: ["Dietary elimination (six-food elimination diet)", "Swallowed topical steroids (budesonide, fluticasone)", "Dupilumab (Dupixent) — FDA-approved biologic for EoE", "PPIs — for acid component", "Esophageal dilation for strictures", "Allergy testing to identify triggers"],
    bgProcedures: ["Upper Endoscopy (EGD) with esophageal biopsies", "Allergy-Immunology consultation and testing at BG", "Pathology: eosinophil count per high-power field (≥15 = EoE)", "Esophageal dilation (if strictures present)"],
    urgency: "routine",
  },
];

const bgServices = [
  { name: "Colonoscopy", desc: "Colon cancer screening & polyp removal. Ages 45+. Direct Access available for established patients.", color: "blue" },
  { name: "Endoscopy (EGD)", desc: "Upper GI visualization. Requires office visit FIRST unless established patient with prior EGD.", color: "teal" },
  { name: "Jacksonville Center for Endoscopy (JCE)", desc: "State-licensed outpatient ASC. Two Jacksonville locations. JCE owned/operated by BG. Joint Commission accredited.", color: "indigo" },
  { name: "Allergy-Immunology", desc: "Dr. Raquel Watkins. Same-day allergy testing. Jacksonville & Orange Park. Treats EoE, food allergies, asthma.", color: "purple" },
  { name: "Imaging Center", desc: "On-site imaging: ultrasound, CT, MRI, FibroScan. Supports GI diagnosis without leaving BG.", color: "rose" },
  { name: "Infusion Center", desc: "IV biologic therapy for IBD (Remicade, Entyvio, Stelara). Infusion nursing staff on site.", color: "orange" },
  { name: "Pathology", desc: "All BG biopsy specimens analyzed by GI-specialized pathologists. Results inform next steps.", color: "green" },
  { name: "Research & Clinical Trials", desc: "Access to novel treatments. Patients may qualify for trials for IBD, NASH, liver disease, and more.", color: "amber" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300",
  teal: "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300",
  purple: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300",
  rose: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300",
  orange: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300",
  green: "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300",
  amber: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300",
};

const categories = ["All", ...Array.from(new Set(conditions.map((c) => c.category)))];

export default function DigestiveSystem() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = conditions.filter((c) => {
    const matchCat = selectedCategory === "All" || c.category === selectedCategory;
    const q = query.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.symptoms.some((s) => s.toLowerCase().includes(q)) || c.treatments.some((t) => t.toLowerCase().includes(q)) || c.bgProcedures.some((p) => p.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const urgencyBadge = (u: Condition["urgency"]) => {
    if (u === "emergency") return <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">Emergency</Badge>;
    if (u === "urgent") return <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">Priority</Badge>;
    return <Badge variant="outline" className="text-muted-foreground">Routine</Badge>;
  };

  return (
    <div className="space-y-6" data-testid="digestive-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Digestive System Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          GI conditions, symptoms, treatments &amp; Borland Groover procedures — sourced from BG clinical services
        </p>
        <a href="https://borlandgroover.com/services/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
          <ExternalLink className="w-3 h-3" /> BG Services Page
        </a>
      </div>

      {/* BG Services Overview */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">BG Services at a Glance</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {bgServices.map((svc) => (
            <div key={svc.name} className={cn("border rounded-lg p-3 text-xs", colorMap[svc.color])}>
              <p className="font-bold mb-1">{svc.name}</p>
              <p className="opacity-80 leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conditions, symptoms, treatments, procedures..."
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

      <p className="text-xs text-muted-foreground">{filtered.length} condition{filtered.length !== 1 ? "s" : ""} shown</p>

      {/* Conditions Accordion */}
      <div className="space-y-2">
        {filtered.map((condition) => {
          const isOpen = expanded === condition.id;
          return (
            <div key={condition.id} className="border border-border rounded-xl overflow-hidden bg-card">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setExpanded(isOpen ? null : condition.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{condition.name}</span>
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">{condition.category}</Badge>
                    {urgencyBadge(condition.urgency)}
                  </div>
                  {!isOpen && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{condition.description}</p>
                  )}
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">{condition.description}</p>
                  {condition.icdNote && (
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 dark:bg-blue-950/40 dark:border-blue-800">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 dark:text-blue-400" />
                      <p className="text-xs text-blue-800 dark:text-blue-300">{condition.icdNote}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Symptoms */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Symptoms</p>
                      </div>
                      <ul className="space-y-1">
                        {condition.symptoms.map((s, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Treatments */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Stethoscope className="w-3.5 h-3.5 text-green-500" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Treatments</p>
                      </div>
                      <ul className="space-y-1">
                        {condition.treatments.map((t, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-green-500 shrink-0 mt-0.5">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* BG Procedures */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <FlaskConical className="w-3.5 h-3.5 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">BG Procedures</p>
                      </div>
                      <ul className="space-y-1">
                        {condition.bgProcedures.map((p, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-primary shrink-0 mt-0.5">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No conditions match your search.</p>
          <p className="text-xs mt-1">Try a different keyword or category.</p>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This reference is for scheduling and patient support purposes only. Clinical decisions are made by licensed physicians. For patient-specific medical questions, transfer to a nurse or direct to the clinical team.
        </p>
      </div>
    </div>
  );
}
