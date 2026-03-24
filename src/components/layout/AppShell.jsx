import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-[var(--color-brand-red)] text-white'
      : 'text-[var(--color-brand-dark)] hover:bg-red-50'
  }`

export default function AppShell({ children }) {
  return (
    <div className="app-shell min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-brand-red)]">
              TT Xpress Workshop Portal
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Intake forms, inspection reports, downloadable service documentation
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" className={navLinkClass}>
              Intake Form
            </NavLink>
            <NavLink to="/reports" className={navLinkClass}>
              Inspection Reports
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="mt-8 bg-[var(--color-brand-dark)]">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-white/80 sm:px-6 lg:px-8">
          TT Xpress Service Workflow Demo
        </div>
      </footer>
    </div>
  )
}