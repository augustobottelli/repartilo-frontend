"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, Eye, AlertCircle } from 'lucide-react';
import { apiService, OptimizationSummary } from '@/services/api';
import { useOptimizationStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [optimizations, setOptimizations] = useState<OptimizationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { setVehicles, setDeliveries, setRoutes, setQRCodes, setEfficiencyMetrics, setCurrentStep } = useOptimizationStore();

  useEffect(() => {
    fetchOptimizations();
    fetchCount();
  }, []);

  const fetchOptimizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('No estás autenticado');
        return;
      }

      const data = await apiService.listOptimizations(token);
      setOptimizations(data);
    } catch (err: any) {
      console.error('Error fetching optimizations:', err);
      setError(err.message || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiService.getOptimizationsCount(token);
      setCount(data.count);
    } catch (err) {
      console.error('Error fetching count:', err);
    }
  };

  const handleView = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      const optimization = await apiService.getOptimization(id, token);

      // Load data into store
      setVehicles(optimization.vehicles);
      setDeliveries(optimization.deliveries);
      setRoutes(optimization.routes as any);
      setQRCodes(optimization.qr_codes || []);
      if (optimization.efficiency_metrics) {
        setEfficiencyMetrics(optimization.efficiency_metrics);
      }
      setCurrentStep('optimized');

      // Navigate to optimize page
      router.push('/dashboard/optimize');
    } catch (err: any) {
      console.error('Error loading optimization:', err);
      alert('Error al cargar la optimización');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta optimización?')) {
      return;
    }

    try {
      setDeletingId(id);

      const token = await getToken();
      if (!token) return;

      await apiService.deleteOptimization(id, token);

      // Refresh list
      await fetchOptimizations();
      await fetchCount();
    } catch (err: any) {
      console.error('Error deleting optimization:', err);
      alert('Error al eliminar la optimización');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando historial...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Optimizaciones</h1>
            <p className="text-muted-foreground">
              {count} de 100 optimizaciones guardadas
            </p>
          </div>
        </div>

        {count >= 90 && count < 100 && (
          <Card className="border-warning mt-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-warning mb-1">Acercándose al límite</h4>
                  <p className="text-sm text-muted-foreground">
                    Has usado {count} de 100 espacios. Considera eliminar optimizaciones antiguas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {count >= 100 && (
          <Card className="border-error mt-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-error mb-1">Límite alcanzado</h4>
                  <p className="text-sm text-muted-foreground">
                    Has alcanzado el límite de 100 optimizaciones guardadas. Debes eliminar algunas para guardar nuevas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {error ? (
        <Card className="border-error">
          <CardContent className="pt-6">
            <p className="text-error">{error}</p>
          </CardContent>
        </Card>
      ) : optimizations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay optimizaciones guardadas</h3>
              <p className="text-muted-foreground mb-4">
                Las optimizaciones se guardan automáticamente cuando ejecutas una optimización
              </p>
              <Button onClick={() => router.push('/dashboard/optimize')}>
                Crear Primera Optimización
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {optimizations.map((opt) => (
            <Card key={opt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{opt.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Fecha</p>
                        <p className="font-medium">{formatDate(opt.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vehículos</p>
                        <p className="font-medium">{opt.vehicles_used}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Entregas</p>
                        <p className="font-medium">{opt.deliveries_count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Distancia</p>
                        <p className="font-medium">{opt.total_distance.toFixed(1)} km</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(opt.id)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(opt.id)}
                      disabled={deletingId === opt.id}
                      className="gap-2 text-error hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === opt.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
