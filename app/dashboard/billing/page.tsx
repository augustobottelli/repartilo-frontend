"use client";

import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    tier: 'free',
    price: 0,
    description: 'Perfecto para probar el servicio',
    features: [
      '5 optimizaciones/mes',
      '2 vehículos por optimización',
      '25 paradas por ruta',
      'Soporte por email',
    ],
    overageEnabled: false,
    overagePrice: null,
    maxOverages: null,
  },
  {
    name: 'Starter',
    tier: 'starter',
    price: 79,
    description: 'Para pequeñas empresas con 1-5 vehículos',
    features: [
      '100 optimizaciones/mes',
      '5 vehículos por optimización',
      '100 paradas por ruta',
      'Soporte prioritario',
      'Generación de códigos QR',
      'Historial de optimizaciones',
    ],
    overageEnabled: true,
    overagePrice: 0.75,
    maxOverages: 50,
  },
  {
    name: 'Professional',
    tier: 'professional',
    price: 149,
    description: 'Para medianas empresas con 5-15 vehículos',
    features: [
      '500 optimizaciones/mes',
      '15 vehículos por optimización',
      '200 paradas por ruta',
      'Soporte prioritario',
      'Analíticas avanzadas',
      'Acceso API',
      'Exportación de datos',
    ],
    overageEnabled: true,
    overagePrice: 0.50,
    maxOverages: 200,
  },
  {
    name: 'Enterprise',
    tier: 'enterprise',
    price: 299,
    description: 'Para flotas grandes con 15+ vehículos',
    features: [
      '2,000 optimizaciones/mes',
      '50 vehículos por optimización',
      'Paradas ilimitadas por ruta',
      'Soporte 24/7',
      'Gestor de cuenta dedicado',
      'Integraciones personalizadas',
      'SLA garantizado',
    ],
    overageEnabled: true,
    overagePrice: 0.25,
    maxOverages: 1000,
  },
];

export default function BillingPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturación</h1>
        <p className="text-muted-foreground">
          Gestiona tu suscripción y método de pago
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Plan Actual</h3>
              </div>
              <p className="text-3xl font-bold capitalize mb-2">{subscription?.tier}</p>
              <p className="text-muted-foreground">
                {subscription?.subscription_status === 'active' ? 'Activo' : subscription?.subscription_status}
              </p>
            </div>
            {subscription?.tier !== 'enterprise' && (
              <Button>Mejorar Plan</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Planes Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                subscription?.tier === plan.tier
                  ? 'border-primary border-2'
                  : ''
              }
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Overage Pricing */}
                {plan.overageEnabled && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Precio por Exceso
                    </p>
                    <p className="text-sm text-gray-600">
                      ${plan.overagePrice}/optimización
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      (máx {plan.maxOverages} excesos/mes)
                    </p>
                  </div>
                )}
                {!plan.overageEnabled && plan.tier === 'free' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Sin excesos disponibles
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Actualiza para continuar
                    </p>
                  </div>
                )}

                <Button
                  className="w-full mt-4"
                  variant={
                    subscription?.tier === plan.tier
                      ? 'outline'
                      : 'default'
                  }
                  disabled={subscription?.tier === plan.tier}
                >
                  {subscription?.tier === plan.tier
                    ? 'Plan Actual'
                    : 'Seleccionar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
