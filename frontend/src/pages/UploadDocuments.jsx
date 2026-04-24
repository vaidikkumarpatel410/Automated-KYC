import { useMemo, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const UploadDocuments = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    username: user?.name || '',
    email: user?.email || '',
    documentType: 'aadhaar',
  })
  const [document, setDocument] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const selectedFileName = useMemo(() => document?.name || '', [document])

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!formData.username || !formData.email || !formData.documentType) {
      setError('Please complete username, email, and document type')
      return
    }

    if (!document) {
      setError('Please upload a document')
      return
    }

    try {
      setLoading(true)

      const payload = new FormData()
      payload.append('username', formData.username)
      payload.append('email', formData.email)
      payload.append('documentType', formData.documentType)
      payload.append('document', document)

      await api.uploadApplication(payload)

      setSuccess('Application submitted successfully')
      setDocument(null)

      event.target.reset()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-8">
          <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">
            New application
          </p>
          <h1 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
            Upload a document with your account details attached.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            We’ll submit your username, email, chosen document type, and one supported file in the same request so the backend receives a clean KYC application.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Checklist
          </p>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              Supported formats: PDF, JPG, JPEG, PNG
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Allowed document types: Aadhaar, PAN, Passport
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Your account name and email are included before submission.
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:p-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Document Type
            </label>

            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="aadhaar">Aadhaar</option>
              <option value="pan">PAN</option>
              <option value="passport">Passport</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Upload Document
            </label>

            <label className="block cursor-pointer rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-teal-500 hover:bg-teal-50/50">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => setDocument(event.target.files?.[0] || null)}
                className="hidden"
                required
              />

              <span className="block text-base font-semibold text-slate-900">
                {selectedFileName || 'Choose a file to upload'}
              </span>
              <span className="mt-2 block text-sm text-slate-500">
                Click here to select a supported file format.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-teal-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default UploadDocuments
