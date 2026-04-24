import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'

const CustomerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-8">
        <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">
          Customer workspace
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight sm:text-5xl">
          Welcome back, {user?.name || 'customer'}.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Submit your identity document, track verification progress, and keep your onboarding details organized in one place.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <button
          onClick={() => navigate('/upload')}
          className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 text-left shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
            Submission
          </p>
          <h2 className="mb-2 text-2xl text-slate-950">
            Create New Application
          </h2>

          <p className="text-slate-600">
            Submit your username, email, document type, and one supported identity file for verification.
          </p>
        </button>

        <button
          onClick={() => navigate('/status')}
          className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 text-left shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            Tracking
          </p>
          <h2 className="mb-2 text-2xl text-slate-950">
            Track Status
          </h2>

          <p className="text-slate-600">
            View whether your KYC application is pending, approved, or rejected.
          </p>
        </button>

        <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Policy
          </p>
          <h2 className="mb-2 text-2xl text-slate-950">
            Application Rules
          </h2>

          <p className="text-slate-600">
            If an application is rejected, you must create a completely new application. Existing applications cannot be edited or re-uploaded.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CustomerDashboard
