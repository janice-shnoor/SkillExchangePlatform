import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!token) {
      setError('Invalid or missing password reset link')
      return
    }

    if (!newPassword) {
      setError('New password is required')
      return
    }

    if (!confirmPassword) {
      setError('Please confirm your new password')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || 'Unable to reset your password.'
        )
      }

      setSuccess('Password reset successfully!')

      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/login')
      }, 5000)
    } catch (err) {
      setError(
        err.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Enter your new password below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
        >
          <div className="space-y-5">

            {error && (
              <p className="rounded-lg border border-[var(--error)]/20 bg-[var(--error)]/10 px-3 py-2.5 text-sm text-[var(--error)]">
                {error}
              </p>
            )}

            {success && (
              <div className="rounded-lg border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3 text-center text-sm">
                <p className="text-[var(--success)]">
                  {success}
                </p>

                <p className="mt-1 text-xs text-[var(--success)]/80">
                  Redirecting to login...
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                New password
              </label>

              <input
                required
                id="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Create a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                required
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-medium text-[var(--dark)] transition-colors duration-200 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Resetting password...' : 'Reset password'}
            </button>

          </div>

          {!success && (
            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-[var(--primary-hover)] transition hover:text-[var(--primary)]"
              >
                Login
              </Link>
            </p>
          )}

        </form>

      </div>
    </div>
  )
}

export default ResetPassword