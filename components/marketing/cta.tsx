"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/80">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            ¿Listo para optimizar tus entregas?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Únete a cientos de empresas que ya ahorran tiempo y dinero con Repartilo.
            Empieza gratis hoy.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <Link href="/sign-in" className="sm:w-auto w-full">
              <Button size="lg" variant="outline" className="sm:w-auto w-full bg-white text-primary hover:bg-gray-50">
                Empezar Ahora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/80">
            Sin tarjeta de crédito • Cancelación en cualquier momento • Soporte en español
          </p>
        </motion.div>
      </div>
    </section>
  );
}
