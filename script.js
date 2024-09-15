//Importación de la clase Graph
import { Graph } from "./Graph.js";

document.getElementById('inputNodos').addEventListener("input", function () {
    const graph = new Graph();

    document.getElementById('span').innerHTML =
        `<h3>Conecte los nodos con sus respectivos pesos: </h3>
    <div id="inputCon">
        <div class="formCon">
            <label for="nodoUno">Nodo: </label>
            <select id="nodoUno"></select>
            <br><br>
            <label for="weight">Peso: </label>
            <input id="weight" type="number" name="weight" placeholoder="number" required min="1">
            <br><br>
            <label for="nodoDos">Nodo: </label><select id="nodoDos"></select>
            <br><br>
        </div>
        <div class="formCon">
            <span id="conNodos"></span>
        </div>
    </div>
    <button id="addEdgeButton">Crear arista</button><br><br>`

    const nodos = parseInt(inputNodos.value);
    for (let i = 1; i <= nodos; i++) {
        graph.addNode(String.fromCharCode(i + 64));
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
            graph.addEdge(node1, node2, weight);
            alert(`Arista ${node1} -> ${node2} creada con peso ${weight}`);
            console.log(weight);
            document.getElementById('conNodos').innerHTML += `<p>${node1} --> ${node2} peso: ${weight}</p>`;
        }
    });

    console.clear();
    console.log(graph);
});

function fillComboBox(options, id) {
    for (let option of options) {
        const newOption = document.createElement('option', option);
        newOption.value = option;
        newOption.textContent = option;
        document.getElementById(id).appendChild(newOption);
    }
}


