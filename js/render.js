import { translate } from "./i18n.js";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const NODE_RADIUS = 17;

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

function addSvgText(parent, text, attributes = {}) {
  const element = createSvgElement("text", attributes);
  element.textContent = text;
  parent.append(element);
  return element;
}

function nodeLabel(node) {
  return typeof node.label === "string" && node.label.trim() ? node.label : node.id;
}

function nodeTypeLabel(type) {
  return translate(type);
}

export function renderEmptyMap(container, messageKey = "emptyMap") {
  container.replaceChildren();
  const state = document.createElement("div");
  state.className = "empty-state";
  const icon = document.createElement("span");
  icon.className = "empty-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "⌖";
  const message = document.createElement("p");
  message.dataset.i18n = messageKey;
  message.textContent = translate(messageKey);
  state.append(icon, message);
  container.append(state);
}

export function renderMap(container, building, state, route, onNodeClick, onEdgeClick) {
  const svg = createSvgElement("svg", {
    viewBox: getViewBox(building.nodes),
    role: "group",
    "aria-label": translate("accessibilityMap", { name: building.building }),
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.classList.add("map-svg");
  const blockedEdges = state.blockedEdges;
  const routeEdges = new Set(
    route?.status === "ok"
      ? route.path.slice(1).map((id, index) => JSON.stringify([route.path[index], id].sort()))
      : [],
  );

  const edgesGroup = createSvgElement("g", { "aria-label": translate("edgeCount") });
  for (const edge of building.edges) {
    const from = building.nodes.find((node) => node.id === edge.from);
    const to = building.nodes.find((node) => node.id === edge.to);
    const pairKey = JSON.stringify([edge.from, edge.to].sort());
    const isBlocked = blockedEdges.has(edge.id);
    const isRouteEdge = routeEdges.has(pairKey) && !isBlocked;
    const edgeGroup = createSvgElement("g", {
      role: "img",
      class: `edge-group${isBlocked ? " is-blocked" : ""}${isRouteEdge ? " is-route" : ""}`,
      "aria-label": translate("accessibilityEdge", {
        from: nodeLabel(from),
        to: nodeLabel(to),
        cost: edge.cost,
      }),
    });
    if (state.mode === "hazard") {
      edgeGroup.setAttribute("role", "button");
      edgeGroup.setAttribute("tabindex", "0");
      edgeGroup.setAttribute("aria-pressed", String(isBlocked));
      edgeGroup.setAttribute("aria-label", `${translate("accessibilityEdge", {
        from: nodeLabel(from),
        to: nodeLabel(to),
        cost: edge.cost,
      })}, ${isBlocked ? translate("hazardBlocked") : translate("hazardOpen")}`);
      edgeGroup.addEventListener("click", () => onEdgeClick(edge.id));
      edgeGroup.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdgeClick(edge.id);
        }
      });
    }
    edgeGroup.append(createSvgElement("line", {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      class: "edge-hit-area",
    }));
    edgeGroup.append(createSvgElement("line", {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      class: "edge-line",
    }));

    const middleX = (from.x + to.x) / 2;
    const middleY = (from.y + to.y) / 2;
    edgeGroup.append(createSvgElement("rect", {
      x: middleX - 17,
      y: middleY - 10,
      width: 34,
      height: 20,
      rx: 7,
      class: "edge-cost-bg",
      "pointer-events": "none",
    }));
    addSvgText(edgeGroup, translate("accessibilityEdgeCost", { cost: edge.cost }), {
      x: middleX,
      y: middleY,
      class: "edge-cost",
      "pointer-events": "none",
    });
    edgesGroup.append(edgeGroup);
  }
  svg.append(edgesGroup);

  const nodesGroup = createSvgElement("g");
  for (const node of building.nodes) {
    const isBlocked = state.blockedNodes.has(node.id);
    const isClosed = state.closedExits.has(node.id);
    const isSelectedStart = node.id === state.start;
    const stateSuffix = isBlocked
      ? translate("accessibilityBlockedSuffix")
      : isClosed
        ? translate("accessibilityClosedSuffix")
        : "";
    const nodeGroup = createSvgElement("g", {
      role: "img",
      class: `node-group${isSelectedStart ? " is-start" : ""}${isBlocked ? " is-blocked" : ""}${isClosed ? " is-closed" : ""}`,
      "aria-label": translate("accessibilityNode", {
        label: nodeLabel(node),
        type: nodeTypeLabel(node.type),
        state: stateSuffix,
      }),
    });
    const canSelectStart = node.type !== "exit" && !isBlocked;
    const hazardClickable = state.mode === "hazard";
    if ((state.mode === "start" && canSelectStart) || hazardClickable) {
      nodeGroup.setAttribute("role", "button");
      nodeGroup.setAttribute("tabindex", "0");
      nodeGroup.setAttribute(
        "aria-pressed",
        String(state.mode === "start" ? isSelectedStart : isBlocked || isClosed),
      );
      nodeGroup.addEventListener("click", () => onNodeClick(node.id));
      nodeGroup.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNodeClick(node.id);
        }
      });
    }
    if (isSelectedStart) {
      nodeGroup.append(createSvgElement("circle", {
        cx: node.x,
        cy: node.y,
        r: NODE_RADIUS + 6,
        class: "node-start-ring",
      }));
    }
    const shapeClass = isBlocked
      ? "node-blocked"
      : isClosed
        ? "node-closed"
        : `node-${node.type}`;
    nodeGroup.append(createNodeShape(node, shapeClass));

    if (isBlocked) {
      nodeGroup.append(createSvgElement("path", {
        d: `M ${node.x - 6} ${node.y - 6} L ${node.x + 6} ${node.y + 6} M ${node.x + 6} ${node.y - 6} L ${node.x - 6} ${node.y + 6}`,
        class: "node-state-mark",
      }));
    }
    if (isSelectedStart) {
      nodeGroup.append(createSvgElement("circle", {
        cx: node.x,
        cy: node.y,
        r: 5,
        fill: "#102a43",
        class: "node-start-marker",
      }));
    }
    if (isClosed) {
      nodeGroup.append(createSvgElement("path", {
        d: `M ${node.x - 8} ${node.y} L ${node.x + 8} ${node.y}`,
        class: "node-state-mark node-closed-mark",
      }));
    }

    addSvgText(nodeGroup, nodeLabel(node), {
      x: node.x,
      y: node.y + NODE_RADIUS + 19,
      class: "node-label",
    });
    nodesGroup.append(nodeGroup);
  }
  svg.append(nodesGroup);
  container.replaceChildren(svg);
}

function createNodeShape(node, className) {
  const shared = { class: `node-shape ${className}` };
  if (node.type === "junction") {
    return createSvgElement("polygon", {
      ...shared,
      points: `${node.x},${node.y - NODE_RADIUS} ${node.x + NODE_RADIUS},${node.y} ${node.x},${node.y + NODE_RADIUS} ${node.x - NODE_RADIUS},${node.y}`,
    });
  }
  if (node.type === "exit") {
    return createSvgElement("rect", {
      ...shared,
      x: node.x - NODE_RADIUS,
      y: node.y - NODE_RADIUS,
      width: NODE_RADIUS * 2,
      height: NODE_RADIUS * 2,
      rx: 7,
    });
  }
  return createSvgElement("circle", {
    ...shared,
    cx: node.x,
    cy: node.y,
    r: NODE_RADIUS,
  });
}

function getViewBox(nodes) {
  const xs = nodes.map((node) => node.x);
  const ys = nodes.map((node) => node.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(Math.max(...xs) - minX, NODE_RADIUS * 4);
  const height = Math.max(Math.max(...ys) - minY, NODE_RADIUS * 4);
  const padding = NODE_RADIUS + 35;
  return `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`;
}

function addDetailRow(parent, label, value) {
  const row = document.createElement("div");
  row.className = "detail-row";
  const labelElement = document.createElement("span");
  labelElement.className = "detail-label";
  labelElement.textContent = label;
  const valueElement = document.createElement("span");
  valueElement.className = "detail-value";
  valueElement.textContent = value;
  row.append(labelElement, valueElement);
  parent.append(row);
}

export function renderBuildingDetails(container, building) {
  container.replaceChildren();
  addDetailRow(container, translate("buildingName"), building.building);
  addDetailRow(container, translate("nodeCount"), `${building.nodes.length} ${translate("nodesUnit")}`);
  addDetailRow(container, translate("edgeCount"), `${building.edges.length} ${translate("edgesUnit")}`);
}

export function renderInitialState(container, building, state = null) {
  container.replaceChildren();
  const initialState = state
    ? {
      start: state.start,
      blocked_nodes: [...state.blockedNodes],
      blocked_edges: [...state.blockedEdges],
      closed_exits: [...state.closedExits],
    }
    : building.initial_state;
  const nodeById = new Map(building.nodes.map((node) => [node.id, node]));
  const formatIds = (ids) => ids.length
    ? ids.map((id) => nodeLabel(nodeById.get(id))).join(", ")
    : translate("none");

  const list = document.createElement("ul");
  list.className = "state-list";
  const rows = [
    [
      translate("startLocation"),
      initialState.start ? nodeLabel(nodeById.get(initialState.start)) : translate("none"),
    ],
    [translate("blockedLocations"), formatIds(initialState.blocked_nodes)],
    [translate("closedExits"), formatIds(initialState.closed_exits)],
  ];
  for (const [label, value] of rows) {
    const item = document.createElement("li");
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = value;
    item.append(labelElement, valueElement);
    list.append(item);
  }

  container.append(list);
}

export function renderRouteResult(container, route) {
  container.replaceChildren();
  if (!route) {
    const empty = document.createElement("p");
    empty.className = "muted-copy";
    empty.dataset.i18n = "routeEmpty";
    empty.textContent = translate("routeEmpty");
    container.append(empty);
    return;
  }

  const statusKey = route.status === "no_route"
    ? "routeNoRoute"
    : route.status === "start_blocked"
      ? "routeStartBlocked"
      : null;
  if (statusKey) {
    const failure = document.createElement("p");
    failure.className = "route-failure";
    failure.dataset.i18n = statusKey;
    failure.textContent = translate(statusKey);
    container.append(failure);
    return;
  }

  const path = document.createElement("ol");
  path.className = "route-path";
  path.setAttribute("aria-label", translate("routeTransitionLabel"));
  for (const [index, id] of route.path.entries()) {
    if (index > 0) {
      const separator = document.createElement("li");
      separator.className = "route-arrow";
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = "→";
      path.append(separator);
    }
    const item = document.createElement("li");
    item.className = "route-node";
    item.textContent = id;
    path.append(item);
  }
  container.append(path);

  const summary = document.createElement("div");
  summary.className = "route-summary";
  addDetailRow(summary, translate("routeExit"), route.exit);
  addDetailRow(summary, translate("routeCost"), String(route.cost));
  container.append(summary);
}

export function renderMessages(list, emptyMessage, card, errors, translateError) {
  list.replaceChildren();
  const hasErrors = errors.length > 0;
  list.hidden = !hasErrors;
  emptyMessage.hidden = hasErrors;
  card.classList.toggle("has-errors", hasErrors);
  for (const error of errors) {
    const item = document.createElement("li");
    item.textContent = translateError(error);
    list.append(item);
  }
}

export function renderMapCount(element, building) {
  element.textContent = `${building.nodes.length} ${translate("nodesUnit")} · ${building.edges.length} ${translate("edgesUnit")}`;
  element.hidden = false;
}

export function clearMapCount(element) {
  element.textContent = "";
  element.hidden = true;
}
