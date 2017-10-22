let { Graph } = require('./lib/graph');
let { removeCycles, minimizeEdgesByTR } = require('./lib/dag');

// hierarchical graph sort

// function draw(g) {
//   // using the Sugiyama Method
//   const cs = getCompoments(g);
//   cs.forEach(c => {
//     const c1 = removeCycles(c);
//     const c2 = assignLayers(c1);
//     const c3 = assignCoordinates(c2);
//   });

// }

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
console.log('edges.length', edges.length);

const g = new Graph(null, edges);
console.log('g.edgeCount', g.edgeCount);

const g1 = removeCycles(g);
console.log('g1.edgeCount', g1.edgeCount);

const g2 = minimizeEdgesByTR(g1);
console.log('g2.edgeCount', g2.edgeCount);
