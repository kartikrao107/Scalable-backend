import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin, isSeller } = useAuth();

  const sections = [
    ...(isSeller || isAdmin
      ? [{ title: 'Products', desc: 'Create, update, and delete products', link: '/admin/products' }]
      : []),
    ...(isAdmin
      ? [
          { title: 'Categories', desc: 'Manage product categories', link: '/admin/categories' },
          { title: 'Coupons', desc: 'Create and manage discount coupons', link: '/admin/coupons' },
        ]
      : []),
  ];

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Welcome, {user?.name}</h2>
        <p className="mt-1 text-sm text-gray-500">
          You are logged in as <span className="font-medium">{user?.role}</span>.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.title}
            to={section.link}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">{section.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
