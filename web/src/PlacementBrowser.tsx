import { useMemo, useState } from "react";
import type { Placement, SortKey, TermConfig } from "./types";
import {
  AREA_OPTIONS,
  MAX_PREFERENCES,
  areaLabel,
  loadPreferences,
  moveInShortlist,
  placementId,
  savePreferences,
  subspecialtyFilterKey,
  uniqueSorted,
} from "./placementLogic";

type Props = { term: TermConfig };

function compare(a: Placement, b: Placement, key: SortKey, regional: boolean): number {
  const va =
    key === "area"
      ? areaLabel(a.area)
      : key === "subspecialty"
        ? subspecialtyFilterKey(a, regional)
        : String(a[key] ?? "");
  const vb =
    key === "area"
      ? areaLabel(b.area)
      : key === "subspecialty"
        ? subspecialtyFilterKey(b, regional)
        : String(b[key] ?? "");
  return va.localeCompare(vb);
}

export function PlacementBrowser({ term }: Props) {
  const { placements, regional, id: termId } = term;

  const [area, setArea] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [subspecialty, setSubspecialty] = useState("");
  const [hospital, setHospital] = useState("");
  const [school, setSchool] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("subspecialty");
  const [sortAsc, setSortAsc] = useState(true);
  const [shortlist, setShortlist] = useState<string[]>(() => loadPreferences(termId));

  const subspecialtyKey = (p: Placement) => subspecialtyFilterKey(p, regional);

  const options = useMemo(() => {
    const specs = uniqueSorted(placements.map((p) => p.specialty));
    const subs = uniqueSorted(placements.map(subspecialtyKey));
    const hospitals = uniqueSorted(placements.map((p) => p.hospital));
    const schools = uniqueSorted(placements.map((p) => p.clinicalSchool));
    return { specs, subs, hospitals, schools };
  }, [placements, regional]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return placements
      .filter((p) => {
        if (area && (p.area ?? "") !== area) return false;
        if (specialty && p.specialty !== specialty) return false;
        if (subspecialty && subspecialtyKey(p) !== subspecialty) return false;
        if (hospital && p.hospital !== hospital) return false;
        if (school && p.clinicalSchool !== school) return false;
        if (!q) return true;
        const blob = [
          p.specialty,
          p.subspecialty,
          p.hospital,
          p.clinicalSchool,
          p.suburb,
          subspecialtyKey(p),
          areaLabel(p.area),
        ]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      })
      .sort((a, b) => {
        const c = compare(a, b, sortKey, regional);
        return sortAsc ? c : -c;
      });
  }, [
    placements,
    area,
    specialty,
    subspecialty,
    hospital,
    school,
    search,
    sortKey,
    sortAsc,
    regional,
  ]);

  const byId = useMemo(() => {
    const m = new Map<string, Placement>();
    for (const p of placements) m.set(placementId(p), p);
    return m;
  }, [placements]);

  const ranked = shortlist
    .map((id) => byId.get(id))
    .filter((p): p is Placement => !!p);

  function resetFilters() {
    setArea("");
    setSpecialty("");
    setSubspecialty("");
    setHospital("");
    setSchool("");
    setSearch("");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function addToShortlist(p: Placement) {
    const id = placementId(p);
    if (shortlist.includes(id)) return;
    if (shortlist.length >= MAX_PREFERENCES) return;
    const next = [...shortlist, id];
    setShortlist(next);
    savePreferences(termId, next);
  }

  function removeFromShortlist(id: string) {
    const next = shortlist.filter((x) => x !== id);
    setShortlist(next);
    savePreferences(termId, next);
  }

  function reorder(id: string, dir: -1 | 1) {
    const next = moveInShortlist(shortlist, id, dir);
    setShortlist(next);
    savePreferences(termId, next);
  }

  function copyForSonia() {
    const lines = ranked.map(
      (p, i) =>
        `${i + 1}. ${p.subspecialty} — ${p.hospital} (${p.clinicalSchool})`,
    );
    const text = lines.join("\n");
    void navigator.clipboard.writeText(text);
    alert("Copied your ranked list to the clipboard. Paste it into your email or notes for Sonia.");
  }

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ▲" : " ▼") : "";

  return (
    <div className="browser">
      <p className="intro">{term.description}</p>

      <section className="filters" aria-label="Filters">
        <div className="filter-grid">
          <label>
            Area
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">All areas</option>
              {AREA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Specialty
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option value="">All specialties</option>
              {options.specs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subspecialty
            <select
              value={subspecialty}
              onChange={(e) => setSubspecialty(e.target.value)}
            >
              <option value="">All subspecialties</option>
              {options.subs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Hospital
            <select value={hospital} onChange={(e) => setHospital(e.target.value)}>
              <option value="">All hospitals</option>
              {options.hospitals.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
          <label>
            Clinical school
            <select value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">All schools</option>
              {options.schools.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="search-field">
            Search
            <input
              type="search"
              placeholder="Hospital, placement, suburb…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <button type="button" className="btn-secondary" onClick={resetFilters}>
          Reset filters
        </button>
        <p className="result-count">
          Showing {filtered.length} of {placements.length} placements
        </p>
      </section>

      <section className="preferences" aria-label="Your preferences">
        <div className="pref-header">
          <h2>Your preferences (1–{MAX_PREFERENCES})</h2>
          {ranked.length > 0 && (
            <button type="button" className="btn-secondary" onClick={copyForSonia}>
              Copy list for Sonia
            </button>
          )}
        </div>
        <p className="hint">
          Add placements from the table below. Your list is saved in this browser only.
          Submit your final ranked list to Sonia as instructed in the program email.
        </p>
        {ranked.length === 0 ? (
          <p className="empty-prefs">No preferences yet — use Add on a row below.</p>
        ) : (
          <table className="data-table pref-table">
            <thead>
              <tr>
                <th>Pref</th>
                <th>Placement</th>
                <th>Hospital</th>
                <th>School</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((p, i) => {
                const id = placementId(p);
                return (
                  <tr key={id}>
                    <td className="num">{i + 1}</td>
                    <td>{p.subspecialty}</td>
                    <td>{p.hospital}</td>
                    <td>{p.clinicalSchool}</td>
                    <td className="actions">
                      <button
                        type="button"
                        title="Move up"
                        disabled={i === 0}
                        onClick={() => reorder(id, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        disabled={i === ranked.length - 1}
                        onClick={() => reorder(id, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeFromShortlist(id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section aria-label="All placements">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button type="button" className="th-btn" onClick={() => toggleSort("subspecialty")}>
                    Placement{sortIndicator("subspecialty")}
                  </button>
                </th>
                <th>
                  <button type="button" className="th-btn" onClick={() => toggleSort("area")}>
                    Area{sortIndicator("area")}
                  </button>
                </th>
                <th>
                  <button type="button" className="th-btn" onClick={() => toggleSort("clinicalSchool")}>
                    Clinical school{sortIndicator("clinicalSchool")}
                  </button>
                </th>
                <th>
                  <button type="button" className="th-btn" onClick={() => toggleSort("hospital")}>
                    Hospital{sortIndicator("hospital")}
                  </button>
                </th>
                <th>
                  <button type="button" className="th-btn" onClick={() => toggleSort("suburb")}>
                    Suburb{sortIndicator("suburb")}
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const id = placementId(p);
                const inList = shortlist.includes(id);
                const rank = shortlist.indexOf(id);
                const full = shortlist.length >= MAX_PREFERENCES;
                return (
                  <tr key={id} className={inList ? "in-shortlist" : undefined}>
                    <td>{p.subspecialty}</td>
                    <td>{areaLabel(p.area)}</td>
                    <td>{p.clinicalSchool}</td>
                    <td>{p.hospital}</td>
                    <td>{p.suburb}</td>
                    <td>
                      {inList ? (
                        <span className="badge">#{rank + 1}</span>
                      ) : (
                        <button
                          type="button"
                          className="btn-add"
                          disabled={full}
                          onClick={() => addToShortlist(p)}
                        >
                          {full ? "Full" : "Add"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
