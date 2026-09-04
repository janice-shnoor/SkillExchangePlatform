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
  const [formError, setFormError] = useState('')
  
  useEffect(() => {
    setForm(initialValues)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    for (const field of fields) {
      const value = form[field.name] ?? ''

      if (field.required && !value.trim()) {
        setFormError(`${field.label} is required`)
        return
      }

      if (
        field.type === 'email' &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        setFormError('Please enter a valid email address')
        return
      }
    }

    try {
      await onSubmit(form)
    } catch (err) {
      setFormError(err.message || 'Please check the entered information.')
    }
  }

  function handleClose() {
    setForm(initialValues)
    setFormError('')
    onClose()
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

        {(formError || error) && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-[var(--error)]">
            {formError || error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
                  readOnly={field.readOnly}
                  className={inputClass}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
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