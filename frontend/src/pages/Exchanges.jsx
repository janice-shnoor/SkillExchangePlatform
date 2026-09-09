import { useEffect, useRef, useState } from 'react'
import ExchangeRequestCard from '../components/ExchangeRequestRow'
import Table from '../components/Table'
import DropdownMenu from '../components/DropdownMenu'
import ConfirmDialog from '../components/ConfirmDialog'
import RatingDialog from '../components/RatingDialog'

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
  const [openMenu, setOpenMenu] = useState(null)
  const menuButtonRef = useRef(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const [ratingExchange, setRatingExchange] = useState(null)

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

  async function handleExchangeAction() {
    if (!confirmAction) return

    try {
      setActionLoading(confirmAction.exchangeId)
      setError('')

      const response = await fetch(
        `${API_URL}/exchange/${confirmAction.exchangeId}/${confirmAction.action}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update exchange'
        )
      }

      setConfirmAction(null)
      await loadRequests()
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading('')
    }
  }

  async function handleRatingSubmit(rating) {
    if (!ratingExchange) return

    try {
      setActionLoading(ratingExchange.id)
      setError('')

      const response = await fetch(
        `${API_URL}/exchange/${ratingExchange.id}/review`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to submit rating'
        )
      }

      setRatingExchange(null)
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
    {
      key: 'rating',
      label: 'Rating',
      render: (exchange) => {
        if (exchange.status !== 'COMPLETED') {
          return '—'
        }

        if (!exchange.reviews?.length) {
          return 'Not rated'
        }

        return `${exchange.reviews[0].rating}/5`
      },
    },
    {
      key: 'actions',
      label: '',
      render: (exchange) => {
        const isRated =
          exchange.status === 'COMPLETED' &&
          exchange.reviews?.length > 0

        const isMenuDisabled =
          exchange.status === 'CANCELLED' || isRated

        return (
          <div>
            <button
              ref={
                openMenu === exchange.id
                  ? menuButtonRef
                  : null
              }
              type="button"
              disabled={isMenuDisabled}
              onClick={() =>
                setOpenMenu(
                  openMenu === exchange.id
                    ? null
                    : exchange.id
                )
              }
              className={`rounded-md px-2 py-1 text-lg ${
                isMenuDisabled
                  ? 'cursor-not-allowed text-[var(--text-muted)] opacity-40'
                  : 'text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)]'
              }`}
            >
              ⋮
            </button>

            {openMenu === exchange.id && (
              <DropdownMenu
                anchorRef={menuButtonRef}
                onClose={() => setOpenMenu(null)}
              >
                {exchange.status === 'ACTIVE' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null)
                        setConfirmAction({
                          exchangeId: exchange.id,
                          action: 'complete',
                        })
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--background)]"
                    >
                      Complete exchange
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null)
                        setConfirmAction({
                          exchangeId: exchange.id,
                          action: 'cancel',
                        })
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--background)]"
                    >
                      Cancel exchange
                    </button>
                  </>
                )}

                {exchange.status === 'COMPLETED' && !isRated && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null)
                      setRatingExchange(exchange)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--background)]"
                  >
                    Rate exchange
                  </button>
                )}
              </DropdownMenu>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-[var(--text)]">
        Manage Exchanges
      </h1>

      <div className="flex gap-6 border-b border-[var(--border)]">
        {[
          { key: 'current', label: 'Current Requests' },
          { key: 'archived', label: 'Archived Requests' },
          { key: 'exchanges', label: 'Exchanges' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium ${
              activeTab === tab.key
                ? 'border-b-2 border-[var(--primary)] text-[var(--text)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-[var(--text-muted)]">
          Loading requests...
        </p>
      )}

      {!loading && error && (
        <p className="rounded-lg border border-[var(--error)]/20 bg-[var(--error)]/10 px-3 py-2.5 text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      {!loading && !error && activeTab === 'current' && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">
              Received
            </h2>

            {pendingReceivedRequests.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
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

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">
              Sent
            </h2>

            {pendingSentRequests.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
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

      {!loading && !error && activeTab === 'archived' && (
        <section>
          {archivedRequests.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
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

      {!loading && !error && activeTab === 'exchanges' && (
        <section>
          {exchanges.length > 0 ? (
            <div className="overflow-visible rounded-xl border border-[var(--border)] bg-[var(--surface)]">
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
      {confirmAction && (
      <ConfirmDialog
        title={
          confirmAction.action === 'complete'
            ? 'Complete exchange'
            : 'Cancel exchange'
        }
        message={
          confirmAction.action === 'complete'
            ? 'Are you sure you want to complete this exchange?'
            : 'Are you sure you want to cancel this exchange?'
        }
        confirmText={
          confirmAction.action === 'complete'
            ? 'Complete'
            : 'Cancel'
        }
        loading={actionLoading === confirmAction.exchangeId}
        onConfirm={handleExchangeAction}
        confirmClassName={
          confirmAction.action === 'complete'
            ? 'bg-[var(--primary)]'
            : 'bg-[var(--error)]'
        }
        onCancel={() => setConfirmAction(null)}
      />
    )}
    {ratingExchange && (
    <RatingDialog
      user={
        ratingExchange.userAId === currentUser?.id
          ? ratingExchange.userB
          : ratingExchange.userA
      }
      skillOffered={
        ratingExchange.userAId === currentUser?.id
          ? ratingExchange.skillA.name
          : ratingExchange.skillB.name
      }
      skillWanted={
        ratingExchange.userAId === currentUser?.id
          ? ratingExchange.skillB.name
          : ratingExchange.skillA.name
      }
      loading={actionLoading === ratingExchange.id}
      error={error}
      onSubmit={handleRatingSubmit}
      onClose={() => setRatingExchange(null)}
    />
  )}
    </div>
  )
}

export default Exchanges