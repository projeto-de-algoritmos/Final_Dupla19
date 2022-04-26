import PriorityQueue from "./priorityQueue";
export default class Graph {
  constructor(numNodes) {
    this.numNodes = numNodes;
    this.adjacencyList = {};
    this.cluster = -1;
  }

  addNode(v) {
    if (!this.adjacencyList[v]) this.adjacencyList[v] = [];
  }

  addEdge(v, u, weight) {
    this.adjacencyList[v].push({ node: u, weight: weight * -1 });
    this.adjacencyList[u].push({ node: v, weight: weight * -1 });
  }

  removeEdge(v, u) {
    if (this.adjacencyList[v] && this.adjacencyList[u]) {
      this.adjacencyList[v] = this.adjacencyList[v].filter(
        (ve) => ve.node !== u
      );
      this.adjacencyList[u] = this.adjacencyList[u].filter(
        (ve) => ve.node !== v
      );
    }
  }

  computeMaximumWeight() {
    var get_keys = Object.keys(this.adjacencyList);
    let weight = 0;
    let temp = 0;

    for (var i of get_keys) {
      var get_values = Object.values(this.adjacencyList[i]);
      temp = 0;

      for (var j of get_values) {
        temp += j.weight;
      }

      if (temp < weight){
        weight = temp;
        this.cluster = i;
      }
    }
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

    console.log(Elist[0]);
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
        if (Elist[nextNode] !== undefined)
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
