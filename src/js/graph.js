module.exports = class Graph {
    constructor(numNodes) {
      this.numNodes = numNodes;
      this.adjacencyList = {};
    }
  
    addNode(v) {
      if (!this.adjacencyList[v]) this.adjacencyList[v] = [];
    }
  
    addEdge(v, u, weight) {
      this.adjacencyList[v].push({ node: u, weight: weight*-1 });
      this.adjacencyList[u].push({ node: v, weight: weight*-1 });
    }
  
    primMST() {
      const MST = new Graph();
  
      let Nlist = Object.keys(this.adjacencyList);
      let Elist = Object.values(this.adjacencyList);
  
      if (Nlist.length === 0) {
        return MST;
      }
  
      let s = Nlist[0];
      let edgeQueue = new PriorityQueue();
      let explored = new Set();
      explored.add(s);
      MST.addNode(s);
  
      Elist[0].forEach((edge) => {
        edgeQueue.PEnqueue([s, edge.node], edge.weight);
      });
  
      let currentMinEdge = edgeQueue.PDequeue();
  
      while (!edgeQueue.PQisEmpty()) {
        while (
          !edgeQueue.PQisEmpty() &&
          explored.has(currentMinEdge.element[1])
        ) {
          currentMinEdge = edgeQueue.PDequeue();
        }
  
        let next = currentMinEdge.element[1];
        let nextNode = Nlist.indexOf(next);
  
        if (!explored.has(next)) {
          MST.addNode(next);
          MST.addEdge(currentMinEdge.element[0], next, currentMinEdge.priority);
          Elist[nextNode].forEach((edge) => {
            edgeQueue.PEnqueue([next, edge.node], edge.weight);
          });
  
          s = next;
          explored.add(next);
        }
      }
  
      return MST;
    }


    printGraph() {
        var get_keys = Object.keys(this.adjacencyList);
    
        for (var i of get_keys) {
          var get_values = Object.values(this.adjacencyList[i]);
          var conc = "";
    
          for (var j of get_values) {
            conc += JSON.stringify(j) + " ";
          }
          console.log(i + " -> " + conc);
        }
    }
  
};

/*
var g = new Graph(5);
var vertices = [ '0', '1', '2', '3', '4'];
 
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addNode(vertices[i]);
}
 
// adding edges
g.addEdge('0', '1', 8);
g.addEdge('0', '2', 5);
g.addEdge('1', '2', 9);
g.addEdge('1', '3', 11);
g.addEdge('2', '3', 15);
g.addEdge('2', '4', 10);
g.addEdge('3', '4', 7);

//g.printGraph();
var gg = new Graph();
gg = g.primMST();
 
gg.printGraph();
*/