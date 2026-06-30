# Cignetti Turnaround Dashboard — GitHub Pages Site

## How to publish

1. Create a GitHub repository (e.g. `cignetti-dashboard`)
2. Upload **all files** in this folder to the repository root:
   - `index.html`
   - `CIGNETTI_TURNAROUND_DASHBOARD_2-18.pptx` (place your .pptx here)
3. Go to **Settings → Pages → Source → Deploy from branch → main / root → Save**
4. Your site goes live at: `https://YOUR-USERNAME.github.io/cignetti-dashboard/`

## How it works

- On load, the site automatically fetches the `.pptx` from the same folder
- It extracts **slides 2 onwards** (slide 1 title is skipped)
- Slides auto-cycle every 5 seconds (adjustable)
- Use ← → arrows, thumbnail strip, or keyboard to navigate manually
- Press **F** for fullscreen, **Space** to pause/resume

## Updating slides

Just replace the `.pptx` file in the repo with the new version — the site always reads live from the file.

## Supported PPTX types

| Slide content | Status |
|---|---|
| Raster images (PNG, JPG, GIF) | ✅ Full support |
| EMF vector images | ✅ Supported |
| Embedded Excel charts | ⚠️ Needs workaround (see below) |

### If slides show blank (embedded charts)

PowerPoint embeds charts as live Excel objects — not images. To fix:
1. Open the `.pptx` in PowerPoint
2. For each chart: right-click → **Copy** → Edit → **Paste Special → PNG**
3. Delete the original chart object
4. Save and re-upload the `.pptx`

## Controls

| Key | Action |
|---|---|
| `←` / `→` | Previous / Next slide |
| `Space` | Play / Pause auto-cycle |
| `F` | Toggle fullscreen |
| Click thumbnail | Jump to slide |
| Speed dropdown | Change auto-cycle interval |
