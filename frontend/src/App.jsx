import { Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { NavigationBar, Footer, AdminLayout, ProtectedRoute, ToastContainer } from './components'
import { ToastProvider } from './context/ToastContext'

const Home          = lazy(() => import('./pages/Home'))
const Work          = lazy(() => import('./pages/Work'))
const About         = lazy(() => import('./pages/About'))
const Contact       = lazy(() => import('./pages/Contact'))
const NotFound      = lazy(() => import('./pages/NotFound/NotFound'))
const AdminLogin    = lazy(() => import('./pages/Admin/AdminLogin'))
const AdminDash     = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminProj     = lazy(() => import('./pages/Admin/AdminProjects'))
const AdminForm     = lazy(() => import('./pages/Admin/AdminProjectForm'))
const AdminAbout     = lazy(() => import('./pages/Admin/AdminAbout'))
const AdminSettings  = lazy(() => import('./pages/Admin/AdminSettings'))
const AdminMemories  = lazy(() => import('./pages/Admin/AdminMemories'))

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'var(--fg-4)',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-sans)',
    }}>
    </div>
  )
}

function PublicLayout() {
  return (
    <>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/"        element={<Home />} />
            <Route path="/work"    element={<Work />} />
            <Route path="/about"   element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"                   element={<AdminDash />} />
              <Route path="/admin/projects"          element={<AdminProj />} />
              <Route path="/admin/projects/new"      element={<AdminForm />} />
              <Route path="/admin/projects/:id/edit" element={<AdminForm />} />
              <Route path="/admin/memories"          element={<AdminMemories />} />
              <Route path="/admin/about"             element={<AdminAbout />} />
              <Route path="/admin/settings"          element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
