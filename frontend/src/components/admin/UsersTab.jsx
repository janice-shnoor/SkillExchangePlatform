import { useEffect, useState } from 'react'
import AdminTable from '../Table'
import ConfirmDialog from '../ConfirmDialog'
import FormDialog from '../FormDialog'
import Avatar from '../Avatar'

const API_URL = import.meta.env.VITE_API_URL

const userColumns = [
  { key: 'avatar', label: '',
    render: (user) => (
      <Avatar
        name={user.name}
        src={user.avatarUrl}
        size="sm"
      />
    ),
  },
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

const userFormFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'username', label: 'Username', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'USER', label: 'USER' },
      { value: 'ADMIN', label: 'ADMIN' },
    ],
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

function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      setError('')

      const data = await adminFetch('/admin/users')
      setUsers(data.users)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateUser(id, form) {
    try {
      setActionLoading(true)
      setError('')

      const data = await adminFetch(`/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      setUsers((current) =>
        current.map((user) => (user.id === id ? data.user : user))
      )

      setEditingUser(null)
    } catch (error) {
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  async function deleteUser() {
    try {
      setActionLoading(true)
      setError('')

      await adminFetch(`/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
      })

      setUsers((current) =>
        current.filter((user) => user.id !== deletingUser.id)
      )

      setDeletingUser(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Loading users...
      </p>
    )
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
          {error}
        </p>
      )}
    <div className='pt-3'></div>
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {users.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No users found.
        </p>
      ) : (
        <AdminTable
          columns={userColumns}
          data={users}
          renderActions={(user) => (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(user)}
                disabled={actionLoading}
                className="font-medium text-[var(--primary-hover)] transition hover:underline disabled:opacity-50"
                >
                Edit
              </button>

              <button
                type="button"
                onClick={() => setDeletingUser(user)}
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

      {editingUser && (
        <FormDialog
          title="Edit User"
          description="Update the user's account information."
          fields={userFormFields}
          initialValues={{
            name: editingUser.name,
            username: editingUser.username,
            email: editingUser.email,
            role: editingUser.role,
          }}
          loading={actionLoading}
          submitLabel="Save Changes"
          onSubmit={(form) => updateUser(editingUser.id, form)}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete ${deletingUser.name}? This action cannot be undone.`}
          loading={actionLoading}
          onConfirm={deleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </>
  )
}

export default UsersTab