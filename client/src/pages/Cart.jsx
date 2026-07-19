import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../api/cart';
import { placeOrder } from '../api/orders';
import { applyCoupon } from '../api/coupons';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Spinner';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [checkout, setCheckout] = useState({ addressId: '', couponCode: '' });
  const [couponPreview, setCouponPreview] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const { data } = await getCart();
      setCart(data.cart);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load cart' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleUpdateQty = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await updateCartItem(itemId, { quantity });
      setCart(data.cart);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Remove failed' });
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart({ ...cart, items: [] });
      setMessage({ type: 'success', text: 'Cart cleared' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to clear cart' });
    }
  };

  const handleApplyCoupon = async () => {
    if (!checkout.couponCode) return;
    try {
      const { data } = await applyCoupon({ code: checkout.couponCode, amount: subtotal });
      setCouponPreview(data.result);
      setMessage({ type: 'success', text: `Discount: $${data.result.discount.toFixed(2)}` });
    } catch (err) {
      setCouponPreview(null);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid coupon' });
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkout.addressId) {
      setMessage({ type: 'error', text: 'Address ID is required to place an order' });
      return;
    }
    setCheckingOut(true);
    try {
      const payload = { addressId: checkout.addressId };
      if (checkout.couponCode) payload.couponCode = checkout.couponCode;
      const { data } = await placeOrder(payload);
      setMessage({ type: 'success', text: `Order placed! ID: ${data.order.id}` });
      setCart({ ...cart, items: [] });
      setCouponPreview(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Checkout failed' });
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {items.length > 0 && (
          <button type="button" onClick={handleClear} className="text-sm text-red-600 hover:text-red-700">
            Clear cart
          </button>
        )}
      </div>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
                {item.product?.images?.[0] && (
                  <img src={item.product.images[0]} alt="" className="h-24 w-24 rounded-lg object-cover" />
                )}
                <div className="flex flex-1 flex-col">
                  <Link to={`/products/${item.productId}`} className="font-medium hover:text-primary-600">
                    {item.product?.name}
                  </Link>
                  <p className="text-primary-600 font-semibold">${item.product?.price?.toFixed(2)}</p>
                  <div className="mt-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="ml-auto text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {couponPreview && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${couponPreview.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${couponPreview.finalAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address ID</label>
                <input
                  type="text"
                  required
                  value={checkout.addressId}
                  onChange={(e) => setCheckout({ ...checkout, addressId: e.target.value })}
                  placeholder="Enter your address ID"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Required by POST /api/orders/. Address routes are not mounted on the backend.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={checkout.couponCode}
                    onChange={(e) => setCheckout({ ...checkout, couponCode: e.target.value })}
                    placeholder="Optional"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={checkingOut}
                className="w-full rounded-lg bg-primary-600 py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {checkingOut ? 'Placing order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
