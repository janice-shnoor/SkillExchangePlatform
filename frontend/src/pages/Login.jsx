import bgImage from '../assets/bg.jpg'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/auth'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    try {
      const data = await loginUser(email, password)

      setEmail('')
      setPassword('')

      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] lg:flex">

    {/* Mobile Branding */}
    <div
      className="relative flex min-h-32 flex-col items-center justify-center overflow-hidden px-5 lg:hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--dark)]/65" />

      {/* Branding Content */}
      <div className="relative z-10 text-center">
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: 'var(--primary)' }}
        >
          Skill Exchange Platform
        </h2>

        <p className="mt-2 text-sm text-[var(--text-on-dark)] sm:text-base">
          A Community platform to offer skills and learn.
        </p>
      </div>
    </div>

      {/* Desktop Branding */}
      <div
        className="relative hidden min-h-screen overflow-hidden lg:block lg:w-[45%]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--dark)]/65" />

        {/* Branding Content */}
        <div className="relative z-10 flex min-h-screen items-start justify-center px-8 pt-[10vh]">
          <div className="max-w-sm text-center">
            <h2
              className="text-5xl font-bold tracking-tight"
              style={{ color: 'var(--primary)' }}
            >
              Skill Exchange Platform
            </h2>

            <p className="mt-4 text-lg text-[var(--text-on-dark)]">
              A Community platform to offer skills and learn.
            </p>
          </div>
        </div>
      </div>

      {/* Login */}
      <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center bg-[var(--background)] px-6 py-10 lg:min-h-screen lg:w-[55%] lg:py-12">
        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
            Login
          </h1>

          {/*<p className="mt-2 text-[var(--text-muted)]">
            Sign in to continue to SkillExchange
          </p>*/}

          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {error && (
              <p className="rounded-lg border border-[var(--error)]/20 bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
                {error}
              </p>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Email
              </label>

              <input
                required
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Password
              </label>

              <input
                required
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            <div className="flex justify-end"> 
              <Link to="/forgot-password" className="text-sm font-medium text-[var(--primary-hover)] transition hover:text-[var(--primary)]" > 
                Forgot password? 
              </Link> 
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-medium text-[var(--dark)] transition-colors duration-200 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            {/* Don't have an account?{' '} */}
            <Link
              to="/register"
              className="font-medium text-[var(--primary-hover)] transition hover:text-[var(--primary)]"
            >
              Register?
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login