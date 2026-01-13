"use client"

import { AlertCircle, Sparkles, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface SubscriptionLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  limitType: 'monthly' | 'vehicles' | 'stops' | 'overage_cap'
  currentValue: number
  limitValue: number
  currentTier: string
  onRetry?: () => void
  // Overage pricing info
  overageAvailable?: boolean
  overagePriceCents?: number
  overagesRemaining?: number
  onProceedWithOverage?: () => void
  // Control whether modal can be dismissed
  dismissible?: boolean
}

export function SubscriptionLimitModal({
  open,
  onOpenChange,
  limitType,
  currentValue,
  limitValue,
  currentTier,
  onRetry,
  overageAvailable = false,
  overagePriceCents = 0,
  overagesRemaining = 0,
  onProceedWithOverage,
  dismissible = true,
}: SubscriptionLimitModalProps) {
  const router = useRouter()

  const overagePrice = (overagePriceCents / 100).toFixed(2)

  const getTitleAndDescription = () => {
    switch (limitType) {
      case 'monthly':
        return {
          title: overageAvailable ? '¡Límite Mensual Alcanzado!' : '¡Límite Mensual Alcanzado!',
          description: overageAvailable
            ? `Has utilizado todas tus ${limitValue} optimizaciones incluidas este mes.`
            : `Has utilizado todas tus ${limitValue} optimizaciones de este mes.`,
          detail: `Uso actual: ${currentValue}/${limitValue}`,
        }
      case 'overage_cap':
        return {
          title: '¡Límite de Excesos Alcanzado!',
          description: `Has utilizado todos tus ${limitValue} excesos disponibles este mes.`,
          detail: `Excesos usados: ${currentValue}/${limitValue}`,
        }
      case 'vehicles':
        return {
          title: 'Demasiados Vehículos',
          description: `Tu plan ${currentTier.toUpperCase()} permite hasta ${limitValue} vehículos, pero tu archivo contiene ${currentValue}.`,
          detail: `Límite: ${limitValue} vehículos`,
        }
      case 'stops':
        return {
          title: 'Demasiadas Entregas',
          description: `Tu plan ${currentTier.toUpperCase()} permite hasta ${limitValue} puntos de entrega, pero tu archivo contiene ${currentValue}.`,
          detail: `Límite: ${limitValue} entregas`,
        }
    }
  }

  const { title, description, detail } = getTitleAndDescription()

  const getUpgradeMessage = () => {
    if (currentTier === 'free') {
      return 'Actualiza a STARTER ($79) para obtener límites más altos y excesos'
    }
    if (currentTier === 'starter') {
      return 'Actualiza a PROFESSIONAL ($149) para más límites y excesos más baratos'
    }
    if (currentTier === 'professional') {
      return 'Actualiza a ENTERPRISE ($299) para límites más altos'
    }
    return 'Actualiza tu plan para continuar'
  }

  const handleUpgrade = () => {
    router.push('/dashboard/billing')
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if dismissible is true
    if (dismissible || newOpen === true) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onClose={dismissible ? () => handleOpenChange(false) : undefined}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Tu Plan Actual:</span>
              <span className="text-sm font-semibold text-gray-900 uppercase">{currentTier}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">{detail}</span>
            </div>
          </div>

          {/* Overage Option (if available) */}
          {overageAvailable && limitType === 'monthly' && onProceedWithOverage && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Continuar con Precio por Exceso
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Precio por optimización:</span>
                      <span className="font-semibold">${overagePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Excesos disponibles:</span>
                      <span className="font-semibold">{overagesRemaining}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-700">
                          <strong>Sin cargo inmediato:</strong> Los excesos se facturan al final de tu ciclo mensual junto con tu suscripción.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {getUpgradeMessage()}
                </h4>
                <p className="text-sm text-gray-600">
                  {currentTier === 'free' && 'Starter: 100 optimizaciones/mes + excesos a $0.75'}
                  {currentTier === 'starter' && 'Professional: 500 optimizaciones/mes + excesos a $0.50'}
                  {currentTier === 'professional' && 'Enterprise: 2,000 optimizaciones/mes + excesos a $0.25'}
                  {currentTier === 'enterprise' && 'Ya tienes el plan más alto disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-3 w-full">
            {onRetry && limitType !== 'monthly' && (
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  onRetry()
                }}
              >
                Subir Otro Archivo
              </Button>
            )}

            {/* Proceed with Overage button (if available) */}
            {overageAvailable && limitType === 'monthly' && onProceedWithOverage && (
              <Button
                onClick={() => {
                  onProceedWithOverage()
                  onOpenChange(false)
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Continuar (${overagePrice})
              </Button>
            )}

            <Button
              onClick={handleUpgrade}
              variant={overageAvailable && limitType === 'monthly' ? 'outline' : 'default'}
              className={
                overageAvailable && limitType === 'monthly'
                  ? 'flex-1'
                  : 'flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver Planes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
