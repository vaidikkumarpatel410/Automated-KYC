import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal-700">
            Digital identity
          </p>
          <h1 className="text-2xl text-slate-950">
            Digital KYC System
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2 py-2 shadow-sm">
            {user?.role === 'customer' && (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                >
                  Dashboard
                </Link>

                <Link
                  to="/upload"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                >
                  New Application
                </Link>

                <Link
                  to="/status"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                >
                  Status
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-right shadow-sm sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
