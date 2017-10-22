let { Graph } = require('./lib/graph');
let { removeCycles, minimizeEdgesByTR } = require('./lib/dag');
let { bestOfAssignLayersCG, bestOfAssignLayersMW } = require('./lib/layout');

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
const edges1 = [
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
const edges2 = [
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
  // [14, 2],
    [2, 14],
  // [14, 1],
    [1, 14],
  [11, 14],
  [8, 11],
  [11, 15],
  [2, 4],
  [1, 3],
  // [15, 1],
    [1, 15],
  [2, 3],
  // [15, 2],
    [2, 15],
  // [15, 5],
    [5, 15],
  [3, 5]
];

console.log('starting...');
console.log('edges1.length', edges1.length);
console.log('edges2.length', edges2.length);

let g1 = new Graph(null, edges1);
let g2 = new Graph(null, edges2);

console.log('removing cycles...');
g1 = removeCycles(g1);
g2 = removeCycles(g2);
console.log('g1.edgeCount', g1.edgeCount);
console.log('g1.edges', `(${g1.edges().join('), (')})`);
console.log('g2.edgeCount', g1.edgeCount);
console.log('g2.edges', `(${g2.edges().join('), (')})`);

console.log('assigning layers...');
let g1tr = minimizeEdgesByTR(g1);
let g2tr = minimizeEdgesByTR(g2);
let g1cgl = bestOfAssignLayersCG(g1tr);
let g2cgl = bestOfAssignLayersCG(g2tr);
let g1bmw = bestOfAssignLayersMW(g1);
let g2bmw = bestOfAssignLayersMW(g2);
console.log('g1 cgl', g1cgl);
console.log('g2 cgl', g2cgl);
console.log('g1 mw', g1bmw);
console.log('g2 mw', g2bmw);