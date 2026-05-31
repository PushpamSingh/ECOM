import { useQuery } from '@tanstack/react-query';
import { TrendingUp, IndianRupee, Users, Wallet } from 'lucide-react';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR } from '@/utils/format.js';

export default function AdminMarketplace() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['mp-analytics'], queryFn: () => marketplaceAdminApi.analytics().then((r) => r.data) });

  if (isLoading) return <PageLoader />;
  if (isError || !data) return <div className="card p-10 text-center text-gray-400">Could not load analytics.</div>;

  const w = data.wallet || {};
  const cards = [
    { label: 'Marketplace GMV', value: formatINR(data.gmv), icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { label: 'Commission Earned', value: formatINR(data.totalCommission), icon: IndianRupee, color: 'bg-green-100 text-green-600' },
    { label: 'Seller Revenue', value: formatINR(data.totalSellerRevenue), icon: Wallet, color: 'bg-purple-100 text-purple-600' },
    { label: 'Active Sellers', value: data.activeSellers, icon: Users, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">Marketplace Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <span className={`grid h-12 w-12 place-items-center rounded-xl ${c.color}`}><c.icon size={22} /></span>
            <div><p className="text-sm text-gray-500">{c.label}</p><p className="text-2xl font-bold text-ink">{c.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-bold text-ink">Seller Wallet Pool</h3>
          {[['Pending settlement', w.pending], ['Available for payout', w.available], ['Processing payouts', w.processing], ['Paid out (lifetime)', w.paid]].map(([l, v]) => (
            <div key={l} className="flex justify-between border-b py-2 text-sm last:border-0">
              <span className="text-gray-500">{l}</span><span className="font-semibold text-ink">{formatINR(v || 0)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between py-2 text-sm">
            <span className="text-gray-500">Orders with pending settlement</span><span className="font-semibold">{data.ordersWithPendingSettlement}</span>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-bold text-ink">Payouts by Status</h3>
          {Object.keys(data.payoutsByStatus || {}).length === 0 ? (
            <p className="text-sm text-gray-400">No payouts yet.</p>
          ) : (
            Object.entries(data.payoutsByStatus).map(([status, v]) => (
              <div key={status} className="flex justify-between border-b py-2 text-sm last:border-0">
                <span className="text-gray-500">{status}</span><span className="font-semibold text-ink">{v.count} • {formatINR(v.amount)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
