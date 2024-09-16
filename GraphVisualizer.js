// Configuración de D3.js
export class GraphVisualizer {
    constructor(graph, svgElement, width = 800, height = 300) {
        this.graph = graph;
        this.nodes = [];
        for (let i = 0; i < graph.getNodes().length; i++) {
            this.nodes.push({ id: graph.getNodes()[i] });
        }

        this.links = graph.getEdges();
        this.width = width;
        this.height = height;

        this.svg = d3.select(svgElement)
            .attr('width', width)
            .attr('height', height)
            .attr("style", "max-width: 100%; height: auto;");

        // Crear simulación de fuerza
        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-50))
            .force('collide', d3.forceCollide(10)) // Ajusta el radio de colisión
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .on("tick", this.addSimulationTick);
        this.renderGraph();
    }

    // Renderizar el grafo
    renderGraph() {
        this.updateSimulation();
        this.addSimulationTick(this.renderLinks(), this.renderNodes(), this.renderLinkLabels());
    }

    // Crear las líneas de los enlaces
    renderLinks() {
        // Dibujar enlaces
        const link = this.svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('class', 'link');
        return link;
    }

    // Crear etiquetas para los pesos de los enlaces
    renderLinkLabels() {
        // Añadir texto para los pesos en los enlaces
        const linkText = this.svg.append('g')
            .attr('class', 'link-text')
            .selectAll('text')
            .data(this.links)
            .enter().append('text')
            .attr('class', 'link-label')
            .text(d => d.weight)
            .style('font-size', '1rem')
            .style('fill', '#000');
        return linkText;
    }

    // Crear los nodos
    renderNodes() {
        // Dibujar nodos
        const node = this.svg.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'node-group');

        // Añadir círculos para los nodos
        node.append('circle')
            .attr('class', 'node')
            .attr('r', 12)
            .call(this.drag(this.simulation));

        // Añadir texto para los nombres de los nodos
        node.append('text')
            .attr('dy', -12) // Ajusta la posición vertical del texto
            .attr('text-anchor', 'middle') // Centra el texto horizontalmente
            .style('font-weight', 'bold')
            .text(d => d.id); // Muestra el nombre del nodo
        return node;
    }

    // Añadir la función de tick de la simulación
    addSimulationTick(link, node, linkText) {
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`); // Actualiza la posición de nodos

            linkText
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2);
        });
    }

    updateSimulation() {
        this.svg.selectAll('*').remove();
    }

    // Funciones para arrastrar nodos
    drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
}
