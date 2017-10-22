let { Graph } = require('./graph');

// coffman-graham layering
function assignLayersCG(G, W) {
  const lambda = {};
  const unprioritized = {};
  const U = {}; // assigned vertices
  let uCount = 0;
  const Z = {}; // assigned to layer above current
  const C = {}; // compliment of U, i.e. V\U
  const L = []; // layers
  let currentLayer = 0;
  let widthCurrent = 0;

  for (let v of G.vertices()) {
    lambda[v] = Infinity;
    unprioritized[v] = true;
    C[v] = true;
  }

  for (let i = 0; i < G.vertexCount; i++) {
    // select a vertex v with lambda[v] = Infinity
    // such that immediate predecessors are minimum
    let min = Infinity;
    let k;

    for (let v of Object.keys(unprioritized)) {
      let inDegree = G.getInDegree(v);

      if (inDegree < min) {
        min = inDegree;
        k = v;
      }
    }

    if (k) {
      lambda[k] = i;
      delete unprioritized[k];
    }
  }

  // initialize current layer
  L[currentLayer] = {};

  while (uCount !== G.vertexCount) {
    // select a vertex v from unassigned such that
    // all the immediate successors are already assigned
    // and lambda[v] is maximum
    let max = -Infinity;
    let k;
    let children;

    for (let v of Object.keys(C)) {
      let select = true;
      let ch = G.children(v);

      for (let child of ch) {
        if (!U[child]) {
          select = false;
          break;
        }
      }
      if (select && lambda[v] > max) {
        max = lambda[v];
        k = v;
        children = ch;
      }
    }

    let childrenInZ = true;
    for (let child of children) {
      if (!Z[child]) {
        childrenInZ = false;
        break;
      }
    }

    if (widthCurrent > W || !childrenInZ) {
      for (let v of Object.keys(L[currentLayer])) {
        Z[v] = true;
      }
      L[++currentLayer] = {};
      widthCurrent = 0;
    }

    L[currentLayer][k] = true;
    widthCurrent++;
    U[k] = true;
    uCount++;
    delete C[k];
  }

  // reverse layers
  const Lr = [];
  for (let i = 0; i < L.length; i++) {
    Lr[L.length - i - 1] = L[i];
  }

  return Lr;
}

exports.assignLayersCG = assignLayersCG;

function bestOfAssignLayersCG(G, W = [1, 2, 3, 4]) {
  let best;

  for (let i of W) {
    const layers = assignLayersCG(G, i);

    if (!best || best.length > layers.length) {
      best = layers;
    }
  }

  return best;
}

exports.bestOfAssignLayersCG = bestOfAssignLayersCG;

// assign layers longest path
function assignLayersLP(G) {
  const U = {}; // assigned vertices
  let uCount = 0;
  const Z = {}; // assigned to layer below current
  const C = {}; // compliment of U, i.e. V\U
  const L = []; // layers
  let currentLayer = 0;

  // initialize current layer
  L[currentLayer] = {};

  for (let v of G.vertices()) {
    C[v] = true;
  }

  while (uCount !== G.vertexCount) {
    // select vertex v from unassigned such that
    // all its immediate successors are already assigned
    // to the layers below the current one
    let k;

    for (let v of Object.keys(C)) {
      let select = true;

      for (let child of G.children(v)) {
        if (!Z[child]) {
          select = false;
          break;
        }
      }
      if (select) {
        k = v;
        break;
      }
    }

    if (k) {
      L[currentLayer][k] = true;
      U[k] = true;
      uCount++;
      delete C[k];
    }

    if (!k) {
      for (let v of Object.keys(L[currentLayer])) {
        Z[v] = true;
      }
      L[++currentLayer] = {};
    }
  }

  // reverse layers
  const Lr = [];
  for (let i = 0; i < L.length; i++) {
    Lr[L.length - i - 1] = L[i];
  }

  return Lr;
}

exports.assignLayersLP = assignLayersLP;

// assign layers with min-width
function assignLayersMW(G, W, c) {
  const cxW = c * W;
  const U = {}; // assigned vertices
  let uCount = 0;
  const Z = {}; // assigned to layer below current
  const C = {}; // compliment of U, i.e. V\U
  const L = []; // layers
  let currentLayer = 0;
  let widthCurrent = 0;
  let widthUp = 0;

  // initialize current layer
  L[currentLayer] = {};

  for (let v of G.vertices()) {
    C[v] = true;
  }

  while (uCount !== G.vertexCount) {
    // select vertex v from unassigned such that
    // all its immediate successors are already assigned
    // to the layers below the current one
    // and maximum out-degree
    let max = -Infinity;
    let k;

    for (let v of Object.keys(C)) {
      let select = true;
      let outDegree = G.getOutDegree(v);

      for (let child of G.children(v)) {
        if (!Z[child]) {
          select = false;
          break;
        }
      }
      if (select && outDegree > max) {
        max = outDegree;
        k = v;
      }
    }

    let conditionGoUp = false;

    if (k) {
      L[currentLayer][k] = true;
      U[k] = true;
      uCount++;
      delete C[k];

      widthCurrent = widthCurrent - max + 1;
      widthUp += G.getInDegree(k);

      if (widthCurrent >= W && max < 1) {
        conditionGoUp = true;
      }
    }

    if (!k || conditionGoUp || widthUp >= cxW) {
      for (let v of Object.keys(L[currentLayer])) {
        Z[v] = true;
      }
      L[++currentLayer] = {};
      widthCurrent = widthUp;
      widthUp = 0;
    }
  }

  // reverse layers
  const Lr = [];
  for (let i = 0; i < L.length; i++) {
    Lr[L.length - i - 1] = L[i];
  }

  return Lr;
}

exports.assignLayersMW = assignLayersMW;

function bestOfAssignLayersMW(G, W = [1, 2, 3, 4], c = [1, 2]) {
  let best;

  for (let i of W) {
    for (let j of c) {
      const layers = assignLayersMW(G, i, j);

      if (!best || best.length > layers.length) {
        best = layers;
      }
    }
  }

  return best;
}

exports.bestOfAssignLayersMW = bestOfAssignLayersMW;
