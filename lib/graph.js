const { deepClone } = require('./clone');

// graph

class Graph {
  constructor(vertices, edges) {
    this._vertices = {};
    this._inedges = {};
    this._outedges = {};
    this._vertex_count = 0;
    this._meta = {};

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

  clone() {
    const graph = new this.constructor();
    graph._vertices = deepClone(this._vertices);
    graph._inedges = deepClone(this._inedges);
    graph._outedges = deepClone(this._outedges);
    graph._vertex_count = deepClone(this._vertex_count);
    graph._meta = deepClone(this._meta);
    return graph;
  }

  addVertex(v) {
    if (!this._vertices[v]) {
      this._vertices[v] = true;
      this._inedges[v] = {};
      this._outedges[v] = {};
      this._meta[v] = {
        indegree: 0,
        outdegree: 0
      };
      this._vertex_count++;
    }
  }

  removeVertex(v) {
    if (this._vertices[v]) {
      // remove inbound edges
      this.removeEdge([null, v], true);
      // remove outbound edges
      this.removeEdge([v, null], true);

      delete this._meta[v];
      delete this._vertices[v];
      this._vertex_count--;
    }
  }

  vertices() {
    return Object.keys(this._vertices);
  }

  vertexCount() {
    return this._vertex_count;
  }

  isEmpty() {
    return !this._vertex_count;
  }

  getInDegree(v) {
    return this._meta[v].indegree;
  }

  getOutDegree(v) {
    return this._meta[v].outdegree;
  }

  getDegree(v) {
    return this._meta[v].outdegree + this._meta[v].indegree;
  }

  addEdge([u, v]) {
    this.addVertex(u);
    this.addVertex(v);
    this._inedges[v][u] = true;
    this._outedges[u][v] = true;
    this._meta[v].indegree++;
    this._meta[u].outdegree++;
  }

  removeEdge([u = null, v = null]) {
    if (u !== null && v !== null) {
      if (this._outedges[u][v] && this._inedges[v][u]) {
        delete this._outedges[u][v];
        delete this._inedges[v][u];
        this._meta[v].indegree--;
        this._meta[u].outdegree--;
      }
      return;
    }
    if (u === null && v === null) {
      return;
    }
    if (u === null) {
      // delete all inbound edges to vertex v
      for (let k of Object.keys(this._outedges)) {
        if (this._outedges[k][v]) {
          delete this._outedges[k][v];
          this._meta[k].outdegree--;
        }
      }
      // if second arrgument is true
      // vertex is being deleted, delete reference
      if (arguments[1] === true) {
        delete this._inedges[v];
      } else {
        this._inedges[v] = {};
        this._meta[v].indegree = 0;
      }
      return;
    }
    if (v === null) {
      // delete all outbound edges from vertex u
      for (let k of Object.keys(this._inedges)) {
        if (this._inedges[k][u]) {
          delete this._inedges[k][u];
          this._meta[k].indegree--;
        }
      }
      // if second arrgument is true
      // vertex is being deleted, delete reference
      if (arguments[1] === true) {
        delete this._outedges[u];
      } else {
        this._outedges[u] = {};
        this._meta[u].outdegree = 0;
      }
      return;
    }
  }

  edges(u = null, v = null) {
    const e = [];
    if (u === null && v === null) {
      for (let k of Object.keys(this._outedges)) {
        for (let l of Object.keys(this._outedges[k])) {
          e.push([k, l]);
        }
      }
      return e;
    }
    if (u !== null && v !== null) {
      if (this._outedges[u] && this._outedges[u][v]) {
        return e.push([u, v]);
      }
      return e;
    }
    if (u !== null) {
      for (let k of Object.keys(this._outedges[u])) {
        e.push([u, k]);
      }
      return e;
    }
    if (v !== null) {
      for (let k of Object.keys(this._inedges[v])) {
        e.push([k, v]);
      }
      return e;
    }
    return e;
  }

  edgeCount() {
    let count = 0;
    for (let k of Object.keys(this._outedges)) {
      for (let l of Object.keys(this._outedges[k])) {
        count++;
      }
    }
    return count;
  }
}

exports.Graph = Graph;