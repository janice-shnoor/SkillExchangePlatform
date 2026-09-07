function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] lg:ml-56">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium text-[var(--text)]">
          SkillExchange
        </p>

        <p>
          Learn, teach, and exchange knowledge.
        </p>

        <p>
          © {new Date().getFullYear()} SkillExchange
        </p>
      </div>
    </footer>
  )
}

export default Footer