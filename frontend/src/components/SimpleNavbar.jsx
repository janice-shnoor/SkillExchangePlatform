import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  MessageCircle,
  ArrowLeftRight,
  User,
  LogOut,
} from 'lucide-react'

function Navbar() {
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
        <div className="flex items-center gap-6">

          <Link
            to="/dashboard"
            title="Dashboard"
            className="text-[var(--text-on-dark)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <LayoutDashboard size={20} />
          </Link>

          <Link
            to="/discover"
            title="Discover"
            className="text-[var(--text-on-dark)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <Search size={20} />
          </Link>

          <Link
            to="/messaging"
            title="Messages"
            className="text-[var(--text-on-dark)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <MessageCircle size={20} />
          </Link>

          <Link
            to="/exchanges"
            title="Exchanges"
            className="text-[var(--text-on-dark)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <ArrowLeftRight size={20} />
          </Link>

          <Link
            to="/profile"
            title="Profile"
            className="text-[var(--text-on-dark)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <User size={20} />
          </Link>

          <Link
            to="/"
            title="Logout"
            className="text-[var(--text-on-dark)] transition-colors hover:text-[var(--error)]"
          >
            <LogOut size={20} />
          </Link>

        </div>

      </div>
    </nav>
  )
}

export default Navbar