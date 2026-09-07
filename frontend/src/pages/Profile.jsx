import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import FormDialog from '../components/FormDialog'
import ProfileSkills from '../components/ProfileSkills'
import Avatar from '../components/Avatar'
import AvatarEditor from '../components/AvatarEditor'

const API_URL = import.meta.env.VITE_API_URL

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'username', label: 'Username', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
]

const passwordFields = [
  { name: 'currentPassword', label: 'Current Password', type: 'password', required: true, },
  { name: 'newPassword', label: 'New Password', type: 'password', required: true, },
  { name: 'confirmPassword', label: 'Confirm New Password', type: 'password', required: true, },
]

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [editingAvatar, setEditingAvatar] = useState(false)

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
    setActionLoading(true)

    try {
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
    } finally {
      setActionLoading(false)
    }
  }

  async function changePassword(form) {
    setPasswordLoading(true)
    setPasswordSuccess('')

    try {
      if (form.newPassword !== form.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      setChangingPassword(false)
      setPasswordSuccess('Password changed successfully')

      setTimeout(() => {
        setPasswordSuccess('')
      }, 7000)
    } finally {
      setPasswordLoading(false)
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
        <p className="rounded-lg border border-[var(--error)]/20 bg-[var(--error)]/10 px-3 py-2.5 text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setError('')
                setEditingAvatar(true)
              }}
              aria-label="Edit profile photo"
              className="shrink-0 rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <Avatar
                name={user.name}
                src={user.avatarUrl}
                size="lg"
                className="transition-opacity hover:opacity-90"
              />
            </button>

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

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)]">
          <div>
            Last updated{' '}
            <span className="font-medium text-[var(--text)]">
              {new Date(user.updatedAt).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordSuccess('')
              setChangingPassword(true)
            }}
            className="shrink-0 text-[var(--text-muted)] transition hover:text-[var(--primary)] hover:underline"
          >
            Change Password
          </button>
        </div>
        {passwordSuccess && (
          <div className="flex justify-end">
            <p className="mt-3 text-xs text-[var(--success)]">
              {passwordSuccess}
            </p>
          </div>
        )}
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
      {editingAvatar && (
        <AvatarEditor
          user={user}
          onUpdate={setUser}
          onClose={() => setEditingAvatar(false)}
        />
      )}
      {changingPassword && (
      <FormDialog
        title="Change Password"
        description="Update your account password."
        fields={passwordFields}
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        loading={passwordLoading}
        submitLabel="Change Password"
        onSubmit={changePassword}
        onClose={() => setChangingPassword(false)}
      />
    )}
    </div>
  )
}

export default Profile