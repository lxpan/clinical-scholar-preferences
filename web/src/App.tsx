import { useState } from "react";
import term1 from "./data/term1.json";
import term2 from "./data/term2.json";
import term3 from "./data/term3.json";
import { PlacementBrowser } from "./PlacementBrowser";
import type { Placement, TermConfig } from "./types";

const TERMS: TermConfig[] = [
  {
    id: "term1",
    label: "Term 1",
    dates: "Feb 2027",
    description:
      "Melbourne metropolitan placements (4 weeks). Filter by area, specialty, and hospital, then rank up to 10 preferences.",
    regional: false,
    placements: term1 as Placement[],
  },
  {
    id: "term2",
    label: "Term 2",
    dates: "Jul 2027",
    description:
      "Regional Victoria placements (4 weeks). Same filters and ranking as Term 1 — preferences are saved separately per term.",
    regional: true,
    placements: term2 as Placement[],
  },
  {
    id: "term3",
    label: "Term 3",
    dates: "Nov 2027",
    description:
      "Regional Victoria placements (4 weeks). Most options overlap with Term 2; check the list for your campus.",
    regional: true,
    placements: term3 as Placement[],
  },
];

export default function App() {
  const [active, setActive] = useState(0);
  const term = TERMS[active];

  return (
    <div className="app">
      <header className="site-header">
        <h1>Clinical Scholar Placements 2027</h1>
        <p className="tagline">
          UniMelb MD — browse placements and build your ranked preference list (1–10 per term).
        </p>
      </header>

      <nav className="term-tabs" aria-label="Terms">
        {TERMS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            className={i === active ? "tab active" : "tab"}
            onClick={() => setActive(i)}
          >
            <span className="tab-label">{t.label}</span>
            <span className="tab-dates">{t.dates}</span>
          </button>
        ))}
      </nav>

      <main>
        <PlacementBrowser key={term.id} term={term} />
      </main>

      <footer className="site-footer">
        <p>
          <strong>Reminder:</strong> You can submit up to 10 preferences per term. You cannot repeat
          the same unit at the same hospital across terms. This tool does not submit preferences —
          copy your list and send it to Sonia as directed in your program materials.
        </p>
      </footer>
    </div>
  );
}
