import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, refreshProfile } = useAuth();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <button
          type="button"
          onClick={refreshProfile}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1">
              <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                {user?.role}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-gray-900">{user?.phone || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="mt-1 font-mono text-sm text-gray-600">{user?.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Member since</dt>
            <dd className="mt-1 text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 font-semibold text-gray-900">Account API</h3>
        <p className="text-sm text-gray-500">
          Profile data is fetched from <code className="rounded bg-gray-100 px-1">POST /api/auth/profile</code>.
          There is no update-profile endpoint on the backend.
        </p>
      </div>
    </div>
  );
}
