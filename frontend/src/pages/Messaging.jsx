import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

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
        const [profile, exchangeData] = await Promise.all([
          fetchData('/profile'),
          fetchData('/exchange'),
        ])

        setCurrentUser(profile.user)
        setExchanges(exchangeData.exchanges)

        const selected = exchangeData.exchanges.find(
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

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Loading messages...
      </p>
    )
  }

  return (
    <div className="w-full">
      <nav className="bg-[var(--dark)] px-6 py-4">
        <div className="mx-auto flex w-full items-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-on-dark)] transition hover:text-[var(--primary)]"
          >
            <ArrowLeft size={20} strokeWidth={3.5} />
          </button>
          <span
            className="ml-auto text-xl font-bold"
            style={{ color: 'var(--primary)' }}
          >
            SkillExchange
          </span>
        </div>
      </nav>
      {error && (
        <p className="text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      <div className="grid min-h-[600px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] md:grid-cols-[280px_1fr]">

        {/* Exchanges */}
        <aside className="bg-[var(--primary-subtle)] md:border-r border-[var(--border)]">
          {exchanges.map((exchange) => {
            const { user, skills } = getExchangeInfo(exchange)
            const selected = selectedExchange?.id === exchange.id

            return (
              <button
                key={exchange.id}
                type="button"
                onClick={() => setSelectedExchange(exchange)}
                className={`w-full px-5 py-4 text-left transition ${
                  selected
                    ? 'bg-[var(--primary)]'
                    : 'hover:bg-[var(--primary-hover)]'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    selected
                      ? 'text-white'
                      : 'text-[var(--text)]'
                  }`}
                >
                  {user.name}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    selected
                      ? 'text-white/70'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {skills}
                </p>
              </button>
            )
          })}
        </aside>

        {/* Conversation */}
        <section className="flex min-w-0 flex-col bg-[var(--background)]">
          {!selectedExchange ? (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]">
              Select an exchange to start messaging.
            </div>
          ) : (
            <>
              <header className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
                <p className="text-sm font-semibold text-[var(--text)]">
                  {getExchangeInfo(selectedExchange).user.name}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {getExchangeInfo(selectedExchange).skills}
                </p>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {loadingMessages ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((message) => {
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
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isMine
                              ? 'border border-[var(--border)] bg-[var(--primary-subtle)] text-[var(--text)]'
                              : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="p-4">
                <div className="flex gap-3">
                  <input
                    value={messageInput}
                    onChange={(e) =>
                      setMessageInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Write a message..."
                    className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                  />

                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Messaging