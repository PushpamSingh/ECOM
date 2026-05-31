import { useQuery } from '@tanstack/react-query';
import { sellerApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDateTime } from '@/utils/format.js';

const LEDGER_LABEL = {
  CREDIT_PENDING: 'Sale credited (pending)',
  MATURE_AVAILABLE: 'Settled to available',
  PAYOUT_PROCESSING: 'Payout started',
  PAYOUT_PAID: 'Payout paid',
  PAYOUT_REVERSAL: 'Payout reversed',
  REFUND_DEBIT: 'Refund deducted',
  ADJUSTMENT: 'Adjustment',
};
const CREDIT = ['CREDIT_PENDING', 'MATURE_AVAILABLE', 'PAYOUT_REVERSAL', 'ADJUSTMENT'];

export default function SellerWallet() {
  const { data: wallet, isLoading } = useQuery({ queryKey: ['seller-wallet'], queryFn: () => sellerApi.wallet().then((r) => r.data) });
  const { data: ledger = [] } = useQuery({ queryKey: ['seller-ledger'], queryFn: () => sellerApi.ledger().then((r) => r.data) });

  if (isLoading || !wallet) return <PageLoader />;

  const cards = [
    { label: 'Pending', value: wallet.pendingAmount, hint: 'Awaiting settlement window' },
    { label: 'Available', value: wallet.availableAmount, hint: 'Ready for payout' },
    { label: 'Processing', value: wallet.processingAmount, hint: 'In an active payout' },
    { label: 'Paid out', value: wallet.paidAmount, hint: 'Lifetime received' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Wallet & Earnings</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{formatINR(c.value)}</p>
            <p className="mt-1 text-xs text-gray-400">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <h3 className="border-b px-5 py-3 font-bold text-ink">Wallet Ledger</h3>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-3">Type</th><th className="px-4 py-3">Note</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Date</th></tr>
          </thead>
          <tbody className="divide-y">
            {ledger.map((e) => (
              <tr key={e._id}>
                <td className="px-4 py-3">{LEDGER_LABEL[e.type] || e.type}</td>
                <td className="px-4 py-3 text-gray-500">{e.note}</td>
                <td className={`px-4 py-3 text-right font-medium ${CREDIT.includes(e.type) ? 'text-green-600' : 'text-red-600'}`}>
                  {CREDIT.includes(e.type) ? '+' : '−'}{formatINR(e.amount)}
                </td>
                <td className="px-4 py-3 text-gray-400">{formatDateTime(e.createdAt)}</td>
              </tr>
            ))}
            {ledger.length === 0 && <tr><td colSpan={4} className="py-10 text-center text-gray-400">No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
