"use client";

import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function UsagePage() {
  const { subscription, loading } = useUserSubscription();

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Uso</h1>
        <p className="text-muted-foreground">
          Monitorea tu uso mensual de optimizaciones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Optimizaciones Este Mes</h3>
            </div>
            <p className="text-4xl font-bold mb-2">
              {subscription?.current_monthly_usage || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              de {subscription?.monthly_route_limit === -1 ? 'ilimitadas' : subscription?.monthly_route_limit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Historial</h3>
            <p className="text-muted-foreground">
              El historial de optimizaciones estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
