"use client";

import { useUser } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Información de la Cuenta</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Notificaciones</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Las preferencias de notificaciones estarán disponibles próximamente.
            </p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Seguridad</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" size="sm">
                Cambiar Contraseña
              </Button>
              <div>
                <Button variant="outline" size="sm" className="text-error hover:text-error">
                  Eliminar Cuenta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
