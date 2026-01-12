"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "€29",
    period: "/mes",
    description: "Perfecto para pequeñas flotas",
    features: [
      "Hasta 3 vehículos",
      "100 entregas por mes",
      "Optimización básica",
      "Mapas interactivos",
      "Códigos QR",
      "Soporte por email",
    ],
    cta: "Empezar Gratis",
    popular: false,
  },
  {
    name: "Professional",
    price: "€79",
    period: "/mes",
    description: "Para equipos en crecimiento",
    features: [
      "Hasta 10 vehículos",
      "500 entregas por mes",
      "Optimización avanzada",
      "Mapas interactivos",
      "Códigos QR",
      "Historial de rutas",
      "API access",
      "Soporte prioritario",
    ],
    cta: "Empezar Prueba",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para grandes operaciones",
    features: [
      "Vehículos ilimitados",
      "Entregas ilimitadas",
      "Optimización empresarial",
      "Integración personalizada",
      "Gestor de cuenta dedicado",
      "SLA garantizado",
      "Formación incluida",
      "Soporte 24/7",
    ],
    cta: "Contactar Ventas",
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
              Elige el plan que mejor se adapte a tu negocio. Todos incluyen 14 días de prueba gratuita.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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

                <Button
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full mb-6"
                >
                  {plan.cta}
                </Button>

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
