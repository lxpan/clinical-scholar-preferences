export type Area = "Medical" | "Surgery" | "Mental Health" | "Paediatrics";

export type Placement = {
  specialty: string;
  subspecialty: string;
  clinicalSchool: string;
  clinicalSchoolCode: string;
  hospital: string;
  suburb: string;
  area: Area | null;
};

export type SortKey =
  | "specialty"
  | "subspecialty"
  | "hospital"
  | "clinicalSchool"
  | "suburb"
  | "area";

export type TermConfig = {
  id: string;
  label: string;
  dates: string;
  description: string;
  regional: boolean;
  placements: Placement[];
};
