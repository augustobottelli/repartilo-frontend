import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Vehicle, Delivery, VehicleRoute } from '@/services/api';

interface OptimizationState {
  // Data
  vehicles: Vehicle[];
  deliveries: Delivery[];
  routes: VehicleRoute[];
  qrCodes: Array<{ vehicle_name: string; qr_code_base64: string; google_maps_url: string }>;
  efficiencyMetrics: {
    distanceSaving: number;
    timeSaving: number;
    fuelSaving: number;
  } | null;

  // UI State
  isLoading: boolean;
  currentStep: 'upload' | 'validated' | 'optimized';
  error: string | null;

  // Actions
  setVehicles: (vehicles: Vehicle[]) => void;
  setDeliveries: (deliveries: Delivery[]) => void;
  setRoutes: (routes: VehicleRoute[]) => void;
  setQRCodes: (qrCodes: Array<{ vehicle_name: string; qr_code_base64: string; google_maps_url: string }>) => void;
  setEfficiencyMetrics: (metrics: { distanceSaving: number; timeSaving: number; fuelSaving: number }) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCurrentStep: (step: 'upload' | 'validated' | 'optimized') => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  vehicles: [],
  deliveries: [],
  routes: [],
  qrCodes: [],
  efficiencyMetrics: null,
  isLoading: false,
  currentStep: 'upload' as const,
  error: null,
};

export const useOptimizationStore = create<OptimizationState>()(
  persist(
    (set) => ({
      ...initialState,

      setVehicles: (vehicles) => set({ vehicles }),
      setDeliveries: (deliveries) => set({ deliveries }),
      setRoutes: (routes) => set({ routes }),
      setQRCodes: (qrCodes) => set({ qrCodes }),
      setEfficiencyMetrics: (efficiencyMetrics) => set({ efficiencyMetrics }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'repartilo-optimization-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
