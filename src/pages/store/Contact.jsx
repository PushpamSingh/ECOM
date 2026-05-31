import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '@/apiservice/misc.api.js';
import { useSettings } from '@/hooks/useCatalog.js';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';

const empty = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const setField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.send(form);
      toast.success('Message sent! We will get back to you soon.');
      setForm(empty);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Contact Us" items={[{ label: 'Contact' }]} />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="card p-7">
          <h2 className="mb-5 text-xl font-bold">Send us a message</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" value={form.name} onChange={setField} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={setField} required />
            <Field label="Phone" name="phone" value={form.phone} onChange={setField} />
            <Field label="Subject" name="subject" value={form.subject} onChange={setField} />
          </div>
          <div className="mt-4">
            <label className="label">Message</label>
            <textarea name="message" value={form.message} onChange={setField} rows={5} className="input" required />
          </div>
          <button className="btn-primary mt-5" disabled={loading}>
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>

        <div className="space-y-4">
          {/* <Info icon={MapPin} title="Address" text={settings?.address || 'Mysuru, Karnataka, India'} /> */}
          <Info icon={Phone} title="Phone" text={settings?.phone || '+91 98765 43210'} />
          <Info icon={Mail} title="Email" text={settings?.adminEmail || 'support@agarbattikart.com'} />
        </div>
      </div>
    </>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...props} />
    </div>
  );
}

function Info({ icon: Icon, title, text }) {
  return (
    <div className="card flex items-start gap-3 p-5">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-50 text-primary-600">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}
