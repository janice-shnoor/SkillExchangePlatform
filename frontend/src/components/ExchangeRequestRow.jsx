function ExchangeRequestRow({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  loading = false,
}) {
  const isReceived = type === 'received'

  const direction = isReceived ? 'FROM' : 'TO'
  const username = isReceived
    ? request.senderUsername
    : request.receiverUsername

  const showActions = onAccept || onReject || onCancel

  const statusStyles = {
    PENDING:
      'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',

    ACCEPTED:
      'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',

    REJECTED:
      'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20',

    CANCELLED:
      'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
  }

  function formatProficiency(value) {
    return value.charAt(0) + value.slice(1).toLowerCase()
  }

  return (
    <div
      className={`grid min-w-[520px] items-center gap-2 border-b border-[var(--border)] px-3 py-3 last:border-b-0 ${
        showActions
          ? 'grid-cols-[80px_minmax(0,1fr)_auto] sm:grid-cols-[120px_1fr_150px]'
          : 'grid-cols-[80px_minmax(0,1fr)_auto] sm:grid-cols-[120px_1fr_100px]'
      }`}
    >
      {/* User */}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {direction}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-[var(--text)]">
          @{username}
        </p>
      </div>

      {/* Exchange */}
      <div className="min-w-0 justify-self-center">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--text)]">
              {request.senderSkillName}
            </p>

            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {formatProficiency(request.senderProficiency)}
            </p>
          </div>

          <span className="shrink-0 text-sm text-[var(--text-muted)]">
            →
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--text)]">
              {request.receiverSkillName}
            </p>

            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {formatProficiency(request.receiverProficiency)}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      {!showActions && (
        <div className="justify-self-end">
          <span
            className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              statusStyles[request.status]
            }`}
          >
            {request.status}
          </span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex justify-self-end gap-2">
          {isReceived ? (
            <>
              <button
                type="button"
                onClick={() => onAccept(request.id)}
                disabled={loading}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-on-dark)] disabled:opacity-50"
              >
                {loading ? '...' : 'Accept'}
              </button>

              <button
                type="button"
                onClick={() => onReject(request.id)}
                disabled={loading}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--error)] hover:bg-[var(--error)] hover:text-[var(--text-on-dark)] disabled:opacity-50"
              >
                {loading ? '...' : 'Reject'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onCancel(request.id)}
              disabled={loading}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--error)] hover:bg-[var(--error)] hover:text-[var(--text-on-dark)] disabled:opacity-50"
            >
              {loading ? '...' : 'Cancel'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ExchangeRequestRow