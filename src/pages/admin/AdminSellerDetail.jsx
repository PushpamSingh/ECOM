import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

export default function AdminSellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['admin-seller', id], queryFn: () => marketplaceAdminApi.seller(id).then((r) => r.data) });

  if (isLoading) return <PageLoader />;
  if (!data?.seller) return <div className="py-20 text-center">Seller not found.</div>;
  const { seller, verification, bank, wallet, products = [], payouts = [] } = data;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/sellers')} className="btn-ghost p-2"><ArrowLeft size={18} /></button>
        <h1 className="text-2xl font-bold text-ink">{seller.storeName}</h1>
        <Badge status={seller.status === 'active' ? 'active' : 'pending'}>{seller.status}</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Owner & Contact">
          <Row k="Name" v={seller.fullName} /><Row k="Email" v={seller.email} /><Row k="Mobile" v={seller.mobile} />
          <Row k="Address" v={`${seller.address}, ${seller.city}, ${seller.state} ${seller.pincode}`} />
        </Card>
        <Card title="Verification">
          <Row k="Status" v={verification?.status || 'pending'} />
          <Row k="Aadhaar" v={verification?.aadhaarNumber || '—'} /><Row k="PAN" v={verification?.panNumber || '—'} />
        </Card>
        <Card title="Payout">
          <Row k="Method" v={bank?.method || '—'} />
          {bank?.method === 'upi' ? <Row k="UPI" v={bank.upiId} /> : <><Row k="A/C" v={bank?.accountNumber} /><Row k="IFSC" v={bank?.ifsc} /><Row k="Bank" v={bank?.bankName} /></>}
        </Card>
      </div>

      {wallet && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[['Pending', wallet.pendingAmount], ['Available', wallet.availableAmount], ['Processing', wallet.processingAmount], ['Paid out', wallet.paidAmount]].map(([l, v]) => (
            <div key={l} className="card p-4"><p className="text-sm text-gray-500">{l}</p><p className="text-xl font-bold text-ink">{formatINR(v)}</p></div>
          ))}
        </div>
      )}

      <Card title={`Products (${products.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">Name</th><th className="py-2 text-right">Price</th><th className="py-2">Status</th></tr></thead>
            <tbody className="divide-y">
              {products.map((p) => <tr key={p._id}><td className="py-2">{p.name}</td><td className="py-2 text-right">{formatINR(p.sellingPrice)}</td><td className="py-2">{p.status}</td></tr>)}
              {products.length === 0 && <tr><td colSpan={3} className="py-4 text-gray-400">No products.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={`Payouts (${payouts.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2 text-right">Amount</th><th className="py-2">Status</th><th className="py-2">Date</th></tr></thead>
            <tbody className="divide-y">
              {payouts.map((p) => <tr key={p._id}><td className="py-2 text-right">{formatINR(p.amount)}</td><td className="py-2">{p.status}</td><td className="py-2 text-gray-400">{formatDate(p.createdAt)}</td></tr>)}
              {payouts.length === 0 && <tr><td colSpan={3} className="py-4 text-gray-400">No payouts.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }) {
  return <div className="card p-5"><h3 className="mb-3 font-bold text-ink">{title}</h3>{children}</div>;
}
function Row({ k, v }) {
  return <div className="flex justify-between gap-3 py-1 text-sm"><span className="text-gray-500">{k}</span><span className="text-right font-medium text-ink">{v}</span></div>;
}
