import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await api.login(
        formData.email,
        formData.password
      )

      login(response.user, response.token)

      if (response.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur xl:grid-cols-[0.92fr_1.08fr]">
        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mb-10">
            <p className="mb-3 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Trusted access
            </p>
            <h1 className="mb-2 text-4xl text-slate-900">
              Login
            </h1>

            <p className="text-slate-500">
              Sign in to continue to the KYC portal
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 py-3.5 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-amber-700 hover:text-amber-800"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="relative hidden overflow-hidden bg-teal-950 px-10 py-12 text-white xl:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.35),transparent_38%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-teal-100">
                Verification hub
              </p>
              <h2 className="max-w-lg text-5xl leading-tight">
                Review status, submit documents, and keep identity checks moving.
              </h2>
            </div>

            <div className="grid gap-4 text-sm text-slate-100">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                Faster customer onboarding with a simple document workflow.
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                Designed for both customers and admins inside one secure portal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
