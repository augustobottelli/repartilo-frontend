"use client";

import { useState, useEffect } from 'react';
import { Download, ExternalLink, QrCode as QrCodeIcon, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleRoute, QRCode, apiService } from '@/services/api';
import { useOptimizationStore } from '@/lib/store';
import { useAuth } from '@clerk/nextjs';
import { SubscriptionLimitModal } from '@/components/subscription-limit-modal';

interface QRCodeDisplayProps {
  routes: VehicleRoute[];
}

export function QRCodeDisplay({ routes }: QRCodeDisplayProps) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [limitModal, setLimitModal] = useState<{
    open: boolean;
    currentValue: number;
    limitValue: number;
    tier: string;
  }>({
    open: false,
    currentValue: 0,
    limitValue: 0,
    tier: 'free',
  });

  const { vehicles, deliveries, efficiencyMetrics, isViewingHistory, setQRCodes: setQRCodesInStore, reset } = useOptimizationStore();
  const { getToken } = useAuth();

  useEffect(() => {
    generateQRCodes();
  }, [routes]);

  const generateQRCodes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.generateQRCodes(routes);
      if (result.success) {
        setQrCodes(result.qr_codes);
        setQRCodesInStore(result.qr_codes);

        // Auto-save optimization after QR codes are generated
        await autoSaveOptimization(result.qr_codes);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al generar códigos QR');
    } finally {
      setIsLoading(false);
    }
  };

  const autoSaveOptimization = async (qrCodesData: QRCode[]) => {
    try {
      // Skip auto-save if viewing from history to prevent duplicates
      if (isViewingHistory) {
        console.log('Skipping auto-save: viewing from history');
        return;
      }

      setIsSaving(true);

      const token = await getToken();
      if (!token) {
        console.warn('No auth token available, skipping auto-save');
        return;
      }

      // Calculate totals
      const totalDistance = routes.reduce((sum, r) => sum + r.distance / 1000, 0);
      const totalDuration = routes.reduce((sum, r) => sum + r.duration, 0);
      const vehiclesUsed = routes.filter((r) => r.steps.length > 0).length;

      // Save to database
      await apiService.saveOptimization({
        vehicles,
        deliveries,
        routes: routes.map(r => ({
          vehicle_name: r.vehicle_name,
          steps: r.steps,
          distance: r.distance,
          duration: r.duration,
          load: r.load,
          geometry: r.geometry
        })),
        qr_codes: qrCodesData,
        efficiency_metrics: efficiencyMetrics || undefined,
        total_distance: totalDistance,
        total_duration: totalDuration,
        vehicles_used: vehiclesUsed,
      }, token);

      setSavedSuccessfully(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (err: any) {
      console.error('Failed to auto-save optimization:', err);
      // Don't show error to user for auto-save failure
    } finally {
      setIsSaving(false);
    }
  };

  const downloadQRCode = (qrCode: QRCode) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrCode.qr_code_base64}`;
    link.download = `${qrCode.vehicle_name.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllQRCodes = () => {
    qrCodes.forEach((qrCode) => {
      setTimeout(() => downloadQRCode(qrCode), 100);
    });
  };

  const handleRunAnotherOptimization = async () => {
    try {
      // Get user subscription info to check if they can run another optimization
      const token = await getToken();
      if (!token) {
        alert('Por favor inicia sesión para continuar');
        return;
      }

      const userInfo = await apiService.getUserInfo(token);

      // Check if user has reached monthly limit
      if (
        userInfo.monthly_route_limit !== -1 &&
        userInfo.current_monthly_usage >= userInfo.monthly_route_limit
      ) {
        // Show modal instead of resetting
        setLimitModal({
          open: true,
          currentValue: userInfo.current_monthly_usage,
          limitValue: userInfo.monthly_route_limit,
          tier: userInfo.tier,
        });
        return;
      }

      // User has not reached limit, proceed with reset
      reset();
    } catch (err: any) {
      console.error('Error checking limits:', err);
      // If check fails, allow reset anyway to avoid blocking user
      reset();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-primary" />
            Códigos QR para Conductores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Generando códigos QR...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-error">
        <CardHeader>
          <CardTitle className="text-error">Error al Generar QR</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={generateQRCodes} variant="outline" className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <QrCodeIcon className="w-5 h-5 text-primary" />
              Códigos QR para Conductores
            </CardTitle>
            {savedSuccessfully && (
              <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
                <CheckCircle2 className="w-3 h-3" />
                Guardado
              </span>
            )}
          </div>
          {qrCodes.length > 0 && (
            <Button onClick={downloadAllQRCodes} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar Todos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {qrCodes.length === 0 ? (
          <div className="text-center py-12">
            <QrCodeIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No hay códigos QR disponibles</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Escanea estos códigos QR con tu móvil para abrir las rutas en Google Maps
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrCodes.map((qrCode, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-lg">{qrCode.vehicle_name}</h4>
                  </div>

                  <div className="bg-white p-3 rounded border border-gray-200 mb-3 flex items-center justify-center">
                    <img
                      src={`data:image/png;base64,${qrCode.qr_code_base64}`}
                      alt={`QR Code for ${qrCode.vehicle_name}`}
                      className="max-w-full h-auto"
                      style={{ width: '200px', height: '200px' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => downloadQRCode(qrCode)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar QR
                    </Button>

                    <a
                      href={qrCode.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir en Google Maps
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 text-sm">💡 Instrucciones para Conductores</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Escanea el código QR con la cámara de tu móvil</li>
                <li>2. Se abrirá automáticamente Google Maps con tu ruta</li>
                <li>3. Sigue las indicaciones para completar todas las entregas</li>
                <li>4. Los puntos están ordenados de forma óptima para ahorro de tiempo y combustible</li>
              </ol>
            </div>

            {/* Run Another Optimization */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleRunAnotherOptimization}
                size="lg"
                className="min-w-[250px] bg-primary hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ejecutar Otra Optimización
              </Button>
            </div>
          </>
        )}

        {/* Monthly Limit Modal */}
        <SubscriptionLimitModal
          open={limitModal.open}
          onOpenChange={(open) => setLimitModal({ ...limitModal, open })}
          limitType="monthly"
          currentValue={limitModal.currentValue}
          limitValue={limitModal.limitValue}
          currentTier={limitModal.tier}
        />
      </CardContent>
    </Card>
  );
}
