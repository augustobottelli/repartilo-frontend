"use client"

import { AlertCircle, Sparkles } from 'lucide-react'
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
  limitType: 'monthly' | 'vehicles' | 'stops'
  currentValue: number
  limitValue: number
  currentTier: string
  onRetry?: () => void
}

export function SubscriptionLimitModal({
  open,
  onOpenChange,
  limitType,
  currentValue,
  limitValue,
  currentTier,
  onRetry,
}: SubscriptionLimitModalProps) {
  const router = useRouter()

  const getTitleAndDescription = () => {
    switch (limitType) {
      case 'monthly':
        return {
          title: '¡Límite Mensual Alcanzado!',
          description: `Has utilizado todas tus ${limitValue} optimizaciones de este mes.`,
          detail: `Uso actual: ${currentValue}/${limitValue}`,
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
      return 'Actualiza a PRO para obtener límites más altos'
    }
    if (currentTier === 'pro') {
      return 'Actualiza a ENTERPRISE para límites ilimitados'
    }
    return 'Actualiza tu plan para continuar'
  }

  const handleUpgrade = () => {
    router.push('/dashboard/billing')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
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

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {getUpgradeMessage()}
                </h4>
                <p className="text-sm text-gray-600">
                  {currentTier === 'free' && 'Pro: 500 optimizaciones/mes, 20 vehículos, 200 entregas'}
                  {currentTier === 'pro' && 'Enterprise: Optimizaciones ilimitadas, sin límites'}
                  {currentTier === 'enterprise' && 'Ya tienes el plan más alto disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
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
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ver Planes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
