import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import FormDialog from './FormDialog'
import ConfirmDialog from './ConfirmDialog'

const API_URL = import.meta.env.VITE_API_URL

const levels = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
}

function ProfileSkills() {
  const [skills, setSkills] = useState([])
  const [offered, setOffered] = useState([])
  const [wanted, setWanted] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/profile/skills`, {
        credentials: 'include',
      }).then((r) => r.json()),

      fetch(`${API_URL}/profile/skills/offered`, {
        credentials: 'include',
      }).then((r) => r.json()),

      fetch(`${API_URL}/profile/skills/wanted`, {
        credentials: 'include',
      }).then((r) => r.json()),
    ])
      .then(([all, offeredData, wantedData]) => {
        if (!all.success || !offeredData.success || !wantedData.success) {
          throw new Error('Unable to load skills')
        }

        setSkills(all.skills)
        setOffered(offeredData.skills)
        setWanted(wantedData.skills)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function addSkill(form) {
    try {
      setActionLoading(true)
      setError('')

      const res = await fetch(`${API_URL}/profile/skills`, {
        method: 'POST',
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

      const list = form.type === 'OFFERED' ? setOffered : setWanted

      list((current) => [...current, data.userSkill])
      setAdding(false)
    } catch (err) {
      setError(
        err.message.includes('Unique constraint failed')
          ? 'Duplicate entries are not allowed.'
          : err.message
      )
    } finally {
      setActionLoading(false)
    }
  }

  async function removeSkill() {
    try {
      setActionLoading(true)
      setError('')

      const res = await fetch(
        `${API_URL}/profile/skills/${deleting.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Unable to remove skill')
      }

      const list =
        deleting.type === 'OFFERED' ? setOffered : setWanted

      list((current) =>
        current.filter((item) => item.id !== deleting.id)
      )

      setDeleting(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const fields = [
    {
      name: 'skillId',
      label: 'Skill',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select a skill' },
        ...skills.map((skill) => ({
          value: skill.id,
          label: skill.name,
        })),
      ],
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select type' },
        { value: 'OFFERED', label: 'Offered' },
        { value: 'WANTED', label: 'Wanted' },
      ],
    },
    {
      name: 'proficiency',
      label: 'Proficiency',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select proficiency' },
        { value: 'BEGINNER', label: 'Beginner' },
        { value: 'INTERMEDIATE', label: 'Intermediate' },
        { value: 'ADVANCED', label: 'Advanced' },
        { value: 'EXPERT', label: 'Expert' },
      ],
    },
  ]

  const group = (items, title) => (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          {title}
        </h3>

        <span className="text-xs text-[var(--text-muted)]">
          {items.length}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {!loading && !items.length && (
          <p className="rounded-lg bg-[var(--background)] px-3 py-4 text-center text-sm text-[var(--text-muted)]">
            No skills added yet.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--text)]">
                {item.skill.name}
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                {levels[item.proficiency]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDeleting(item)}
              disabled={actionLoading}
              className="shrink-0 rounded-md p-1.5 text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--error)] disabled:opacity-50"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Skills
          </h2>

          <button
            type="button"
            onClick={() => {
              setError('')
              setAdding(true)
            }}
            disabled={loading || actionLoading}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[var(--primary-hover)] transition hover:bg-[var(--primary-subtle)] disabled:opacity-50"
          >
            <Plus size={15} />
            Add
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-[var(--error)]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-5 text-sm text-[var(--text-muted)]">
            Loading skills...
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {group(offered, 'Offered Skills')}
            {group(wanted, 'Wanted Skills')}
          </div>
        )}
      </section>

      {adding && (
        <FormDialog
          title="Add Skill"
          description="Add a skill you offer or want to learn."
          fields={fields}
          initialValues={{
            skillId: '',
            type: '',
            proficiency: '',
          }}
          loading={actionLoading}
          error={error}
          submitLabel="Add Skill"
          onSubmit={addSkill}
          onClose={() => setAdding(false)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove Skill"
          message={`Are you sure you want to remove ${deleting.skill.name}?`}
          confirmText="Remove"
          loading={actionLoading}
          onConfirm={removeSkill}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}

export default ProfileSkills