import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:ml-56 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout