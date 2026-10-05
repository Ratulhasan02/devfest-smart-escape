export function edgeKey(firstId, secondId) {
  return JSON.stringify([firstId, secondId].sort());
}

function comparePaths(firstPath, secondPath) {
  const sharedLength = Math.min(firstPath.length, secondPath.length);
  for (let index = 0; index < sharedLength; index += 1) {
    if (firstPath[index] < secondPath[index]) return -1;
    if (firstPath[index] > secondPath[index]) return 1;
  }
  return firstPath.length - secondPath.length;
}

function buildAdjacency(building, blockedNodes, blockedEdges) {
  const adjacency = new Map();
  for (const node of building.nodes) {
    if (!blockedNodes.has(node.id)) {
      adjacency.set(node.id, []);
    }
  }

  for (const edge of building.edges) {
    if (blockedNodes.has(edge.from)
      || blockedNodes.has(edge.to)
      || blockedEdges.has(edgeKey(edge.from, edge.to))) {
      continue;
    }

    adjacency.get(edge.from)?.push({ id: edge.to, cost: edge.cost });
    adjacency.get(edge.to)?.push({ id: edge.from, cost: edge.cost });
  }

  for (const neighbors of adjacency.values()) {
    neighbors.sort((first, second) => (
      first.id < second.id ? -1 : first.id > second.id ? 1 : 0
    ));
  }
  return adjacency;
}

export function findRoute(building, start, hazards = {}) {
  const nodesById = new Map(building.nodes.map((node) => [node.id, node]));
  const blockedNodes = new Set(hazards.blockedNodes ?? []);
  const blockedEdges = new Set(hazards.blockedEdges ?? []);
  const closedExits = new Set(hazards.closedExits ?? []);

  if (blockedNodes.has(start)) {
    return { status: "start_blocked" };
  }

  const adjacency = buildAdjacency(building, blockedNodes, blockedEdges);
  if (!adjacency.has(start)) {
    return { status: "no_route" };
  }

  const distances = new Map([[start, 0]]);
  const paths = new Map([[start, [start]]]);
  const pending = [{ id: start, cost: 0, path: [start] }];

  while (pending.length > 0) {
    pending.sort((first, second) => (
      first.cost - second.cost || comparePaths(first.path, second.path)
    ));
    const current = pending.shift();
    const bestPath = paths.get(current.id);
    if (distances.get(current.id) !== current.cost
      || !bestPath
      || comparePaths(current.path, bestPath) !== 0) {
      continue;
    }

    const currentNode = nodesById.get(current.id);
    if (currentNode.type === "exit" && closedExits.has(current.id)) {
      continue;
    }

    for (const neighbor of adjacency.get(current.id) ?? []) {
      const nextCost = current.cost + neighbor.cost;
      const nextPath = [...current.path, neighbor.id];
      const knownCost = distances.get(neighbor.id);
      const knownPath = paths.get(neighbor.id);
      if (knownCost !== undefined && (
        nextCost > knownCost
        || (nextCost === knownCost && comparePaths(nextPath, knownPath) >= 0)
      )) {
        continue;
      }

      distances.set(neighbor.id, nextCost);
      paths.set(neighbor.id, nextPath);
      pending.push({ id: neighbor.id, cost: nextCost, path: nextPath });
    }
  }

  const candidates = building.nodes
    .filter((node) => node.type === "exit" && !closedExits.has(node.id))
    .filter((node) => distances.has(node.id))
    .sort((first, second) => {
      const costDifference = distances.get(first.id) - distances.get(second.id);
      if (costDifference !== 0) return costDifference;
      if (first.id < second.id) return -1;
      if (first.id > second.id) return 1;
      return comparePaths(paths.get(first.id), paths.get(second.id));
    });

  const selectedExit = candidates[0];
  if (!selectedExit) {
    return { status: "no_route" };
  }

  return {
    status: "ok",
    path: paths.get(selectedExit.id),
    exit: selectedExit.id,
    cost: distances.get(selectedExit.id),
  };
}
