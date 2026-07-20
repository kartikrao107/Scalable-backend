import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
const linkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
  }`;

export default function AdminLayout() {
  const { isAdmin, isSeller } = useAuth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Panel</h1>
      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="rounded-xl border border-gray-200 bg-white p-4">
          <nav className="space-y-1">
            <NavLink to="/admin" end className={linkClass}>Overview</NavLink>
            {(isSeller || isAdmin) && (
              <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
            )}
            <NavLink to="/admin/orders" className={linkClass}>
  Orders
</NavLink>
            {isAdmin && (
              <>
                <NavLink to="/admin/categories" className={linkClass}>Categories</NavLink>
                <NavLink to="/admin/coupons" className={linkClass}>Coupons</NavLink>
              </>
            )}
          </nav>
        </aside>
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
