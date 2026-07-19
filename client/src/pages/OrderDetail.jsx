import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder, cancelOrder } from '../api/orders';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Spinner';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getOrder(id)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setMessage({ type: 'error', text: 'Order not found' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    try {
      const { data } = await cancelOrder(id);
      setOrder(data.order);
      setMessage({ type: 'success', text: 'Order cancelled' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel' });
    }
  };

  if (loading) return <PageLoader />;
  if (!order) return <p className="text-center text-gray-500">Order not found.</p>;

  return (
    <div>
      <Link to="/orders" className="mb-4 inline-block text-sm text-primary-600 hover:text-primary-700">
        &larr; Back to orders
      </Link>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
          <div className="flex gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[order.orderStatus]}`}>
              {order.orderStatus}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="mt-6 divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
              {item.product?.images?.[0] && (
                <img src={item.product.images[0]} alt="" className="h-16 w-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <Link to={`/products/${item.productId}`} className="font-medium hover:text-primary-600">
                  {item.product?.name}
                </Link>
                <p className="text-sm text-gray-500">Qty: {item.quantity} &middot; ${item.price?.toFixed(2)} each</p>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-lg font-bold">Total: ${order.totalAmount?.toFixed(2)}</span>
          {order.orderStatus === 'PENDING' && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
