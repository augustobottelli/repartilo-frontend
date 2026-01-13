"use client";

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Calendar, PlayCircle, BarChart3, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimizationStore } from '@/lib/store';
import Link from 'next/link';
import { OverageInfo } from '@/components/overage-info';
import { SubscriptionLimitModal } from '@/components/subscription-limit-modal';
import { apiService, OverageChargesResponse } from '@/services/api';

export default function DashboardPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { subscription, loading, error } = useUserSubscription();
  const router = useRouter();
  const { reset } = useOptimizationStore();
  const [overageCharges, setOverageCharges] = useState<OverageChargesResponse | null>(null);
  const [loadingCharges, setLoadingCharges] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="p-8">
        <Card className="border-error">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-error mb-2">Error</h3>
            <p className="text-muted-foreground">
              {error || 'No se pudo cargar la información de la suscripción'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const usagePercentage = subscription.monthly_route_limit === -1
    ? 0
    : (subscription.current_monthly_usage / subscription.monthly_route_limit) * 100;

  const isNearLimit = usagePercentage > 80;
  const isAtLimit = !subscription.can_optimize;

  const remainingIncluded = Math.max(0, subscription.monthly_route_limit - subscription.current_monthly_usage);
  const usagePercent = subscription.monthly_route_limit === -1
    ? 0
    : (subscription.current_monthly_usage / subscription.monthly_route_limit) * 100;

  const handleRunOptimization = () => {
    // Check if user is at monthly limit
    if (isAtLimit) {
      // Check if they've reached overage cap
      if (subscription.enable_overage) {
        const overagesRemaining = subscription.max_overage_optimizations - subscription.overage_count_this_month;
        if (overagesRemaining <= 0) {
          setShowLimitModal(true);
          return;
        } else {
          // Show modal with overage option
          setShowLimitModal(true);
          return;
        }
      } else {
        // No overage available, show limit modal
        setShowLimitModal(true);
        return;
      }
    }

    // User is within limits, proceed with optimization
    reset();
    router.push('/dashboard/optimize');
  };

  const handleProceedWithOverage = () => {
    reset();
    router.push('/dashboard/optimize');
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.firstName || user?.emailAddresses[0].emailAddress}!
        </h1>
        <p className="text-muted-foreground">
          Panel de control de tu cuenta Repartilo
        </p>
      </div>

      {/* Unified Subscription & Usage Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6">Tu Suscripción y Uso</h2>

          {/* Plan Info & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
            {/* Subscription Tier */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Plan Actual</p>
              </div>
              <p className="text-2xl font-bold capitalize">{subscription.tier}</p>
              {subscription.tier !== 'enterprise' && (
                <Link
                  href="/dashboard/billing"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Mejorar plan →
                </Link>
              )}
            </div>

            {/* Usage This Month */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className={`w-5 h-5 ${isNearLimit ? 'text-warning' : 'text-primary'}`} />
                <p className="text-sm text-muted-foreground">Uso Este Mes</p>
              </div>
              <p className="text-2xl font-bold">
                {subscription.current_monthly_usage}
                {subscription.monthly_route_limit !== -1 && (
                  <span className="text-lg text-muted-foreground">
                    /{subscription.monthly_route_limit}
                  </span>
                )}
              </p>
              {subscription.monthly_route_limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isAtLimit ? 'bg-error' : isNearLimit ? 'bg-warning' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Account Status */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Estado</p>
              </div>
              <p className="text-2xl font-bold capitalize">
                {subscription.subscription_status === 'active' ? 'Activo' : subscription.subscription_status}
              </p>
              {subscription.current_period_end && (
                <p className="text-xs text-muted-foreground mt-1">
                  Renueva: {new Date(subscription.current_period_end).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Optimizations Used */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Optimizaciones Usadas</h3>
              </div>
              <p className="text-3xl font-bold mb-1">
                {subscription.current_monthly_usage}
              </p>
              <p className="text-sm text-muted-foreground">
                de {subscription.monthly_route_limit === -1 ? 'ilimitadas' : subscription.monthly_route_limit} incluidas
              </p>
            </div>

            {/* Remaining */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Restantes</h3>
              </div>
              <p className="text-3xl font-bold mb-1">
                {remainingIncluded}
              </p>
              <p className="text-sm text-muted-foreground">
                optimizaciones incluidas
              </p>
            </div>

            {/* Overage Charges - Always show for consistency */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Cargos por Exceso</h3>
              </div>
              <p className="text-3xl font-bold mb-1">
                ${subscription.enable_overage ? (subscription.overage_spent_cents / 100).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-muted-foreground">
                {subscription.enable_overage
                  ? `${subscription.overage_count_this_month} overage${subscription.overage_count_this_month !== 1 ? 's' : ''} este mes`
                  : 'No disponible en tu plan'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning if user is using overages */}
      {subscription.is_using_overages && (
        <div className="mb-8">
          <OverageInfo subscription={subscription} variant="warning" />
        </div>
      )}

      {/* Overage Charges Detail */}
      {subscription.enable_overage && subscription.overage_count_this_month > 0 && (
        <Card className="mb-8">
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

      {/* Plan Limits */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Límites de tu Plan {subscription.tier.toUpperCase()}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Optimizaciones Mensuales</p>
              <p className="font-semibold text-lg">
                {subscription.monthly_route_limit === -1 ? 'Ilimitadas' : subscription.monthly_route_limit}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Vehículos por Optimización</p>
              <p className="font-semibold text-lg">
                {subscription.max_vehicles_per_optimization === -1 ? 'Ilimitados' : subscription.max_vehicles_per_optimization}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Paradas por Ruta</p>
              <p className="font-semibold text-lg">
                {subscription.max_stops_per_route === -1 ? 'Ilimitadas' : subscription.max_stops_per_route}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ready to Optimize - Large CTA Button */}
      <div className="mt-8 mb-8">
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-none overflow-hidden">
          <CardContent className="pt-8 pb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">¿Listo para optimizar tus rutas?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Sube tu archivo Excel y genera rutas optimizadas en segundos. Ahorra tiempo, combustible y mejora la eficiencia de tus entregas.
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-12 py-6 h-auto"
              onClick={handleRunOptimization}
            >
              <PlayCircle className="w-6 h-6 mr-3" />
              Ejecutar Optimización
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Limit Modal */}
      <SubscriptionLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        limitType={
          subscription.enable_overage &&
          subscription.overage_count_this_month >= subscription.max_overage_optimizations
            ? 'overage_cap'
            : 'monthly'
        }
        currentValue={subscription.current_monthly_usage}
        limitValue={subscription.monthly_route_limit}
        currentTier={subscription.tier}
        overageAvailable={
          subscription.enable_overage &&
          subscription.overage_count_this_month < subscription.max_overage_optimizations
        }
        overagePriceCents={subscription.overage_price_cents}
        overagesRemaining={
          subscription.max_overage_optimizations - subscription.overage_count_this_month
        }
        onProceedWithOverage={handleProceedWithOverage}
        dismissible={false}
      />
    </div>
  );
}
