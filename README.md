# Swahili Dictionary Frontend

A modern, responsive web interface for the Swahili-English dictionary powered by AI and vector search technology.

## Features

- **AI-Powered Search**: Get natural language responses from the LLM
- **Vector Similarity Search**: Fast and accurate word lookups
- **Bilingual Support**: Search in both Swahili and English
- **Real-time Health Monitoring**: Track system status and connectivity
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light theme support

## Prerequisites

- Node.js 18+ or Bun
- pnpm (or npm/yarn)
- Backend API running (see main project README)

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` if your backend API is running on a different URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

Build for production:

```bash
pnpm build
pnpm start
```

## Project Structure

```
kisw-dict-frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dictionary page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SearchBar.tsx      # Search input component
│   ├── SearchResults.tsx  # Results display component
│   ├── DictionaryEntry.tsx # Individual entry card
│   └── HealthStatus.tsx   # System status display
├── lib/                   # Utilities and services
│   ├── api.ts            # API client
│   └── types.ts          # TypeScript type definitions
└── public/               # Static assets
```

## API Integration

The frontend connects to the following backend endpoints:

- `GET /api/v1/health` - System health check
- `POST /api/v1/query` - Single query with RAG
- `POST /api/v1/batch-query` - Batch queries
- `POST /api/v1/search` - Vector search only (faster)

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **pnpm** - Fast package manager

## Troubleshooting

### Backend Connection Issues

If you see connection errors:

1. Ensure the backend API is running:
   ```bash
   cd ../
   uvicorn api.main:app --reload
   ```

2. Verify the API URL in `.env.local` matches your backend

3. Check CORS settings in the backend (`api/config.py`)

### Build Errors

If you encounter TypeScript errors:

```bash
pnpm build
```

Check the error output and ensure all types are correctly imported.

## License

Part of the Swahili Dictionary RAG System project.
