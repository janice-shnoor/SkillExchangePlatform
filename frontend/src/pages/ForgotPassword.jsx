import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || 'Please check the entered information.'
        )
      }

      setMessage(data.message)
      setEmail('')
    } catch (err) {
      setError(
        err.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] lg:flex">

      {/* Mobile Branding */}
      <div className="flex h-20 items-center justify-center bg-[var(--dark)] px-5 lg:hidden">
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--primary)' }}
        >
          Skill Exchange Platform
        </h2>
      </div>

      {/* Desktop Branding */}
            {/* Forgot Password */}
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-[var(--background)] px-6 py-10 lg:min-h-screen lg:w-[60%] lg:py-12">
        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Enter your email address and we’ll send you a password reset link.
          </p>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {error && (
              <p className="rounded-lg border border-[var(--error)]/20 bg-[var(--error)]/10 px-3 py-2.5 text-sm text-[var(--error)]">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg border border-[var(--success)]/20 bg-[var(--success)]/10 px-3 py-2.5 text-sm text-[var(--success)]">
                {message}
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
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-medium text-[var(--dark)] transition-colors duration-200 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            <Link
              to="/login"
              className="font-medium centered text-[var(--primary-hover)] transition hover:text-[var(--primary)]"
            >
              Back to login
            </Link>
          </p>

        </div>
      </div>
      <div className="hidden items-center justify-center bg-[var(--dark)] lg:flex lg:min-h-screen lg:w-[40%]">
        <div className="px-8 text-center">
          <h2
            className="text-5xl font-bold"
            style={{ color: 'var(--primary)' }}
          >
            Skill Exchange Platfrom
          </h2>

          <p className="mt-4 text-[var(--text-on-dark)]">
            A Community platform to offer skills and learn.
          </p>
        </div>
      </div>

    </div>
  )
}

export default ForgotPassword