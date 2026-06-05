import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const addToast = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = ++counter.current
    setToasts(t => [...t, { id, type, title, message, duration, leaving: false }])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(t => t.map(toast => toast.id === id ? { ...toast, leaving: true } : toast))
    setTimeout(() => {
      setToasts(t => t.filter(toast => toast.id !== id))
    }, 320)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
