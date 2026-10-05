# Smart Escape: Interactive Evacuation Route Simulator

**Name:** Ratul Hasan

**Registration number:** N/A (mock test)

**Live site:** https://ratulhasan02.github.io/devfest-smart-escape/

Smart Escape is a bilingual, browser-based evacuation route simulator built with plain HTML, CSS, and JavaScript ES modules.

## Main features done

- Import a building JSON file or load the included sample; invalid files are reported in English or Bengali and are not drawn.
- Validate the official building schema, node and edge limits, unique IDs, labels and categories, coordinates, positive integer costs, endpoints, undirected duplicate connections, and initial hazard IDs/categories.
- Draw a responsive SVG floor plan with room, junction, exit, connection-cost, route, and hazard states.
- Choose any unblocked room or junction as the starting location.
- Calculate a minimum-cost route to an open exit, with deterministic ties by cost, exit ID, and then the complete node-ID sequence.
- Toggle hazards on rooms/junctions, corridors by edge ID, and exits; recalculate the route immediately.
- Reset hazards to the imported initial state while retaining the current start if it is still an unblocked room or junction. Otherwise, no start is selected.
- Operate map controls with a keyboard, switch languages, and respect reduced-motion preferences.

## Bonus features

None of the optional challenge bonuses are implemented.

## Run locally

The sample loader and JavaScript ES modules require an HTTP origin. From this folder, start a static web server and open its local URL. For example:

```powershell
npx serve .
```

GitHub Pages deploys the `main` branch root.

## Screenshots

- `screenshots/baseline-route.png` — live-site baseline route R1 → C1 → C2 → E1, cost 7.
- `screenshots/reroute-blocked-c2.png` — live-site route after blocking C2: R1 → C1 → C3 → C4 → E2, cost 11.

## Building JSON format

The app accepts the challenge schema. A building has a non-empty `building` name, labeled nodes, uniquely identified edges, and an `initial_state` containing the three hazard-ID arrays. The user chooses a start in the app; the JSON does not contain a start field.

```json
{
  "building": "Example Building",
  "nodes": [
    { "id": "R1", "label": "Room 1", "type": "room", "x": 120, "y": 180 },
    { "id": "C1", "label": "Corridor 1", "type": "junction", "x": 300, "y": 180 },
    { "id": "E1", "label": "East Exit", "type": "exit", "x": 500, "y": 180 }
  ],
  "edges": [
    { "id": "e1", "from": "R1", "to": "C1", "cost": 2 },
    { "id": "e2", "from": "C1", "to": "E1", "cost": 3 }
  ],
  "initial_state": {
    "blocked_nodes": [],
    "blocked_edges": [],
    "closed_exits": []
  }
}
```

- `building` must be a non-empty string.
- Include 2–60 nodes and 1–150 edges. Node IDs and edge IDs must each be unique, non-empty strings.
- Every node must have a non-empty `label`, a `type` of `room`, `junction`, or `exit`, and numeric finite `x` and `y` coordinates.
- Every edge must have existing `from` and `to` node IDs and a positive integer `cost`. Corridors are undirected. Self-loops and repeated undirected pairs are invalid; A–B and B–A count as the same pair.
- Include at least one room or junction and at least one exit.
- `initial_state.blocked_nodes`, `initial_state.blocked_edges`, and `initial_state.closed_exits` must be arrays. Blocked node IDs must identify rooms or junctions, blocked edge IDs must identify existing edges, and closed exit IDs must identify exits.
- Choose the route's starting room or junction interactively after loading a valid building.

Validation errors are listed beside the map in the selected language. Invalid data is never drawn.

## Select a start and test hazards

Choose **Select start** and click an unblocked room or junction to calculate its shortest route to an open exit. Choose **Toggle hazard** to block/unblock a room or junction, block/unblock a corridor, or close/reopen an exit. Corridor hazard state is tracked by the edge's ID, even though its connection is undirected. **Reset** restores the imported initial hazards and retains the current start only when it remains valid and unblocked.

The sample supports the five challenge checks:

1. Select R1: R1 → C1 → C2 → E1, cost 7.
2. Select R1 and block C2: R1 → C1 → C3 → C4 → E2, cost 11.
3. Select R1 and close E1 and E2: no route available.
4. Select R2: R2 → C3 → C4 → E2, cost 7.
5. Select R1 and block R1: starting location blocked.

## Known issues

- Route costs are abstract edge weights; the app does not estimate travel time, accessibility, or real-world building safety.
- Imported data and hazard changes are kept in the current page session. Only the language preference is saved in local storage.
- The coordinate-based SVG is a diagram, not a scale-accurate architectural drawing.
- The bundled sample is synthetic and must not be used for emergency response.

## AI tools used

GitHub Copilot in VS Code was used for implementation assistance, code review, and generating test cases. The schema and routing requirements were checked against the challenge specification and sample scenarios.

## Most useful prompt

“Implement the Smart Escape app using the official JSON schema: building, labeled nodes, uniquely identified undirected edges, and initial blocked_nodes, blocked_edges, and closed_exits, with no initial start. Validate every field and category, use edge IDs for corridor hazards, and let users select an unblocked room or junction as the start. Keep routing deterministic and verify all five supplied scenarios.”

## Project files

- `index.html` — app layout and accessible controls.
- `css/style.css` — responsive styling and SVG map styles.
- `js/i18n.js` — English/Bengali translations and saved language choice.
- `js/validate.js` — JSON schema and domain validation.
- `js/graph.js` — pure shortest-route calculation and deterministic tie-breaking.
- `js/state.js` — starting location, current hazards, and reset behavior.
- `js/render.js` — interactive SVG map and information panels.
- `js/main.js` — import, routing, hazard controls, and event wiring.
- `sample/building.json` — example building using the challenge schema.

## License

MIT.
