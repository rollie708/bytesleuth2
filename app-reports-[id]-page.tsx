export default function ContractReportPage() {
  const { id } = useParams()
  const router = useRouter()

  if (!id) {
    return <div>No analysis ID provided</div>
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Analysis Report #{id}
        </h1>

        <div className="bg-black/50 rounded-xl p-6 mb-8">
          <p className="text-sm text-muted-foreground">
            Loading analysis report... (ID: {id})
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              View detailed analysis including bytecode, function selectors, 
              permission findings, and AI-generated explanations.
            </p>
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full mb-4"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </main>
  )
}