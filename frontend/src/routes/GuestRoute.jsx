{/*import { Outlet } from 'react-router-dom'

function GuestRoute() {
  return <Outlet />
}

export default GuestRoute*/}

import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function GuestRoute() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${API_URL}/auth/currUser`, {
          credentials: 'include',
        })

        if (!response.ok) {
          setUser(null)
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default GuestRoute