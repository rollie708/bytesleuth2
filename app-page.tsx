export default function HomePage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16l-4-4 4-4m0 0l4 4-4 4m0-8l4 4-4 4" />
            </svg>
            <span className="text-3xl font-bold text-primary">ByteSleuth</span>
          </div>
          <p className="text-muted-foreground text-lg mt-4">
            AI-Powered Web3 Reverse Engineering Agent
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <a href="/analyze" className="btn-primary">
              Analyze Contract
            </a>
            <a href="/docs" className="btn-secondary">
              Docs
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}