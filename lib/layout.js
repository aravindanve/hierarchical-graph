let { Graph } = require('./graph');

// coffman-graham layering
function assignLayers(G, W = Math.ceil(Math.sqrt(G.vertexCount))) {
  G = G.clone(); // necessary?

  const lambda = {};
  const unnumbered = {};
  const U = {}; // assigned vertices
  let lenU = 0;
  const C = {}; // compliment V\U

  for (let v of G.vertices()) {
    lambda[v] = Infinity;
    unnumbered[v] = true;
    C[v] = true;
  }
  for (let i = 1; i <= G.vertexCount; i++) {
    // choose a vertex v with lambda[v] = Infinity
    // such that adjacent child count |V-(v)| is minimized
    let min = Infinity;
    let k;
    for (let v of Object.keys(unnumbered)) {
      const childCount = G.getChildCount(v);

      if (childCount < min) {
        min = childCount;
        k = v;
      }
    }

    if (k) {
      lambda[k] = i;
      delete unnumbered[k];
    }
  }

  let n = 0;
  const L = [];
  const lenL = [];
  const prevLayer = {};

  L[n] = {};
  lenL[n] = 0;

  while (lenU !== G.vertexCount) {
    // choose v from V\U such that
    // all parents of v i.e. V+(v) is a strict subset of U
    // lambda[v] is maximized
    let max = 0;
    let k;
    let parents;

    for (let v of Object.keys(C)) {
      let pick = true;
      let ps = G.parents(v);

      for (let p of ps) {
        if (!U[p]) {
          pick = false;
          break;
        }
      }
      if (pick && lambda[v] > max) {
        max = lambda[v];
        k = v;
        parents = ps;
      }
    }

    let parentInPrevLayer = true;
    for (let p of parents) {
      if (!prevLayer[p]) {
        parentInPrevLayer = false;
        break;
      }
    }

    if (!parentInPrevLayer || lenL[n] >= W) {
      // record current level vertices in prevLayer
      for (let p of Object.keys(L[n])) {
        prevLayer[p] = true;
      }
      // increment layer
      L[++n] = {};
      lenL[n] = 0;
    }

    L[n][k] = true;
    lenL[n]++;
    U[k] = true;
    lenU++;
    delete C[k];
  }

  return L;
}

exports.assignLayers = assignLayers;

function orderVertices() { }
function assignCoordinates() { }
