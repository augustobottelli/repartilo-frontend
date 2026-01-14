import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export interface UserSubscription {
  user_id: string;
  clerk_user_id: string;
  email: string;
  tier: 'free' | 'starter' | 'professional' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_monthly_usage: number;
  monthly_route_limit: number;
  max_vehicles_per_optimization: number;
  max_stops_per_route: number;
  can_optimize: boolean;
  current_period_end?: string;
  // Stripe fields
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  // Overage pricing fields
  price_monthly_cents: number;
  overage_price_cents: number;
  max_overage_optimizations: number;
  enable_overage: boolean;
  overage_count_this_month: number;
  overage_spent_cents: number;
  total_overage_charges_cents: number;
  is_using_overages: boolean;
}

interface UseUserSubscriptionReturn {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserSubscription(): UseUserSubscriptionReturn {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.statusText}`);
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isLoaded, isSignedIn]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}
