'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('info')

  const showToast = useCallback((msg, sev = 'info') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }, [])

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    warning: (msg) => showToast(msg, 'warning'),
    info: (msg) => showToast(msg, 'info'),
  }

  // Pastel color palette with professional minimalist design
  const severityStyles = {
    success: {
      backgroundColor: '#E8F5E9',
      color: '#2E7D32',
      border: '1px solid #A5D6A7',
    },
    error: {
      backgroundColor: '#FFEBEE',
      color: '#C62828',
      border: '1px solid #EF9A9A',
    },
    warning: {
      backgroundColor: '#FFF3E0',
      color: '#E65100',
      border: '1px solid #FFCC80',
    },
    info: {
      backgroundColor: '#E3F2FD',
      color: '#1565C0',
      border: '1px solid #90CAF9',
    },
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2, mr: 2, zIndex: 10000 }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant='outlined'
          sx={{
            width: '100%',
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            ...severityStyles[severity],
            '& .MuiAlert-icon': {
              fontSize: '20px',
              opacity: 0.9,
              alignItems: 'center',
              marginRight: '12px',
            },
            '& .MuiAlert-message': {
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
            },
            '& .MuiAlert-action': {
              padding: '0',
              paddingLeft: '12px',
              alignItems: 'center',
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
