function SkillCard({ user }) {
  const offeredSkills = user.userSkills.filter(
    (item) => item.type === 'OFFERED'
  )

  const wantedSkills = user.userSkills.filter(
    (item) => item.type === 'WANTED'
  )

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

        {/* Rating Placeholder */}
        <p className="shrink-0 text-[11px] text-[var(--text-muted)]">
          ★ No Ratings Yet
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
        <div className="rounded-lg bg-slate-50 p-3">
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
          {user.noSkills !== undefined && (
            <p className="text-xs font-medium text-[var(--primary-hover)]">
              {user.noSkills} complementary{' '}
              {user.noSkills === 1 ? 'skill' : 'skills'}
            </p>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--text)] transition-colors duration-200 hover:border-[var(--primary-hover)] hover:bg-[var(--primary-hover)] hover:text-[var(--text-on-dark)]"
        >
          Request
        </button>
      </div>
    </div>
  )
}

export default SkillCard