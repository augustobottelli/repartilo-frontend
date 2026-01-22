"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Hero() {

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Optimización Inteligente de Rutas
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Optimiza tus entregas en{" "}
              <span className="text-primary">segundos</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Planifica rutas óptimas para múltiples vehículos, ahorra tiempo y combustible,
              y mejora la eficiencia de tu flota con solo subir un archivo Excel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/sign-in" className="sm:w-auto w-full">
                <Button size="lg" className="w-full">
                  Empezar Gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Sin tarjeta de crédito. Prueba gratuita de 14 días.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-gray-900">40%</span>
                </div>
                <p className="text-sm text-gray-600">Menos km recorridos</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-gray-900">60%</span>
                </div>
                <p className="text-sm text-gray-600">Ahorro de tiempo</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-gray-900">35%</span>
                </div>
                <p className="text-sm text-gray-600">Menos combustible</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <Image
                  src="/images/mapa_rutas.png"
                  alt="Vista previa del mapa de rutas optimizadas"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Distancia total</span>
                  <span className="text-sm font-semibold text-gray-900">8.5 km</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Tiempo estimado</span>
                  <span className="text-sm font-semibold text-gray-900">40 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Vehículos</span>
                  <span className="text-sm font-semibold text-gray-900">1</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            >
              ✓ Ruta optimizada
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            >
              5 entregas planificadas
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
