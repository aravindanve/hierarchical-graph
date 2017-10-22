// directed acyclic graph helpers

// remove cycles using enhanced greedy heuristic
function removeCycles(G) {
  G = G.clone();

  const Gf = G.clone();
  const Er = [];

  while (!G.isEmpty()) {
    // remove free vertices
    for (let v of G.vertices()) {
      if (G.getDegree(v) === 0) {
        G.remove(v);
      }
    }

    // remove sink vertices
    while (!G.isEmpty()) {
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
    while (!G.isEmpty()) {
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

    if (!G.isEmpty()) {
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
