import { useEffect, useState } from 'react'

const inputClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none'

function FormDialog({
  title,
  description,
  fields,
  initialValues = {},
  loading = false,
  error = '',
  submitLabel = 'Save',
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState(initialValues)

  useEffect(() => {
    setForm(initialValues)
  }, [initialValues])

  function handleChange(e) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-[var(--surface)] p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {description}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-[var(--error)]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                {field.label}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name] ?? ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={field.rows || 4}
                  className={`${inputClass} resize-none`}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name] ?? ''}
                  onChange={handleChange}
                  required={field.required}
                  className={inputClass}
                >
                  {field.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || 'text'}
                  value={form[field.name] ?? ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={inputClass}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--dark)] disabled:opacity-50"
            >
              {loading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormDialog