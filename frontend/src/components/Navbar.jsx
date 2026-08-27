import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../api/auth'
import {
  LayoutDashboard,
  Search,
  MessageCircle,
  ArrowLeftRight,
  User,
  LogOut,
} from 'lucide-react'


function Navbar() {
  const navigate = useNavigate()
  async function handleLogout() {
    try {
      await logoutUser()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <nav className="bg-[var(--dark)] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="mr-auto text-xl font-bold"
          style={{ color: 'var(--primary)' }}
        >
          SkillExchange
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-[var(--text-on-dark)]">

          <Link to="/dashboard" title="Dashboard">
            <LayoutDashboard size={20} />
          </Link>

          <Link to="/discover" title="Discover">
            <Search size={20} />
          </Link>

          <Link to="/messaging" title="Messages">
            <MessageCircle size={20} />
          </Link>

          <Link to="/exchanges" title="Exchanges">
            <ArrowLeftRight size={20} />
          </Link>

          <Link to="/profile" title="Profile">
            <User size={20} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={20} />
          </button>

        </div>

      </div>
    </nav>
  )
}

export default Navbar