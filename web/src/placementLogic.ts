import type { Placement } from "./types";

export const MAX_PREFERENCES = 10;

export const AREA_OPTIONS = [
  { value: "Medical", label: "Medical (RACP)" },
  { value: "Surgery", label: "Surgery" },
] as const;

const ADDICTION = "Addiction Medicine";
const MENTAL_HEALTH = "Mental Health";
const PSYCHIATRY = "Psychiatry";

function norm(sub: string): string {
  return sub.toLowerCase().trim();
}

function isAddiction(sub: string): boolean {
  const s = norm(sub);
  return (
    s === "addiction medicine" ||
    s.includes("addiction medicine") ||
    s.includes("addiction psychiatry")
  );
}

function hasPsychiatry(sub: string): boolean {
  return /psychiatry|psychiatric/i.test(sub);
}

function mentalHealthKey(p: Placement): string | null {
  if (p.area !== "Mental Health") return null;
  if (isAddiction(p.subspecialty)) return ADDICTION;
  if (hasPsychiatry(p.subspecialty)) return PSYCHIATRY;
  return MENTAL_HEALTH;
}

type Rule = { label: string; match: (sub: string, p: Placement) => boolean };

const REGIONAL_RULES: Rule[] = [
  {
    label: "Emergency Department",
    match: (sub) =>
      /^emergency medicine/i.test(sub.trim()) ||
      /medicine team e.*\(ed team\)/i.test(sub),
  },
  {
    label: "Anaesthetics & ICU",
    match: (sub) => {
      const s = norm(sub);
      if (s.includes("emergency department")) return false;
      return (
        /^anaesthetics\b/.test(s) ||
        s.includes("intensive care") ||
        s === "icu" ||
        s.includes("peri op") ||
        s === "critical care" ||
        s.includes("perioperative medicine")
      );
    },
  },
  {
    label: "General Medicine",
    match: (sub) => {
      const s = norm(sub);
      if (/medicine team e.*ed team/.test(s)) return false;
      return (
        s === "general medicine" ||
        s === "medicine" ||
        s === "medicine rapu" ||
        /^medicine team [a-d]\b/.test(s)
      );
    },
  },
  {
    label: "Endocrinology",
    match: (sub) =>
      /^endocrinology$/i.test(sub.trim()) || /diabetic clinic/i.test(sub),
  },
  {
    label: "Upper GI Surgery",
    match: (sub) =>
      /upper gi|hepatopancreatobiliary|hepatobiliary\/ugi|liver transplant|general endocrine surgery|\(ges\)|surgery 1\)|surgery 3\)|surgery unit 1/i.test(
        sub,
      ),
  },
  {
    label: "Colorectal Surgery",
    match: (sub) => /colorectal|surgery unit 2/i.test(sub),
  },
  {
    label: "Vascular & Plastic Surgery",
    match: (sub) => /vascular\/plastic|surgery unit 3/i.test(sub),
  },
  {
    label: "General Surgery",
    match: (sub) => {
      const s = norm(sub);
      return (
        s === "general surgery" ||
        s === "surgery" ||
        /surgery unit 4|acute surgery unit/i.test(s)
      );
    },
  },
  {
    label: "Orthopaedics",
    match: (sub) =>
      /^(orthopaedic|orthopaedics)\b|orthopaedic surgery|surgery \(orthopaedics|orthopaedics \(surg\)/i.test(
        sub,
      ),
  },
  {
    label: "Paediatrics",
    match: (sub) => /^paediatrics$/i.test(sub.trim()),
  },
];

const METRO_RULES: Rule[] = [
  {
    label: "Emergency Department",
    match: (sub) => {
      const s = norm(sub);
      if (s.includes("& anaesthetic")) return false;
      if (s.includes("emergency general surgery") || s.includes("trauma emergency surgery")) {
        return false;
      }
      return (
        s === "ed" ||
        s === "emergency" ||
        s === "emergency (ed)" ||
        s === "emergency department"
      );
    },
  },
  {
    label: "Emergency & Anaesthetics",
    match: (sub) => norm(sub).includes("emergency department & anaesthetic"),
  },
  {
    label: "Emergency Surgery",
    match: (sub) =>
      /emergency general surgery|trauma emergency surgery|\(egs\)|\(gates\)/i.test(sub),
  },
  {
    label: "Anaesthetics & ICU",
    match: (sub) => {
      const s = norm(sub);
      if (s.includes("emergency department")) return false;
      return (
        /^anaesthetics\b/.test(s) ||
        s.includes("intensive care") ||
        s === "icu" ||
        s.includes("peri op")
      );
    },
  },
  { label: "Infectious Diseases", match: (sub) => /infectious/i.test(sub) },
  {
    label: "Nephrology",
    match: (sub) => {
      const s = norm(sub);
      if (s.includes("renal surgery")) return false;
      return s.includes("nephrology") || /^renal\b/.test(s) || s === "renal";
    },
  },
  { label: "Respiratory Medicine", match: (sub) => /respiratory/i.test(sub) },
  {
    label: "Aged Care",
    match: (sub) =>
      /aged care|acute care of the elderly|orthogeriatric|trauma geriatric/i.test(sub),
  },
  { label: "Cardiology", match: (sub) => norm(sub) === "cardiology" },
  {
    label: "Gastroenterology",
    match: (sub) => {
      const s = norm(sub);
      return s === "gastro" || s === "gastroenterology";
    },
  },
  { label: "Endocrinology", match: (sub) => norm(sub) === "endocrinology" },
  { label: "Haematology", match: (sub) => norm(sub) === "haematology" },
  {
    label: "Oncology",
    match: (sub) => {
      const s = norm(sub);
      if (/surgical|gynaeoncology|radiation/i.test(s)) return false;
      return s === "oncology" || s.includes("medical oncology");
    },
  },
  {
    label: "Neurology",
    match: (sub) => norm(sub) === "neurology" || norm(sub) === "epilepsy",
  },
  { label: "Stroke", match: (sub) => norm(sub) === "stroke" },
  { label: "Rheumatology", match: (sub) => norm(sub).startsWith("rheumatology") },
  { label: "Dermatology", match: (sub) => norm(sub) === "dermatology" },
  { label: "General Medicine", match: (sub) => norm(sub) === "general medicine" },
  { label: "Palliative Care", match: (sub) => /palliative/i.test(sub) },
  { label: "Medical Unit", match: (sub) => /medical unit.*\(mu\d\)/i.test(sub) },
  {
    label: "Acute Medical Unit (AMU)",
    match: (sub) => /acute medical unit|\(amu\)/i.test(sub),
  },
  { label: "Pain Management", match: (sub) => /pain management/i.test(sub) },
  { label: "Clinical Genetics", match: (sub) => /clinical genetics/i.test(sub) },
  { label: "Clinical Immunology", match: (sub) => /clinical immunology/i.test(sub) },
  { label: "Hepatology", match: (sub) => norm(sub) === "hepatobiliary" },
  {
    label: "Hospital in the Home",
    match: (sub) => /hospital in the home|\(hith\)/i.test(sub),
  },
  { label: "Trauma", match: (sub) => norm(sub) === "trauma" },
  {
    label: "Cardiac Surgery",
    match: (sub) =>
      /cardiac surgery|cardiothoracic surgery \(cardiac\)/i.test(sub),
  },
  {
    label: "Thoracic Surgery",
    match: (sub) =>
      /thoracic surgery|thoracics surgery|cardiothoracic surgery \(thoracic\)|thoracics\/upper gi/i.test(
        sub,
      ),
  },
  {
    label: "ENT",
    match: (sub) => {
      const s = norm(sub);
      return s === "ent" || s.includes("ear nose and throat");
    },
  },
  { label: "Colorectal Surgery", match: (sub) => /colorectal/i.test(sub) },
  {
    label: "Breast Surgery",
    match: (sub) => /breast/i.test(sub) && /surgery|endocrine|\(boe\)/i.test(sub),
  },
  {
    label: "Upper GI Surgery",
    match: (sub) =>
      /upper gi|hepatopancreatobiliary|hepatobiliary\/ugi|liver transplant|general endocrine surgery|\(ges\)|surgery 1\)|surgery 3\)/i.test(
        sub,
      ),
  },
  { label: "General Surgery", match: (sub) => norm(sub) === "general surgery" },
  {
    label: "Orthopaedics",
    match: (sub) =>
      /^(orthopaedic|orthopaedics)\b|orthopaedic surgery|surgery \(orthopaedics/i.test(
        sub,
      ),
  },
  { label: "Urology", match: (sub) => norm(sub) === "urology" },
  { label: "Vascular Surgery", match: (sub) => /vascular surgery/i.test(sub) },
  { label: "Neurosurgery", match: (sub) => norm(sub) === "neurosurgery" },
  { label: "Plastic Surgery", match: (sub) => norm(sub) === "plastic surgery" },
  { label: "OMFS", match: (sub) => /oromaxillo|omfs/i.test(sub) },
  { label: "Ophthalmology", match: (sub) => norm(sub) === "ophthalmology" },
  { label: "Surgical Oncology", match: (sub) => /surgical oncology/i.test(sub) },
  { label: "Renal Surgery", match: (sub) => /renal surgery|\(neps\)/i.test(sub) },
  { label: "Spinal Medicine", match: (sub) => /spinal medicine|vscs/i.test(sub) },
  { label: "Robotic Surgery", match: (sub) => /robotic surgery/i.test(sub) },
  { label: "The Surgery Centre", match: (sub) => /surgery centre/i.test(sub) },
  {
    label: "Obstetrics & Gynaecology",
    match: (sub) =>
      /gynaecology|gynaeoncology|obstetric|obstetrics|perinatal|urogynaecology/i.test(
        sub,
      ),
  },
  { label: "Neonatology", match: (sub) => norm(sub) === "neonatology" },
  {
    label: "Radiology",
    match: (sub) =>
      norm(sub) === "radiology" ||
      /medical imaging/i.test(sub) ||
      /cancer imaging/i.test(sub),
  },
  { label: "Radiation Oncology", match: (sub) => /radiation oncology/i.test(sub) },
  {
    label: "Rehabilitation",
    match: (sub) => /rehabilitation|rehab abi|rehab consults/i.test(sub),
  },
  { label: "General Practice", match: (sub) => /general practice/i.test(sub) },
  {
    label: "Medical Education",
    match: (sub) => /medical education|medical humanities/i.test(sub),
  },
  { label: "Pathology", match: (sub) => norm(sub) === "pathology" },
  {
    label: "Public & Community Health",
    match: (sub) => /corrections medicine|immigrant|refugee health/i.test(sub),
  },
  {
    label: "Paediatrics",
    match: (sub) => ["NICU", "PICU", "PIPER"].includes(sub),
  },
];

export function subspecialtyFilterKey(p: Placement, regional: boolean): string {
  const mh = mentalHealthKey(p);
  if (mh) return mh;
  const rules = regional ? [...REGIONAL_RULES, ...METRO_RULES] : METRO_RULES;
  for (const { label, match } of rules) {
    if (match(p.subspecialty, p)) return label;
  }
  return p.subspecialty;
}

export function placementId(p: Placement): string {
  return `${p.subspecialty}|${p.hospital}|${p.clinicalSchoolCode}`;
}

export function areaLabel(area: Placement["area"]): string {
  return area ?? "—";
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function moveInShortlist(
  ids: string[],
  id: string,
  direction: -1 | 1,
): string[] {
  const i = ids.indexOf(id);
  if (i < 0) return ids;
  const j = i + direction;
  if (j < 0 || j >= ids.length) return ids;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function loadPreferences(termId: string): string[] {
  try {
    const raw = localStorage.getItem(`cs-prefs-${termId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function savePreferences(termId: string, ids: string[]): void {
  localStorage.setItem(`cs-prefs-${termId}`, JSON.stringify(ids));
}
