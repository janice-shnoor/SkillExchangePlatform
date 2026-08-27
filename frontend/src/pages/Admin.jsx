import { useState } from 'react'
import UsersTab from '../components/admin/UsersTab'
import SkillsTab from '../components/admin/SkillsTab'

function Admin() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Admin Controls
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Manage users and skills across the platform.
        </p>
      </div>

      <div className="flex gap-6 border-b border-[var(--border)]">
        {['users', 'skills'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-[var(--primary)] text-[var(--text)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {activeTab === 'users' ? <UsersTab /> : <SkillsTab />}
      </div>
    </div>
  )
}

export default Admin