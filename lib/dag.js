// directed acyclic graph helpers

// remove cycles using enhanced greedy heuristic
function removeCycles(G) {
  G = G.clone();

  const Gf = G.clone();
  const Er = [];

  while (!G.isEmpty) {
    // remove free vertices
    for (let v of G.vertices()) {
      if (G.getDegree(v) === 0) {
        G.remove(v);
      }
    }

    // remove sink vertices
    while (!G.isEmpty) {
      let removed = 0;
      for (let v of G.vertices()) {
        if (G.getOutDegree(v) === 0) {
          G.removeVertex(v);
          removed++;
        }
      }
      if (!removed) {
        break;
      }
    }

    // remove source vertices
    while (!G.isEmpty) {
      let removed = 0;
      for (let v of G.vertices()) {
        if (G.getInDegree(v) === 0) {
          G.removeVertex(v);
          removed++;
        }
      }
      if (!removed) {
        break;
      }
    }

    if (!G.isEmpty) {
      let max = -Infinity;
      let k;

      // get vertex k with max difference of
      // outbound edges and inbound edges
      for (let v of G.vertices()) {
        const diff = G.getOutDegree(v) - G.getInDegree(v);
        if (diff > max) {
          max = diff;
          k = v;
        }
      }

      // mark inbound edges of k for removal
      Er.push(...G.edges(null, k));

      // remove vertex k
      G.removeVertex(k);
    }
  }

  // remove edges and return result
  for (let e of Er) {
    Gf.removeEdge(e);
  }
  return Gf;
}

exports.removeCycles = removeCycles;

// minimize edges by transitive reduction
function minimizeEdgesByTR(G) {
  G = G.clone();

  const P = {}; // path matrix
  const vertices = G.vertices();

  // depth first search from each vertex
  // to compute transitive closure P
  for (let v of vertices) {
    const stack = [v];
    const visited = {};
    let node;

    while (stack.length) {
      node = stack.pop();

      for (let child of G.children(node)) {
        if (!visited[child]) {
          stack.push(child);
        }
      }

      // mark node as reachable from v
      P[node] = P[node] || {};
      P[node][v] = true;
      visited[node] = true;
    }
  }

  // minimize graph
  for (let i of vertices) {
    for (let j of vertices) {
      // reflexive reduction
      if (i === j) {
        G.removeEdge([i, j]);
        continue;
      }
      if (G.hasEdge([i, j])) {
        for (let k of vertices) {
          if (k === i || k === j) {
            continue;
          }
          // if k is reachable from i, j is reachable from k
          // i.e. i -.-> k, k -.-> j exist remove [i, j]
          if (P[k] && P[k][i] && P[j] && P[j][k]) {
            G.removeEdge([i, j]);
            continue;
          }
        }
      }
    }
  }

  return G;
}

exports.minimizeEdgesByTR = minimizeEdgesByTR;
