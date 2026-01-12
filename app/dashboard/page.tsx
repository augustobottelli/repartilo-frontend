"use client";

import { useUser } from '@clerk/nextjs';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Calendar, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimizationStore } from '@/lib/store';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();
  const { subscription, loading, error } = useUserSubscription();
  const router = useRouter();
  const { reset } = useOptimizationStore();

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

      {/* Profile & Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Tu Perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Subscription Tier */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Plan Actual</p>
                </div>
                <p className="text-2xl font-bold capitalize">{subscription.tier}</p>
                {subscription.tier === 'free' && (
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
          </CardContent>
        </Card>

        {/* Run Optimization Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-none">
          <CardContent className="pt-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">¿Listo para optimizar?</h2>
              <p className="text-white/90 text-sm mb-6">
                Sube tu archivo Excel y optimiza tus rutas en segundos
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-white text-primary hover:bg-gray-100 font-semibold"
              disabled={isAtLimit}
              onClick={() => {
                // Reset state before starting new optimization
                reset();
                router.push('/dashboard/optimize');
              }}
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Ejecutar Optimización
            </Button>
            {isAtLimit && (
              <p className="text-xs text-white/80 mt-2 text-center">
                Has alcanzado tu límite mensual
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
