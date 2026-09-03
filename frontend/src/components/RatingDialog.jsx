import { useState } from 'react'
import { Star } from 'lucide-react'

function RatingDialog({
  user,
  skillOffered,
  skillWanted,
  loading = false,
  error = '',
  onSubmit,
  onClose,
}) {
  const [rating, setRating] = useState(0)

  function handleSubmit() {
    if (rating === 0) return
    onSubmit(rating)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-[var(--surface)] p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          Rate exchange
        </h2>

        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Rate your exchange with this user.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--text)]">
              User
            </p>

            <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)]">
              {user.name} · @{user.username}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[var(--text)]">
              Exchange
            </p>

            <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)]">
              {skillOffered} ↔ {skillWanted}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-[var(--error)]">
              {error}
            </p>
          )}

          <div>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} out of 5`}
                  className="text-[var(--warning)] transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    strokeWidth={1.8}
                    fill={star <= rating ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
            className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--dark)] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit rating'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingDialog