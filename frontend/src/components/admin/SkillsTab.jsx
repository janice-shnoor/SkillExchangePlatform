import { useEffect, useState } from 'react'
import AdminTable from '../Table'
import ConfirmDialog from '../ConfirmDialog'
import FormDialog from '../FormDialog'
import { Plus } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const skillColumns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
]

const skillFormFields = [
  { name: 'name', label: 'Name', required: true },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
  },
]

async function adminFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function SkillsTab() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingSkill, setEditingSkill] = useState(null)
  const [deletingSkill, setDeletingSkill] = useState(null)
  const [addingSkill, setAddingSkill] = useState(false)

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    try {
      setLoading(true)
      setError('')

      const data = await adminFetch('/admin/skills')
      setSkills(data.skills)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function createSkill(form) {
    try {
      setActionLoading(true)
      setError('')

      const data = await adminFetch('/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      setSkills((current) => [...current, data.skill])
      setAddingSkill(false)
    } catch (error) {
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  async function updateSkill(id, form) {
    try {
      setActionLoading(true)
      setError('')

      const data = await adminFetch(`/admin/skills/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      setSkills((current) =>
        current.map((skill) => (skill.id === id ? data.skill : skill))
      )

      setEditingSkill(null)
    } catch (error) {
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  async function deleteSkill() {
    try {
      setActionLoading(true)
      setError('')

      await adminFetch(`/admin/skills/${deletingSkill.id}`, {
        method: 'DELETE',
      })

      setSkills((current) =>
        current.filter((skill) => skill.id !== deletingSkill.id)
      )

      setDeletingSkill(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Loading skills...
      </p>
    )
  }

  return (
  <>
    <div className="flex justify-end pb-1 pt-1">
      <button
        type="button"
        onClick={() => setAddingSkill(true)}
        disabled={actionLoading}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[var(--primary-hover)] transition hover:bg-[var(--primary-subtle)] disabled:opacity-50"
      >
        <Plus size={15} />
        Add Skill
      </button>
    </div>

    {error && (
      <div className="px-6 pb-4">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
          {error}
        </p>
      </div>
    )}

    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
    {skills.length === 0 ? (
      <p className="px-6 py-6 text-sm text-[var(--text-muted)]">
        No skills found.
      </p>
    ) : (
      <AdminTable
        columns={skillColumns}
        data={skills}
        renderActions={(skill) => (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditingSkill(skill)}
              disabled={actionLoading}
              className="font-medium text-[var(--primary-hover)] transition hover:underline disabled:opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => setDeletingSkill(skill)}
              disabled={actionLoading}
              className="font-medium text-[var(--error)] transition hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      />
    )}
    </div>

      {addingSkill && (
        <FormDialog
          title="Add Skill"
          description="Add a new skill to the platform."
          fields={skillFormFields}
          initialValues={{
            name: '',
            description: '',
          }}
          loading={actionLoading}
          submitLabel="Add Skill"
          onSubmit={createSkill}
          onClose={() => setAddingSkill(false)}
        />
      )}

      {editingSkill && (
        <FormDialog
          title="Edit Skill"
          description="Update the skill information."
          fields={skillFormFields}
          initialValues={{
            name: editingSkill.name,
            description: editingSkill.description || '',
          }}
          loading={actionLoading}
          submitLabel="Save Changes"
          onSubmit={(form) => updateSkill(editingSkill.id, form)}
          onClose={() => setEditingSkill(null)}
        />
      )}

      {deletingSkill && (
        <ConfirmDialog
          title="Delete Skill"
          message={`Are you sure you want to delete ${deletingSkill.name}? This action cannot be undone.`}
          loading={actionLoading}
          onConfirm={deleteSkill}
          onCancel={() => setDeletingSkill(null)}
        />
      )}
    </>
  )
}

export default SkillsTab