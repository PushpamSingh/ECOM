import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Send, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { sellerApi } from '@/apiservice/marketplace.api.js';
import { useSeller } from '@/hooks/useSeller.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import { formatINR } from '@/utils/format.js';
import { onImgError } from '@/utils/format.js';

const STATUS_STYLE = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  NEEDS_CHANGES: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
  BLOCKED: 'bg-red-100 text-red-700',
  UNPUBLISHED: 'bg-gray-100 text-gray-600',
  SOLD_OUT: 'bg-gray-100 text-gray-600',
};

export default function SellerProducts() {
  const queryClient = useQueryClient();
  const { isApproved } = useSeller();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: () => sellerApi.listProducts().then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['seller-products'] });
  const submit = useMutation({
    mutationFn: (id) => sellerApi.submitProduct(id),
    onSuccess: () => { toast.success('Submitted for review'); invalidate(); },
  });
  const del = useMutation({
    mutationFn: (id) => sellerApi.deleteProduct(id),
    onSuccess: () => { toast.success('Draft deleted'); invalidate(); },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">My Products</h2>
        {isApproved && (
          <Link to="/seller/products/new" className="btn-primary"><Plus size={16} /> Add Product</Link>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          message={isApproved ? 'Add your first product to start selling.' : 'You can add products once your account is verified.'}
          action={isApproved ? <Link to="/seller/products/new" className="btn-primary mt-2">Add Product</Link> : null}
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.mainImage} alt="" onError={onImgError} className="h-12 w-12 rounded-lg border object-cover" />
                      <div>
                        <p className="font-medium text-ink line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatINR(p.sellingPrice)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_STYLE[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status.replace('_', ' ')}</span>
                    {p.adminNotes && (p.status === 'NEEDS_CHANGES' || p.status === 'REJECTED') && (
                      <p className="mt-1 max-w-[200px] text-xs text-gray-500">Note: {p.adminNotes}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {['DRAFT', 'NEEDS_CHANGES'].includes(p.status) && (
                        <>
                          <Link to={`/seller/products/${p._id}`} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100" title="Edit"><Pencil size={15} /></Link>
                          <button onClick={() => submit.mutate(p._id)} className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100" title="Submit for review"><Send size={15} /></button>
                        </>
                      )}
                      {p.status === 'DRAFT' && (
                        <button onClick={() => window.confirm('Delete this draft?') && del.mutate(p._id)} className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
