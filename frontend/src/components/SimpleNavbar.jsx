import { Link } from 'react-router-dom'

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

      </div>
    </nav>
  )
}

export default Navbar