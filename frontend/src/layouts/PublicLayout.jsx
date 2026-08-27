import { Outlet } from 'react-router-dom'
import SimpleNavbar from '../components/SimpleNavbar'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SimpleNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout