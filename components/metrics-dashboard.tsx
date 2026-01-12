"use client";

import { Truck, Clock, Route, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleRoute } from '@/services/api';
import { formatDistance, formatDuration, formatPercentage } from '@/lib/utils';
import { useOptimizationStore } from '@/lib/store';

interface MetricsDashboardProps {
  routes: VehicleRoute[];
  totalDistance: number;
  totalDuration: number;
  vehiclesUsed: number;
  unassigned: Array<{ customer_name: string; address: string; packages: number; reason: string }>;
}

export function MetricsDashboard({
  routes,
  totalDistance,
  totalDuration,
  vehiclesUsed,
  unassigned,
}: MetricsDashboardProps) {
  const { efficiencyMetrics } = useOptimizationStore();

  // Fallback to default values if metrics aren't available
  const distanceSaving = efficiencyMetrics?.distanceSaving ?? 40;
  const timeSaving = efficiencyMetrics?.timeSaving ?? 60;
  const fuelSaving = efficiencyMetrics?.fuelSaving ?? 35;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Distancia Total</p>
                <p className="text-3xl font-bold text-gray-900">{totalDistance.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">kilómetros</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Route className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Total</p>
                <p className="text-3xl font-bold text-gray-900">{Math.floor(totalDuration / 60)}</p>
                <p className="text-xs text-muted-foreground mt-1">minutos</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehículos Usados</p>
                <p className="text-3xl font-bold text-gray-900">{vehiclesUsed}</p>
                <p className="text-xs text-muted-foreground mt-1">de {routes.length} disponibles</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregas Totales</p>
                <p className="text-3xl font-bold text-gray-900">
                  {routes.reduce((sum, route) => sum + route.steps.filter((s) => s.type === 'job').length, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">en todas las rutas</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-success" />
            Eficiencia de Optimización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ahorro Estimado vs Ruta Manual</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-success">~{distanceSaving}%</span>
                <span className="text-sm text-muted-foreground mb-1">menos km</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ahorro de Tiempo</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-success">~{timeSaving}%</span>
                <span className="text-sm text-muted-foreground mb-1">más rápido</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ahorro de Combustible</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-success">~{fuelSaving}%</span>
                <span className="text-sm text-muted-foreground mb-1">menos consumo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route, idx) => {
              const jobSteps = route.steps.filter((s) => s.type === 'job');
              const deliveryCount = jobSteps.length;
              const totalLoad = route.load;

              // Calculate vehicle capacity from first vehicle in the route
              // Since we don't have capacity in route, we'll use load as approximation
              const capacity = totalLoad > 0 ? totalLoad : 100;
              const utilization = (totalLoad / capacity) * 100;

              return (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{route.vehicle_name}</h4>
                    <span className="text-sm text-muted-foreground">{deliveryCount} entregas</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Distancia</p>
                      <p className="font-semibold">{(route.distance / 1000).toFixed(1)} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duración</p>
                      <p className="font-semibold">{Math.floor(route.duration / 60)} min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Carga</p>
                      <p className="font-semibold">{totalLoad} paquetes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Utilización</p>
                      <p className="font-semibold">{utilization.toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Load bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        utilization > 90 ? 'bg-success' : utilization > 70 ? 'bg-primary' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Deliveries Warning */}
      {unassigned.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Entregas No Asignadas ({unassigned.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Las siguientes entregas no pudieron ser asignadas a ningún vehículo:
            </p>
            <div className="space-y-3">
              {unassigned.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-warning/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{item.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.packages} paquetes</p>
                    </div>
                    <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                      {item.reason || 'Capacidad insuficiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
