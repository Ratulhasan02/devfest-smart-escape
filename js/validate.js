const NODE_TYPES = new Set(["room", "junction", "exit"]);
const BLOCKABLE_TYPES = new Set(["room", "junction"]);

function addError(errors, key, params = {}) {
  errors.push({ key, params });
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function displayId(value) {
  return typeof value === "string" && value.length > 0 ? value : "?";
}

export function validateBuilding(building) {
  const errors = [];

  if (!isRecord(building)) {
    return [{ key: "errorBuildingName", params: {} }];
  }

  if (typeof building.name !== "string" || building.name.trim().length === 0) {
    addError(errors, "errorBuildingName");
  }

  const nodesAreArray = Array.isArray(building.nodes);
  const nodes = nodesAreArray ? building.nodes : [];
  if (!nodesAreArray) {
    addError(errors, "errorNodesArray");
  } else if (nodes.length < 2 || nodes.length > 60) {
    addError(errors, "errorNodeCount");
  }

  const nodesById = new Map();
  let hasRoomOrJunction = false;
  let hasExit = false;

  for (const node of nodes) {
    if (!isRecord(node)) {
      addError(errors, "errorNodeObject");
      continue;
    }

    const idIsValid = typeof node.id === "string" && node.id.trim().length > 0;
    if (!idIsValid) {
      addError(errors, "errorNodeId");
    } else if (nodesById.has(node.id)) {
      addError(errors, "errorDuplicateNodeId", { id: node.id });
    } else {
      nodesById.set(node.id, node);
    }

    const id = displayId(node.id);
    if (!NODE_TYPES.has(node.type)) {
      addError(errors, "errorNodeType", { id });
    } else if (BLOCKABLE_TYPES.has(node.type)) {
      hasRoomOrJunction = true;
    } else {
      hasExit = true;
    }

    if (typeof node.x !== "number" || !Number.isFinite(node.x)
      || typeof node.y !== "number" || !Number.isFinite(node.y)) {
      addError(errors, "errorNodeCoordinates", { id });
    }
  }

  if (nodesAreArray && !hasRoomOrJunction) {
    addError(errors, "errorNodeKinds");
  }
  if (nodesAreArray && !hasExit) {
    addError(errors, "errorExitRequired");
  }

  const edgesAreArray = Array.isArray(building.edges);
  const edges = edgesAreArray ? building.edges : [];
  if (!edgesAreArray) {
    addError(errors, "errorEdgesArray");
  } else if (edges.length < 1 || edges.length > 150) {
    addError(errors, "errorEdgeCount");
  }

  const seenPairs = new Set();
  for (const edge of edges) {
    if (!isRecord(edge)) {
      addError(errors, "errorEdgeObject");
      continue;
    }

    const from = displayId(edge.from);
    const to = displayId(edge.to);
    const endpointsExist = nodesById.has(edge.from) && nodesById.has(edge.to);
    if (!endpointsExist) {
      addError(errors, "errorEdgeEndpoint", { from, to });
    }

    if (typeof edge.from === "string" && edge.from === edge.to) {
      addError(errors, "errorSelfLoop", { id: from });
    }

    if (typeof edge.from === "string" && typeof edge.to === "string") {
      const pair = JSON.stringify([edge.from, edge.to].sort());
      if (seenPairs.has(pair)) {
        addError(errors, "errorRepeatedEdge", { from, to });
      } else {
        seenPairs.add(pair);
      }
    }

    if (!Number.isInteger(edge.cost) || edge.cost <= 0) {
      addError(errors, "errorEdgeCost", { from, to });
    }
  }

  validateInitialState(building.initial_state, nodesById, errors);
  return errors;
}

function validateInitialState(initialState, nodesById, errors) {
  if (!isRecord(initialState)
    || !Object.hasOwn(initialState, "start")
    || !Object.hasOwn(initialState, "blocked_nodes")
    || !Object.hasOwn(initialState, "closed_exits")) {
    addError(errors, "errorInitialState");
    return;
  }

  const startNode = nodesById.get(initialState.start);
  if (!startNode) {
    addError(errors, "errorStartId", { id: displayId(initialState.start) });
  } else if (startNode.type !== "room") {
    addError(errors, "errorStartCategory", { id: initialState.start });
  }

  validateStateList(
    initialState.blocked_nodes,
    "errorBlockedArray",
    "errorBlockedId",
    "errorBlockedCategory",
    "blockedListName",
    BLOCKABLE_TYPES,
    nodesById,
    errors,
  );
  validateStateList(
    initialState.closed_exits,
    "errorClosedArray",
    "errorClosedId",
    "errorClosedCategory",
    "closedListName",
    new Set(["exit"]),
    nodesById,
    errors,
  );
}

function validateStateList(values, arrayError, missingError, categoryError, listNameKey, allowedTypes, nodesById, errors) {
  if (!Array.isArray(values)) {
    addError(errors, arrayError);
    return;
  }

  const seen = new Set();
  for (const id of values) {
    const node = nodesById.get(id);
    if (!node) {
      addError(errors, missingError, { id: displayId(id) });
    } else if (!allowedTypes.has(node.type)) {
      addError(errors, categoryError, { id });
    }

    if (typeof id === "string") {
      if (seen.has(id)) {
        addError(errors, "errorDuplicateInitialId", {
          id,
          list: listNameKey === "blockedListName" ? "blocked_nodes" : "closed_exits",
        });
      } else {
        seen.add(id);
      }
    }
  }
}
