import { useEffect, useState } from 'react'
import ExchangeRequestCard from '../components/ExchangeRequestRow'
import Table from '../components/Table'


const API_URL = import.meta.env.VITE_API_URL

function Exchanges() {
  const [activeTab, setActiveTab] = useState('current')
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState('')
  const [exchanges, setExchanges] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  async function fetchCurrentUser() {
    const response = await fetch(`${API_URL}/profile`, {
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load profile')
    }

    return data.user
  }

  async function fetchRequests(path) {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load requests')
    }

    return data.requests
  }

  async function loadRequests() {
    try {
      setLoading(true)
      setError('')

      const [sent, received, exchangeData, user] = await Promise.all([
        fetchRequests('/exchange-requests/sent'),
        fetchRequests('/exchange-requests/received'),
        fetchExchanges(),
        fetchCurrentUser(),
      ])

      setSentRequests(sent)
      setReceivedRequests(received)
      setExchanges(exchangeData)
      setCurrentUser(user)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function fetchExchanges() {
    const response = await fetch(`${API_URL}/exchange`, {
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load exchanges')
    }

    return data.exchanges
  }

  async function handleAction(requestId, action) {
    try {
      setActionLoading(requestId)
      setError('')

      const response = await fetch(
        `${API_URL}/exchange-requests/${requestId}/${action}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} request`)
      }

      await loadRequests()
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading('')
    }
  }

  const pendingSentRequests = sentRequests.filter(
    (request) => request.status === 'PENDING'
  )

  const pendingReceivedRequests = receivedRequests.filter(
    (request) => request.status === 'PENDING'
  )

  const archivedRequests = [
    ...sentRequests.map((request) => ({
      ...request,
      direction: 'To',
      username: request.receiverUsername,
    })),
    ...receivedRequests.map((request) => ({
      ...request,
      direction: 'From',
      username: request.senderUsername,
    })),
  ]
    .filter((request) => request.status !== 'PENDING')
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )

  function formatProficiency(value) {
    return value.charAt(0) + value.slice(1).toLowerCase()
  }

  const archivedColumns = [
    {
      key: 'direction',
      label: 'Direction',
    },
    {
      key: 'username',
      label: 'User',
      render: (request) => `@${request.username}`,
    },
    {
      key: 'senderSkillName',
      label: 'Offers',
      render: (request) =>
        `${request.senderSkillName} · ${formatProficiency(
          request.senderProficiency
        )}`,
    },
    {
      key: 'receiverSkillName',
      label: 'Wants to Learn',
      render: (request) =>
        `${request.receiverSkillName} · ${formatProficiency(
          request.receiverProficiency
        )}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (request) => {
        const statusStyles = {
          ACCEPTED:
            'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
          REJECTED:
            'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20',
          CANCELLED:
            'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
        }

        return (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              statusStyles[request.status]
            }`}
          >
            {request.status}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (request) =>
        new Date(request.createdAt).toLocaleDateString(),
    },
  ]

  const exchangeColumns = [
    {
      key: 'user',
      label: 'User',
      render: (exchange) => {
        const otherUser =
          exchange.userAId === currentUser?.id
            ? exchange.userB
            : exchange.userA

        return `@${otherUser.username}`
      },
    },
    {
      key: 'skillA',
      label: 'Skill A',
      render: (exchange) => {
        const isUserA = exchange.userAId === currentUser?.id

        return isUserA
          ? exchange.skillA.name
          : exchange.skillB.name
      },
    },
    {
      key: 'skillB',
      label: 'Skill B',
      render: (exchange) => {
        const isUserA = exchange.userAId === currentUser?.id

        return isUserA
          ? exchange.skillB.name
          : exchange.skillA.name
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
    {
      key: 'createdAt',
      label: 'Created At',
      render: (exchange) =>
        new Date(exchange.createdAt).toLocaleDateString(),
    },
    {
      key: 'completedAt',
      label: 'Closed At',
      render: (exchange) =>
        exchange.completedAt
          ? new Date(exchange.completedAt).toLocaleDateString()
          : '—',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Manage Exchanges
        </h1>

        {/*<p className="mt-2 text-[var(--text-muted)]">
          Manage your exchange requests.
        </p>*/}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[var(--border)]">
        {[
            { key: 'current', label: 'Current Requests' },
            { key: 'archived', label: 'Archived Requests' },
            { key: 'exchanges', label: 'Exchanges' },
          ].map((tab)=> (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium capitalize ${
              activeTab === tab.key
                ? 'border-b-2 border-[var(--primary)] text-[var(--text)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-[var(--text-muted)]">
          Loading requests...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      {/* Current */}
      {!loading && !error && activeTab === 'current' && (
        <div className="space-y-10">
          
          {/* Received */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Received
              </h2>
              {/*<p className="mt-1 text-sm text-[var(--text-muted)]">
                Pending requests waiting for your response.
              </p>*/}
            </div>

            {pendingReceivedRequests.length > 0 ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {pendingReceivedRequests.map((request) => (
                  <ExchangeRequestCard
                    key={request.id}
                    request={request}
                    type="received"
                    onAccept={(id) => handleAction(id, 'accept')}
                    onReject={(id) => handleAction(id, 'reject')}
                    loading={actionLoading === request.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No pending received requests.
              </p>
            )}
          </section>

          {/* Sent */}
          <section className="border-t border-[var(--border)] pt-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Sent
              </h2>
              {/*<p className="mt-1 text-sm text-[var(--text-muted)]">
                Pending requests you have sent.
              </p>*/}
            </div>

            {pendingSentRequests.length > 0 ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {pendingSentRequests.map((request) => (
                  <ExchangeRequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                    onCancel={(id) => handleAction(id, 'cancel')}
                    loading={actionLoading === request.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No pending sent requests.
              </p>
            )}
          </section>
        </div>
      )}

      {/* Archived */}
      {!loading && !error && activeTab === 'archived' && (
        <section>
          {archivedRequests.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <Table
                columns={archivedColumns}
                data={archivedRequests}
              />
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              No archived requests.
            </p>
          )}
        </section>
      )}

      {/* Exchanges */}
      {!loading && !error && activeTab === 'exchanges' && (
        <section>
          {exchanges.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <Table
                columns={exchangeColumns}
                data={exchanges}
              />
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              No exchanges yet.
            </p>
          )}
        </section>
      )}
    </div>
  )
}

export default Exchanges
