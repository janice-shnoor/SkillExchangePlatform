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
      fetch(`${API_URL}/profile/skills`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${API_URL}/profile/skills/offered`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${API_URL}/profile/skills/wanted`, { credentials: 'include' }).then((r) => r.json()),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Request failed')

      const list = form.type === 'OFFERED' ? setOffered : setWanted
      list((current) => [...current, data.userSkill])
      setAdding(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function removeSkill() {
    try {
      setActionLoading(true)
      setError('')

      await fetch(
        `${API_URL}/profile/skills/${deleting.skillId}/${deleting.type}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const list = deleting.type === 'OFFERED' ? setOffered : setWanted
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

  const group = (items, title, description, type) => (
    <div className="rounded-xl border border-[var(--border)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
        </div>
        <span className="text-xs text-[var(--text-muted)]">{items.length}</span>
      </div>

      <div className="mt-5 space-y-2">
        {!loading && !items.length && (
          <p className="rounded-lg bg-[var(--background)] px-4 py-5 text-center text-sm text-[var(--text-muted)]">
            No skills added yet.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-[var(--text)]">
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
              className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-[var(--error)]"
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
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">Skills</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Manage the skills you offer and want to learn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('')
              setAdding(true)
            }}
            disabled={loading || actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary-hover)] hover:bg-[var(--primary-subtle)] disabled:opacity-50"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-[var(--error)]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-8 text-sm text-[var(--text-muted)]">
            Loading skills...
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {group(
              offered,
              'Offered Skills',
              'Skills you can teach to other users.',
              'OFFERED'
            )}

            {group(
              wanted,
              'Wanted Skills',
              'Skills you would like to learn.',
              'WANTED'
            )}
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
