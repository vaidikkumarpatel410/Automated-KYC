import { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import api from '../services/api'

const AdminDashboard = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const canReviewApplication = (application) => {
    return (
      application.status === 'approved' ||
      application.status === 'failed' ||
      application.status === 'manual_review' ||
      application.status === 'rejected'
    )
  }

  const formatConfidence = (confidence) => {
    if (typeof confidence !== 'number') {
      return 'Not available'
    }

    return `${Math.round(confidence)}%`
  }

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.getAdminApplications()
        setApplications(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleApprove = async (applicationId) => {
    try {
      await api.approveApplication(applicationId)

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? { ...application, status: 'approved' }
            : application
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (applicationId) => {
    try {
      await api.rejectApplication(applicationId)

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? { ...application, status: 'rejected' }
            : application
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return(
    <DashboardLayout>
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-8">
        <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-100">
          Admin review
        </p>
        <h1 className="text-4xl sm:text-5xl">
          Admin Dashboard
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Review customer KYC applications, especially items flagged for manual review, and approve or reject them.
        </p>
      </section>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          description="There are currently no customer applications."
        />
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
            >
              <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl text-slate-950">
                    {application.user?.name || 'Customer'}
                  </h2>

                  <p className="mb-1 text-slate-600">
                    Email: {application.user?.email}
                  </p>

                  <p className="mb-1 text-slate-600">
                    Document Type: {application.documentType}
                  </p>

                  <p className="mb-4 text-slate-600">
                    Submitted:{' '}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mb-5">
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-2 font-semibold text-slate-800">
                      Uploaded Document
                    </h3>

                    <a
                      href={`http://localhost:5000/${application.documentPath.replace(/^\/+/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-teal-700 hover:underline"
                    >
                      View Document
                    </a>
                  </div>

                  {application.verificationResult && (
                    <div className={`mt-4 rounded-2xl border p-4 ${
                      application.status === 'manual_review'
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
                          OCR Review
                        </h3>
                        <StatusBadge status={application.verificationResult.status} />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-white/80 p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Confidence
                          </p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">
                            {formatConfidence(application.verificationResult.confidence)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/80 p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Extracted Number
                          </p>
                          <p className="mt-1 break-all text-sm font-medium text-slate-900">
                            {application.verificationResult.extractedDocumentNumber || 'Not found'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-white/80 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          OCR Reason
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {application.verificationResult.remarks || 'No OCR remarks available.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {canReviewApplication(application) && (
                  <div className="flex gap-4 xl:flex-col">
                    <button
                      onClick={() => handleApprove(application._id)}
                      className="rounded-2xl bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(application._id)}
                      className="rounded-2xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard
