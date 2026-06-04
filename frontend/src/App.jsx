import { Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navigation from './components/Layout/Navigation'
import Footer from './components/Layout/Footer'
import AdminLayout from './components/Admin/AdminLayout'
import ProtectedRoute from './components/Admin/ProtectedRoute'
import LoadingSpinner from './components/UI/LoadingSpinner'

const Home        = lazy(() => import('./pages/Home/Home'))
const Bio         = lazy(() => import('./pages/Bio/Bio'))
const Projects    = lazy(() => import('./pages/Projects/Projects'))
const Contact     = lazy(() => import('./pages/Contact/Contact'))
const AdminLogin  = lazy(() => import('./pages/Admin/AdminLogin'))
const AdminDash     = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminProj     = lazy(() => import('./pages/Admin/AdminProjects'))
const AdminForm     = lazy(() => import('./pages/Admin/AdminProjectForm'))
const AdminAbout    = lazy(() => import('./pages/Admin/AdminAbout'))
const AdminSettings = lazy(() => import('./pages/Admin/AdminSettings'))
const NotFound      = lazy(() => import('./pages/NotFound/NotFound'))

function PublicLayout() {
  return (
    <>
      <Navigation />
      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/"        element={<Home />} />
          <Route path="/work"    element={<Projects />} />
          <Route path="/about"   element={<Bio />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin login — standalone */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                       element={<AdminDash />} />
            <Route path="/admin/projects"              element={<AdminProj />} />
            <Route path="/admin/projects/new"          element={<AdminForm />} />
            <Route path="/admin/projects/:id/edit"     element={<AdminForm />} />
            <Route path="/admin/about"                 element={<AdminAbout />} />
            <Route path="/admin/settings"              element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
