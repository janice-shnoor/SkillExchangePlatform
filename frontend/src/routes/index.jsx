import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import PublicLayout from '../layouts/PublicLayout'

import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import GuestRoute from './GuestRoute'

import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Discover from '../pages/Discover'
import Profile from '../pages/Profile'
import Messaging from '../pages/Messaging'
import Exchanges from '../pages/Exchanges'
import Admin from '../pages/Admin'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '*', element: <NotFound /> },
      {
        element: <GuestRoute />,
        children: [
          { path: '/register', element: <Register /> },
          { path: '/reset-password', element: <ResetPassword /> },
        ],
      },
    ],
  },

  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/discover', element: <Discover /> },
          { path: '/profile', element: <Profile /> },
          { path: '/exchanges', element: <Exchanges /> },

          {
            element: <AdminRoute />,
            children: [
              { path: '/admin', element: <Admin /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/messaging', element: <Messaging /> },
    ],
  },
])

export default router