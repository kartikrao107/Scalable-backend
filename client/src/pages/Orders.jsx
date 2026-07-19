import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../api/orders';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Spinner';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await cancelOrder(id);
      await load();
      setMessage({ type: 'success', text: 'Order cancelled' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel' });
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No orders yet.</p>
          <Link to="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id.slice(-8)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-semibold">Total: ${order.totalAmount?.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/orders/${order.id}`}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Details
                  </Link>
                  {order.orderStatus === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(order.id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
