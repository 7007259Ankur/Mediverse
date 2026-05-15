# Mediverse – Low Level Design (LLD)
> Interview-ready technical breakdown of the Mediverse telemedicine platform

---

## 1. System Overview

Mediverse is a full-stack telemedicine platform with three distinct services:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│              React 19 + Vite + Redux Toolkit                    │
│                    (Netlify – port 5173)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP / WebSocket / Socket.io
┌────────────────────────▼────────────────────────────────────────┐
│                    NODE.JS BACKEND                              │
│              Express 5 + MongoDB + Passport.js                  │
│                      (port 4000)                                │
└──────────┬──────────────────────────────┬───────────────────────┘
           │ HTTP (axios proxy)           │ WebRTC signaling
┌──────────▼──────────┐       ┌───────────▼──────────────────────┐
│   FLASK AI SERVICE  │       │     WebRTC Video Server          │
│  Python + TF/Keras  │       │   (PeerJS / Socket.io room)      │
│     (port 5001)     │       │         (port 3000)              │
└─────────────────────┘       └──────────────────────────────────┘
```

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Redux Toolkit, React Router v7, Axios |
| Backend | Node.js, Express 5, Mongoose 8, JWT, Passport.js |
| Database | MongoDB (Atlas / local) |
| Real-Time | Socket.io 4.8, WebSocket (ws), WebRTC |
| AI/ML | Python Flask, scikit-learn, TensorFlow/Keras, Pandas |
| Auth | JWT (7d expiry), bcryptjs (salt=12), Google OAuth 2.0 |
| File Upload | Multer (5MB limit, image/PDF) |
| Security | Helmet, CORS, express-rate-limit (100 req/15min) |
| Deployment | Netlify (frontend), Cloud (backend) |

---

## 3. Database Schema

### 3.1 User Collection

```js
{
  _id: ObjectId,
  name: String,           // max 50 chars
  email: String,          // unique, lowercase, indexed
  password: String,       // bcrypt hashed (select: false)
  googleId: String,       // for OAuth users
  role: Enum['user', 'doctor', 'admin'],
  createdAt: Date,
  updatedAt: Date
}
```

Key design decisions:
- `password` and `googleId` are mutually optional (one must exist)
- `select: false` on password prevents accidental exposure in queries
- `bcrypt.genSalt(12)` — higher cost factor for security
- Virtual `profileUrl` computed field

### 3.2 Record Collection

```js
{
  _id: ObjectId,
  userId: ObjectId,       // ref: User
  filename: String,
  fileType: String,       // MIME type
  text: String,           // extracted content / metadata
  filePath: String,       // relative path: "uploads/<filename>"
  createdAt: Date,
  doctorNotes: [{
    _id: ObjectId,
    doctorId: ObjectId,   // ref: User (doctor)
    note: String,
    createdAt: Date,
    updatedAt: Date,
    status: Enum['active', 'archived']
  }]
}
```

Key design decisions:
- `doctorNotes` is embedded (not a separate collection) — optimized for read-heavy access
- `filePath` stored as relative path for portability across environments
- Temporary file access tokens (10-min JWT) prevent direct URL scraping

### 3.3 Relationships

```
User (1) ──────────── (N) Record
                              │
                              └── (N) DoctorNotes ──── (1) User [doctor]
```

---

## 4. Backend Architecture

### 4.1 Server Entry Point (`server.js`)

```
Express App
├── Middleware stack
│   ├── helmet()           → security headers
│   ├── morgan('dev')      → request logging
│   ├── cors()             → whitelist: localhost:5173, medixpert.netlify.app
│   ├── express.json()     → body parsing (10kb limit)
│   ├── rateLimit()        → 100 req / 15 min
│   ├── session()          → MongoStore backed sessions
│   └── passport.initialize()
│
├── Routes
│   ├── /api/auth          → authRoutes.js
│   ├── /api/records       → recordRoutes.js
│   ├── /api/users         → userRoutes.js
│   ├── /api/video         → videoRoutes.js
│   └── /api/ai/predict-risk → proxy to Flask :5001
│
├── Socket.io              → video signaling + note events
├── WebSocket (ws)         → real-time note broadcast
└── HTTP server            → wraps Express for Socket.io
```

### 4.2 API Endpoints

#### Auth (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register with email/password |
| POST | `/login` | Login, returns JWT |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | OAuth callback, issues JWT |

#### Records (`/api/records`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/upload` | user | Upload file (multer) |
| GET | `/:userId` | user/doctor | Get user's records |
| GET | `/all-records` | doctor only | All patients + records |
| POST | `/:id/notes` | doctor only | Add clinical note |
| GET | `/:id/notes` | any | Get notes for record |
| GET | `/file-token/:recordId` | any | Get 10-min file token |
| GET | `/file/:id?token=` | token | Serve file securely |

#### AI (`/api/ai`)
| Method | Path | Description |
|---|---|---|
| POST | `/predict-risk` | Proxy to Flask, returns risk score |

### 4.3 Middleware Chain

```
Request
  → auth.js         (verify JWT, attach req.user)
  → validation.js   (express-validator rules)
  → uploadMiddleware (multer + file type check)
  → roleCheck.js    (req.user.role === 'doctor')
  → Controller
  → errorHandler.js (centralized error response)
```

### 4.4 Auth Middleware Detail

```js
// auth.js
1. Extract Bearer token from Authorization header
2. jwt.verify(token, JWT_SECRET) → decoded { id, role }
3. User.findById(decoded.id).select('-password')
4. Attach full user doc to req.user
5. Call next() or return 401
```

---

## 5. Frontend Architecture

### 5.1 Route Map

```
/                   → Home (public)
/login              → Login
/register           → Register
/oauth-success      → OAuthSuccess (token extraction)
/patient            → PatientDashboard [role: user]
/doctor             → DoctorDashboard [role: doctor]
/admin              → AdminDashboard [role: admin]
/vault              → HealthVault [authenticated]
/records            → HealthRecords
/ai                 → AIPredictions
/conv               → HealthAssistant (ElevenLabs voice)
/video              → VideoConsultation
/shop               → ShopNow
/doctor-assistant   → DoctorAssistant [role: user]
/predict            → HealthPredictionPage
/access             → AccessCodeEntryPage
```

### 5.2 Redux State Shape

```js
store = {
  auth: {
    token: String,        // JWT
    user: {
      _id, name, email, role
    },
    isAuthenticated: Boolean
  }
}
// Persisted to localStorage via redux-persist
```

### 5.3 ProtectedRoute Component

```
<ProtectedRoute allowedRoles={['doctor']}>
  → reads auth.token from Redux
  → if no token → redirect /login
  → if role not in allowedRoles → redirect /
  → else render children
```

### 5.4 Key Component Responsibilities

| Component | Responsibility |
|---|---|
| `PatientDashboard` | Upload records, view records, initiate video call, WebSocket listener |
| `DoctorDashboard` | View all patients, add notes, join video call, WebSocket with reconnect |
| `AIPredictions` | 4-domain health form, range validation, risk display |
| `HealthAssistant` | ElevenLabs voice API integration |
| `ShopNow` | Medicine catalog, cart state, checkout |
| `HealthVault` | Secure record browser with file token flow |

---

## 6. Real-Time Communication

### 6.1 WebSocket (Doctor Notes)

```
Patient Browser ──── ws:// ──── Node Server
                                    │
Doctor Browser  ──── ws:// ─────────┘

Flow:
1. Both dashboards open WebSocket on mount
2. Doctor adds note → POST /api/records/:id/notes
3. Server broadcasts { type: 'noteAdded', recordId, note } to all clients
4. Patient dashboard receives and updates notes state in real-time
```

DoctorDashboard implements exponential backoff reconnection:
```
attempt 1 → wait 1s
attempt 2 → wait 2s
...
attempt 5 → wait 10s (max)
```

### 6.2 Video Consultation (WebRTC + Socket.io)

```
Patient                    Node Server               Doctor
   │                           │                       │
   │── generate roomId ────────│                       │
   │── share roomId ───────────│──────────────────────►│
   │                           │                       │
   │── join room (Socket.io) ──►                       │
   │                           │◄── join room ─────────│
   │                           │                       │
   │◄──── WebRTC offer/answer signaling ──────────────►│
   │                           │                       │
   │◄═══════════ P2P Video Stream ════════════════════►│
```

- Room ID: random 8-char alphanumeric string
- Signaling: Socket.io events (offer, answer, ice-candidate)
- P2P: WebRTC via PeerJS library

---

## 7. AI/ML Service (Flask)

### 7.1 Architecture

```
Node Backend ──── POST /api/ai/predict-risk ──── Flask :5001
                        (axios proxy, 5s timeout)
```

### 7.2 Prediction Pipeline

```
Input JSON
  → validate required fields [age, bloodPressure, cholesterol, bmi]
  → build DataFrame
  → scaler.transform(numerical_cols)   ← StandardScaler
  → tile to shape (1, 5, 6)            ← LSTM expects sequence
  → model.predict()                    ← LSTM .h5 model
  → risk_score (0.0 – 1.0)
  → risk_level: Low(<0.3) / Medium(<0.6) / High(≥0.6)
```

### 7.3 Health Domains (sklearn models)

| Domain | Key Features | Model |
|---|---|---|
| Diabetes | Glucose, BMI, Insulin, Age | sklearn classifier |
| Cardiovascular | sysBP, cholesterol, age, smoker | sklearn classifier |
| Liver | Bilirubin, ALT, AST, Albumin | sklearn classifier |
| Kidney | bp, hemoglobin, creatinine | sklearn classifier |
| Mental Health | stress, sleep, family_history | sklearn classifier |

---

## 8. Security Design

### 8.1 Authentication Flow

```
Register:
  email + password → validate → bcrypt.hash(pw, 12) → save User → JWT(7d)

Login:
  email → find user (select +password) → bcrypt.compare() → JWT(7d)

Google OAuth:
  redirect → Google consent → callback → find/create user → JWT(7d) → redirect /oauth-success?token=

Every protected request:
  Authorization: Bearer <token> → auth middleware → req.user attached
```

### 8.2 File Security

```
Upload:  multer validates MIME type + 5MB size limit
Access:  GET /file-token/:recordId → short-lived JWT (10 min, purpose:'file_access')
         GET /file/:id?token=<jwt> → verify token.purpose + token.recordId match
```

### 8.3 RBAC Matrix

| Resource | user | doctor | admin |
|---|---|---|---|
| Own records | ✅ | ✅ | ✅ |
| All patient records | ❌ | ✅ | ✅ |
| Add doctor notes | ❌ | ✅ | ✅ |
| Admin dashboard | ❌ | ❌ | ✅ |
| AI predictions | ✅ | ✅ | ✅ |

---

## 9. Key Design Decisions (Interview Talking Points)

**Why embed doctorNotes inside Record instead of a separate collection?**
Notes are always accessed together with the record. Embedding avoids an extra DB round-trip and keeps the data co-located. The tradeoff is document size growth, acceptable here since notes per record are bounded.

**Why proxy AI requests through Node instead of calling Flask directly from frontend?**
Keeps the Flask service internal (not exposed to the internet), centralizes auth enforcement, and allows the Node layer to add timeouts and error normalization before the client sees a response.

**Why use short-lived tokens for file access instead of serving files directly?**
Prevents URL sharing/scraping. A 10-minute JWT tied to a specific recordId and user means even if the URL leaks, it expires quickly and can't be used for a different file.

**Why Redux Persist?**
JWT and user data need to survive page refreshes without re-login. Persisting to localStorage via redux-persist keeps the auth state consistent across sessions without a separate "check token" API call on every load.

**Why WebSocket for notes instead of polling?**
Real-time UX — doctors and patients see note updates instantly. Polling would add unnecessary load and latency. The exponential backoff reconnection in DoctorDashboard handles network instability gracefully.

**Why LSTM for the risk prediction model?**
LSTM handles sequential/time-series health data well. Even for single-point predictions, the model is fed a padded sequence of 5 identical entries to match the expected input shape — a pragmatic workaround for non-sequential inputs.

---

## 10. Data Flow Diagrams

### 10.1 File Upload Flow

```
Patient
  │── select file ──► PatientDashboard
  │                        │── POST /api/records/upload (multipart)
  │                        │         │
  │                   auth middleware (JWT check)
  │                        │         │
  │                   uploadMiddleware (multer: type + size)
  │                        │         │
  │                   recordController.uploadHealthRecord()
  │                        │── save file to /server/uploads/
  │                        │── create Record in MongoDB
  │                        │── return { message, file }
  │◄── success message ────┘
```

### 10.2 Doctor Note Flow (Real-Time)

```
Doctor
  │── type note ──► DoctorDashboard
  │                     │── POST /api/records/:id/notes
  │                     │         │
  │                 auth + role check (doctor only)
  │                     │         │
  │                 Record.findByIdAndUpdate($push doctorNotes)
  │                     │         │
  │                 io.emit('noteAdded', { recordId, note })
  │                     │         │
  │              ┌───────────────────────────┐
  │              │  All connected WebSocket  │
  │              │  clients receive event    │
  │              └───────────────────────────┘
  │                     │
Patient Dashboard ◄──── noteAdded event → update notes state
```

---

*Generated for interview preparation — Mediverse by Ankur Gupta & Abhyuday Pratap Singh*
