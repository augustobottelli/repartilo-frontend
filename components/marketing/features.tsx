"use client";

import { Upload, Map, Zap, QrCode, BarChart3, Truck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: Upload,
    title: "Importación Simple",
    description: "Sube un archivo Excel con tus vehículos y direcciones. Validamos automáticamente todas las ubicaciones y te alertamos de posibles errores.",
  },
  {
    icon: Truck,
    title: "Asignación Inteligente",
    description: "El algoritmo asigna automáticamente entregas a vehículos considerando capacidad, ubicación y restricciones.",
  },
  {
    icon: Zap,
    title: "Optimización Instantánea",
    description: "Nuestro algoritmo calcula las mejores rutas en segundos, no en horas.",
  },
  {
    icon: Map,
    title: "Visualización Interactiva",
    description: "Ve tus rutas optimizadas en un mapa interactivo con códigos de color.",
  },
  {
    icon: QrCode,
    title: "QR para Conductores",
    description: "Genera códigos QR que abren las rutas directamente en Google Maps.",
  },
  {
    icon: BarChart3,
    title: "Métricas Detalladas",
    description: "Analiza distancias, tiempos y utilización de capacidad por vehículo.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para optimizar tus entregas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Herramientas potentes y fáciles de usar que hacen que la planificación de rutas sea simple y eficiente.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="h-full p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 sm:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ¿Cómo funciona?
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Descarga la plantilla Excel</p>
                    <p className="text-gray-600 text-sm">Formato simple con dos hojas: vehículos y direcciones</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Completa tus datos</p>
                    <p className="text-gray-600 text-sm">Agrega información de vehículos y puntos de entrega</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Valida tus direcciones</p>
                    <p className="text-gray-600 text-sm">Verificamos todas las ubicaciones y te alertamos de posibles errores</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Sube y optimiza</p>
                    <p className="text-gray-600 text-sm">Obtén rutas optimizadas al instante con mapas y métricas</p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <Image
                  src="/images/sheet_template.png"
                  alt="Plantilla de Excel para optimización de rutas"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
