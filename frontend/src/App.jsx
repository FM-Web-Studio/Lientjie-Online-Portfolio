import { Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { NavigationBar, Footer, ToastContainer } from './components'
import { ToastProvider } from './context/ToastContext'
import { ContentProvider } from './context/ContentContext'
import useMomentumScroll from './hooks/useMomentumScroll'

const Home     = lazy(() => import('./pages/Home'))
const Work     = lazy(() => import('./pages/Work'))
const About    = lazy(() => import('./pages/About'))
const Contact  = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))
const Admin    = lazy(() => import('./pages/Admin/Admin'))

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', color: 'var(--fg-4)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)',
    }} />
  )
}

// Public site chrome - nav + footer. The admin panel is standalone (no chrome),
// and momentum scrolling is only mounted here so admin keeps native scrolling.
function PublicLayout() {
  useMomentumScroll()
  return (
    <>
      <NavigationBar />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <ContentProvider>
        <ToastContainer />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Admin - standalone, self-gating, no public chrome */}
            <Route path="/admin" element={<Admin />} />

            <Route element={<PublicLayout />}>
              <Route path="/"        element={<Home />} />
              <Route path="/work"    element={<Work />} />
              <Route path="/about"   element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*"        element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ContentProvider>
    </ToastProvider>
  )
}
