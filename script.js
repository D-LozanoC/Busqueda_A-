//Importación de la clase Graph
import { Graph } from "./Graph.js";
import { GraphVisualizer } from "./GraphVisualizer.js";
import { AStarVisualizer } from "./AStarVisualizer.js";
// import { TreeVisualizer } from "./TreeVisualizer.js";

document.getElementById('inputNodos').addEventListener("input", function () {
    const graph = new Graph();
    const span = document.getElementById('span');
    span.innerHTML =
        `<h3>Conecte los nodos con sus respectivos pesos: </h3>
        <div id="inputCon">
            <div class="formCon">
                <label for="nodoUno">Nodo: </label>
                <select id="nodoUno"></select>
                <br><br>
                <label for="weight">Peso: </label>
                <input id="weight" type="number" name="weight" placeholoder="number" min="1">
                <br><br>
                <label for="nodoDos">Nodo: </label><select id="nodoDos"></select>
                <br><br>
            </div>
            <div class="formCon">
                <span id="conNodos"></span>
            </div>
        </div>
        <button id="addEdgeButton" type="button">Crear arista</button><br><br>
        <button id="saveSettings" type="button" disabled>Guardar grafo</button><br><br>`

    const nodos = parseInt(inputNodos.value);
    const nodeArray = [];
    for (let i = 1; i <= nodos; i++) {
        graph.addNode(String.fromCharCode(i + 64));
        nodeArray.push({ id: String.fromCharCode(i + 64) });
    }

    const options = graph.getNodes();
    fillComboBox(options, 'nodoUno');
    fillComboBox(options, 'nodoDos');

    document.getElementById('addEdgeButton').addEventListener('click', (event) => {
        event.preventDefault();
        const node1 = document.getElementById('nodoUno').value;
        const node2 = document.getElementById('nodoDos').value;
        const weight = parseInt(document.getElementById('weight').value);
        if (node1 === node2) {
            alert('No puede conectar un nodo a sí mismo');
            return;
        } else if ((graph.adjacencyList.get(node1).has(node2) && graph.adjacencyList.get(node2).has(node1)) || isNaN(weight)) {
            alert('Los nodos ya estan conectados o no hay un peso asignado');
            return;
        } else {
            graph.addEdge(node1, node2, weight)
            alert(`Arista ${node1} -> ${node2} creada con peso ${weight}`);
            document.getElementById('conNodos').innerHTML += `<p>${node1} --> ${node2} peso: ${weight}</p>`;
            const graphVisualizer = new GraphVisualizer(graph, '#graph');
            if (graph.isFull()) {
                document.getElementById('saveSettings').disabled = false;
            }
        }
    });

    document.getElementById('saveSettings').addEventListener('click', () => {
        document.getElementById('inputNodos').style.display = 'none';
        document.getElementById('labelNum').style.display = 'none';
        span.innerHTML = `<label for="nodoInicial">Nodo inicial: </label>
                <select id="nodoInicial"></select>
                <br><br>
                <label for="nodoObj">Nodo Objetivo: </label><select id="nodoObj"></select>
                <br><br><br><br>
                <button id="viewTree" type="button">Aplicar A*</button><br><br>`;
        fillComboBox(options, 'nodoInicial');
        fillComboBox(options, 'nodoObj');
        document.getElementById('viewTree').addEventListener('click', () => {
            const nodoObj = document.getElementById('nodoObj').value;
            const nodoIni = document.getElementById('nodoInicial').value;
            if (nodoIni === nodoObj) {
                alert('El nodo inicial y el nodo objetivo no pueden ser el mismo');
                return;
            } else {
                const arrayNodes = (aStar(graph, nodoIni, nodoObj));
                const newGraph = new Graph();
                for (let i = 1; i < arrayNodes.length; i++) {
                    newGraph.addEdge(arrayNodes[i - 1], arrayNodes[i], 0);
                }
                const aStarVisualizer = new AStarVisualizer(newGraph, '#aStar');
                if (arrayNodes.length > 0) {
                    document.getElementById('viewTree').disabled = true;
                    span.innerHTML += `<button id="restart" type="button">Reiniciar</button>`
                    document.getElementById('restart').addEventListener('click', () => {
                        window.location.reload();
                    });
                } else {
                    alert('No se encontró camino desde el nodo inicial hasta el nodo objetivo');
                }
            }
        });
    });

    const graphVisualizer = new GraphVisualizer(graph, 'svg');

});

function fillComboBox(options, id) {
    for (let option of options) {
        const newOption = document.createElement('option', option);
        newOption.value = option;
        newOption.textContent = option;
        document.getElementById(id).appendChild(newOption);
    }
}


function heuristic(node, goal) {
    // Heurística basada en la distancia de caracteres para simplificar
    return Math.abs(node.charCodeAt(0) - goal.charCodeAt(0));
}

function aStar(graph, start, goal) {
    let openSet = [];
    let closedSet = new Set();

    // Inicializar mapas para almacenar costos y padres
    let gScore = new Map();
    let fScore = new Map();
    let cameFrom = new Map();

    // Inicializar los valores de los nodos
    for (let node of graph.getNodes()) {
        gScore.set(node, Infinity);
        fScore.set(node, Infinity);
    }

    // Configurar nodo inicial
    gScore.set(start, 0);
    fScore.set(start, heuristic(start, goal));
    openSet.push(start);

    while (openSet.length > 0) {
        // Encontrar el nodo en openSet con el menor valor fScore
        let current = openSet.reduce((prev, curr) => (fScore.get(prev) < fScore.get(curr) ? prev : curr));

        // Si hemos llegado al nodo objetivo
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        // Remover el nodo actual del openSet y añadirlo al closedSet
        openSet = openSet.filter(node => node !== current);
        closedSet.add(current);

        // Explorar los vecinos del nodo actual
        for (let { node: neighbor, cost } of graph.getNeighbors(current)) {
            if (closedSet.has(neighbor)) continue; // Ignorar nodos ya explorados

            let tentativeG = gScore.get(current) + cost;

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor); // Añadir al openSet si no está ya
            } else if (tentativeG >= gScore.get(neighbor)) {
                continue; // Saltar si no hemos encontrado un mejor camino
            }

            // Este es el mejor camino encontrado hasta ahora
            cameFrom.set(neighbor, current);
            gScore.set(neighbor, tentativeG);
            fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, goal));
        }
    }

    return []; // Si no se encuentra un camino
}

function reconstructPath(cameFrom, current) {
    let path = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        path.unshift(current);
    }
    return path;
}