import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

async function fetchData(path) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function Dashboard() {
  const [user, setUser] = useState(null)
  const [offered, setOffered] = useState([])
  const [wanted, setWanted] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetchData('/profile'),
      fetchData('/profile/skills/offered'),
      fetchData('/profile/skills/wanted'),
    ])
      .then(([profile, offeredData, wantedData]) => {
        setUser(profile.user)
        setOffered(offeredData.skills)
        setWanted(wantedData.skills)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Loading dashboard...
      </p>
    )
  }

  if (error || !user) {
    return (
      <p className="text-sm text-[var(--error)]">
        {error || 'Unable to load dashboard.'}
      </p>
    )
  }

  const SkillList = ({ skills }) => (
    skills.length ? (
      <div className="mt-5 space-y-2">
        {skills.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3"
          >
            <span className="text-sm font-medium text-[var(--text)]">
              {item.skill.name}
            </span>

            <span className="text-xs text-[var(--text-muted)]">
              {item.proficiency?.charAt(0) +
                item.proficiency?.slice(1).toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-5 rounded-lg bg-[var(--background)] px-4 py-5 text-center text-sm text-[var(--text-muted)]">
        No skills added yet.
      </p>
    )
  )

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Dashboard
        </h1>

        <p className="mt-2 text-[var(--text-muted)]">
          Welcome back, {user.name}.
        </p>
      </div>

      {/* Account summary */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-subtle)] text-xl font-semibold text-[var(--primary-hover)]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {user.name}
              </h2>

              <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-[var(--border)] pt-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Email
              </p>
              <p className="mt-1.5 text-sm text-[var(--text)]">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Role
              </p>
              <span className="mt-1.5 inline-flex rounded-full bg-[var(--primary-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--primary-hover)]">
                {user.role}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Skills
              </p>
              <p className="mt-1.5 text-sm text-[var(--text)]">
                {offered.length + wanted.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills summary */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Offered Skills
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Skills you can teach.
              </p>
            </div>

            <span className="text-2xl font-semibold text-[var(--text)]">
              {offered.length}
            </span>
          </div>

          <SkillList skills={offered} />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Wanted Skills
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Skills you want to learn.
              </p>
            </div>

            <span className="text-2xl font-semibold text-[var(--text)]">
              {wanted.length}
            </span>
          </div>

          <SkillList skills={wanted} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard