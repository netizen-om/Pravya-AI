# Pravya AI - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [Services Overview](#services-overview)
8. [Core Features](#core-features)
9. [API Documentation](#api-documentation)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)
12. [Infrastructure](#infrastructure)

---

## Project Overview

**Pravya AI** is a comprehensive AI-powered interview and resume analysis platform that provides:

- **Real-time Voice Interviews**: Conduct AI-powered voice interviews with real-time transcription and analysis
- **Resume RAG (Retrieval-Augmented Generation)**: Upload resumes, get AI-powered analysis, and chat with your resume using vector search
- **Detailed Interview Feedback**: Receive structured, multi-dimensional feedback on interview performance
- **Subscription Management**: Integrated payment and subscription system
- **Admin Panel**: Comprehensive admin dashboard for managing users, interviews, resumes, and content

### Key Capabilities

1. **Voice Interview System**
   - Real-time speech-to-text using Deepgram
   - AI-powered interview agent with natural conversation flow
   - Dynamic question generation based on role and level
   - Multi-dimensional feedback analysis (communication, technical, problem-solving, behavioral, confidence)

2. **Resume Analysis**
   - PDF parsing and text extraction
   - Vector embedding generation and storage in Qdrant
   - ATS (Applicant Tracking System) scoring
   - Grammar, spelling, and formatting analysis
   - Interactive resume chatbot using RAG

3. **Payment & Subscriptions**
   - Integration with DodoPayments
   - Webhook handling for payment events
   - Subscription lifecycle management
   - Email notifications for payment events

---

## Architecture

Pravya AI follows a **monorepo architecture** using pnpm workspaces, consisting of multiple microservices:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                      │
├──────────────────────┬──────────────────────────────────────┤
│   Pravya (Frontend)  │      Admin Panel (Frontend)          │
│   Next.js 15         │      Next.js 16                      │
│   Port: 3000         │      Port: 3003                      │
└──────────┬───────────┴──────────────┬───────────────────────┘
           │                          │
           │                          │
┌──────────▼───────────┐  ┌───────────▼────────────┐
│   WebSocket Server   │  │    Webhook Server      │
│   Express + Socket.IO│  │    Express             │ 
│   Port: 3001         │  │    Port: 4000          │
└──────────┬───────────┘  └───────────┬────────────┘
           │                          │
           │                          │
┌──────────▼──────────────────────────▼─────────────┐
│              Worker Service                       │
│              Express + BullMQ                     │
│              Port: 8000                           │
│  - Resume Processing                              │
│  - Interview Analysis                             │
│  - Queue Management                               │
└──────────┬────────────────────────────────────────┘
           │
           │
┌──────────▼────────────────────────────────────────┐
│              Shared Packages                      │
│  - @repo/db (Prisma + PostgreSQL)                 │
│  - @repo/auth (NextAuth.js)                       │
└───────────────────────────────────────────────────┘
           │
           │
┌──────────▼────────────────────────────────────────┐
│              External Services                    │
│  - PostgreSQL Database                            │
│  - Redis (Queue + Pub/Sub)                        │
│  - Qdrant (Vector Database)                       │
│  - Cloudinary (File Storage)                      │
│  - Deepgram (Speech-to-Text)                      │
│  - DodoPayments (Payment Gateway)                 │
│  - Google Gemini / Groq (LLM)                     │
│  - HuggingFace (Embeddings)                       │
└───────────────────────────────────────────────────┘
```

### Architecture Patterns

- **Microservices**: Separate services for different concerns (web, worker, websocket, webhooks)
- **Event-Driven**: Redis pub/sub for real-time updates
- **Queue-Based Processing**: BullMQ for async job processing
- **Monorepo**: Shared packages for database and authentication
- **API-First**: RESTful APIs and WebSocket for real-time communication

---

## Technology Stack

### Frontend

#### Pravya App (`apps/pravya`)
- **Framework**: Next.js 15.3.8 (App Router)
- **React**: 19.0.0
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: React Hooks, React Context
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion 12.23.24
- **Charts**: Recharts 3.1.2
- **Voice SDK**: @vapi-ai/web 2.3.8
- **WebSocket Client**: socket.io-client 4.7.5
- **Authentication**: NextAuth.js 4.24.11

#### Admin Panel (`apps/admin`)
- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.0
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 2.15.4
- **Authentication**: JWT-based custom auth

### Backend Services

#### Worker Service (`apps/worker`)
- **Runtime**: Node.js 20
- **Framework**: Express 5.1.0
- **Queue System**: BullMQ 5.57.0
- **AI SDK**: Vercel AI SDK 6.0.23
- **LLM Providers**: 
  - Google Gemini (via @ai-sdk/google)
  - Groq (via @ai-sdk/groq)
- **Vector Database**: Qdrant (via @langchain/qdrant)
- **Embeddings**: HuggingFace (sentence-transformers/all-MiniLM-L6-v2)
- **PDF Processing**: pdf-parse 1.1.1
- **LangChain**: 0.3.30

#### WebSocket Server (`apps/ws-server`)
- **Runtime**: Node.js 20
- **Framework**: Express 5.1.0
- **WebSocket**: Socket.IO 4.8.1
- **Speech-to-Text**: Deepgram SDK 4.11.2
- **Text-to-Speech**: Deepgram TTS (aura-2-juno-en)
- **AI SDK**: Vercel AI SDK 6.0.27
- **LLM**: Groq (openai/gpt-oss-20b)

#### Webhook Server (`apps/webhooks`)
- **Runtime**: Node.js 20
- **Framework**: Express 5.1.0
- **Webhook Verification**: standardwebhooks 1.0.0
- **Email**: Resend 6.7.0

### Database & Storage

- **Primary Database**: PostgreSQL (via Prisma ORM)
- **Queue & Cache**: Redis 7-alpine
- **Vector Database**: Qdrant v1.8.3
- **File Storage**: Cloudinary

### Development Tools

- **Package Manager**: pnpm 10.14.0
- **TypeScript**: 5.4.5
- **Build Tool**: Next.js Turbopack (dev), esbuild (worker)
- **Linting**: ESLint 9
- **Containerization**: Docker + Docker Compose

---

## Project Structure

```
Pravya-AI-v2/
├── apps/
│   ├── pravya/                    # Main user-facing application
│   │   ├── src/
│   │   │   ├── app/               # Next.js App Router pages
│   │   │   │   ├── api/           # API routes
│   │   │   │   ├── auth/          # Authentication pages
│   │   │   │   ├── dashboard/     # User dashboard
│   │   │   │   ├── interview/     # Interview pages
│   │   │   │   ├── resume/        # Resume pages
│   │   │   │   └── ...
│   │   │   ├── actions/           # Server actions
│   │   │   ├── components/        # React components
│   │   │   ├── lib/               # Utility libraries
│   │   │   └── middleware.ts      # Next.js middleware
│   │   ├── public/                # Static assets
│   │   ├── next.config.ts         # Next.js configuration
│   │   └── package.json
│   │
│   ├── admin/                     # Admin panel application
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── actions/               # Server actions
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utility libraries
│   │   ├── middleware.ts         # Auth middleware
│   │   └── package.json
│   │
│   ├── worker/                    # Background job processor
│   │   ├── src/
│   │   │   ├── controller/       # Route controllers
│   │   │   ├── lib/              # Core libraries
│   │   │   │   ├── embedding.ts  # Embedding generation
│   │   │   │   ├── qdrant.ts     # Vector DB client
│   │   │   │   ├── redis.ts      # Redis client
│   │   │   │   └── ...
│   │   │   ├── routes/           # Express routes
│   │   │   ├── utils/            # Worker functions
│   │   │   │   ├── parseResume.ts
│   │   │   │   ├── analyseResume.ts
│   │   │   │   └── analyseInterview.ts
│   │   │   └── index.ts          # Entry point
│   │   └── package.json
│   │
│   ├── ws-server/                 # WebSocket server
│   │   ├── src/
│   │   │   ├── lib/              # Libraries
│   │   │   │   ├── deepGramClient.ts
│   │   │   │   ├── gemini.ts
│   │   │   │   └── groqForAISDK.ts
│   │   │   └── index.ts          # Socket.IO server
│   │   └── package.json
│   │
│   └── webhooks/                  # Webhook handler
│       ├── src/
│       │   ├── lib/              # Libraries
│       │   └── index.ts          # Express webhook server
│       └── package.json
│
├── packages/
│   ├── db/                        # Shared database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Prisma schema
│   │   │   └── seed.ts           # Database seed
│   │   └── index.ts              # Prisma client export
│   │
│   └── auth/                      # Shared auth package
│       ├── index.ts              # NextAuth configuration
│       └── next-auth.d.ts       # Type definitions
│
├── docker/
│   ├── Dockerfile.pravya
│   ├── Dockerfile.admin
│   └── Dockerfile.worker
│
├── docker-compose.yml            # Local infrastructure
├── pnpm-workspace.yaml           # pnpm workspace config
├── package.json                  # Root package.json
└── DOCUMENTATION.md              # This file
```

---

## Environment Variables

### Pravya App (`apps/pravya`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pravya

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis
REDIS_URL=redis://localhost:6379

# Worker Service
WORKER_SERVICE_URL=http://localhost:8000

# WebSocket Server
NEXT_PUBLIC_WS_SERVER_URL=http://localhost:3001

# DodoPayments
DODOPAYMENTS_API_KEY=your-dodo-api-key
DODOPAYMENTS_WEBHOOK_SECRET=your-webhook-secret

# VAPI (Voice AI)
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-vapi-workflow-id

# Email
RESEND_API_KEY=your-resend-api-key

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Admin Panel (`apps/admin`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pravya

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Admin Auth
ADMIN_SESSION_SECRET=your-admin-session-secret
```

### Worker Service (`apps/worker`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pravya

# Redis
REDIS_URL=redis://localhost:6379

# Qdrant Vector Database
QDRANT_CLOUD_URL=https://your-qdrant-instance.qdrant.io
QDRANT_CLOUD_API=your-qdrant-api-key
QDRANT_PARSED_RESUME_COLLECTION_NAME=pravya-resume

# AI/LLM Providers
GOOGLE_API_KEY=your-google-api-key
GROQ_API_KEY=your-groq-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
OPENROUTER_API_KEY=your-openrouter-api-key (optional)
```

### WebSocket Server (`apps/ws-server`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pravya

# Deepgram
DEEPGRAM_API_KEY=your-deepgram-api-key

# AI/LLM Providers
GOOGLE_API_KEY=your-google-api-key
GROQ_API_KEY=your-groq-api-key
```

### Webhook Server (`apps/webhooks`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pravya

# DodoPayments Webhook
DODOPAYMENTS_WEBHOOK_SECRETE=your-webhook-secret

# Email
RESEND_API_KEY=your-resend-api-key
```

---

## Database Schema

### Core Models

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified Boolean?
  image         String?
  imagePublicId String?
  password      String?
  isSubscribed  Boolean   @default(false)
  isDeleted     Boolean   @default(false)
  bio           String?
  createdAt     DateTime? @default(now())
  updatedAt     DateTime? @updatedAt

  accounts       Account[]
  interviews     Interview[]
  payment        Payment[]
  Resume         Resume[]
  userActivities UserActivity[]
  subscription   Subscription?
}
```

#### Interview
```prisma
model Interview {
  interviewId   String          @id @default(cuid())
  userId        String
  user          User            @relation(fields: [userId], references: [id])
  role          String?
  level         String?
  transcribe    Json?           // Conversation transcript
  noOfQuestions Int
  type          String?
  status        InterviewStatus @default(PENDING)
  updatedAt     DateTime        @updatedAt
  createdAt     DateTime        @default(now())
  isDeleted     Boolean         @default(false)

  interviewTemplateId String?
  template            InterviewTemplate? @relation(...)

  questions Question[]
  feedback  Feedback?
}

enum InterviewStatus {
  PENDING
  COMPLETED
  INCOMPLETE
  ERROR
  ANALYSING
}
```

#### Feedback
```prisma
model Feedback {
  feedbackId  String    @id @default(uuid())
  interviewId String    @unique
  interview   Interview @relation(...)

  overallScore     Int
  summary          String
  keyStrengths     String[]
  improvementAreas String[]

  communicationScore  Int
  technicalScore      Int
  problemSolvingScore Int
  behavioralScore     Int
  confidenceScore     Int

  fullFeedbackJson Json  // Complete structured feedback

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Resume
```prisma
model Resume {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(...)

  fileName       String
  isDeleted      Boolean         @default(false)
  publicId       String
  fileUrl        String
  QdrantStatus   String          @default("uploadeding")
  AnalysisStatus String          @default("pending")
  qdrantFileId   String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  ResumeAnalysis ResumeAnalysis?
}

model ResumeAnalysis {
  resumeAnalysisId String   @id @default(cuid())
  resumeId         String   @unique
  resume           Resume   @relation(...)
  atsScore         Int?
  analysis         Json?    // Structured analysis data
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

#### Payment & Subscription
```prisma
model Payment {
  paymentId String   @id @default(uuid())
  createdAt DateTime @default(now())

  userId String
  user   User   @relation(...)

  amount        Int
  currency      String  @default("INR")
  paymentMethod String?

  status PaymentStatus @default(PENDING)

  dodoOrderId   String? @unique
  dodoPaymentId String? @unique
  dodoSignature String?

  metadata      Json?
  subscriptions Subscription[]

  @@index([userId])
}

model Subscription {
  subscriptionId     String   @id @default(cuid())
  dodoSubscriptionId String?  @unique

  userId String  @unique
  user   User    @relation(...)

  plan      String   @default("monthly")
  status    String   @default("ACTIVE")
  startDate DateTime @default(now())
  endDate   DateTime

  lastPaymentId String?
  lastPayment   Payment? @relation(...)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Interview Templates
```prisma
model MainCategory {
  mainCategoryId String @id @default(cuid())
  name           String @unique
  subCategories  SubCategory[]
}

model SubCategory {
  subCategoryId String @id @default(cuid())
  name          String
  mainCategoryId String
  mainCategory   MainCategory @relation(...)
  templates     InterviewTemplate[]

  @@unique([name, mainCategoryId])
}

model InterviewTemplate {
  interviewTemplateId String  @id @default(cuid())
  title               String
  description         String?
  estimatedDuration   Int
  subCategoryId       String
  subCategory         SubCategory @relation(...)
  tags                Tag[]
  Interview           Interview[]
}
```

#### Admin
```prisma
model Admin {
  id             String         @id @default(cuid())
  name           String
  email          String         @unique
  password       String
  expiresAt      DateTime?
  role           AdminRoleType  @default(MANAGER)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  userActivities UserActivity[]
}

enum AdminRoleType {
  SUPER_ADMIN
  MANAGER
  SUPPORT
}
```

---

## Services Overview

### 1. Pravya App (Main Application)

**Port**: 3000  
**Framework**: Next.js 15 (App Router)

**Key Features**:
- User authentication (NextAuth.js with Google, GitHub, Credentials)
- Interview management and scheduling
- Resume upload and management
- Real-time interview sessions via WebSocket
- Subscription management
- Dashboard with analytics

**Key Routes**:
- `/dashboard` - User dashboard
- `/interview` - Interview management
- `/interview/session/[id]` - Live interview session
- `/interview/feedback/[id]` - Interview feedback view
- `/resume/upload` - Resume upload
- `/resume/chat/[id]` - Resume chatbot
- `/resume/analyse/[id]` - Resume analysis view
- `/subscriptions` - Subscription management
- `/auth/*` - Authentication flows

**API Routes**:
- `/api/auth/*` - Authentication endpoints
- `/api/upload/resume-upload` - Resume upload handler
- `/api/checkout` - Payment checkout
- `/api/webhook/dodopayment` - Payment webhook
- `/api/interviews/list` - List user interviews
- `/api/resume/*` - Resume management endpoints

### 2. Admin Panel

**Port**: 3003  
**Framework**: Next.js 16 (App Router)

**Key Features**:
- Admin authentication (JWT-based)
- User management
- Interview management and analytics
- Resume management
- Financial dashboard
- Content management (interview templates)
- System monitoring

**Key Routes**:
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/interviews` - Interview management
- `/admin/resumes` - Resume management
- `/admin/financials` - Financial dashboard
- `/admin/content` - Content management
- `/admin/admins` - Admin user management (SUPER_ADMIN only)

**API Routes**:
- `/api/auth/login` - Admin login
- `/api/auth/logout` - Admin logout
- `/api/admin/create` - Create admin (SUPER_ADMIN only)
- `/api/admin/list` - List admins (SUPER_ADMIN only)

### 3. Worker Service

**Port**: 8000  
**Framework**: Express + BullMQ

**Purpose**: Background job processing for CPU-intensive tasks

**Queues**:
1. **resume-processing** (Concurrency: 1)
   - PDF parsing
   - Text extraction
   - Vector embedding generation
   - Qdrant storage

2. **resume-analyse** (Concurrency: 2)
   - Resume analysis using LLM
   - ATS scoring
   - Grammar and formatting checks
   - Structured analysis generation

3. **interview-analyse** (Concurrency: 2)
   - Interview transcript analysis
   - Multi-dimensional feedback generation
   - Score calculation

**API Endpoints**:
- `POST /api/v1/resume/chat/:resumeId` - Resume RAG chat
- `POST /api/v1/interview/questions/generate` - Generate interview questions
- `POST /api/v1/interview/questions/get-ai-answer` - Get AI answer for question
- `POST /api/v1/interview/questions/generate-personalised-questions` - Generate personalized questions

**Worker Functions**:
- `resumeParser`: Processes PDF, extracts text, generates embeddings, stores in Qdrant
- `resumeAnalysis`: Analyzes resume using Gemini/Groq, generates structured feedback
- `analyseInterview`: Multi-step LLM analysis for interview feedback

### 4. WebSocket Server

**Port**: 3001  
**Framework**: Express + Socket.IO

**Purpose**: Real-time voice interview communication

**Key Features**:
- Deepgram integration for speech-to-text
- Deepgram TTS for text-to-speech
- Real-time conversation management
- AI-powered interview flow control
- Natural conversation handling with silence detection

**Socket Events**:
- `start-stream`: Initialize interview session
- `audio-stream`: Receive audio chunks from client
- `deepgram-ready`: Signal that Deepgram is ready
- `user-transcript-interim`: Interim transcription updates
- `user-transcript-final`: Final transcription
- `agent-transcript`: AI agent speech text
- `ai-audio-begin`: Start of AI audio stream
- `ai-audio-chunk`: AI audio data chunks
- `ai-audio-end`: End of AI audio stream
- `interview-finished`: Interview completion signal
- `reset-interview`: Reset interview state

**Interview Flow**:
1. Client connects and sends `start-stream` with questions
2. Server initializes Deepgram live transcription
3. Server starts interview with first question (TTS)
4. Client streams audio chunks via `audio-stream`
5. Deepgram transcribes speech in real-time
6. Server detects silence and processes user response
7. AI decides next action (follow-up, next question, end)
8. Server responds with TTS audio
9. Process repeats until interview completion

### 5. Webhook Server

**Port**: 4000  
**Framework**: Express

**Purpose**: Handle external webhooks (primarily DodoPayments)

**Endpoints**:
- `POST /api/webhook/dodopayment` - DodoPayments webhook handler

**Handled Events**:
- `subscription.created` / `subscription.active`
- `subscription.updated` / `subscription.renewed`
- `subscription.cancelled` / `subscription.deleted`
- `payment.succeeded`
- `payment.failed`
- `refund.created` / `refund.succeeded`

**Features**:
- Webhook signature verification (standardwebhooks)
- Idempotency handling (prevents duplicate processing)
- Email notifications (Resend)
- Database updates (Payment, Subscription models)

---

## Core Features

### 1. Real-Time Voice Interview

**Technology Stack**:
- **Speech-to-Text**: Deepgram Nova-3 model
- **Text-to-Speech**: Deepgram Aura-2-Juno-EN
- **AI Agent**: Groq (openai/gpt-oss-20b)
- **Real-time Communication**: Socket.IO

**Flow**:
1. User selects interview template or provides custom questions
2. Frontend connects to WebSocket server
3. Server initializes Deepgram live transcription
4. Interview starts with AI greeting and first question
5. User speaks, audio is streamed to server
6. Deepgram transcribes speech in real-time
7. Server detects silence (1.5s threshold) and processes response
8. AI analyzes response and decides next action:
   - Ask follow-up question
   - Move to next question
   - End interview
9. Server responds with TTS audio
10. Process repeats until completion
11. Transcript is saved to database
12. Interview analysis job is queued

**Key Features**:
- Natural conversation flow with dynamic follow-ups
- Silence detection for natural pauses
- Interim transcriptions for real-time feedback
- Buffered audio streaming for stable MP3 playback
- Error handling and fallback responses

### 2. Interview Analysis

**Multi-Step LLM Workflow**:

**Step 1: Per-Question Analysis**
- Analyzes each question-answer pair individually
- Provides specific feedback, positive points, improvement areas
- Generates model answers for reference
- Uses Groq (openai/gpt-oss-120b)

**Step 2: Communication & Delivery Analysis**
- Analyzes entire conversation for delivery metrics
- Evaluates pace, filler words, tone, clarity
- Focuses on communication skills, not content

**Step 3: Final Synthesis**
- Combines per-question feedback and communication analysis
- Generates overall performance summary
- Calculates dashboard metrics (scores for 5 dimensions)
- Provides role-specific fit analysis
- Identifies key strengths and improvement areas

**Output Structure**:
```typescript
{
  overallPerformance: {
    overallScore: number,
    summary: string,
    keyStrengths: string[],
    keyAreasForImprovement: string[]
  },
  dashboardMetrics: {
    communication: { score: number, feedback: string },
    hardSkills: { score: number, feedback: string },
    problemSolving: { score: number, feedback: string },
    softSkills: { score: number, feedback: string },
    confidence: { score: number, feedback: string }
  },
  questionBreakdown: Array<{
    questionId: string,
    questionText: string,
    userAnswerTranscript: string,
    specificFeedback: string,
    positivePoints: string[],
    improvementAreas: string[],
    modelAnswer?: string
  }>,
  communicationAndDelivery: {
    pace: { score: number, feedback: string },
    fillerWords: { score: number, feedback: string },
    tone: { score: number, feedback: string },
    clarity: { score: number, feedback: string }
  },
  roleSpecificFit: {
    fitScore: number,
    analysis: string,
    recommendations: string[]
  }
}
```

### 3. Resume RAG System

**Technology Stack**:
- **PDF Processing**: pdf-parse + LangChain PDFLoader
- **Embeddings**: HuggingFace (sentence-transformers/all-MiniLM-L6-v2)
- **Vector Database**: Qdrant
- **LLM**: Groq / Google Gemini

**Processing Pipeline**:

1. **Upload & Parse**:
   - User uploads PDF resume
   - File is stored in Cloudinary
   - Resume record created in database (status: "uploaded")

2. **Vector Processing** (Queue: resume-processing):
   - PDF downloaded from Cloudinary
   - Text extracted using PDFLoader
   - Documents chunked with metadata (userId, resumeId)
   - Embeddings generated using HuggingFace model
   - Vectors stored in Qdrant collection "pravya-resume"
   - Status updated to "completed"

3. **Analysis** (Queue: resume-analyse):
   - PDF text extracted
   - Structured analysis generated using Gemini 2.5 Flash
   - Analysis includes:
     - ATS score
     - Grammar and spelling errors
     - Formatting issues
     - Impact word suggestions
     - Keyword analysis
   - Analysis stored in ResumeAnalysis model

4. **RAG Chat**:
   - User asks question about resume
   - Question is embedded using same model
   - Vector search in Qdrant (filtered by resumeId)
   - Top 5 relevant chunks retrieved
   - Context assembled:
     - Resume analysis data
     - Relevant resume excerpts
   - LLM generates answer based on context
   - Response streamed to client

**Status Tracking**:
- `QdrantStatus`: "uploaded" → "parsing" → "completed" / "error"
- `AnalysisStatus`: "pending" → "analyzing" → "completed" / "error"
- Real-time updates via Redis pub/sub

### 4. Payment & Subscription System

**Payment Gateway**: DodoPayments

**Flow**:
1. User initiates subscription on frontend
2. Frontend calls `/api/checkout` with user details
3. DodoPayments checkout session created
4. User redirected to DodoPayments payment page
5. User completes payment
6. DodoPayments sends webhook to `/api/webhook/dodopayment`
7. Webhook server:
   - Verifies signature
   - Checks for duplicate events (idempotency)
   - Updates Payment and Subscription models
   - Sends email notifications
   - Updates user subscription status

**Subscription States**:
- `ACTIVE`: Active subscription
- `CANCELLED`: User cancelled
- `EXPIRED`: Payment failed or subscription ended

**Webhook Events**:
- `subscription.created`: New subscription created
- `subscription.active`: Subscription activated
- `subscription.updated`: Subscription updated
- `subscription.renewed`: Subscription renewed
- `subscription.cancelled`: Subscription cancelled
- `payment.succeeded`: Payment successful
- `payment.failed`: Payment failed
- `refund.created`: Refund initiated

**Email Notifications**:
- Subscription activation email
- Payment success invoice
- Subscription cancellation confirmation

---

## API Documentation

### Pravya App APIs

#### Authentication

**POST** `/api/auth/signup`
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**POST** `/api/auth/verify-email`
```json
{
  "token": "string"
}
```

**POST** `/api/auth/forget-password`
```json
{
  "email": "string"
}
```

#### Resume

**POST** `/api/upload/resume-upload`
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file)

**GET** `/api/resume/get-all-user-resume`
- Returns: Array of user resumes

**GET** `/api/resume/get-resume-detail?resumeId=string`
- Returns: Resume details with analysis

**GET** `/api/resume/status-updates?resumeId=string`
- Returns: Real-time status updates (SSE)

#### Interview

**GET** `/api/interviews/list`
- Returns: Array of user interviews

**POST** `/api/worker/add-to-interview-queue`
```json
{
  "interviewId": "string"
}
```

#### Subscription

**POST** `/api/checkout`
- Returns: `{ url: string }` (checkout URL)

**POST** `/api/subscription/cancel`
- Cancels user subscription

### Worker Service APIs

**POST** `/api/v1/resume/chat/:resumeId`
```json
{
  "question": "string"
}
```
- Returns: Streaming response with AI answer

**POST** `/api/v1/interview/questions/generate`
```json
{
  "role": "string",
  "level": "string",
  "noOfQuestions": number
}
```
- Returns: Array of interview questions

**POST** `/api/v1/interview/questions/generate-personalised-questions`
```json
{
  "resumeId": "string",
  "role": "string",
  "level": "string",
  "noOfQuestions": number
}
```
- Returns: Personalized questions based on resume

**POST** `/api/v1/interview/questions/get-ai-answer`
```json
{
  "question": "string",
  "role": "string",
  "level": "string"
}
```
- Returns: Model answer for question

### Webhook APIs

**POST** `/api/webhook/dodopayment`
- Headers:
  - `webhook-id`: string
  - `webhook-signature`: string
  - `webhook-timestamp`: string
- Body: DodoPayments webhook payload

---

## Development Setup

### Prerequisites

- **Node.js**: 20.x or higher
- **pnpm**: 10.14.0
- **PostgreSQL**: 14+ (or use Docker)
- **Redis**: 7+ (or use Docker)
- **Docker & Docker Compose** (optional, for local infrastructure)

### Initial Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd Pravya-AI-v2
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Setup Database**
```bash
# Generate Prisma client
pnpm -F @repo/db exec prisma generate

# Run migrations (if migrations exist)
pnpm -F @repo/db exec prisma migrate dev

# Seed database (optional)
pnpm -F @repo/db exec prisma db seed
```

4. **Setup Infrastructure (Docker)**
```bash
# Start Redis and Qdrant
docker-compose up -d
```

5. **Configure Environment Variables**
- Copy `.env.example` files to `.env` in each app directory
- Fill in all required environment variables (see [Environment Variables](#environment-variables))

6. **Start Development Servers**

**Terminal 1 - Pravya App**:
```bash
pnpm dev:pravya
# Runs on http://localhost:3000
```

**Terminal 2 - Admin Panel**:
```bash
pnpm dev:admin
# Runs on http://localhost:3003
```

**Terminal 3 - Worker Service**:
```bash
pnpm dev:worker
# Runs on http://localhost:8000
```

**Terminal 4 - WebSocket Server**:
```bash
pnpm dev:ws-server
# Runs on http://localhost:3001
```

**Terminal 5 - Webhook Server**:
```bash
pnpm dev:webhooks
# Runs on http://localhost:4000
```

### Development Workflow

1. **Database Changes**:
   - Modify `packages/db/prisma/schema.prisma`
   - Run `pnpm -F @repo/db exec prisma migrate dev`
   - Prisma client auto-regenerates

2. **Adding Dependencies**:
   - Add to specific app's `package.json`
   - Run `pnpm install` from root

3. **Shared Package Changes**:
   - Modify `packages/db` or `packages/auth`
   - Changes are immediately available to consuming apps

### Testing

**Run Linters**:
```bash
pnpm -F @repo/pravya run lint
pnpm -F @repo/admin run lint
```

**Type Checking**:
```bash
# TypeScript will check during build
pnpm -F @repo/pravya build
```

---

## Deployment

### Docker Deployment

The project includes Dockerfiles for each service:

#### Build Images

```bash
# Build Pravya app
docker build -f docker/Dockerfile.pravya -t pravya-app .

# Build Admin panel
docker build -f docker/Dockerfile.admin -t pravya-admin .

# Build Worker service
docker build -f docker/Dockerfile.worker -t pravya-worker .
```

#### Run Containers

```bash
# Pravya app
docker run -p 3000:3000 --env-file .env.pravya pravya-app

# Admin panel
docker run -p 3003:3003 --env-file .env.admin pravya-admin

# Worker service
docker run -p 8000:8000 --env-file .env.worker pravya-worker
```

### Production Considerations

1. **Environment Variables**: Use secure secret management (AWS Secrets Manager, HashiCorp Vault, etc.)

2. **Database**: Use managed PostgreSQL (AWS RDS, Supabase, Neon, etc.)

3. **Redis**: Use managed Redis (AWS ElastiCache, Redis Cloud, etc.)

4. **Qdrant**: Use Qdrant Cloud or self-hosted cluster

5. **File Storage**: Cloudinary (already configured)

6. **CDN**: Use Cloudflare or AWS CloudFront for static assets

7. **Monitoring**: 
   - Application monitoring (Sentry, Datadog)
   - Queue monitoring (BullMQ Dashboard)
   - Database monitoring (Prisma Pulse)

8. **Scaling**:
   - Horizontal scaling for worker service
   - Load balancing for web services
   - Redis cluster for high availability

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Redis and Qdrant accessible
- [ ] External API keys configured (Deepgram, DodoPayments, etc.)
- [ ] SSL certificates configured
- [ ] Domain names configured
- [ ] Webhook URLs updated in external services
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place

---

## Infrastructure

### Required Services

1. **PostgreSQL Database**
   - Primary data store
   - Managed service recommended (AWS RDS, Supabase, Neon)

2. **Redis**
   - Queue management (BullMQ)
   - Pub/Sub for real-time updates
   - Cache (optional)
   - Managed service recommended (AWS ElastiCache, Redis Cloud)

3. **Qdrant Vector Database**
   - Vector storage for resume embeddings
   - Qdrant Cloud or self-hosted

4. **Cloudinary**
   - File storage for resumes
   - Image optimization

5. **Deepgram**
   - Speech-to-text
   - Text-to-speech

6. **DodoPayments**
   - Payment processing
   - Subscription management

7. **AI/LLM Providers**
   - Google Gemini (via Google AI SDK)
   - Groq (for faster inference)
   - HuggingFace (for embeddings)

8. **Email Service**
   - Resend (for transactional emails)

### Network Architecture

```
Internet
   │
   ├─── Load Balancer / Reverse Proxy (Nginx/Cloudflare)
   │
   ├─── Pravya App (Next.js) ────┐
   │                              │
   ├─── Admin Panel (Next.js) ────┤
   │                              │
   ├─── WebSocket Server ─────────┤───┐
   │                              │   │
   └─── Webhook Server ───────────┤   │
                                  │   │
                                  │   ├─── PostgreSQL
                                  │   │
                                  │   ├─── Redis
                                  │   │
                                  │   └─── Qdrant
                                  │
                                  └─── Worker Service (Background Jobs)
```

### Queue Architecture

```
┌─────────────────────────────────────────┐
│         Redis (BullMQ)                  │
├─────────────────────────────────────────┤
│  Queue: resume-processing               │
│  Queue: resume-analyse                  │
│  Queue: interview-analyse               │
└─────────────────┬───────────────────────┘
                  │
                  │
┌─────────────────▼───────────────────────┐
│      Worker Service (Multiple Instances)│
│  - resumeParser                         │
│  - resumeAnalysis                       │
│  - analyseInterview                     │
└─────────────────────────────────────────┘
```

---

## Additional Notes

### Security Considerations

1. **Authentication**:
   - NextAuth.js with secure session management
   - JWT for admin panel
   - Password hashing with bcryptjs

2. **API Security**:
   - Webhook signature verification
   - Rate limiting (implemented in middleware)
   - CORS configuration

3. **Data Protection**:
   - Environment variables for secrets
   - Database connection encryption
   - Secure file uploads (Cloudinary)

### Performance Optimizations

1. **Database**:
   - Prisma connection pooling
   - Indexed queries
   - Efficient relationships

2. **Caching**:
   - Redis for frequently accessed data
   - Next.js static generation where applicable

3. **Queue Processing**:
   - Configurable concurrency
   - Job retries with exponential backoff
   - Priority queues (if needed)

4. **Vector Search**:
   - Efficient Qdrant queries
   - Filtered searches by resumeId
   - Top-K retrieval

### Monitoring & Observability

1. **Logging**:
   - Structured logging in all services
   - Error tracking (Sentry recommended)

2. **Metrics**:
   - Queue metrics (BullMQ dashboard)
   - API response times
   - Database query performance

3. **Health Checks**:
   - Implement `/health` endpoints
   - Database connectivity checks
   - External service availability

---

## Support & Maintenance

### Common Issues

1. **Prisma Client Not Generated**:
   ```bash
   pnpm -F @repo/db exec prisma generate
   ```

2. **Redis Connection Issues**:
   - Verify `REDIS_URL` environment variable
   - Check Redis server is running
   - Verify network connectivity

3. **Qdrant Connection Issues**:
   - Verify `QDRANT_CLOUD_URL` and `QDRANT_CLOUD_API`
   - Check Qdrant collection exists
   - Verify API key permissions

4. **WebSocket Connection Issues**:
   - Check `NEXT_PUBLIC_WS_SERVER_URL` in frontend
   - Verify WebSocket server is running
   - Check CORS configuration

### Database Migrations

```bash
# Create new migration
pnpm -F @repo/db exec prisma migrate dev --name migration-name

# Apply migrations in production
pnpm -F @repo/db exec prisma migrate deploy

# Reset database (development only)
pnpm -F @repo/db exec prisma migrate reset
```

---

## License

ISC

---

## Contributors

netizenom

---

**Last Updated**: 23 January 2026  
**Version**: 1.0.0

