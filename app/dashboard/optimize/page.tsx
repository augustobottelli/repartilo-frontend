"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useOptimizationStore } from '@/lib/store';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { StepIndicator } from '@/components/step-indicator';
import { ExcelUpload } from '@/components/excel-upload';
import { ValidationResults } from '@/components/validation-results';
import { MetricsDashboard } from '@/components/metrics-dashboard';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { SubscriptionLimitModal } from '@/components/subscription-limit-modal';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import('@/components/route-map').then(mod => mod.RouteMap), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="pt-6">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
      </CardContent>
    </Card>
  ),
});

export default function OptimizePage() {
  const { currentStep, routes, error } = useOptimizationStore();
  const { subscription, loading } = useUserSubscription();
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Check if user is at monthly limit when page loads
  useEffect(() => {
    if (!loading && subscription && currentStep === 'upload') {
      const isAtLimit = subscription.current_monthly_usage >= subscription.monthly_route_limit;
      if (isAtLimit && !subscription.enable_overage) {
        setShowLimitModal(true);
      } else if (isAtLimit && subscription.enable_overage) {
        // Check if they've reached overage cap too
        const overagesRemaining = subscription.max_overage_optimizations - subscription.overage_count_this_month;
        if (overagesRemaining <= 0) {
          setShowLimitModal(true);
        } else {
          // Show modal with overage option
          setShowLimitModal(true);
        }
      }
    }
  }, [subscription, loading, currentStep]);

  return (
    <div className="p-8">
        <StepIndicator />

        {/* Error Display */}
        {error && (
          <Card className="border-error mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-error mb-1">Error</h4>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Step */}
        {currentStep === 'upload' && <ExcelUpload />}

        {/* Validation Results Step */}
        {currentStep === 'validated' && <ValidationResults />}

        {/* Optimization Results Step */}
        {currentStep === 'optimized' && (
          <div className="space-y-8">
            {/* Success Header */}
            <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🎉 ¡Rutas Optimizadas con Éxito!
                  </h2>
                  <p className="text-muted-foreground">
                    Tus rutas han sido calculadas de forma óptima. Revisa los detalles a continuación.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Excel Data Summary - Keep visible for validation */}
            <ValidationResults readOnly />

            {/* Metrics Dashboard */}
            <MetricsDashboard
              routes={routes}
              totalDistance={routes.reduce((sum, r) => sum + r.distance / 1000, 0)}
              totalDuration={routes.reduce((sum, r) => sum + r.duration, 0)}
              vehiclesUsed={routes.filter((r) => r.steps.length > 0).length}
              unassigned={[]}
            />

            {/* Route Map */}
            <RouteMap routes={routes} />

            {/* QR Codes */}
            <QRCodeDisplay routes={routes} />
          </div>
        )}

        {/* Monthly Limit Modal */}
        {subscription && (
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
            dismissible={false}
          />
        )}
    </div>
  );
}
