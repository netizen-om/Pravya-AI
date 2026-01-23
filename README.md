# Pravya AI

> **AI-Powered Interview and Resume Analysis Platform**

Pravya AI is a comprehensive platform that provides real-time voice interviews with detailed AI-powered feedback and intelligent resume analysis using RAG (Retrieval-Augmented Generation).

## 🚀 Features

- **🎤 Real-Time Voice Interviews**
  - AI-powered interview agent with natural conversation flow
  - Real-time speech-to-text using Deepgram
  - Dynamic question generation based on role and experience level
  - Multi-dimensional feedback analysis (communication, technical, problem-solving, behavioral, confidence)

- **📄 Resume RAG System**
  - Upload and analyze PDF resumes
  - AI-powered resume analysis with ATS scoring
  - Interactive resume chatbot using vector search
  - Grammar, spelling, and formatting suggestions

- **💳 Subscription Management**
  - Integrated payment processing with DodoPayments
  - Webhook-based subscription lifecycle management
  - Email notifications for payment events

- **👨‍💼 Admin Panel**
  - Comprehensive dashboard for managing users, interviews, and resumes
  - Financial analytics and reporting
  - Content management for interview templates
  - System monitoring and administration

## 🏗️ Architecture

Pravya AI is built as a **monorepo** using pnpm workspaces, consisting of:

- **Pravya App** (`apps/pravya`) - Main user-facing Next.js application
- **Admin Panel** (`apps/admin`) - Admin dashboard (Next.js)
- **Worker Service** (`apps/worker`) - Background job processor (Express + BullMQ)
- **WebSocket Server** (`apps/ws-server`) - Real-time interview communication (Socket.IO)
- **Webhook Server** (`apps/webhooks`) - External webhook handler (Express)

### Shared Packages

- **@repo/db** - Prisma database client and schema
- **@repo/auth** - NextAuth.js configuration

## 🛠️ Tech Stack

### Frontend
- **Next.js** 15/16 (App Router)
- **React** 19
- **TypeScript** 5
- **Tailwind CSS** 3/4
- **Radix UI** components
- **Framer Motion** for animations

### Backend
- **Node.js** 20
- **Express** 5
- **Prisma** ORM
- **PostgreSQL** database
- **Redis** (BullMQ queues + pub/sub)
- **Qdrant** vector database

### AI/ML
- **Deepgram** (Speech-to-Text & TTS)
- **Google Gemini** (LLM)
- **Groq** (Fast LLM inference)
- **HuggingFace** (Embeddings)
- **LangChain** (LLM orchestration)

### Infrastructure
- **Cloudinary** (File storage)
- **DodoPayments** (Payment gateway)
- **Resend** (Email service)

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 10.14.0
- **PostgreSQL** 14+ (or Docker)
- **Redis** 7+ (or Docker)
- **Docker & Docker Compose** (optional, for local infrastructure)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd Pravya-AI-v2
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Database

```bash
# Generate Prisma client
pnpm -F @repo/db exec prisma generate

# Run migrations
pnpm -F @repo/db exec prisma migrate dev
```

### 4. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This starts:
- **Redis** on port `6379`
- **Qdrant** on port `6333`

### 5. Configure Environment Variables

Create `.env` files in each app directory with required variables. See [Environment Variables](#environment-variables) section in the full documentation.

### 6. Start Development Servers

```bash
# Terminal 1 - Main App
pnpm dev:pravya          # http://localhost:3000

# Terminal 2 - Admin Panel
pnpm dev:admin           # http://localhost:3003

# Terminal 3 - Worker Service
pnpm dev:worker          # http://localhost:8000

# Terminal 4 - WebSocket Server
pnpm dev:ws-server       # http://localhost:3001

# Terminal 5 - Webhook Server
pnpm dev:webhooks        # http://localhost:4000
```

## 📚 Documentation

For comprehensive technical documentation, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

The documentation includes:

- Detailed architecture overview
- Complete API documentation
- Database schema reference
- Environment variables guide
- Deployment instructions
- Development workflow
- Troubleshooting guide

## 🗂️ Project Structure

```
Pravya-AI-v2/
├── apps/
│   ├── pravya/          # Main application
│   ├── admin/           # Admin panel
│   ├── worker/          # Background jobs
│   ├── ws-server/       # WebSocket server
│   └── webhooks/        # Webhook handler
├── packages/
│   ├── db/              # Database package (Prisma)
│   └── auth/            # Auth package (NextAuth)
├── docker/              # Dockerfiles
└── docker-compose.yml   # Local infrastructure
```

## 🔑 Environment Variables

### Required for Pravya App

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
DODOPAYMENTS_API_KEY=...
DEEPGRAM_API_KEY=...
GOOGLE_API_KEY=...
GROQ_API_KEY=...
HUGGINGFACE_API_KEY=...
```

See **[DOCUMENTATION.md](./DOCUMENTATION.md)** for complete environment variable reference.

## 🧪 Development

### Database Migrations

```bash
# Create migration
pnpm -F @repo/db exec prisma migrate dev --name migration-name

# Apply migrations
pnpm -F @repo/db exec prisma migrate deploy
```

### Adding Dependencies

```bash
# Add to specific app
cd apps/pravya
pnpm add package-name

# Or from root
pnpm -F @repo/pravya add package-name
```

### Linting

```bash
pnpm -F @repo/pravya run lint
pnpm -F @repo/admin run lint
```

## 🐳 Docker Deployment

Build and run individual services:

```bash
# Build
docker build -f docker/Dockerfile.pravya -t pravya-app .
docker build -f docker/Dockerfile.admin -t pravya-admin .
docker build -f docker/Dockerfile.worker -t pravya-worker .

# Run
docker run -p 3000:3000 --env-file .env.pravya pravya-app
docker run -p 3003:3003 --env-file .env.admin pravya-admin
docker run -p 8000:8000 --env-file .env.worker pravya-worker
```

## 📊 Key Features Explained

### Real-Time Voice Interview

1. User selects interview template or provides questions
2. WebSocket connection established
3. Deepgram live transcription initialized
4. AI agent conducts interview with natural flow
5. Real-time transcription and TTS audio streaming
6. Interview transcript saved to database
7. Background job analyzes interview and generates feedback

### Resume RAG

1. User uploads PDF resume
2. PDF parsed and text extracted
3. Text chunked and embedded using HuggingFace model
4. Vectors stored in Qdrant with metadata
5. Resume analyzed using LLM (ATS score, grammar, formatting)
6. User can chat with resume using RAG (vector search + LLM)

### Interview Feedback

Multi-step LLM analysis:
1. **Per-question analysis** - Individual feedback for each Q&A
2. **Communication analysis** - Delivery metrics (pace, tone, clarity)
3. **Final synthesis** - Overall performance and role-fit analysis

## 🔒 Security

- NextAuth.js for secure authentication
- JWT-based admin authentication
- Webhook signature verification
- Rate limiting on API routes
- Secure file uploads via Cloudinary
- Environment variable management

## 📈 Monitoring

- BullMQ dashboard for queue monitoring
- Prisma query logging
- Structured logging across services
- Error tracking (Sentry recommended)

<!-- ## 🤝 Contributing

[Add contribution guidelines] -->

## 📝 License

ISC

## Support

work.om08@gmail.com

---

**For detailed technical documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)**

