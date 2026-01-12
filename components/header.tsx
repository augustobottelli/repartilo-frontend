"use client";

import { Truck, RotateCcw, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOptimizationStore } from '@/lib/store';
import { useUser, useClerk } from '@clerk/nextjs';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const { reset, currentStep } = useOptimizationStore();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { subscription } = useUserSubscription();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isSignedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Repartilo</h1>
              <p className="text-xs text-muted-foreground">Optimizador de Rutas</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {currentStep !== 'upload' && (
              <Button onClick={reset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nueva Optimización
              </Button>
            )}

            {/* User Menu */}
            {isSignedIn ? (
              <div className="relative">
                {/* User Badge with Tier */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {subscription && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary uppercase">
                      {subscription.tier}
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0] || user?.emailAddresses[0].emailAddress[0].toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">
                          {user?.firstName || user?.emailAddresses[0].emailAddress}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.emailAddresses[0].emailAddress}
                        </p>
                        {subscription && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {subscription.current_monthly_usage}/{subscription.monthly_route_limit === -1 ? '∞' : subscription.monthly_route_limit} rutas usadas
                          </p>
                        )}
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configuración</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left text-error"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
