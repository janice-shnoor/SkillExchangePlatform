function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-[var(--dark)]">
          404
        </h1>

        <p className="mt-4 text-lg font-medium text-[var(--text)]">
          NotFound
        </p>

        <p className="mt-2 text-sm text-[var(--text-muted)]">
          The Page your looking for is not there
        </p>
      </div>
    </div>
  )
}

export default NotFound