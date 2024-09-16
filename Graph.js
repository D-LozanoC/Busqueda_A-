// Clase Graph para gestionar el grafo
export class Graph {
    constructor() {
        this.adjacencyList = new Map(); // Mapa para nodos y aristas
        this.nodesId;
        this.counter = 0;
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
            for (let [target, weight] of edges) {
                edgesArray.push({ source: node, target: target, weight: weight });
            }
        }
        return edgesArray;
    }

    // Función para obtener todos los caminos entre dos nodos (origen y destino)
    getAllPaths(source, destination) {
        let paths = [];
        let visited = new Set();  // Conjunto de nodos visitados
        let currentPath = [];     // Camino actual
        // Función recursiva para DFS
        const dfs = (node, destination) => {
            if (!this.adjacencyList.has(node)) {
                console.error(`El nodo ${node} no existe en el grafo.`);
                return;
            }
            visited.add(node);       // Marcamos el nodo como visitado
            currentPath.push(node);  // Añadimos el nodo al camino actual
            // Si llegamos al nodo destino, guardamos el camino
            if (node === destination) {
                paths.push([...currentPath]);  // Guardamos una copia del camino actual
            } else {
                // Recorremos los nodos vecinos
                for (let neighbor of this.adjacencyList.get(node)) {
                    if (!visited.has(neighbor)) {  // Si no ha sido visitado
                        dfs(neighbor, destination);
                    }
                }
            }
            // Retrocedemos
            currentPath.pop();
            visited.delete(node);
        };
        // Iniciamos DFS desde el nodo de origen
        if (this.adjacencyList.has(source)) {
            dfs(source, destination);
        } else {
            console.error(`El nodo ${source} no existe en el grafo.`);
        }
        return paths;
    }

    isFull() {
        for (let [node, edges] of this.adjacencyList) {
            if (edges.size === 0) {
                return false;
            }
        }
        return true;
    }

}