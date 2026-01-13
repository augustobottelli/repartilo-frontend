import { AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { UserSubscription } from '@/lib/hooks/useUserSubscription';

interface OverageInfoProps {
  subscription: UserSubscription;
  variant?: 'card' | 'inline' | 'warning';
}

export function OverageInfo({ subscription, variant = 'card' }: OverageInfoProps) {
  const {
    enable_overage,
    is_using_overages,
    overage_price_cents,
    overage_count_this_month,
    overage_spent_cents,
    max_overage_optimizations,
    monthly_route_limit,
    current_monthly_usage,
  } = subscription;

  // Don't show anything if overages aren't enabled
  if (!enable_overage) {
    return null;
  }

  const overagesRemaining = max_overage_optimizations - overage_count_this_month;
  const overagePrice = (overage_price_cents / 100).toFixed(2);
  const totalSpent = (overage_spent_cents / 100).toFixed(2);
  const overageUsagePercent = (overage_count_this_month / max_overage_optimizations) * 100;

  // Determine color based on usage
  const getStatusColor = () => {
    if (overageUsagePercent >= 90) return 'text-red-600 bg-red-50';
    if (overageUsagePercent >= 70) return 'text-amber-600 bg-amber-50';
    if (is_using_overages) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Card variant - full featured card
  if (variant === 'card') {
    return (
      <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Overage Usage</h3>

            {is_using_overages ? (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Overages used:</span>
                    <span className="font-medium">{overage_count_this_month} / {max_overage_optimizations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overage charges:</span>
                    <span className="font-medium">${totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next overage cost:</span>
                    <span className="font-medium">${overagePrice}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div
                      className="bg-current h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(overageUsagePercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1">
                    {overagesRemaining} overage{overagesRemaining !== 1 ? 's' : ''} remaining
                  </p>
                </div>

                {overageUsagePercent >= 80 && (
                  <div className="mt-3 text-sm font-medium">
                    ⚠️ You're running low on overage allowance. Consider upgrading your plan.
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm space-y-1">
                <p>You're within your monthly limit ({current_monthly_usage} / {monthly_route_limit})</p>
                <p className="text-xs opacity-75">
                  After your limit, additional optimizations cost ${overagePrice} each (up to {max_overage_optimizations} overages)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Warning variant - compact warning message
  if (variant === 'warning' && is_using_overages) {
    return (
      <div className={`rounded-lg border p-3 ${getStatusColor()} flex items-start gap-2`}>
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium mb-1">Using overage pricing</p>
          <p>
            You've used {overage_count_this_month} of {max_overage_optimizations} overage optimizations.
            Current charges: <span className="font-semibold">${totalSpent}</span>
          </p>
          {overageUsagePercent >= 80 && (
            <p className="mt-1 font-medium">
              Only {overagesRemaining} overage{overagesRemaining !== 1 ? 's' : ''} remaining!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline variant - compact single line
  if (variant === 'inline') {
    if (is_using_overages) {
      return (
        <div className="text-sm text-amber-600 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>
            Overages: {overage_count_this_month}/{max_overage_optimizations} used
            (${totalSpent} charged, ${overagePrice} per additional)
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>
            After limit: ${overagePrice}/optimization (up to {max_overage_optimizations} overages)
          </span>
        </div>
      );
    }
  }

  return null;
}

export default OverageInfo;
