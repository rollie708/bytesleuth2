export default function DashboardPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Investigation Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Total Analyses</p>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="bg-black/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-green-500">0</p>
          </div>
          <div className="bg-black/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-blue-500">0</p>
          </div>
          <div className="bg-black/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-3xl font-bold text-red-500">0</p>
          </div>
        </div>

        <div className="bg-black/50 rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Recent analyses will appear here</p>
          <p className="text-muted-foreground mt-2">No analyses found</p>
        </div>
      </div>
    </main>
  )
}