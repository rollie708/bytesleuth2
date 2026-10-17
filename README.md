# ByteSleuth - AI-Powered Web3 Reverse Engineering Agent

Production-ready smart contract analysis tool that performs bytecode analysis, proxy detection, permission analysis, and AI-powered security reporting for EVM contracts.

## Features

- **Real Blockchain Integration**: Base mainnet with extensible multi-chain support
- **Bytecode Analysis**: Custom EVM disassembler with opcode parsing
- **Proxy Detection**: EIP-1967, EIP-1822, EIP-1167, beacon proxies
- **Permission Analysis**: Owner patterns, pause mechanisms, upgrade controls
- **AI Explanations**: Structured security analysis with confidence scoring
- **Evidence-First**: Never fabricates data, clearly marks uncertainties

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Base mainnet RPC URL

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

3. Setup database:
```bash
npm run db:generate
npm run db:push
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string
- `BASE_RPC_URL`: Base mainnet RPC endpoint

Optional:
- `LLM_API_KEY`: OpenAI API key for AI analysis
- `LLM_MODEL`: Model name (default: gpt-4)

## File Structure

All files are in root directory for easy GitHub upload:
- `app-*.tsx`: Next.js pages and API routes
- `components-*.tsx`: React components
- `lib-*.ts`: Core analysis libraries
- `prisma-schema.prisma`: Database schema
- Config files: `next.config.js`, `tailwind.config.ts`, etc.

## Usage

1. **Analyze Contract**: Enter address on `/analyze` page
2. **View Report**: See results at `/reports/[id]`
3. **Dashboard**: Monitor analyses at `/dashboard`

## API Endpoints

- `POST /api/v1/contracts/validate` - Validate contract address
- `POST /api/v1/analyses` - Create analysis job
- `GET /api/v1/analyses/:id` - Get analysis status
- `GET /api/v1/analyses/:id/report` - Get full report

## Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Blockchain**: viem (Base mainnet)
- **Database**: PostgreSQL
- **AI**: OpenAI API (optional)

## Security

- Server-side secrets management
- Input validation with Zod
- Rate limiting recommended
- Safe subprocess handling
- Evidence-based reporting

## Test Contract

Test on Base mainnet USDC: `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`

## License

MIT

## Support

For issues, create a GitHub issue with reproduction steps.
