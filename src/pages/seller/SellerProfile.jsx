import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerApi } from '@/apiservice/marketplace.api.js';
import { useSeller } from '@/hooks/useSeller.js';
import { PageLoader } from '@/components/common/Loader.jsx';

export default function SellerProfile() {
  const queryClient = useQueryClient();
  const { seller, bank, isLoading } = useSeller();
  const [profile, setProfile] = useState(null);
  const [bankForm, setBankForm] = useState({ method: 'upi', upiId: '', accountHolder: '', accountNumber: '', ifsc: '', bankName: '' });
  const [savingP, setSavingP] = useState(false);
  const [savingB, setSavingB] = useState(false);

  useEffect(() => { if (seller) setProfile(seller); }, [seller]);
  useEffect(() => { if (bank) setBankForm({ ...bankForm, ...bank }); }, [bank]); // eslint-disable-line

  if (isLoading || !profile) return <PageLoader />;

  const setP = (e) => setProfile((f) => ({ ...f, [e.target.name]: e.target.value }));
  const setB = (e) => setBankForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingP(true);
    try {
      const { fullName, mobile, email, address, city, state, country, pincode, storeName, storeDescription } = profile;
      await sellerApi.updateProfile({ fullName, mobile, email, address, city, state, country, pincode, storeName, storeDescription });
      await queryClient.invalidateQueries({ queryKey: ['seller', 'me'] });
      toast.success('Profile updated');
    } catch { /* handled */ } finally { setSavingP(false); }
  };

  const saveBank = async (e) => {
    e.preventDefault();
    setSavingB(true);
    try {
      const payload = bankForm.method === 'upi'
        ? { method: 'upi', upiId: bankForm.upiId }
        : { method: 'bank', accountHolder: bankForm.accountHolder, accountNumber: bankForm.accountNumber, ifsc: bankForm.ifsc, bankName: bankForm.bankName };
      await sellerApi.setBank(payload);
      await queryClient.invalidateQueries({ queryKey: ['seller', 'me'] });
      toast.success('Payout details updated');
    } catch { /* handled */ } finally { setSavingB(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Profile & Bank</h2>

      <form onSubmit={saveProfile} className="card p-6">
        <h3 className="mb-4 font-bold text-ink">Store Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Store Name" name="storeName" v={profile.storeName} on={setP} />
          <F label="Full Name" name="fullName" v={profile.fullName} on={setP} />
          <F label="Mobile" name="mobile" v={profile.mobile} on={setP} />
          <F label="Email" name="email" v={profile.email} on={setP} />
          <div className="sm:col-span-2"><F label="Address" name="address" v={profile.address} on={setP} /></div>
          <F label="City" name="city" v={profile.city} on={setP} />
          <F label="State" name="state" v={profile.state} on={setP} />
          <F label="Country" name="country" v={profile.country} on={setP} />
          <F label="Pincode" name="pincode" v={profile.pincode} on={setP} />
        </div>
        <button className="btn-primary mt-4" disabled={savingP}>{savingP ? 'Saving…' : 'Save Profile'}</button>
      </form>

      <form onSubmit={saveBank} className="card p-6">
        <h3 className="mb-4 font-bold text-ink">Payout Details</h3>
        <div className="mb-4 flex gap-3">
          {['upi', 'bank'].map((m) => (
            <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm ${bankForm.method === m ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <input type="radio" name="method" value={m} checked={bankForm.method === m} onChange={setB} className="accent-primary-600" />
              {m === 'upi' ? 'UPI ID' : 'Bank Account'}
            </label>
          ))}
        </div>
        {bankForm.method === 'upi' ? (
          <F label="UPI ID" name="upiId" v={bankForm.upiId} on={setB} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Account Holder" name="accountHolder" v={bankForm.accountHolder} on={setB} />
            <F label="Account Number" name="accountNumber" v={bankForm.accountNumber} on={setB} />
            <F label="IFSC" name="ifsc" v={bankForm.ifsc} on={setB} />
            <F label="Bank Name" name="bankName" v={bankForm.bankName} on={setB} />
          </div>
        )}
        <button className="btn-primary mt-4" disabled={savingB}>{savingB ? 'Saving…' : 'Save Payout Details'}</button>
      </form>
    </div>
  );
}

function F({ label, name, v, on }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" name={name} value={v || ''} onChange={on} />
    </div>
  );
}
