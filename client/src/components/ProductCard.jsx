import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image</div>
        )}
        {product.discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            -{product.discount}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-gray-900 hover:text-primary-600">{product.name}</h3>
        </Link>
        {product.category && (
          <p className="mt-1 text-xs text-gray-500">{product.category.name}</p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary-600">${discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div className="mt-auto flex gap-2 pt-4">
          <button
            type="button"
            disabled={!product.isAvailable || product.stock <= 0}
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => onAddToWishlist?.(product.id)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            title="Add to wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}
