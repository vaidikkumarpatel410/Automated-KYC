import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from '../pages/Login'
import Signup from '../pages/Signup'
import CustomerDashboard from '../pages/CustomerDashboard'
import UploadDocuments from '../pages/UploadDocuments'
import ApplicationStatus from '../pages/ApplicationStatus'
import AdminDashboard from '../pages/AdminDashboard'
import NotFound from '../pages/NotFound'
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute role="customer">
              <UploadDocuments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/status"
          element={
            <ProtectedRoute role="customer">
              <ApplicationStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes