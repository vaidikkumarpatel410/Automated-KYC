const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || '').toLowerCase()

  const styles = {
    uploaded: 'bg-slate-100 text-slate-700',
    under_verification: 'bg-amber-100 text-amber-700',
    verified: 'bg-emerald-100 text-emerald-700',
    manual_review: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    failed: 'bg-rose-100 text-rose-700',
  }
  const labels = {
    uploaded: 'Uploaded',
    under_verification: 'Under Verification',
    verified: 'Verified',
    manual_review: 'Manual Review',
    approved: 'Approved',
    rejected: 'Rejected',
    failed: 'Failed',
  }

  return (
    <span
      className={`inline-block rounded-full px-4 py-2 font-medium ${styles[normalizedStatus] || 'bg-slate-100 text-slate-700'}`}
    >
      {labels[normalizedStatus] || status}
    </span>
  )
}

export default StatusBadge
