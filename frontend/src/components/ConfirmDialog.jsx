function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  confirmClassName = 'bg-[var(--error)]',
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--surface)] p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          {title}
        </h2>

        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:bg-[var(--surface-hover)] disabled:pointer-events-none disabled:opacity-50"          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 ${confirmClassName}`}
            >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog