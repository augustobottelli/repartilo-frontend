"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Cómo funciona la optimización de rutas?",
    answer: "Repartilo utiliza algoritmos avanzados de optimización que analizan las distancias, capacidades de vehículos y restricciones para calcular las rutas más eficientes. Solo subes un archivo Excel con tus datos y obtienes rutas optimizadas en segundos.",
  },
  {
    question: "¿Qué necesito para empezar?",
    answer: "Solo necesitas un archivo Excel con dos hojas: una para tus vehículos (con capacidad y dirección de inicio) y otra para las direcciones de entrega (con cantidad de paquetes). Proporcionamos una plantilla descargable para facilitar el proceso.",
  },
  {
    question: "¿Puedo probar antes de pagar?",
    answer: "¡Por supuesto! Todos nuestros planes incluyen 14 días de prueba gratuita sin necesidad de tarjeta de crédito. Puedes explorar todas las funcionalidades y decidir qué plan se adapta mejor a tus necesidades.",
  },
  {
    question: "¿Funcionan las rutas en cualquier país?",
    answer: "Sí, Repartilo funciona en cualquier país. Utilizamos mapas globales y geocodificación internacional para validar direcciones y calcular rutas en todo el mundo.",
  },
  {
    question: "¿Puedo exportar las rutas para mis conductores?",
    answer: "Sí, generamos códigos QR para cada ruta que tus conductores pueden escanear con sus móviles. Al escanear, se abre Google Maps con la ruta completa y todas las paradas en orden optimizado.",
  },
  {
    question: "¿Qué pasa si tengo más entregas de las que caben en mis vehículos?",
    answer: "Nuestro sistema detecta automáticamente cuando una entrega excede la capacidad de un vehículo y la divide en múltiples paradas. También te alertamos si necesitas más vehículos para completar todas las entregas.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-600">
              Respuestas a las dudas más comunes sobre Repartilo
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            ¿Tienes más preguntas?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Contacta con nuestro equipo
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
