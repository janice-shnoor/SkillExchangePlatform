import { useRef, useState } from 'react'
import { Camera, Trash2, X } from 'lucide-react'
import Avatar from './Avatar'

const API_URL = import.meta.env.VITE_API_URL

function AvatarEditor({
  user,
  onUpdate,
  onClose,
}) {
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(event) {
    const file = event.target.files?.[0]

    // Allow the same file to be selected again.
    event.target.value = ''

    if (!file) return

    setError('')

    const allowedTypes = new Set([
      'image/jpeg',
      'image/png',
    ])

    if (!allowedTypes.has(file.type)) {
      setError('Only JPG and PNG images are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to upload profile photo'
        )
      }

      onUpdate(data.user)
    } catch (err) {
      setError(
        err.message || 'Failed to upload profile photo'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove() {
    setError('')

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to remove profile photo'
        )
      }

      onUpdate(data.user)
    } catch (err) {
      setError(
        err.message || 'Failed to remove profile photo'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-[var(--surface)] p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Profile Photo
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Manage your profile photo.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-[var(--text-muted)] transition hover:bg-[var(--background)] hover:text-[var(--text)] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-[var(--error)]">
            {error}
          </p>
        )}

        {/* Large Profile Viewer */}
        <div className="mt-6 flex justify-center">
          <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--primary-subtle)] shadow-sm sm:h-52 sm:w-52">
            <Avatar
              name={user.name}
              src={user.avatarUrl}
              size="xl"
              className="h-full w-full text-4xl"
            />
          </div>
        </div>

        {/* User identity */}
        <div className="mt-4 text-center">
          <p className="text-base font-semibold text-[var(--text)]">
            {user.name}
          </p>

          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            @{user.username}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera size={16} />

            {loading
              ? 'Uploading...'
              : user.avatarUrl
                ? 'Change Photo'
                : 'Upload Photo'}
          </button>

          {user.avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:border-[var(--error)] hover:bg-[var(--error)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />

              {loading ? 'Removing...' : 'Remove Photo'}
            </button>
          )}
        </div>

        {/* File requirements */}
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          JPG or PNG, up to 5 MB.
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default AvatarEditor