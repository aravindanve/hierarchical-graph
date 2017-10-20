// hierarchical graph sort

class Graph {
  constructor(vertices, edges) {
    this._vertices = {};
    this._inedges = {};
    this._outedges = {};

    if (Array.isArray(vertices)) {
      for (let v of vertices) {
        this.addVertex(v);
      }
    }
    if (Array.isArray(edges)) {
      for (let e of edges) {
        if (Array.isArray(e) && e.length === 2) {
          this.addEdge(e);
        }
      }
    }
  }

  isEmpty() {
    return !Object.keys(this._vertices).length;
  }

  addVertex(v) {
    this._vertices[v] = true;
    this._inedges[v] = this._inedges[v] || {};
    this._outedges[v] = this._outedges[v] || {};
  }

  removeVertex(v) {
    console.log('Graph: removing vertex', v);
    for (let e of this.inboundEdges(v)) {
      this.removeEdge(e);
    }
    for (let e of this.outboundEdges(v)) {
      this.removeEdge(e);
    }
    delete this._vertices[v];
  }

  addEdge([u, v]) {
    if (u + '' !== v + '') {
      this.addVertex(u);
      this.addVertex(v);
      this._outedges[u][v] = true;
      this._inedges[v][u] = true;
    }
  }

  removeEdge([u, v]) {
    console.log('Graph: removing edge', [u, v]);
    if (this._outedges[u]) {
      delete this._outedges[u][v];
    }
    if (this._inedges[v]) {
      delete this._inedges[v][u];
    }
  }

  getInDegree(v) {
    if (typeof this._inedges[v] === 'object') {
      return Object.keys(this._inedges[v]).length;
    }
  }

  getOutDegree(v) {
    if (typeof this._outedges[v] === 'object') {
      return Object.keys(this._outedges[v]).length;
    }
  }

  countEdges() {
    let count = 0;
    for (let u of Object.keys(this._outedges)) {
      for (let v of Object.keys(this._outedges[u])) {
        ++count;
      }
    }
    return count;
  }

  * vertices() {
    for (let v of Object.keys(this._vertices)) {
      if (this._vertices[v]) {
        yield v;
      }
    }
  }

  * sourceVertices() {
    for (let v of this.vertices()) {
      if (!Object.keys(this._inedges[v]).length) {
        yield v;
      }
    }
  }

  * sinkVertices() {
    for (let v of this.vertices()) {
      if (!Object.keys(this._outedges[v]).length) {
        yield v;
      }
    }
  }

  * verticesWithDegree(deg) {
    for (let v of this.vertices()) {
      if (this.getInDegree(v) + this.getOutDegree(v) === deg) {
        yield v;
      }
    }
  }

  * edges (k = null) {
    if (k) {
      yield* this.inboundEdges(k);
      yield* this.outboundEdges(k);
    } else {
      for (let u of Object.keys(this._outedges)) {
        yield* this.outboundEdges(u);
      }
    }
  }

  * inboundEdges(v) {
    for (let e of Object.keys(this._inedges[v])) {
      yield [e, v];
    }
  }

  * outboundEdges(v) {
    for (let e of Object.keys(this._outedges[v])) {
      yield [v, e];
    }
  }
}

function deepClone(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    const clone = [];
    obj.forEach(value => {
      clone.push(deepClone(value));
    });
    return clone;
  } else {
    const clone = {};
    Object.keys(obj).forEach(key => {
      clone[key] = deepClone(obj[key])
    });
    return clone;
  }
}

// enhanced greedy heuristic
function removeCycles(G) {
  const Er = new Graph();
  while (!G.isEmpty()) {
    for (let v of G.sinkVertices()) {
      console.log('removing sink vertex', v);
      G.removeVertex(v);
    }
    for (let v of G.verticesWithDegree(0)) {
      console.log('removing 0 degree vertex', v);
      G.removeVertex(v);
    }
    for (let v of G.sourceVertices()) {
      console.log('removing source vertex', v);
      G.removeVertex(v);
    }
    if (!G.isEmpty()) {
      let max = -Infinity;
      let k;
      for (let v of G.vertices()) {
        const i = G.getOutDegree(v) - G.getInDegree(v);
        if (i > max) {
          max = i;
          k = v;
        }
      }
      console.log('selected vertex', k);
      for (let e of G.inboundEdges(k)) {
        console.log('adding edge', e);
        Er.addEdge(e);
      }
      console.log('removing vertex', k);
      G.removeVertex(k);
    }
  }
  return Er;
}

function assignLayers() { }
function orderVertices() { }
function assignCoordinates() { }

function draw(g) {
  // using the Sugiyama Method
  const cs = getCompoments(g);
  cs.forEach(c => {
    const c1 = removeCycles(c);
    const c2 = assignLayers(c1);
    const c3 = assignCoordinates(c2);
  });

}

// test
const edges = [
  [9, 12],
  [9, 13],
  [7, 9],
  [6, 7],
  [5, 7],
  [7, 10],
  [7, 11],
  [6, 10],
  [10, 14],
  [6, 8],
  [4, 6],
  [3, 6],
  [14, 2],
  [14, 1],
  [11, 14],
  [8, 11],
  [11, 15],
  [2, 4],
  [1, 3],
  [15, 1],
  [2, 3],
  [15, 2],
  [15, 5],
  [3, 5]
];

console.log('starting...');
const graph = new Graph(null, edges);

console.log('edges', edges.length);
console.log('graph.countEdges()', graph.countEdges());
const er = removeCycles(graph);

console.log('Er', er.countEdges(), Array.from(er.edges()));

