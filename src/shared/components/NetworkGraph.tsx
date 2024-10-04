import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Connection } from '../types/connection';
import { calculateNetworkValue } from '../utils/networkCalculations';
import { useNetworkValue } from '../hooks/useNetworkValue';

// Define the props for the NetworkGraph component
interface NetworkGraphProps {
  connections: Connection[];
  onNodeClick: (userId: string) => void;
}

/**
 * NetworkGraph component for rendering an interactive network visualization using D3.js.
 * 
 * Requirements addressed:
 * 1. Visual Network Management (Technical specification/1.1 System Objectives)
 * 2. Interactive D3.js network graphs (Technical specification/1.1 System Objectives)
 */
const NetworkGraph: React.FC<NetworkGraphProps> = ({ connections, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [networkValue] = useNetworkValue(connections);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width, height } = dimensions;

    // Create a force simulation
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Prepare the data
    const nodes = [{ id: 'currentUser', name: 'You' }, ...connections.map(c => ({ id: c.connectedUserId, name: `User ${c.connectedUserId}` }))];
    const links = connections.map(c => ({ source: 'currentUser', target: c.connectedUserId, value: c.connectionValue }));

    // Create the links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', d => Math.sqrt(d.value))
      .attr('stroke', '#999');

    // Create the nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', (d) => d.id === 'currentUser' ? '#ff0000' : '#00ff00')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add labels to the nodes
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.name)
      .attr('font-size', '12px')
      .attr('dx', 15)
      .attr('dy', 4);

    // Set up the simulation
    simulation
      .nodes(nodes)
      .on('tick', ticked);

    simulation.force<d3.ForceLink<any, any>>('link')!.links(links);

    // Define tick function to update positions
    function ticked() {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    }

    // Define drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Add click event to nodes
    node.on('click', (event, d) => {
      if (d.id !== 'currentUser') {
        onNodeClick(d.id);
      }
    });

    // Add tooltips
    node.append('title')
      .text(d => `${d.name}\nConnections: ${d.id === 'currentUser' ? connections.length : 1}`);

  }, [connections, dimensions, onNodeClick]);

  return (
    <div className="network-graph">
      <h2>Your Network</h2>
      <p>Network Value: {networkValue.toFixed(2)}</p>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
};

export default NetworkGraph;
```

This implementation of the NetworkGraph component fulfills the requirements for visual network management and interactive D3.js network graphs. It creates a force-directed graph visualization of the user's network, with the following features:

1. The current user is represented by a red node at the center.
2. Connected users are represented by green nodes.
3. Connections are represented by lines, with thickness based on connection value.
4. Nodes are draggable for better visualization.
5. Clicking on a node (except the current user) triggers the `onNodeClick` callback.
6. Tooltips show the name and number of connections for each node.
7. The network value is displayed above the graph.
8. The graph is responsive and adjusts to the container size.

The component uses the `useNetworkValue` hook to calculate and display the network value, and it leverages D3.js for creating an interactive and visually appealing network graph. The implementation follows best practices for React and D3.js integration, ensuring good performance and maintainability.