import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import { addToCart } from '../api/cart';
import { addToWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Spinner';

export default function Products() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '12',
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(filters);
      setProducts(data.products || []);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
      });
    } catch {
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to add items to cart' });
      return;
    }
    try {
      await addToCart({ productId, quantity: 1 });
      setMessage({ type: 'success', text: 'Added to cart!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add to cart' });
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to add to wishlist' });
      return;
    }
    try {
      await addToWishlist({ productId });
      setMessage({ type: 'success', text: 'Added to wishlist!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add to wishlist' });
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Products</h1>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

      <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Search..."
          defaultValue={filters.search}
          onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Brand"
          defaultValue={filters.brand}
          onKeyDown={(e) => e.key === 'Enter' && updateFilter('brand', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min $"
            defaultValue={filters.minPrice}
            onKeyDown={(e) => e.key === 'Enter' && updateFilter('minPrice', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max $"
            defaultValue={filters.maxPrice}
            onKeyDown={(e) => e.key === 'Enter' && updateFilter('maxPrice', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">{pagination.totalProducts} products found</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => updateFilter('page', String(pagination.page - 1))}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateFilter('page', String(pagination.page + 1))}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
