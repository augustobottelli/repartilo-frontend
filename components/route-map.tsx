"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleRoute } from '@/services/api';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Colors for different vehicles
const VEHICLE_COLORS = [
  '#FF6B35', // Primary orange
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

interface RouteMapProps {
  routes: VehicleRoute[];
}

// Component to fit map bounds
function FitBounds({ routes }: { routes: VehicleRoute[] }) {
  const map = useMap();

  useEffect(() => {
    if (routes.length === 0) return;

    const bounds = L.latLngBounds([]);
    routes.forEach((route) => {
      route.steps.forEach((step) => {
        if (step.location) {
          bounds.extend([step.location[1], step.location[0]]);
        }
      });
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, map]);

  return null;
}

// Decode polyline (simplified for common encoding)
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

export function RouteMap({ routes }: RouteMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Rutas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Cargando mapa...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate center point
  let centerLat = 40.4168;
  let centerLon = -3.7038;

  if (routes.length > 0 && routes[0].steps.length > 0) {
    const firstStep = routes[0].steps[0];
    if (firstStep.location) {
      centerLon = firstStep.location[0];
      centerLat = firstStep.location[1];
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Rutas Optimizadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-border">
          <MapContainer
            center={[centerLat, centerLon]}
            zoom={12}
            style={{ height: '600px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds routes={routes} />

            {routes.map((route, routeIdx) => {
              const color = VEHICLE_COLORS[routeIdx % VEHICLE_COLORS.length];

              // Decode polyline if available
              let polylineCoords: [number, number][] = [];
              if (route.geometry) {
                try {
                  polylineCoords = decodePolyline(route.geometry);
                } catch (error) {
                  console.error('Error decoding polyline:', error);
                }
              }

              // Fallback: create polyline from steps
              if (polylineCoords.length === 0) {
                polylineCoords = route.steps
                  .filter((step) => step.location)
                  .map((step) => [step.location![1], step.location![0]]);
              }

              return (
                <div key={routeIdx}>
                  {/* Route polyline */}
                  {polylineCoords.length > 1 && (
                    <Polyline
                      positions={polylineCoords}
                      color={color}
                      weight={4}
                      opacity={0.7}
                    />
                  )}

                  {/* Markers for each step */}
                  {route.steps.map((step, stepIdx) => {
                    if (!step.location) return null;

                    const position: [number, number] = [step.location[1], step.location[0]];

                    // Custom icon based on step type
                    let iconHtml = '';
                    if (step.type === 'start') {
                      iconHtml = `<div style="background: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-weight: bold;">S</div>`;
                    } else if (step.type === 'end') {
                      iconHtml = `<div style="background: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-weight: bold;">E</div>`;
                    } else {
                      // Job - show number
                      const jobNumber = route.steps.filter((s, i) => i < stepIdx && s.type === 'job').length + 1;
                      iconHtml = `<div style="background: ${color}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 12px; font-weight: bold;">${jobNumber}</div>`;
                    }

                    const icon = L.divIcon({
                      html: iconHtml,
                      className: 'custom-marker',
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                    });

                    return (
                      <Marker key={stepIdx} position={position} icon={icon}>
                        <Popup>
                          <div className="p-2">
                            <h4 className="font-semibold mb-1" style={{ color }}>
                              {route.vehicle_name}
                            </h4>
                            {step.type === 'job' && (
                              <>
                                <p className="text-sm font-medium">{step.customer_name}</p>
                                <p className="text-xs text-gray-600 mb-1">{step.address}</p>
                                <p className="text-xs">📦 {step.packages} paquetes</p>
                              </>
                            )}
                            {step.type === 'start' && (
                              <>
                                <p className="text-sm">Punto de inicio</p>
                                <p className="text-xs text-gray-600">{step.address}</p>
                              </>
                            )}
                            {step.type === 'end' && (
                              <>
                                <p className="text-sm">Punto final</p>
                                <p className="text-xs text-gray-600">{step.address}</p>
                              </>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </div>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {routes.map((route, idx) => {
            const color = VEHICLE_COLORS[idx % VEHICLE_COLORS.length];
            return (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{route.vehicle_name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
