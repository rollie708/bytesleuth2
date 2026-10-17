export default function AnalyzePage() {
  const router = useRouter()
  const params = router.query
  const address = params.address as string
  const chainId = Number(params.chainId)

  if (!address) {
    return <div>No contract address provided</div>
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Contract Analysis: {formatAddress(address)}
        </h1>

        <p className="text-muted-foreground mb-6">
          Chain: {chainId === 8453 ? 'Base Mainnet' : `Chain ${chainId}`}
        </p>

        {/* Analysis status */}
        <div className="bg-black/50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{'Pending'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="font-medium">{'Initializing'}</p>
            </div>
          </div>
        </div>

        {/* Analysis tabs */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Overview</button>
            <button className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground">Functions</button>
            <button className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground">Bytecode</button>
            <button className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground">AI</button>
          </div>

          {/* Overview tab */}
          <div className="rounded-xl p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Analysis job created. Processing contract bytecode from Base mainnet. This may take a moment.
            </p>
          </div>

          {/* Functions tab */}
          <div className="rounded-xl p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Function selectors: 0 found (analysis in progress)
            </p>
          </div>

          {/* Bytecode tab */}
          <div className="rounded-xl p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Disassembly will appear here as bytecode is analyzed.
            </p>
          </div>

          {/* AI Analysis tab */}
          <div className="rounded-xl p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              AI explanation will appear once analysis completes.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}