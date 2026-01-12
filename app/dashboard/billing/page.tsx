"use client";

import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    features: [
      '50 optimizaciones/mes',
      '3 vehículos por optimización',
      '50 paradas por ruta',
      'Soporte por email',
    ],
  },
  {
    name: 'Pro',
    price: 29,
    features: [
      '500 optimizaciones/mes',
      '10 vehículos por optimización',
      '200 paradas por ruta',
      'Soporte prioritario',
      'Exportación de datos',
    ],
  },
  {
    name: 'Enterprise',
    price: 99,
    features: [
      'Optimizaciones ilimitadas',
      'Vehículos ilimitados',
      'Paradas ilimitadas',
      'Soporte 24/7',
      'API access',
      'Gestor de cuenta dedicado',
    ],
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                subscription?.tier === plan.name.toLowerCase()
                  ? 'border-primary border-2'
                  : ''
              }
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={
                    subscription?.tier === plan.name.toLowerCase()
                      ? 'outline'
                      : 'default'
                  }
                  disabled={subscription?.tier === plan.name.toLowerCase()}
                >
                  {subscription?.tier === plan.name.toLowerCase()
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
