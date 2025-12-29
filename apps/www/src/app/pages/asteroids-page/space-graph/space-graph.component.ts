import {
  Component,
  OnInit,
  signal,
  computed,
  viewChild,
  ElementRef,
  AfterViewInit,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelestialBody } from '@libs/shared/lib/types/celestial-body';

interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

@Component({
  selector: 'nd-space-graph',
  imports: [CommonModule],
  templateUrl: './space-graph.component.html',
  styleUrl: './space-graph.component.scss',
  standalone: true,
})
export class SpaceGraphComponent implements OnInit, AfterViewInit {
  public readonly asteroids = input<CelestialBody[]>([]);

  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly container =
    viewChild.required<ElementRef<HTMLDivElement>>('container');

  private ctx!: CanvasRenderingContext2D;
  private animationId?: number;

  // State
  private readonly viewport = signal<ViewportState>({
    zoom: 1,
    panX: 0,
    panY: 0,
  });
  private readonly celestialBodies = signal<CelestialBody[]>([]);
  private readonly selectedBody = signal<CelestialBody | null>(null);
  private readonly isDragging = signal(false);
  private readonly lastMousePos = signal({ x: 0, y: 0 });

  // Computed values
  protected readonly selectedBodyInfo = computed(() => {
    const body = this.selectedBody();
    return body
      ? {
          name: body.name,
          type: body.type,
          info: body.info || `A ${body.type} in our solar system`,
          position: `X: ${Math.round(body.position.x)}, Y: ${Math.round(
            body.position.y
          )}`,
        }
      : null;
  });

  constructor() {
    effect(() => {
      this.asteroids().forEach((asteroid) => {
        this.addAsteroid(
          asteroid.position.x,
          asteroid.position.y,
          asteroid.name
        );
      });
    });
  }

  ngOnInit(): void {
    this.initializeSolarSystem();
  }

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.setupEventListeners();
    this.startAnimation();
  }

  private setupCanvas(): void {
    const canvas = this.canvas().nativeElement;
    const container = this.container().nativeElement;

    // Set canvas size to match container
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = true;
  }

  private setupEventListeners(): void {
    const canvas = this.canvas().nativeElement;

    // Mouse wheel for zooming
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const viewport = this.viewport();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * zoomFactor));

      this.viewport.set({ ...viewport, zoom: newZoom });
    });

    // Mouse events for panning and selection
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if clicking on a celestial body
      const clickedBody = this.getBodyAtPosition(mouseX, mouseY);
      if (clickedBody) {
        this.selectBody(clickedBody);
      } else {
        this.selectedBody.set(null);
        this.isDragging.set(true);
        this.lastMousePos.set({ x: mouseX, y: mouseY });
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging()) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const lastPos = this.lastMousePos();
        const viewport = this.viewport();

        const deltaX = mouseX - lastPos.x;
        const deltaY = mouseY - lastPos.y;

        this.viewport.set({
          ...viewport,
          panX: viewport.panX + deltaX,
          panY: viewport.panY + deltaY,
        });

        this.lastMousePos.set({ x: mouseX, y: mouseY });
      }
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging.set(false);
    });

    // Double click to center on body
    canvas.addEventListener('dblclick', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clickedBody = this.getBodyAtPosition(mouseX, mouseY);
      if (clickedBody) {
        this.centerOnBody(clickedBody);
      }
    });
  }

  private getBodyAtPosition(
    mouseX: number,
    mouseY: number
  ): CelestialBody | null {
    const viewport = this.viewport();

    for (const body of this.celestialBodies()) {
      const screenX = (body.position.x + viewport.panX) * viewport.zoom;
      const screenY = (body.position.y + viewport.panY) * viewport.zoom;
      const screenRadius = body.radius * viewport.zoom;

      const distance = Math.sqrt(
        (mouseX - screenX) ** 2 + (mouseY - screenY) ** 2
      );
      if (distance <= Math.max(screenRadius, 10)) {
        // Minimum clickable area
        return body;
      }
    }
    return null;
  }

  private selectBody(body: CelestialBody): void {
    // Clear previous selection
    this.celestialBodies.update((bodies) =>
      bodies.map((b) => ({ ...b, selected: false }))
    );

    // Select new body
    this.celestialBodies.update((bodies) =>
      bodies.map((b) => (b.id === body.id ? { ...b, selected: true } : b))
    );

    this.selectedBody.set({ ...body, selected: true });
  }

  private centerOnBody(body: CelestialBody): void {
    const canvas = this.canvas().nativeElement;
    const viewport = this.viewport();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.viewport.set({
      ...viewport,
      panX: centerX / viewport.zoom - body.position.x,
      panY: centerY / viewport.zoom - body.position.y,
    });
  }

  private initializeSolarSystem(): void {
    const centerX = 0;
    const centerY = 0;

    const bodies: CelestialBody[] = [
      // Sun
      {
        id: 'sun',
        name: 'Sun',
        type: 'star',
        position: { x: centerX, y: centerY },
        radius: 30,
        color: '#FFD700',
        info: 'The star at the center of our solar system',
      },
      // Planets (simplified distances for visualization)
      {
        id: 'mercury',
        name: 'Mercury',
        type: 'planet',
        position: { x: centerX + 80, y: centerY },
        radius: 4,
        color: '#8C7853',
        orbitRadius: 80,
        orbitCenter: { x: centerX, y: centerY },
        info: 'The smallest planet and closest to the Sun',
      },
      {
        id: 'venus',
        name: 'Venus',
        type: 'planet',
        position: { x: centerX + 120, y: centerY },
        radius: 6,
        color: '#FFC649',
        orbitRadius: 120,
        orbitCenter: { x: centerX, y: centerY },
        info: 'The hottest planet in our solar system',
      },
      {
        id: 'earth',
        name: 'Earth',
        type: 'planet',
        position: { x: centerX + 160, y: centerY },
        radius: 8,
        color: '#6B93D6',
        orbitRadius: 160,
        orbitCenter: { x: centerX, y: centerY },
        info: 'Our home planet',
      },
      {
        id: 'mars',
        name: 'Mars',
        type: 'planet',
        position: { x: centerX + 220, y: centerY },
        radius: 6,
        color: '#CD5C5C',
        orbitRadius: 220,
        orbitCenter: { x: centerX, y: centerY },
        info: 'The red planet',
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        type: 'planet',
        position: { x: centerX + 320, y: centerY },
        radius: 20,
        color: '#D8CA9D',
        orbitRadius: 320,
        orbitCenter: { x: centerX, y: centerY },
        info: 'The largest planet in our solar system',
      },
      {
        id: 'saturn',
        name: 'Saturn',
        type: 'planet',
        position: { x: centerX + 420, y: centerY },
        radius: 16,
        color: '#FAD5A5',
        orbitRadius: 420,
        orbitCenter: { x: centerX, y: centerY },
        info: 'The ringed planet',
      },
      {
        id: 'uranus',
        name: 'Uranus',
        type: 'planet',
        position: { x: centerX + 520, y: centerY },
        radius: 12,
        color: '#4FD0E7',
        orbitRadius: 520,
        orbitCenter: { x: centerX, y: centerY },
        info: 'An ice giant tilted on its side',
      },
      {
        id: 'neptune',
        name: 'Neptune',
        type: 'planet',
        position: { x: centerX + 620, y: centerY },
        radius: 12,
        color: '#4B70DD',
        orbitRadius: 620,
        orbitCenter: { x: centerX, y: centerY },
        info: 'The windiest planet',
      },
      // Earth's Moon
      {
        id: 'moon',
        name: 'Moon',
        type: 'moon',
        position: { x: centerX + 180, y: centerY },
        radius: 3,
        color: '#C0C0C0',
        info: "Earth's natural satellite",
      },
    ];

    this.celestialBodies.set(bodies);

    // Center view on Earth initially
    setTimeout(() => {
      const earth = bodies.find((b) => b.id === 'earth');
      if (earth) {
        this.centerOnBody(earth);
        this.viewport.update((v) => ({ ...v, zoom: 1.5 }));
      }
    }, 100);
  }

  public addRandomAsteroid(): void {
    const x = Math.random() * 1000 - 500;
    const y = Math.random() * 1000 - 500;
    this.addAsteroid(x, y);
  }

  public addAsteroid(x: number, y: number, name?: string): void {
    const asteroid: CelestialBody = {
      id: `asteroid_${Date.now()}`,
      name:
        name ||
        `Asteroid ${
          this.celestialBodies().filter((b) => b.type === 'asteroid').length + 1
        }`,
      type: 'asteroid',
      position: { x, y },
      radius: 2 + Math.random() * 3, // Random size
      color: '#8C8C8C',
      info: 'A near-Earth asteroid',
    };

    this.celestialBodies.update((bodies) => [...bodies, asteroid]);
  }

  private startAnimation(): void {
    const animate = () => {
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private render(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = this.ctx;
    const viewport = this.viewport();

    // Clear canvas with space background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    this.drawStars(ctx, canvas.width, canvas.height);

    ctx.save();

    // Apply zoom and pan transformations
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(viewport.panX, viewport.panY);

    // Draw orbital paths
    this.drawOrbitalPaths(ctx);

    // Draw celestial bodies
    this.celestialBodies().forEach((body) => this.drawCelestialBody(ctx, body));

    ctx.restore();

    // Draw UI elements (not affected by zoom/pan)
    this.drawUI(ctx, canvas.width, canvas.height);
  }

  private drawStars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    ctx.fillStyle = '#FFFFFF';
    // Simple star field - you could make this more sophisticated
    for (let i = 0; i < 200; i++) {
      const x = (i * 7 + width) % width;
      const y = (i * 13 + height) % height;
      const brightness = Math.random();
      ctx.globalAlpha = brightness * 0.8;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  private drawOrbitalPaths(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = '#333366';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    this.celestialBodies().forEach((body) => {
      if (body.orbitRadius && body.orbitCenter) {
        ctx.beginPath();
        ctx.arc(
          body.orbitCenter.x,
          body.orbitCenter.y,
          body.orbitRadius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    });

    ctx.setLineDash([]);
  }

  private drawCelestialBody(
    ctx: CanvasRenderingContext2D,
    body: CelestialBody
  ): void {
    const { x, y } = body.position;

    // Draw selection ring
    if (body.selected) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, body.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw body
    ctx.fillStyle = body.color;
    ctx.beginPath();
    ctx.arc(x, y, body.radius, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect for stars
    if (body.type === 'star') {
      const gradient = ctx.createRadialGradient(
        x,
        y,
        body.radius,
        x,
        y,
        body.radius * 2
      );
      gradient.addColorStop(0, body.color + '80');
      gradient.addColorStop(1, body.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, body.radius * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw rings for Saturn
    if (body.id === 'saturn') {
      ctx.strokeStyle = '#FAD5A5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, body.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, body.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawUI(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    // Draw zoom level
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText(`Zoom: ${(this.viewport().zoom * 100).toFixed(0)}%`, 10, 25);

    // Draw instructions
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '12px Arial';
    ctx.fillText(
      'Scroll to zoom • Drag to pan • Click to select • Double-click to center',
      10,
      height - 10
    );
  }

  // Public methods for external control
  public resetView(): void {
    this.viewport.set({ zoom: 1, panX: 0, panY: 0 });
    this.selectedBody.set(null);
  }

  public zoomIn(): void {
    const viewport = this.viewport();
    this.viewport.set({ ...viewport, zoom: Math.min(5, viewport.zoom * 1.2) });
  }

  public zoomOut(): void {
    const viewport = this.viewport();
    this.viewport.set({
      ...viewport,
      zoom: Math.max(0.1, viewport.zoom / 1.2),
    });
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
