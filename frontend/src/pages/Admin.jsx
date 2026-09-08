import { useState } from 'react'
import UsersTab from '../components/admin/UsersTab'
import SkillsTab from '../components/admin/SkillsTab'
import OverviewTab from '../components/admin/OverviewTab'

function Admin() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Admin Panel
        </h1>
      </div>

      <div>
        <div className="flex gap-6 border-b border-[var(--border)]">
          {['overview', 'users', 'skills'].map((tab) => (
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
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'skills' && <SkillsTab />}
      </div>
    </div>
  )
}

export default Admin