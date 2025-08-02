import { Component, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import Graph = dagre.graphlib.Graph;
import dagre from 'dagre';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';

type NodeViewModel = {
  id: string;
  connectorId: string;
  position: IPoint;
  parentIDs: string[];
};

type ConnectionViewModel = {
  id: string;
  from: string;
  to: string;
};

type NodeMetadata = {
  id: string;
  parentIDs: string[];
  position: IPoint;
};

@Component({
  selector: 'nd-space-graph',
  imports: [CommonModule, FFlowModule],
  templateUrl: './space-graph.component.html',
  styleUrl: './space-graph.component.scss',
})
export class SpaceGraphComponent implements OnInit {
  protected readonly nodes = signal<NodeViewModel[]>([]);
  protected readonly connections = signal<ConnectionViewModel[]>([]);

  protected readonly fFlowComponent =
    viewChild.required<FFlowComponent>('fFlowComponent');

  protected readonly fCanvasComponent =
    viewChild.required<FCanvasComponent>('fCanvasComponent');

  protected onLoaded(): void {
    this.fitToScreen();
  }

  public ngOnInit(): void {
    this._getData(new dagre.graphlib.Graph());
  }

  private _setGraph(graph: Graph): void {
    graph.setGraph({
      rankdir: 'LR',
    });

    const nodes: NodeViewModel[] = [];
    const connections: ConnectionViewModel[] = [];

    GRAPH_DATA.forEach((node) => {
      nodes.push({
        id: node.id,
        connectorId: generateGuid(),
        position: { x: node.position.x, y: node.position.y },
        parentIDs: node.parentIDs,
      });
    });

    nodes.forEach((node) => {
      if (node.parentIDs.length > 0) {
        node.parentIDs.forEach((parentId) => {
          const parentViewModel = nodes.find((n) => n.id === parentId);
          connections.push({
            id: `${node.connectorId}-${parentViewModel?.connectorId}`,
            from: node.connectorId,
            to: parentViewModel?.connectorId ?? '',
          });
        });
      }
    });

    this.nodes.set(nodes);
    this.connections.set(connections);

    GRAPH_DATA.forEach((node) => {
      graph.setNode(node.id, { width: 120, height: 73 });
      if (node.parentIDs.length > 0) {
        node.parentIDs.forEach((parentId) => {
          graph.setEdge(parentId, node.id, {});
        });
      }
    });
    dagre.layout(graph);
  }

  private _getData(graph: Graph): void {
    this.fFlowComponent().reset();
    this._setGraph(graph);
  }

  protected fitToScreen(): void {
    this.fCanvasComponent().fitToScreen({ x: 50, y: 50 }, false);
  }
}

const GRAPH_DATA: NodeMetadata[] = [
  {
    id: 'earth',
    position: { x: 500, y: 500 },
    parentIDs: [],
  },
  {
    id: 'moon',
    position: { x: 200, y: 200 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 1200, y: 800 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 1600, y: 1200 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 1800, y: 600 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 2000, y: 1800 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 2200, y: 1000 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 1400, y: 2000 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 1700, y: 1700 },
    parentIDs: ['earth'],
  },
  {
    id: 'asteroid',
    position: { x: 2100, y: 1400 },
    parentIDs: ['earth'],
  },
];
