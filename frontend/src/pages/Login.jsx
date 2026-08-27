import bgImage from '../assets/bg.jpg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
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

      console.log('Login successful:', data)

      setEmail('')
      setPassword('')

      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen lg:flex">
      {/*<div className="hidden lg:block lg:w-[35%]">
        <img
          src={bgImage}
          alt="People exchanging skills"
          className="h-screen w-full object-cover"
        />
      </div> */}
      <div className="hidden items-center justify-center bg-[var(--dark)] lg:flex lg:w-[35%]">
        <div className="text-center">
          <h2
            className="text-5xl font-bold"
            style={{ color: 'var(--primary)' }}
          >Skill Exchange Platfrom</h2>
          <p className="mt-4 text-[var(--text-on-dark)]">
            A Community platform to offer skills and learn.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-[65%]">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold text-[var(--text)]">
            Login
          </h1>

          {/*<p className="mt-2 text-[var(--text-muted)]">
            Sign in to continue to SkillExchange
          </p>*/}

          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
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
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-medium text-[var(--dark)]"
            >
              Sign in
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            {/* Don't have an account?{' '} */}
            <Link
              to="/register"
              className="font-medium text-[var(--primary-hover)]"
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