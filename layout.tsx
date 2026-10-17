import './globals.css'

export const metadata = {
  title: 'ByteSleuth - AI Web3 Contract Analyzer',
  description: 'Production-ready AI-powered Web3 reverse engineering agent for EVM smart contract bytecode analysis',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}