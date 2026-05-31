import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { sellerApi } from '@/apiservice/marketplace.api.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useSeller } from '@/hooks/useSeller.js';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';

const empty = {
  fullName: '', mobile: '', email: '', address: '', city: '', state: '', country: 'India', pincode: '',
  storeName: '', storeDescription: '', aadhaarNumber: '', panNumber: '',
  bankMethod: 'upi', upiId: '', accountHolder: '', accountNumber: '', ifsc: '', bankName: '',
};

export default function BecomeSeller() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const { isSeller, isLoading } = useSeller();
  const [form, setForm] = useState({ ...empty, email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) return <Navigate to="/account" state={{ from: '/become-seller' }} replace />;
  if (isLoading) return <PageLoader />;
  if (isSeller) return <Navigate to="/seller" replace />;

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await sellerApi.become({
        fullName: form.fullName, mobile: form.mobile, email: form.email, address: form.address,
        city: form.city, state: form.state, country: form.country, pincode: form.pincode,
        storeName: form.storeName, storeDescription: form.storeDescription,
        aadhaarNumber: form.aadhaarNumber, panNumber: form.panNumber,
      });
      // Save payout details (seller doc now exists).
      const bank = form.bankMethod === 'upi'
        ? { method: 'upi', upiId: form.upiId }
        : { method: 'bank', accountHolder: form.accountHolder, accountNumber: form.accountNumber, ifsc: form.ifsc, bankName: form.bankName };
      await sellerApi.setBank(bank);
      await queryClient.invalidateQueries({ queryKey: ['seller', 'me'] });
      toast.success('Seller profile submitted for verification');
      navigate('/seller');
    } catch {
      /* handled by interceptor */
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Become a Seller" items={[{ label: 'Become Seller' }]} />
      <form onSubmit={submit} className="container-page grid max-w-4xl gap-6 py-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-100 text-primary-700"><Store size={22} /></span>
          <p className="text-gray-600">Sell your products on AgarbattiKart. Complete your seller profile to get started.</p>
        </div>

        <Section title="Personal & Store Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" value={form.fullName} onChange={set} required />
            <Field label="Mobile Number" name="mobile" value={form.mobile} onChange={set} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={set} required />
            <Field label="Store Name" name="storeName" value={form.storeName} onChange={set} required />
            <div className="sm:col-span-2">
              <Field label="Address" name="address" value={form.address} onChange={set} required />
            </div>
            <Field label="City" name="city" value={form.city} onChange={set} required />
            <Field label="State" name="state" value={form.state} onChange={set} required />
            <Field label="Country" name="country" value={form.country} onChange={set} />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={set} required />
            <div className="sm:col-span-2">
              <label className="label">Store Description</label>
              <textarea name="storeDescription" value={form.storeDescription} onChange={set} rows={3} className="input" />
            </div>
          </div>
        </Section>

        <Section title="Identity Verification (optional)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Aadhaar Number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={set} />
            <Field label="PAN Number" name="panNumber" value={form.panNumber} onChange={set} />
          </div>
        </Section>

        <Section title="Payout Details">
          <div className="mb-4 flex gap-3">
            {['upi', 'bank'].map((m) => (
              <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm ${form.bankMethod === m ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                <input type="radio" name="bankMethod" value={m} checked={form.bankMethod === m} onChange={set} className="accent-primary-600" />
                {m === 'upi' ? 'UPI ID' : 'Bank Account'}
              </label>
            ))}
          </div>
          {form.bankMethod === 'upi' ? (
            <Field label="UPI ID" name="upiId" value={form.upiId} onChange={set} required placeholder="name@bank" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account Holder Name" name="accountHolder" value={form.accountHolder} onChange={set} required />
              <Field label="Account Number" name="accountNumber" value={form.accountNumber} onChange={set} required />
              <Field label="IFSC Code" name="ifsc" value={form.ifsc} onChange={set} required />
              <Field label="Bank Name" name="bankName" value={form.bankName} onChange={set} required />
            </div>
          )}
        </Section>

        <div className="flex items-center gap-3">
          <button className="btn-primary" disabled={saving}>{saving ? 'Submitting…' : 'Submit for Verification'}</button>
          <Link to="/" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-6">
      <h3 className="mb-4 text-lg font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, required, ...props }) {
  return (
    <div>
      <label className="label">{label} {required && <span className="text-red-500">*</span>}</label>
      <input className="input" required={required} {...props} />
    </div>
  );
}
