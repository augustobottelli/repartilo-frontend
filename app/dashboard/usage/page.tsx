"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { apiService, OverageChargesResponse } from '@/services/api';
import { OverageInfo } from '@/components/overage-info';

export default function UsagePage() {
  const { getToken } = useAuth();
  const { subscription, loading } = useUserSubscription();
  const [overageCharges, setOverageCharges] = useState<OverageChargesResponse | null>(null);
  const [loadingCharges, setLoadingCharges] = useState(false);

  useEffect(() => {
    async function fetchOverageCharges() {
      if (!subscription?.enable_overage) return;

      try {
        setLoadingCharges(true);
        const token = await getToken();
        if (!token) return;

        const charges = await apiService.getOverageCharges(token);
        setOverageCharges(charges);
      } catch (error) {
        console.error('Error fetching overage charges:', error);
      } finally {
        setLoadingCharges(false);
      }
    }

    fetchOverageCharges();
  }, [subscription, getToken]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  const remainingIncluded = subscription ? Math.max(0, subscription.monthly_route_limit - subscription.current_monthly_usage) : 0;
  const usagePercent = subscription ? (subscription.current_monthly_usage / subscription.monthly_route_limit) * 100 : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Uso</h1>
        <p className="text-muted-foreground">
          Monitorea tu uso mensual de optimizaciones
        </p>
      </div>

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Optimizaciones Usadas</h3>
            </div>
            <p className="text-4xl font-bold mb-2">
              {subscription?.current_monthly_usage || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              de {subscription?.monthly_route_limit === -1 ? 'ilimitadas' : subscription?.monthly_route_limit} incluidas
            </p>
            {subscription && subscription.monthly_route_limit !== -1 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      usagePercent >= 100 ? 'bg-red-500' : usagePercent >= 80 ? 'bg-amber-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">Restantes</h3>
            </div>
            <p className="text-4xl font-bold mb-2">
              {remainingIncluded}
            </p>
            <p className="text-sm text-muted-foreground">
              optimizaciones incluidas
            </p>
          </CardContent>
        </Card>

        {subscription?.enable_overage && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Cargos por Exceso</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                ${(subscription.overage_spent_cents / 100).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {subscription.overage_count_this_month} overage{subscription.overage_count_this_month !== 1 ? 's' : ''} este mes
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overage Information */}
      {subscription?.enable_overage && (
        <div className="mb-8">
          <OverageInfo subscription={subscription} variant="card" />
        </div>
      )}

      {/* Overage Charges Detail */}
      {subscription?.enable_overage && subscription?.overage_count_this_month > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Detalle de Cargos por Exceso</h3>

            {loadingCharges ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : overageCharges && overageCharges.charges.length > 0 ? (
              <div className="space-y-2">
                {overageCharges.charges.map((charge) => (
                  <div key={charge.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(charge.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {charge.optimizations_count} optimización{charge.optimizations_count !== 1 ? 'es' : ''}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      ${(charge.charge_cents / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t-2">
                  <p className="font-bold">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ${overageCharges.total_charges_dollars.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay cargos por exceso este mes
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
