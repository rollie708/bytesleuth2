export default function DocsPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Documentation
        </h1>

        <div className="space-y-6">
          <div className="rounded-xl p-6 bg-muted/50 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">Getting Started</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Install dependencies:</strong> <code>npm install</code>
              </li>
              <li>
                <strong>Configure environment:</strong> Copy <code>.env.example</code> to <code>.env</code> and set required variables
              </li>
              <li>
                <strong>Set up database:</strong> <code>npm run db:generate && npm run db:push</code>
              </li>
              <li>
                <strong>Start development server:</strong> <code>npm run dev</code>
              </li>
            </ol>
          </div>

          <div className="rounded-xl p-6 bg-muted/50 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">Analysis Workflow</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Enter contract address</strong> on the analyze page
              </li>
              <li>
                <strong>Validate</strong> the contract bytecode against Base mainnet
              </li>
              <li>
                <strong>Analyze</strong> bytecode for functions, proxies, and permissions
              </li>
              <li>
                <strong>Review</strong> the comprehensive report with AI explanations
              </li>
            </ol>
          </div>

          <div className="rounded-xl p-6 bg-muted/50 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">Test Contract</h2>
            <p className="text-muted-foreground mb-4">
              Test ByteSleuth with USDC on Base mainnet: <a href="https://basescan.org/address/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/90">0x833589fcd6edb6e08f4c7c32d4f71b54bda02913</a>
            </p>
            <p className="text-sm text-muted-foreground">
              This is a verified ERC-20 token contract suitable for testing bytecode analysis, proxy detection, and permission analysis.
            </p>
          </div>

          <div className="rounded-xl p-6 bg-muted/50">
            <h2 className="text-xl font-bold text-primary mb-4">API Reference</h2>
            <p className="text-sm text-muted-foreground">
              Key API endpoints for integration:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><code>POST /api/v1/contracts/validate</code> - Validate contract address and retrieve bytecode</li>
              <li><code>POST /api/v1/analyses</code> - Create a new analysis job</li>
              <li><code>GET /api/v1/analyses/:id</code> - Get analysis status</li>
              <li><code>GET /api/v1/analyses/:id/report</code> - Get full analysis report</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}