import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/products';
import { getCart } from '../api/cart';
import { getWishlist } from '../api/wishlist';
import { getOrders } from '../api/orders';
import { PageLoader } from '../components/Spinner';

export default function Dashboard() {
  const { user, isAdmin, isSeller } = useAuth();
  const [stats, setStats] = useState({ products: 0, cartItems: 0, wishlistItems: 0, orders: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, cartRes, wishlistRes, ordersRes] = await Promise.allSettled([
          getProducts({ limit: 4, sort: 'newest' }),
          getCart(),
          getWishlist(),
          getOrders(),
        ]);

        if (productsRes.status === 'fulfilled') {
          setRecentProducts(productsRes.value.data.products || []);
          setStats((s) => ({ ...s, products: productsRes.value.data.totalProducts || 0 }));
        }
        if (cartRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, cartItems: cartRes.value.data.cart?.items?.length || 0 }));
        }
        if (wishlistRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, wishlistItems: wishlistRes.value.data.wishlist?.length || 0 }));
        }
        if (ordersRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, orders: ordersRes.value.data.orders?.length || 0 }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: 'Total Products', value: stats.products, link: '/products', color: 'bg-blue-500' },
    { label: 'Cart Items', value: stats.cartItems, link: '/cart', color: 'bg-green-500' },
    { label: 'Wishlist', value: stats.wishlistItems, link: '/wishlist', color: 'bg-pink-500' },
    { label: 'Orders', value: stats.orders, link: '/orders', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name}! Role: <span className="font-medium">{user?.role}</span>
        </p>
      </div>
<Link
  to="/address"
  className="mb-6 inline-block rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
>
  My Addresses
</Link>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`mb-3 inline-flex rounded-lg ${card.color} p-2 text-white`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      {(isAdmin || isSeller) && (
        <div className="mb-8 rounded-xl border border-primary-200 bg-primary-50 p-5">
          <h2 className="font-semibold text-primary-900">Admin Access</h2>
          <p className="mt-1 text-sm text-primary-700">
            You have {isAdmin ? 'admin' : 'seller'} privileges.
          </p>
          <Link
            to="/admin"
            className="mt-3 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Go to Admin Panel
          </Link>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">New Arrivals</h2>
          <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.name} className="mb-3 aspect-square w-full rounded-lg object-cover" />
              )}
              <h3 className="line-clamp-1 font-medium">{product.name}</h3>
              <p className="text-primary-600 font-semibold">
  ₹{Number(product.price).toLocaleString("en-IN")}
</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
