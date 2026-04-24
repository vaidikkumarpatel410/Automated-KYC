const EmptyState = ({ title, description }) => {
  return (
    <div className="rounded-2xl bg-white p-10 text-center shadow-md">
      <h2 className="mb-3 text-2xl font-semibold text-gray-800">
        {title}
      </h2>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}

export default EmptyState