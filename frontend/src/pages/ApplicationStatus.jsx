import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import api from '../services/api'

const ApplicationStatus = () => {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.getCustomerApplications()

        setApplications(response.applications || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  return (
    <DashboardLayout>
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:px-8">
        <p className="mb-3 inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Application tracking
        </p>
        <h1 className="text-4xl text-slate-950 sm:text-5xl">
          Application Status
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Follow each submission from upload through verification, manual review, approval, or rejection.
        </p>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          description="You have not submitted any KYC applications yet."
        />
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="max-w-4xl rounded-[2rem] border border-white/60 bg-white/82 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
            >
              <h2 className="mb-2 text-2xl text-slate-950">
                Application #{application._id.slice(-6)}
              </h2>

              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {application.documentType}
              </p>

              <p className="mb-4 text-slate-600">
                Submitted on{' '}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>

              <div className="mb-6">
                <StatusBadge status={application.status} />
              </div>

              {application.status === 'under_verification' && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-yellow-700">
                    Your KYC application is currently under review.
                  </p>
                </div>
              )}

              {application.status === 'manual_review' && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-orange-700">
                    This upload needs a manual check because the OCR result was not confident enough.
                  </p>
                </div>
              )}

              {application.status === 'verified' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-emerald-700">
                    Your document passed automated checks successfully.
                  </p>
                </div>
              )}

              {application.status === 'approved' && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-green-700">
                    Your KYC application has been approved successfully.
                  </p>
                </div>
              )}

              {application.status === 'failed' && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                  <p className="mb-4 text-rose-700">
                    This upload did not match the selected document type. Please start a new application with the correct document.
                  </p>

                  <button
                    onClick={() => navigate('/upload')}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-white transition hover:bg-slate-800"
                  >
                    Start New Application
                  </button>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <p className="mb-4 text-red-700">
                    Your application was rejected. Reupload is not allowed for this application, so please start a new one.
                  </p>

                  <button
                    onClick={() => navigate('/upload')}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-white transition hover:bg-slate-800"
                  >
                    Create New Application
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default ApplicationStatus
