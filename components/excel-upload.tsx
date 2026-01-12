"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiService } from '@/services/api';
import { useOptimizationStore } from '@/lib/store';
import { downloadFile } from '@/lib/utils';
import { SubscriptionLimitModal } from '@/components/subscription-limit-modal';
import { useAuth } from '@clerk/nextjs';

export function ExcelUpload() {
  const { setVehicles, setDeliveries, setCurrentStep, setIsLoading, setError, isLoading } = useOptimizationStore();
  const [validationErrors, setValidationErrors] = useState<any>(null);
  const [limitModal, setLimitModal] = useState<{
    open: boolean;
    limitType: 'vehicles' | 'stops';
    currentValue: number;
    limitValue: number;
    tier: string;
  }>({
    open: false,
    limitType: 'vehicles',
    currentValue: 0,
    limitValue: 0,
    tier: 'free',
  });
  const { getToken } = useAuth();

  const handleDownloadTemplate = async () => {
    try {
      const blob = await apiService.downloadTemplate();
      downloadFile(blob, 'plantilla_repartilo.xlsx');
    } catch (error) {
      console.error('Error downloading template:', error);
      setError('Error al descargar la plantilla');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      // Step 1: Get JWT token
      const token = await getToken();
      if (!token) {
        setError('Por favor inicia sesión para continuar');
        setIsLoading(false);
        return;
      }

      // Step 2: Get user subscription info
      const userInfo = await apiService.getUserInfo(token);

      // Step 3: Count rows in Excel file (fast, no geocoding)
      const counts = await apiService.countExcelRows(file);

      // Step 4: Check vehicle limit
      if (
        userInfo.max_vehicles_per_optimization !== -1 &&
        counts.vehicle_count > userInfo.max_vehicles_per_optimization
      ) {
        setLimitModal({
          open: true,
          limitType: 'vehicles',
          currentValue: counts.vehicle_count,
          limitValue: userInfo.max_vehicles_per_optimization,
          tier: userInfo.tier,
        });
        setIsLoading(false);
        return;
      }

      // Step 5: Check stops limit
      if (
        userInfo.max_stops_per_route !== -1 &&
        counts.delivery_count > userInfo.max_stops_per_route
      ) {
        setLimitModal({
          open: true,
          limitType: 'stops',
          currentValue: counts.delivery_count,
          limitValue: userInfo.max_stops_per_route,
          tier: userInfo.tier,
        });
        setIsLoading(false);
        return;
      }

      // Step 6: All checks passed, proceed with full validation and geocoding
      const result = await apiService.validateExcel(file);

      if (result.success && result.vehicles && result.deliveries) {
        setVehicles(result.vehicles);
        setDeliveries(result.deliveries);
        setCurrentStep('validated');
      } else {
        setError(result.message);
        setValidationErrors({
          vehicle_errors: result.vehicle_errors || [],
          delivery_errors: result.delivery_errors || [],
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al validar el archivo Excel');
    } finally {
      setIsLoading(false);
    }
  }, [setVehicles, setDeliveries, setCurrentStep, setIsLoading, setError, getToken]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            Configurar Optimización de Entregas
          </CardTitle>
          <CardDescription>
            Sube un archivo Excel con tus vehículos y direcciones de entrega
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h3 className="font-semibold mb-2">📋 Instrucciones</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Necesitas un solo archivo Excel con <strong>2 hojas</strong>:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <strong>Hoja "Vehiculos":</strong> Nombre, Capacidad, Dirección Inicio, Dirección Final (opcional)</li>
              <li>• <strong>Hoja "Direcciones":</strong> Dirección, Paquetes, Nombre</li>
            </ul>
          </div>

          {/* Download Template Button */}
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Plantilla Excel
          </Button>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : isLoading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-border hover:border-primary/50 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            {isLoading ? (
              <>
                <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-lg font-medium">Validando archivo...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Esto puede tomar unos segundos
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-lg font-medium">Suelta el archivo aquí...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">Arrastra tu archivo Excel aquí</p>
                    <p className="text-sm text-muted-foreground">o haz clic para seleccionar</p>
                    <p className="text-xs text-muted-foreground mt-2">Formatos: .xlsx, .xls</p>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors && (validationErrors.vehicle_errors.length > 0 || validationErrors.delivery_errors.length > 0) && (
        <Card className="border-error">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-error">
              <AlertCircle className="w-5 h-5" />
              Errores de Validación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validationErrors.vehicle_errors.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Errores en hoja "Vehiculos":</h4>
                <ul className="space-y-1">
                  {validationErrors.vehicle_errors.map((err: any, idx: number) => (
                    <li key={idx} className="text-sm text-error">
                      • Fila {err.row}, campo "{err.field}": {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {validationErrors.delivery_errors.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Errores en hoja "Direcciones":</h4>
                <ul className="space-y-1">
                  {validationErrors.delivery_errors.map((err: any, idx: number) => (
                    <li key={idx} className="text-sm text-error">
                      • Fila {err.row}, campo "{err.field}": {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subscription Limit Modal */}
      <SubscriptionLimitModal
        open={limitModal.open}
        onOpenChange={(open) => setLimitModal({ ...limitModal, open })}
        limitType={limitModal.limitType}
        currentValue={limitModal.currentValue}
        limitValue={limitModal.limitValue}
        currentTier={limitModal.tier}
        onRetry={() => {
          // Reset file input to allow upload again
          setValidationErrors(null);
          setError(null);
        }}
      />
    </div>
  );
}
