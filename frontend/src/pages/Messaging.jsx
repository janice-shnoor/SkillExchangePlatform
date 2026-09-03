import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  MessageCircle,
  ArrowLeftRight,
  User,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

function Messaging() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)
  const [exchanges, setExchanges] = useState([])
  const [selectedExchange, setSelectedExchange] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExchangeOpen, setMobileExchangeOpen] = useState(false)

  const navigation = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/discover', label: 'Discover', icon: Search },
    { to: '/messaging', label: 'Messages', icon: MessageCircle },
    { to: '/exchanges', label: 'Exchanges', icon: ArrowLeftRight },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  async function fetchData(path, options = {}) {
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

  function getExchangeInfo(exchange) {
    const isUserA = exchange.userAId === currentUser?.id

    return {
      user: isUserA ? exchange.userB : exchange.userA,
      skills: isUserA
        ? `${exchange.skillA.name} ↔ ${exchange.skillB.name}`
        : `${exchange.skillB.name} ↔ ${exchange.skillA.name}`,
    }
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')

        const [profile, exchangeData] = await Promise.all([
          fetchData('/profile'),
          fetchData('/exchange'),
        ])
        setCurrentUser(profile.user)

        const activeExchanges = exchangeData.exchanges.filter(
          (exchange) => exchange.status === 'ACTIVE'
        )

        setExchanges(activeExchanges)

        const selected = activeExchanges.find(
          (exchange) => exchange.id === id
        )

        setSelectedExchange(selected || null)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  useEffect(() => {
    if (!selectedExchange) return

    async function loadMessages() {
      try {
        setLoadingMessages(true)
        setError('')

        const data = await fetchData(
          `/message/${selectedExchange.id}/messages`
        )

        setMessages(data.messages)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [selectedExchange])

  async function handleSendMessage() {
    const content = messageInput.trim()

    if (!content || !selectedExchange) return

    try {
      const data = await fetchData(
        `/message/${selectedExchange.id}/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      )

      setMessages((current) => [...current, data.data])
      setMessageInput('')
    } catch (error) {
      setError(error.message)
    }
  }

  function selectExchange(exchange) {
    setSelectedExchange(exchange)
    setMessages([])
    setError('')
    setMobileExchangeOpen(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--text-muted)]">
        Loading messages...
      </div>
    )
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[var(--background)]">

      {/* Desktop Navigation */}
      <aside className="hidden w-14 shrink-0 flex-col items-center bg-[var(--dark)] py-4 md:flex">
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={({ isActive }) =>
                  `flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'text-[var(--text-on-dark)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                  }`
                }
              >
                <Icon size={18} />
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/20"
          />

          <aside className="relative flex h-full w-56 flex-col bg-[var(--dark)]">
            <div className="flex justify-end px-4 py-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-on-dark)] transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-1 px-3 py-2">
              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'text-[var(--text-on-dark)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Exchange List */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-[var(--border)] px-4">
          <h1 className="text-sm font-semibold text-[var(--text)]">
            Messages
          </h1>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {exchanges.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[var(--text-muted)]">
              No active exchanges.
            </div>
          ) : (
            exchanges.map((exchange) => {
              const { user, skills } = getExchangeInfo(exchange)
              const selected = selectedExchange?.id === exchange.id

              return (
                <button
                  key={exchange.id}
                  type="button"
                  onClick={() => selectExchange(exchange)}
                  className={`w-full border-b border-[var(--border)] px-4 py-3 text-left transition ${
                    selected
                      ? 'bg-[var(--primary-subtle)]'
                      : 'hover:bg-[var(--background)]'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        selected
                          ? 'bg-[var(--primary)]/10 text-[var(--primary-hover)]'
                          : 'bg-[var(--primary-subtle)] text-[var(--primary-hover)]'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text)]">
                        {user.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                        {skills}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="absolute left-0 right-0 top-0 z-30 flex h-14 items-center justify-between bg-[var(--dark)] px-4 md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-on-dark)] transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
        >
          <Menu size={19} />
        </button>

        <h1 className="text-sm font-semibold text-[var(--text-on-dark)]">
          Messages
        </h1>

        <button
          type="button"
          onClick={() =>
            setMobileExchangeOpen((current) => !current)
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-on-dark)] transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
        >
          {mobileExchangeOpen ? (
            <ChevronUp size={19} />
          ) : (
            <ChevronDown size={19} />
          )}
        </button>
      </div>

      {/* Mobile Exchange Dropdown */}
      {mobileExchangeOpen && (
        <div className="absolute left-0 right-0 top-14 z-20 max-h-[60vh] overflow-y-auto border-b border-[var(--border)] bg-[var(--surface)] md:hidden">
          {exchanges.length === 0 ? (
            <div className="px-4 py-5 text-sm text-[var(--text-muted)]">
              No active exchanges.
            </div>
          ) : (
            exchanges.map((exchange) => {
              const { user, skills } = getExchangeInfo(exchange)
              const selected = selectedExchange?.id === exchange.id

              return (
                <button
                  key={exchange.id}
                  type="button"
                  onClick={() => selectExchange(exchange)}
                  className={`w-full border-b border-[var(--border)] px-4 py-3.5 text-left last:border-b-0 ${
                    selected
                      ? 'bg-[var(--primary-subtle)]'
                      : 'hover:bg-[var(--background)]'
                  }`}
                >
                  <p className="truncate text-sm font-medium text-[var(--text)]">
                    {user.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                    {skills}
                  </p>
                </button>
              )
            })
          )}
        </div>
      )}

      {/* One Conversation */}
      <main className="min-w-0 flex-1 flex flex-col pt-14 md:pt-0">

        {!selectedExchange ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare
                size={28}
                className="mx-auto text-[var(--text-muted)]"
                strokeWidth={1.5}
              />

              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Select an exchange to start messaging.
              </p>
            </div>
          </div>
        ) : (
          <>
            <header className="flex h-14 shrink-0 items-center border-b border-[var(--border)] bg-[var(--surface)] px-4 md:px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">
                  {getExchangeInfo(selectedExchange).user.name}
                </p>

                <p className="truncate text-xs text-[var(--text-muted)]">
                  {getExchangeInfo(selectedExchange).skills}
                </p>
              </div>
            </header>

            {error && (
              <p className="border-b border-[var(--border)] bg-red-50 px-5 py-2 text-sm text-[var(--error)]">
                {error}
              </p>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-5 md:py-6">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                  No messages yet.
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                  {messages.map((message) => {
                    const isMine =
                      message.senderId === currentUser?.id

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isMine
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:max-w-[75%] ${
                            isMine
                              ? 'bg-[var(--primary-subtle)] text-[var(--text)]'
                              : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Cleaner Composer */}
            <div className="shrink-0 bg-[var(--background)] px-3 py-3 md:px-5 md:py-4">
              <div className="mx-auto flex w-full max-w-4xl items-end gap-2 md:gap-3">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  rows={1}
                  placeholder="Write a message..."
                  className="min-h-10 flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
                />

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="shrink-0 rounded-lg px-3.5 py-2.5 text-sm font-medium text-[var(--primary-hover)] transition hover:bg-[var(--primary-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Messaging