# Building Evacuation Map

A static, no-build-step building map viewer made with HTML, CSS and JavaScript ES modules. It imports and validates building JSON, displays an interactive SVG floor plan, calculates shortest escape routes, and supports blocking nodes, corridors and exits.

## Run locally

The sample loader and ES modules need an HTTP origin. From this folder, start any static web server and open its local URL. For example:

```powershell
npx serve .
```

On GitHub Pages, publish this folder (or the repository root) as the site source.

## Building JSON format

```json
{
  "name": "Example Building",
  "nodes": [
    { "id": "lobby", "label": "Lobby", "type": "room", "x": 120, "y": 180 },
    { "id": "hall", "label": "Hall", "type": "junction", "x": 300, "y": 180 },
    { "id": "exit-a", "label": "East Exit", "type": "exit", "x": 500, "y": 180 }
  ],
  "edges": [
    { "from": "lobby", "to": "hall", "cost": 2 },
    { "from": "hall", "to": "exit-a", "cost": 3 }
  ],
  "initial_state": {
    "start": "lobby",
    "blocked_nodes": [],
    "closed_exits": []
  }
}
```

- `name` must be a non-empty string.
- Include 2–60 nodes and 1–150 connections. Node IDs must be unique.
- Node `type` is `room`, `junction` or `exit`; `x` and `y` are finite numbers. `label` is optional and defaults to the node ID.
- Every connection has existing `from` and `to` IDs and a positive integer `cost`. Self-connections and duplicate undirected pairs are not allowed.
- Include at least one room or junction and at least one exit.
- `initial_state.start` must identify a room. `blocked_nodes` can contain rooms and junctions; `closed_exits` can contain exits. Each list must be an array of existing node IDs.

Validation errors are listed beside the map in the selected language. Invalid data is never drawn.

## Select a start and test hazards

Use **Select start** and click an unblocked room or junction to recalculate its shortest route to an open exit. **Toggle hazard** switches clicks to toggling blocked rooms/junctions, blocked corridors, and closed exits. The Reset button restores the imported file's original hazards and keeps the selected starting node when it remains valid.

The included sample uses the R1/R2 and C1–C4 test graph. From R1 the route to E1 costs 7; blocking C2 reroutes to E2 for 11. From R2 the route to E2 costs 7.

## Project files

- `index.html` — app layout and accessible controls.
- `css/style.css` — responsive styling and SVG map styles.
- `js/i18n.js` — English/Bengali translations and saved language choice.
- `js/validate.js` — JSON shape and domain validation.
- `js/graph.js` — pure shortest-route calculation and deterministic tie-breaking.
- `js/state.js` — starting location, current hazards and reset behavior.
- `js/render.js` — interactive SVG map and information panels.
- `js/main.js` — import, routing, hazard controls and event wiring.
- `sample/building.json` — example building.
