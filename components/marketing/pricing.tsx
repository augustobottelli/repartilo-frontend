"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mes",
    description: "Perfecto para probar el servicio",
    features: [
      "5 optimizaciones",
      "2 vehículos por optimización",
      "25 paradas por ruta",
      "Soporte por email",
    ],
    popular: false,
  },
  {
    name: "Starter",
    price: "$79",
    period: "/mes",
    description: "Para pequeñas empresas con 1-5 vehículos",
    features: [
      "100 optimizaciones",
      "5 vehículos por optimización",
      "100 paradas por ruta",
      "Soporte prioritario",
      "Generación de códigos QR",
      "Historial de optimizaciones",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/mes",
    description: "Para medianas empresas con 5-15 vehículos",
    features: [
      "500 optimizaciones",
      "15 vehículos por optimización",
      "200 paradas por ruta",
      "Soporte prioritario",
      "Analíticas avanzadas",
      "Acceso API",
      "Exportación de datos",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/mes",
    description: "Para flotas grandes con 15+ vehículos",
    features: [
      "2,000 optimizaciones",
      "50 vehículos por optimización",
      "Paradas ilimitadas por ruta",
      "Soporte 24/7",
      "Gestor de cuenta dedicado",
      "Integraciones personalizadas",
      "SLA garantizado",
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Precios simples y transparentes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tu negocio. Empieza gratis con funciones limitadas.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}
              <div
                className={`h-full p-8 rounded-2xl bg-white border-2 ${
                  plan.popular ? "border-primary shadow-xl scale-105" : "border-gray-200"
                } transition-all duration-300 hover:shadow-lg`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            ¿Necesitas más información?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Compara todos los planes
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
