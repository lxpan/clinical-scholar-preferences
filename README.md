# Clinical Scholar placement preferences (2027)

Tools to browse UniMelb MD Clinical Scholar placements and rank up to 10 preferences per term.

## For students (share this)

Use the **web app** in [`web/`](web/) once deployed — see [web/README.md](web/README.md) for hosting. That is the link to send to lay users: filters, grouped subspecialties, and a copyable ranked list for Sonia.

## For developers

- **Source lists:** `Term 1 placements.txt`, `Term 2 placements.txt`, `Term 3 placements.txt`, `ALL PLACEMENTS.txt`
- **Parsed JSON:** `data/metro-term1-placements.json`, `data/term2-regional-placements.json`, `data/term3-regional-placements.json`
- **Cursor canvases** (IDE only, not public URLs): `.cursor/projects/.../canvases/clinical-scholar-*.canvas.tsx`

To refresh the public site after list changes, copy JSON into `web/src/data/` and redeploy.
