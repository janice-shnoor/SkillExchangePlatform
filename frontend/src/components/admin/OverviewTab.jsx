import { useEffect, useState } from 'react'
import {
  UsersRound,
  UserRoundCheck,
  Layers3,
  Repeat2,
  TrendingUp,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

async function adminFetch(path) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function OverviewTab() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOverview()
  }, [])

  async function loadOverview() {
    try {
      setLoading(true)
      setError('')

      const data = await adminFetch('/admin/overview')
      setOverview(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Loading overview...
      </p>
    )
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--error)]">
        {error}
      </p>
    )
  }

  const stats = [
    {
      label: 'Total Users',
      value: overview.stats.totalUsers,
      icon: UsersRound,
    },
    {
      label: 'Active Users',
      value: overview.stats.activeUsers,
      icon: UserRoundCheck,
    },
    {
      label: 'Skills',
      value: overview.stats.skills,
      icon: Layers3,
    },
    {
      label: 'Exchanges',
      value: overview.stats.exchanges,
      icon: Repeat2,
    },
  ]

  const maxUsage = Math.max(
    ...overview.popularSkills.map((skill) => skill.usageCount),
    1
  )

  return (
    <div className="space-y-4 pt-3">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--primary)]"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="text-[var(--primary-hover)]"
                />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Popular Skills */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp
            size={18}
            strokeWidth={1.8}
            className="text-[var(--primary-hover)]"
          />

          <h2 className="text-lg font-semibold text-[var(--text)]">
            Popular Skills
          </h2>
        </div>

        {overview.popularSkills.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              No skill usage data available.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            {overview.popularSkills.map((skill, index) => {
              const percentage =
                (skill.usageCount / maxUsage) * 100

              return (
                <div
                  key={skill.id}
                  className={`px-5 py-4 ${
                    index !== overview.popularSkills.length - 1
                      ? 'border-b border-[var(--border)]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-subtle)] text-xs font-semibold text-[var(--primary-hover)]">
                        {index + 1}
                      </span>

                      <span className="truncate text-sm font-medium text-[var(--text)]">
                        {skill.name}
                      </span>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-[var(--text-secondary)]">
                      {skill.usageCount}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)] transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewTab