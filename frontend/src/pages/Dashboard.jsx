import { useEffect, useState } from 'react'
import ExchangeRequestRow from '../components/ExchangeRequestRow'
import Table from '../components/Table'

import {
  Layers3,
  ArrowLeftRight,
  Repeat2,
} from 'lucide-react'

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
  const [exchanges, setExchanges] = useState([])

  const recentExchangeColumns = [
    {
      key: 'user',
      label: 'User',
      render: (exchange) => {
        const otherUser =
          exchange.userAId === user?.id
            ? exchange.userB
            : exchange.userA

        return `@${otherUser.username}`
      },
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (exchange) => {
        const isUserA = exchange.userAId === user?.id

        return isUserA
          ? `${exchange.skillA.name} ↔ ${exchange.skillB.name}`
          : `${exchange.skillB.name} ↔ ${exchange.skillA.name}`
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (exchange) => {
        const statusStyles = {
          ACTIVE:
            'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
          COMPLETED:
            'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
          CANCELLED:
            'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
        }

        return (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              statusStyles[exchange.status]
            }`}
          >
            {exchange.status}
          </span>
        )
      },
    },
  ]

  useEffect(() => {
    Promise.all([
      fetchData('/profile'),
      fetchData('/profile/skills/offered'),
      fetchData('/profile/skills/wanted'),
      fetchData('/exchange-requests/sent'),
      fetchData('/exchange-requests/received'),
      fetchData('/exchange')
    ])
      .then(
        ([
          profile,
          offeredData,
          wantedData,
          sentData,
          receivedData,
          exchangeData,
        ]) => {
          setUser(profile.user)
          setOffered(offeredData.skills)
          setWanted(wantedData.skills)
          setSentRequests(sentData.requests)
          setReceivedRequests(receivedData.requests)
          setExchanges(exchangeData.exchanges)
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
  const recentExchanges = exchanges.slice(0, 5)

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
        <p className="text-sm text-[var(--text-muted)]">
          Welcome back,
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--text)]">
          {user.name}
        </h1>
      </div>

      {/* Stats */}
      <section>
        <div className="grid gap-4 sm:grid-cols-3">

          {/* Skills */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--primary)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-subtle)] text-[var(--primary-hover)]">
                <Layers3 size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Skills
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                  {offered.length + wanted.length}
                </p>
              </div>
            </div>
          </div>

          {/* Requests */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--primary)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-subtle)] text-[var(--primary-hover)]">
                <ArrowLeftRight size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Requests
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                  {sentRequests.length + receivedRequests.length}
                </p>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--primary)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-subtle)] text-[var(--primary-hover)]">
                <Repeat2 size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Exchanges
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--text)]">
                  {exchanges.length}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dashboard Overview */}
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[3fr_2fr]">        
        {/* Recent Requests */}
        <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">          <div className="p-6 pb-4 sm:p-8 sm:pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">
              Recent Requests
            </h2>
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

        {/* Recent Exchanges */}
        <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">          
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">
              Exchanges
            </h2>
          </div>

          <div className="mt-6 w-full min-w-0 overflow-x-auto rounded-xl border border-[var(--border)]">            {recentExchanges.length > 0 ? (
              <Table
                columns={recentExchangeColumns}
                data={recentExchanges}
              />
            ) : (
              <p className="p-5 text-sm text-[var(--text-muted)]">
                No exchanges yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard