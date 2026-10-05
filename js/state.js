import { edgeKey } from "./graph.js";

const START_TYPES = new Set(["room", "junction"]);
const BLOCKABLE_TYPES = new Set(["room", "junction"]);

function copy(value) {
  return structuredClone(value);
}

export function createBuildingState(building) {
  const buildingCopy = copy(building);
  const state = {
    building: buildingCopy,
    originalInitialState: copy(buildingCopy.initial_state),
    start: buildingCopy.initial_state.start,
    blockedNodes: new Set(buildingCopy.initial_state.blocked_nodes),
    blockedEdges: new Set(),
    closedExits: new Set(buildingCopy.initial_state.closed_exits),
    mode: "start",
  };
  return state;
}

export function getHazards(state) {
  return {
    blockedNodes: [...state.blockedNodes],
    blockedEdges: [...state.blockedEdges],
    closedExits: [...state.closedExits],
  };
}

export function setStart(state, nodeId) {
  const node = state.building.nodes.find((candidate) => candidate.id === nodeId);
  if (!node || !START_TYPES.has(node.type) || state.blockedNodes.has(nodeId)) {
    return false;
  }
  state.start = nodeId;
  return true;
}

export function toggleNodeHazard(state, nodeId) {
  const node = state.building.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) {
    throw new RangeError(`Unknown node ID: ${nodeId}`);
  }

  if (BLOCKABLE_TYPES.has(node.type)) {
    if (state.blockedNodes.has(nodeId)) {
      state.blockedNodes.delete(nodeId);
    } else {
      state.blockedNodes.add(nodeId);
    }
    return;
  }

  if (node.type === "exit") {
    if (state.closedExits.has(nodeId)) {
      state.closedExits.delete(nodeId);
    } else {
      state.closedExits.add(nodeId);
    }
    return;
  }

  throw new RangeError(`Unsupported node type: ${node.type}`);
}

export function toggleEdgeHazard(state, firstId, secondId) {
  const key = edgeKey(firstId, secondId);
  if (state.blockedEdges.has(key)) {
    state.blockedEdges.delete(key);
  } else {
    state.blockedEdges.add(key);
  }
}

export function resetBuildingState(state) {
  const previousStart = state.start;
  const restored = copy(state.originalInitialState);
  state.blockedNodes = new Set(restored.blocked_nodes);
  state.blockedEdges.clear();
  state.closedExits = new Set(restored.closed_exits);

  const selectedNode = state.building.nodes.find((node) => node.id === previousStart);
  state.start = selectedNode
    && START_TYPES.has(selectedNode.type)
    && !state.blockedNodes.has(previousStart)
    ? previousStart
    : restored.start;
}
