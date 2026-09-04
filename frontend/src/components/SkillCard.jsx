import { useState } from 'react'
import FormDialog from './FormDialog'

const API_URL = import.meta.env.VITE_API_URL

function SkillCard({ user }) {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [myOfferedSkills, setMyOfferedSkills] = useState([])
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestError, setRequestError] = useState('')

  const offeredSkills = user.userSkills.filter(
    (item) => item.type === 'OFFERED'
  )

  const wantedSkills = user.userSkills.filter(
    (item) => item.type === 'WANTED'
  )

  async function handleRequestClick() {
    setShowRequestForm(true)
    setRequestError('')

    try {
      setLoadingSkills(true)

      const response = await fetch(
        `${API_URL}/profile/skills/offered`,
        {
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load your offered skills'
        )
      }

      setMyOfferedSkills(data.skills)
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setLoadingSkills(false)
    }
  }

  async function handleRequestSubmit(form) {
    setRequestLoading(true)
    setRequestError('')

    try {
      const response = await fetch(`${API_URL}/exchange-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: user.id,
          senderSkillId: form.senderSkillId,
          receiverSkillId: form.receiverSkillId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send request')
      }

      setShowRequestForm(false)
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setRequestLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--primary)] hover:ring-1 hover:ring-[var(--primary)]">

      {/* User Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[var(--text)]">
            {user.name}
          </h3>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            @{user.username}
          </p>
        </div>

        <p className="shrink-0 text-[11px] text-[var(--text-muted)]">
          ★{' '}
          {user.averageRating !== null &&
          user.averageRating !== undefined
            ? `${user.averageRating.toFixed(1)} (${user.totalRatings})`
            : 'No Ratings Yet'}
        </p>
      </div>

      {/* Skills */}
      <div className="mt-5 grid grid-cols-2 gap-4">

        {/* Offers */}
        <div className="rounded-lg bg-[var(--primary-subtle)]/50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary-hover)]">
            Offers
          </p>

          <div className="mt-2.5 space-y-2.5">
            {offeredSkills.length > 0 ? (
              offeredSkills.map((item) => (
                <div key={item.id}>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {item.skill.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                    {item.proficiency.charAt(0) +
                      item.proficiency.slice(1).toLowerCase()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                None listed
              </p>
            )}
          </div>
        </div>

        {/* Wants */}
        <div className="rounded-lg bg-[var(--background)]/50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Wants
          </p>

          <div className="mt-2.5 space-y-2.5">
            {wantedSkills.length > 0 ? (
              wantedSkills.map((item) => (
                <div key={item.id}>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {item.skill.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                    {item.proficiency.charAt(0) +
                      item.proficiency.slice(1).toLowerCase()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                None listed
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <div>
          {user.count !== undefined && (
            <p className="text-xs font-medium text-[var(--primary-hover)]">
              *{user.count} complementary{' '}
              {user.count === 1 ? 'skill' : 'skills'}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleRequestClick}
          className="rounded-lg border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--text)] transition-colors duration-200 hover:border-[var(--primary-hover)] hover:bg-[var(--primary-hover)] hover:text-[var(--text-on-dark)]"
        >
          Request
        </button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <FormDialog
          title="Request Exchange"
          description="Choose what you'll teach and what you'd like to learn."
          initialValues={{
            receiverUsername: user.username,
            senderSkillId: '',
            receiverSkillId: '',
          }}
          loading={requestLoading || loadingSkills}
          error={requestError}
          submitLabel="Send Request"
          onSubmit={handleRequestSubmit}
          onClose={() => {
            if (!requestLoading) {
              setShowRequestForm(false)
              setRequestError('')
            }
          }}
          fields={[
            {
              name: 'receiverUsername',
              label: 'Recipient',
              type: 'text',
              readOnly: true,
            },
            {
              name: 'senderSkillId',
              label: "I'll teach",
              type: 'select',
              required: true,
              options: [
                { value: '', label: 'Select a skill' },
                ...myOfferedSkills.map((item) => ({
                  value: item.id,
                  label: `${item.skill.name} — ${item.proficiency}`,
                })),
              ],
            },
            {
              name: 'receiverSkillId',
              label: "I'd like to learn",
              type: 'select',
              required: true,
              options: [
                { value: '', label: 'Select a skill' },
                ...offeredSkills.map((item) => ({
                  value: item.id,
                  label: `${item.skill.name} — ${item.proficiency}`,
                })),
              ],
            },
          ]}
        />
      )}
    </div>
  )
}

export default SkillCard