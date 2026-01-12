"use client";

import { Check, Upload, CheckCircle, Sparkles } from 'lucide-react';
import { useOptimizationStore } from '@/lib/store';

const steps = [
  { id: 'upload', label: 'Subir Excel', icon: Upload },
  { id: 'validated', label: 'Validación', icon: CheckCircle },
  { id: 'optimized', label: 'Optimizado', icon: Sparkles },
];

export function StepIndicator() {
  const { currentStep } = useOptimizationStore();

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-primary text-white scale-110 shadow-lg'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCurrent ? 'text-gray-900' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="w-24 h-0.5 mx-4 relative top-[-20px]">
                  <div
                    className={`h-full ${
                      index < currentStepIndex ? 'bg-success' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
