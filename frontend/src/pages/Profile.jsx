import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import FormDialog from '../components/FormDialog'
import ProfileSkills from '../components/ProfileSkills'

const API_URL = import.meta.env.VITE_API_URL

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'username', label: 'Username', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
]

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message)
        setUser(data.user)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function updateProfile(form) {
    try {
      setActionLoading(true)
      setError('')

      const res = await fetch(`${API_URL}/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Request failed')
      }

      setUser(data.user)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Loading profile...
      </p>
    )
  }

  if (!user) {
    return (
      <p className="text-sm text-[var(--error)]">
        Unable to load profile.
      </p>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Profile
        </h1>

        {user.role === 'ADMIN' && (
          <Link
            to="/admin"
            className="shrink-0 text-sm font-medium text-[var(--primary-hover)] transition hover:underline"
          >
            Admin Controls →
          </Link>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--primary-subtle)] text-xl font-semibold text-[var(--primary-hover)]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-[var(--text)]">
                {user.name}
              </h2>

              <p className="truncate text-sm text-[var(--text-muted)]">
                @{user.username}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('')
              setEditing(true)
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[var(--primary-hover)] transition hover:bg-[var(--primary-subtle)]"
          >
            <Pencil size={15} />
            Edit
          </button>
        </div>

        <div className="mt-6 grid gap-5 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Full Name
            </p>

            <p className="mt-1.5 text-sm text-[var(--text)]">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Username
            </p>

            <p className="mt-1.5 text-sm text-[var(--text)]">
              @{user.username}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Email
            </p>

            <p className="mt-1.5 break-words text-sm text-[var(--text)]">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Role
            </p>

            <span className="mt-1.5 inline-flex rounded-full bg-[var(--primary-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--primary-hover)]">
              {user.role}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Rating
            </p>

            <p className="mt-1.5 text-sm text-[var(--text)]">
              {user.averageRating !== null &&
              user.averageRating !== undefined
                ? `${user.averageRating.toFixed(1)} (${user.totalRatings})`
                : 'No Ratings Yet'}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)]">
          Last updated{' '}
          <span className="font-medium text-[var(--text)]">
            {new Date(user.updatedAt).toLocaleDateString(undefined, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </section>

      <ProfileSkills />

      {editing && (
        <FormDialog
          title="Edit Profile"
          description="Update your account information."
          fields={fields}
          initialValues={{
            name: user.name,
            username: user.username,
            email: user.email,
          }}
          loading={actionLoading}
          submitLabel="Save Changes"
          onSubmit={updateProfile}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}

export default Profile