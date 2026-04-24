import Navbar from '../components/Navbar'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
