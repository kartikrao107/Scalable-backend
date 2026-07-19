import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { getReviews, createReview, deleteReview } from '../api/reviews';
import { addToCart } from '../api/cart';
import { addToWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [productRes, reviewsRes] = await Promise.all([
        getProduct(id),
        getReviews(id),
      ]);
      setProduct(productRes.data.product);
      setReviews(reviewsRes.data.reviews || []);
    } catch {
      setMessage({ type: 'error', text: 'Product not found' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const discountedPrice = product?.discount
    ? product.price - (product.price * product.discount) / 100
    : product?.price;

  const handleAddToCart = async () => {
    if (!user) return setMessage({ type: 'error', text: 'Please login first' });
    try {
      await addToCart({ productId: id, quantity });
      setMessage({ type: 'success', text: 'Added to cart!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return setMessage({ type: 'error', text: 'Please login first' });
    try {
      await addToWishlist({ productId: id });
      setMessage({ type: 'success', text: 'Added to wishlist!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await getReviews(id);
      setReviews(data.reviews || []);
      setMessage({ type: 'success', text: 'Review submitted!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit review' });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete' });
    }
  };

  if (loading) return <PageLoader />;
  if (!product) return <p className="text-center text-gray-500">Product not found.</p>;

  return (
    <div>
      <Link to="/products" className="mb-4 inline-block text-sm text-primary-600 hover:text-primary-700">
        &larr; Back to products
      </Link>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-gray-100">
          {product.images?.length > 0 ? (
            <div className="grid gap-2">
              <img src={product.images[0]} alt={product.name} className="aspect-square w-full object-cover" />
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2">
                  {product.images.slice(1).map((img, i) => (
                    <img key={i} src={img} alt="" className="aspect-square rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center text-gray-400">No image</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.category && (
            <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
          )}
          {product.brand && (
            <p className="text-sm text-gray-500">Brand: {product.brand}</p>
          )}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-600">${discountedPrice?.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">${product.price?.toFixed(2)}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-medium text-red-700">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          {product.seller && (
            <p className="mt-1 text-sm text-gray-500">Sold by: {product.seller.name}</p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <label className="text-sm font-medium">Qty:</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={!product.isAvailable || product.stock <= 0}
              onClick={handleAddToCart}
              className="flex-1 rounded-lg bg-primary-600 py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleAddToWishlist}
              className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
            >
              ♥ Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Reviews ({reviews.length})</h2>
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <label className="text-sm font-medium">Rating:</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} stars</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Write a review..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Submit Review
            </button>
          </form>
        )}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                    <span className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}</span>
                  </div>
                  {user?.id === review.userId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {review.comment && <p className="mt-2 text-gray-600">{review.comment}</p>}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
