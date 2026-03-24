export default function PageHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-brand-red)]">
            TT Xpress Service Intake
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Vehicle intake, service classification, and downloadable report generation
          </p>
        </div>

        <span className="badge badge-red">Fleet Service Workflow</span>
      </div>
    </header>
  )
}