import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

function Register() {
  const navigate = useNavigate()
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!name.trim()) return setError('Name is required')
    if (!username.trim()) return setError('Username is required')
    if (!email.trim()) return setError('Email is required')
    if (!password.trim()) return setError('Password is required')
    if (!confirmPassword.trim()) {
      return setError('Please confirm your password')
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setLoading(true)

      await registerUser({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      })

      setSuccess('Account created successfully!')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Create your account
          </h1>

          {/*<p className="mt-2 text-[var(--text-muted)]">
            Join SkillExchange and start exchanging skills
          </p>*/}
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
        >

          <div className="space-y-5">

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Name
              </label>

              <input
                required
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Username
              </label>

              <input
                required
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

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
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />

            </div>

            {error && (
              <p className="rounded-lg border border-[var(--error)]/20 bg-[var(--error)]/10 px-3 py-2.5 text-sm text-[var(--error)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-medium text-[var(--dark)] transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            {success && (
              <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-center text-sm">
                <p className="text-[var(--success)]">
                  {success}
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-2 font-medium text-[var(--primary-hover)] transition hover:text-[var(--primary)]"
                >
                  Go to Login
                </button>
              </div>
            )}

          </div>

          {!success && (
            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              <Link
                to="/login"
                className="font-medium text-[var(--primary-hover)] transition hover:text-[var(--primary)]"
              >
                Login?
              </Link>
            </p>
          )}

        </form>

      </div>
    </div>
  )
}

export default Register