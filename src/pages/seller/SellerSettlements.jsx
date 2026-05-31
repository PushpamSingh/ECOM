import { useQuery } from '@tanstack/react-query';
import { sellerApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

const SETTLE_STYLE = {
  pending: 'bg-amber-100 text-amber-700',
  settled: 'bg-green-100 text-green-700',
  refunded: 'bg-red-100 text-red-700',
  disputed: 'bg-purple-100 text-purple-700',
  none: 'bg-gray-100 text-gray-600',
};
const PAYOUT_STYLE = {
  PROCESSING: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function SellerSettlements() {
  const { data: rows = [], isLoading } = useQuery({ queryKey: ['seller-settlements'], queryFn: () => sellerApi.settlements().then((r) => r.data) });
  const { data: payouts = [] } = useQuery({ queryKey: ['seller-payouts'], queryFn: () => sellerApi.payouts().then((r) => r.data) });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Settlements</h2>

      <div className="card overflow-x-auto">
        <h3 className="border-b px-5 py-3 font-bold text-ink">Sales & Settlement Status</h3>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Item</th><th className="px-4 py-3 text-right">Sale</th><th className="px-4 py-3 text-right">Commission</th><th className="px-4 py-3 text-right">You earn</th><th className="px-4 py-3">Settlement</th><th className="px-4 py-3">Date</th></tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-3 font-medium text-ink">{r.orderNumber}</td>
                <td className="px-4 py-3 text-gray-600">{r.name} × {r.quantity}</td>
                <td className="px-4 py-3 text-right">{formatINR(r.productPrice)}</td>
                <td className="px-4 py-3 text-right text-red-600">−{formatINR(r.commissionAmount)}</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{formatINR(r.sellerReceivableAmount)}</td>
                <td className="px-4 py-3"><span className={`badge capitalize ${SETTLE_STYLE[r.settlementStatus]}`}>{r.settlementStatus}</span></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-gray-400">No sales yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="border-b px-5 py-3 font-bold text-ink">Payout History</h3>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr>
          </thead>
          <tbody className="divide-y">
            {payouts.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3 text-right font-medium">{formatINR(p.amount)}</td>
                <td className="px-4 py-3"><span className={`badge ${PAYOUT_STYLE[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan={3} className="py-10 text-center text-gray-400">No payouts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
