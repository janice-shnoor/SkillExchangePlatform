import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../api/auth'
import {
  LayoutDashboard,
  Search,
  MessageCircle,
  ArrowLeftRight,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import Avatar from '../components/Avatar'

function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    )

    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile`,
          {
            credentials: 'include',
          }
        )

        const data = await response.json()

        if (response.ok) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }

    loadUser()
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navigation = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/discover',
      label: 'Discover',
      icon: Search,
    },
    {
      to: '/messaging',
      label: 'Messages',
      icon: MessageCircle,
    },
    {
      to: '/exchanges',
      label: 'Exchanges',
      icon: ArrowLeftRight,
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
    },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 bg-[var(--dark)] lg:flex lg:flex-col">

        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link
            to="/dashboard"
            className="text-xl font-bold"
            style={{ color: 'var(--primary)' }}
          >
            SkillExchange
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'text-[var(--text-on-dark)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-5">
          <button
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-on-dark)] transition hover:text-[var(--primary)]"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-on-dark)] transition hover:text-[var(--error)]"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Top Navbar */}
      <nav className="fixed top-0 right-0 left-0 z-30 h-14 border-b border-[var(--border)] bg-[var(--dark)] shadow-sm lg:left-56 lg:bg-[var(--surface)]">
        <div className="flex h-full items-center px-4 sm:px-6 lg:px-7">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="mr-3 text-[var(--text-on-dark)] lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile Logo */}
          <Link
            to="/dashboard"
            className="text-lg font-bold lg:hidden"
            style={{ color: 'var(--primary)' }}
          >
            SkillExchange
          </Link>

          {/* User Info */}
          <div className="ml-auto flex items-center gap-3 border-l border-white/10 pl-5 lg:border-[var(--border)]">
            {/* Name + Username */}
            <div className="text-right leading-tight">
              <p className="text-sm font-bold text-[var(--text-on-dark)] lg:text-[var(--text)]">
                {user?.name || 'Name'}
              </p>

              <p className="text-xs font-semibold text-white/70 lg:text-[var(--text-muted)]">
                @{user?.username || 'username'}
              </p>
            </div>
            {/* Avatar */}
            <Avatar
              name={user?.name || ''}
              src={user?.avatarUrl || ''}
              size="sm"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {menuOpen && (
      <aside className="fixed top-14 bottom-0 left-0 z-40 flex w-56 flex-col bg-[var(--dark)] lg:hidden">
        <nav className="flex flex-1 flex-col px-3 py-6">

            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'text-[var(--text-on-dark)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}

            {/* Mobile Logout */}
            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-on-dark)] transition hover:text-[var(--primary)]"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Light' : 'Dark'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-on-dark)] transition hover:text-[var(--error)]"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

          </nav>
        </aside>
      )}
    </>
  )
}

export default Navbar