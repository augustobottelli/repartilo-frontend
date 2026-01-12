"use client";

import { CheckCircle, Truck, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useOptimizationStore } from '@/lib/store';
import { apiService } from '@/services/api';
import { calculateEfficiencyMetrics } from '@/lib/utils';

interface ValidationResultsProps {
  readOnly?: boolean;
}

export function ValidationResults({ readOnly = false }: ValidationResultsProps) {
  const { vehicles, deliveries, setRoutes, setEfficiencyMetrics, setCurrentStep, setIsLoading, setError, isLoading } = useOptimizationStore();

  const handleOptimize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.optimizeRoutes(vehicles, deliveries);

      if (result.success) {
        setRoutes(result.routes);

        // Calculate and store efficiency metrics based on the optimization results
        const metrics = calculateEfficiencyMetrics(result.routes, vehicles.length);
        setEfficiencyMetrics(metrics);

        setCurrentStep('optimized');
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al optimizar las rutas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-success">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">¡Validación Exitosa!</h3>
              <p className="text-sm text-muted-foreground">
                Se validaron {vehicles.length} vehículos y {deliveries.length} entregas correctamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Vehículos ({vehicles.length})
          </CardTitle>
          <CardDescription>Todos los vehículos tienen direcciones válidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Capacidad</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Dirección Inicio</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{vehicle.name}</td>
                    <td className="py-3 px-4">{vehicle.capacity} paquetes</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {vehicle.start_address}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <CheckCircle className="w-3 h-3" />
                        Válida
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Entregas ({deliveries.length})
          </CardTitle>
          <CardDescription>Todas las direcciones fueron geocodificadas correctamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Dirección</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Paquetes</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Confianza</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.slice(0, 10).map((delivery, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{delivery.customer_name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {delivery.address}
                    </td>
                    <td className="py-3 px-4">{delivery.packages}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div
                            className="bg-success h-2 rounded-full"
                            style={{ width: `${delivery.confidence * 10}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{delivery.confidence}/10</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deliveries.length > 10 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Mostrando 10 de {deliveries.length} entregas
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimize Button - Only show if not in read-only mode */}
      {!readOnly && (
        <div className="flex justify-end">
          <Button
            onClick={handleOptimize}
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? 'Optimizando...' : 'Optimizar Rutas'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
