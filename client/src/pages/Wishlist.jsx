import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api/wishlist';
import { addToCart } from '../api/cart';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Spinner';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getWishlist();
      setItems(data.wishlist || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load wishlist' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: 'success', text: 'Removed from wishlist' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to remove' });
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      setMessage({ type: 'success', text: 'Moved to cart!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add to cart' });
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Wishlist</h1>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {item.product?.images?.[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="mb-3 aspect-square w-full rounded-lg object-cover"
                />
              )}
              <Link to={`/products/${item.productId}`} className="font-medium hover:text-primary-600">
                {item.product?.name}
              </Link>
              <p className="text-primary-600 font-semibold">${item.product?.price?.toFixed(2)}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveToCart(item.productId)}
                  className="flex-1 rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
