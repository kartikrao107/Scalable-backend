import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

export default function Layout() {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="text-xl font-bold text-primary-600">
            ShopScale
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            {user && (
              <>
                <NavLink to="/cart" className={navLinkClass}>Cart</NavLink>
                <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>
                <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              </>
            )}
            {(isAdmin || isSeller) && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm text-gray-600 sm:inline">
                  Hi, {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600">Login</Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 md:hidden">
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/cart" className={navLinkClass}>Cart</NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>
            <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>
            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
            {(isAdmin || isSeller) && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        ShopScale &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
