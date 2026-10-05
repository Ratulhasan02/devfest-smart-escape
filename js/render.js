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

export function renderMap(container, building) {
  const svg = createSvgElement("svg", {
    viewBox: getViewBox(building.nodes),
    role: "img",
    "aria-label": translate("accessibilityMap", { name: building.name }),
    preserveAspectRatio: "xMidYMid meet",
  });
  const initialState = building.initial_state;
  const blockedNodes = new Set(initialState.blocked_nodes);
  const closedExits = new Set(initialState.closed_exits);

  const edgesGroup = createSvgElement("g", { "aria-label": translate("edgeCount") });
  for (const edge of building.edges) {
    const from = building.nodes.find((node) => node.id === edge.from);
    const to = building.nodes.find((node) => node.id === edge.to);
    const edgeGroup = createSvgElement("g", {
      role: "img",
      "aria-label": translate("accessibilityEdge", {
        from: nodeLabel(from),
        to: nodeLabel(to),
        cost: edge.cost,
      }),
    });
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
    }));
    addSvgText(edgeGroup, translate("accessibilityEdgeCost", { cost: edge.cost }), {
      x: middleX,
      y: middleY,
      class: "edge-cost",
    });
    edgesGroup.append(edgeGroup);
  }
  svg.append(edgesGroup);

  const nodesGroup = createSvgElement("g");
  for (const node of building.nodes) {
    const isBlocked = blockedNodes.has(node.id);
    const isClosed = closedExits.has(node.id);
    const stateSuffix = isBlocked
      ? translate("accessibilityBlockedSuffix")
      : isClosed
        ? translate("accessibilityClosedSuffix")
        : "";
    const nodeGroup = createSvgElement("g", {
      role: "img",
      "aria-label": translate("accessibilityNode", {
        label: nodeLabel(node),
        type: nodeTypeLabel(node.type),
        state: stateSuffix,
      }),
    });
    const shapeClass = isBlocked
      ? "node-blocked"
      : isClosed
        ? "node-closed"
        : `node-${node.type}`;
    nodeGroup.append(createNodeShape(node, shapeClass));

    if (node.id === initialState.start) {
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
        d: `M ${node.x - 5} ${node.y - 5} L ${node.x + 5} ${node.y + 5} M ${node.x + 5} ${node.y - 5} L ${node.x - 5} ${node.y + 5}`,
        class: "node-state-mark",
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
  addDetailRow(container, translate("buildingName"), building.name);
  addDetailRow(container, translate("nodeCount"), `${building.nodes.length} ${translate("nodesUnit")}`);
  addDetailRow(container, translate("edgeCount"), `${building.edges.length} ${translate("edgesUnit")}`);
}

export function renderInitialState(container, building) {
  container.replaceChildren();
  const initialState = building.initial_state;
  const nodeById = new Map(building.nodes.map((node) => [node.id, node]));
  const formatIds = (ids) => ids.length
    ? ids.map((id) => nodeLabel(nodeById.get(id))).join(", ")
    : translate("none");

  const list = document.createElement("ul");
  list.className = "state-list";
  const rows = [
    [translate("startLocation"), nodeLabel(nodeById.get(initialState.start))],
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
