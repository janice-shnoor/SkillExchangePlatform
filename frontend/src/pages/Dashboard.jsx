import { useEffect, useState } from 'react'
import ExchangeRequestRow from '../components/ExchangeRequestRow'

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
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetchData('/profile'),
      fetchData('/profile/skills/offered'),
      fetchData('/profile/skills/wanted'),
      fetchData('/exchange-requests/sent'),
      fetchData('/exchange-requests/received'),
    ])
      .then(
        ([
          profile,
          offeredData,
          wantedData,
          sentData,
          receivedData,
        ]) => {
          setUser(profile.user)
          setOffered(offeredData.skills)
          setWanted(wantedData.skills)
          setSentRequests(sentData.requests)
          setReceivedRequests(receivedData.requests)
        }
      )
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

  const recentSentRequests = sentRequests.slice(0, 3)
  const recentReceivedRequests = receivedRequests.slice(0, 3)

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Dashboard
        </h1>

        <p className="mt-2 text-[var(--text-muted)]">
          Welcome back, {user.name}.
        </p>
      </div>

      {/* Profile */}
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

      {/* Dashboard Overview */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Recent Requests */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="p-6 pb-4 sm:p-8 sm:pb-5">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Recent Requests
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Your latest exchange activity.
            </p>
          </div>

          {/* Sent */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Sent
            </p>

            {recentSentRequests.length > 0 ? (
              <div className="rounded-xl border border-[var(--border)]">
                {recentSentRequests.map((request) => (
                  <ExchangeRequestRow
                    key={request.id}
                    request={request}
                    type="sent"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No sent requests yet.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border)]" />

          {/* Received */}
          <div className="p-6 pt-6 sm:p-8 sm:pt-7">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Received
            </p>

            {recentReceivedRequests.length > 0 ? (
              <div className="rounded-xl border border-[var(--border)]">
                {recentReceivedRequests.map((request) => (
                  <ExchangeRequestRow
                    key={request.id}
                    request={request}
                    type="received"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No received requests yet.
              </p>
            )}
          </div>
        </section>

        {/* Current Skills */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Current Skills
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              What you can offer and what you want to learn.
            </p>
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--primary-hover)]">
              Offers
            </p>

            <SkillList skills={offered} />
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-7">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Wants to Learn
            </p>

            <SkillList skills={wanted} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard