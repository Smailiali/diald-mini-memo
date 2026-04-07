# Mini Memo

AI-powered commercial real estate due diligence reports in minutes.

## Why I Built This

Commercial real estate analysis is time-consuming and expensive. Institutional investors rely on multi-disciplinary teams -- location analysts, demographic researchers, market specialists, and risk assessors -- to produce investment memos before making decisions.

Mini Memo demonstrates how a multi-step LLM pipeline can replicate that workflow at speed. Instead of one generic prompt, it chains five sequential Claude API calls, each acting as a different specialist, with every step receiving the full output of prior steps as context. The result is a structured investment memo with an overall score, sub-scores, SWOT analysis, and an executive summary -- generated from a single address input.

This project was built as a portfolio piece to demonstrate applied LLM pipeline architecture in the context of commercial real estate, inspired by the kind of AI-assisted analysis that platforms like Diald AI are building for the industry.

---

## Architecture

The core of the app is a five-step pipeline where each Claude call builds on the last:

```
Address Input
      |
      v
[Step 1] Location Analyst
   Neighborhood, property type, landmarks, transit, area characteristics
      |
      v
[Step 2] Demographic Analyst  (receives Step 1 output)
   Population density, income levels, employment drivers, growth trends
      |
      v
[Step 3] Market Analyst  (receives Steps 1-2 output)
   Comparable properties, rent/sale ranges, vacancy trends, demand drivers
      |
      v
[Step 4] Risk Specialist  (receives Steps 1-3 output)
   SWOT analysis -- 3-4 items per quadrant, grounded in prior chapters
      |
      v
[Step 5] Senior Analyst  (receives Steps 1-4 output)
   Investment score (0-100), sub-scores (0-25 each), executive summary
      |
      v
Memo saved to PostgreSQL, streamed to frontend via SSE
```

Each step receives the complete JSON output of all prior steps, so later analysts can reference earlier findings. The SSE stream means the frontend updates in real time as each step completes.

---

## Tech Stack

- **Next.js 14** (App Router, server + client components)
- **TypeScript** (strict mode, no `any`)
- **Tailwind CSS**
- **Anthropic Claude API** (`claude-sonnet-4-20250514`)
- **PostgreSQL** via Prisma ORM (hosted on Neon)
- **Vercel** (deployment)

---

## Running Locally

### 1. Clone the repo

```bash
git clone git@github.com:Smailiali/diald-mini-memo.git
cd diald-mini-memo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```
DATABASE_URL=your_neon_postgresql_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Also create a `.env` file with just the `DATABASE_URL` (required by Prisma CLI):

```
DATABASE_URL=your_neon_postgresql_connection_string
```

- Get a free PostgreSQL database at [neon.tech](https://neon.tech)
- Get an API key at [console.anthropic.com](https://console.anthropic.com)

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Live Demo

Coming soon.

---

## How It Works

1. Enter any commercial property address on the landing page
2. The app opens an SSE connection to `POST /api/memo/generate`
3. The pipeline runs 5 sequential Claude API calls server-side, each streaming a completion event back to the client
4. The progress UI updates in real time as each analyst step completes
5. Once all steps finish, the full memo is saved to PostgreSQL and you are redirected to the memo page
6. Every generated memo is accessible from the History page
