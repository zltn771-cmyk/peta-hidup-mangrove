// Global Leaflet type declaration — loaded via CDN in index.html
// We only declare the parts we actively use to keep this minimal.
declare global {
  interface Window {
    L: LeafletStatic;
  }

  interface LeafletStatic {
    map(id: string | HTMLElement, options?: MapOptions): LeafletMap;
    tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer;
    circleMarker(latlng: LatLng, options?: CircleMarkerOptions): CircleMarker;
    divIcon(options?: DivIconOptions): DivIcon;
    marker(latlng: LatLng, options?: MarkerOptions): LeafletMarker;
    layerGroup(layers?: Layer[]): LayerGroup;
    control: ControlFactory;
  }

  type LatLng = [number, number];

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    zoomControl?: boolean;
    scrollWheelZoom?: boolean;
    attributionControl?: boolean;
    minZoom?: number;
    maxZoom?: number;
  }

  interface TileLayerOptions {
    attribution?: string;
    maxZoom?: number;
    className?: string;
    opacity?: number;
  }

  interface CircleMarkerOptions {
    radius?: number;
    fillColor?: string;
    color?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
    className?: string;
  }

  interface DivIconOptions {
    html?: string;
    className?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
  }

  interface MarkerOptions {
    icon?: DivIcon;
    title?: string;
  }

  interface Layer {
    addTo(map: LeafletMap): this;
    remove(): this;
  }

  interface LayerGroup extends Layer {
    clearLayers(): this;
    addLayer(layer: Layer): this;
  }

  interface TileLayer extends Layer {}

  interface CircleMarker extends Layer {
    bindPopup(content: string, options?: PopupOptions): this;
    bindTooltip(content: string, options?: TooltipOptions): this;
  }

  interface LeafletMarker extends Layer {
    bindPopup(content: string, options?: PopupOptions): this;
    bindTooltip(content: string, options?: TooltipOptions): this;
  }

  interface DivIcon {}

  interface PopupOptions {
    maxWidth?: number;
    className?: string;
  }

  interface TooltipOptions {
    permanent?: boolean;
    direction?: string;
    className?: string;
    offset?: [number, number];
  }

  interface ControlFactory {
    zoom(options?: { position?: string }): Layer;
    attribution(options?: { position?: string; prefix?: string }): Layer;
    layers(baseLayers?: Record<string, Layer>, overlays?: Record<string, Layer>, options?: { position?: string; collapsed?: boolean }): Layer;
  }

  interface LeafletMap {
    setView(latlng: LatLng, zoom: number): this;
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer): this;
    remove(): void;
    on(event: string, handler: (e: LeafletEvent) => void): this;
    getZoom(): number;
    fitBounds(bounds: LatLng[]): this;
    invalidateSize(): this;
  }

  interface LeafletEvent {
    latlng?: { lat: number; lng: number };
    target?: LeafletMap;
  }
}

export {};
