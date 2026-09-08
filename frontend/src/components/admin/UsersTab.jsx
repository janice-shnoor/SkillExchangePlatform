import { useEffect, useState } from 'react'
import AdminTable from '../Table'
import ConfirmDialog from '../ConfirmDialog'
import FormDialog from '../FormDialog'
import Avatar from '../Avatar'

import {
  Search,
  X,
  ChevronDown,
} from 'lucide-react'

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
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

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

  const filteredUsers = users.filter((user) => {
    const searchValue = search.trim().toLowerCase()

    const matchesSearch =
      !searchValue ||
      user.name.toLowerCase().includes(searchValue) ||
      user.username.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)

    const matchesRole =
      roleFilter === 'ALL' ||
      user.role === roleFilter

    return matchesSearch && matchesRole
  })

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
    <div className="flex items-center gap-3 pb-4 pt-3">
      {/* Search */}
      <div className="relative flex-1">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] pl-3 pr-20 text-sm text-[var(--text)] outline-none transition-colors duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-9 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)]"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        )}

        <button
          type="button"
          onClick={() => setSearch(search.trim())}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
        >
          <Search
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Role Filter */}
      <div className="relative w-32 shrink-0">
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--surface)] pl-3 pr-8 text-sm text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
        >
          <option value="ALL">All</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
      </div>
    </div>
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {filteredUsers.length === 0 ? (
        <p className="px-6 py-6 text-sm text-[var(--text-muted)]">
          {users.length === 0
            ? 'No users found.'
            : 'No users match your search.'}
        </p>
      ) : (
        <AdminTable
          columns={userColumns}
          data={filteredUsers}
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