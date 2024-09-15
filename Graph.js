// Clase Graph para gestionar el grafo
export class Graph {
    constructor() {
        this.adjacencyList = new Map(); // Mapa para nodos y aristas
    }

    // Agrega un nodo
    addNode(node) {
        if (!this.adjacencyList.has(node)) {
            this.adjacencyList.set(node, new Map());
        }
    }

    // Agrega una arista
    addEdge(node1, node2, weight) {
        this.addNode(node1);
        this.addNode(node2);
        this.adjacencyList.get(node1).set(node2, weight); // Añade el peso a la arista
        this.adjacencyList.get(node2).set(node1, weight); // Añade el peso a la arista (grafo no dirigido)
    }

    // Obtiene los nodos para D3
    getNodes() {
        let nodesArray = [];
        for (let node of this.adjacencyList.keys()) {
            nodesArray.push(node);
        }
        return nodesArray;
    }

    // Obtiene las aristas para D3
    getEdges() {
        let edgesArray = [];
        for (let [node, edges] of this.adjacencyList) {
            edges.forEach(({target, weight}) => {
                // Añade cada enlace solo una vez (grafo no dirigido)
                if (!edgesArray.some(edge => (edge.source === target && edge.target === node))) {
                    edgesArray.push({ source: node, target: target, weight: weight});
                }
            });
        }
        return edgesArray;
    }


}