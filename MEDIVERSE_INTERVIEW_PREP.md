# MediVerse — Interview Preparation Guide
## AI-Powered Telehealth Platform

---

# 1. WHAT IS THIS PROJECT?

**MediVerse** is a full-stack, AI-powered telehealth platform with role-based access for patients, doctors, and admins.

One-liner: "A digital hospital — patients upload records, consult doctors live via video, get AI health predictions, and buy medicines, all in one app."

Live: https://medixpert.netlify.app/

---

# 2. HIGH-LEVEL SYSTEM ARCHITECTURE

```
                        USER (Browser)
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       React Frontend   WebRTC Video   Razorpay
       (Netlify CDN)    (P2P direct)   Payment UI
              │
              │  REST API calls
              ▼
┌─────────────────────────────────────────────────────┐
│              Node.js / Express Backend               │
│                   (server/)                          │
│                                                      │
│  /api/auth/*      /api/records/*    /api/video/*     │
│       │                 │                │           │
│  authController   recordController  videoRoutes      │
│       │                 │                            │
│  JWT + Google     Multer upload                      │
│  OAuth 2.0        MongoDB save                       │
└─────────────────────────────────────────────────────┘
              │                    │
              │                    │ Socket.io
              ▼                    ▼
       ┌────────────┐      ┌──────────────────┐
       │  MongoDB   │      │  Socket.io Server │
       │  Atlas     │      │  (WebRTC signal) │
       │            │      └──────────────────┘
       │ users      │
       │ records    │
       └────────────┘
              │
              │  HTTP proxy
              ▼
┌─────────────────────────────────────────────────────┐
│              Flask AI Service (Python)               │
│                  (flask_ai/)                         │
│                                                      │
│  /predict/<domain>    /ocr    /api/ai/predict-risk   │
│         │               │              │             │
│   5 ML models      Tesseract OCR   LSTM model        │
│   (sklearn .pkl)   + PyMuPDF       (TensorFlow)      │
└─────────────────────────────────────────────────────┘
```

---

# 3. FULL FEATURE MAP

```
MediVerse
│
├── AUTH SYSTEM
│   ├── Local register/login (JWT, bcrypt salt=12)
│   ├── Google OAuth 2.0 (google-auth-library)
│   └── Role-based: user | doctor | admin
│
├── HEALTH RECORDS (HealthVault)
│   ├── Upload PDF / image (Multer middleware)
│   ├── OCR extraction (Tesseract + PyMuPDF)
│   ├── Stored in MongoDB (Record model)
│   ├── Patient: sees own records only
│   └── Doctor: sees ALL patients + their records
│
├── AI HEALTH PREDICTIONS
│   ├── 5 disease models (sklearn .pkl files)
│   │   ├── Diabetes        (8 features, PIMA dataset)
│   │   ├── Cardiovascular  (10 features, Framingham)
│   │   ├── Liver Disease   (10 features, ILPD)
│   │   ├── Kidney Disease  (15 features)
│   │   └── Mental Health   (6 features)
│   ├── LSTM risk model (TensorFlow, 4 vitals)
│   └── Gated by Razorpay payment + access code
│
├── VIDEO CONSULTATION (WebRTC)
│   ├── Peer-to-peer encrypted video
│   ├── Socket.io signaling server
│   ├── In-call chat (real-time messages)
│   ├── Doctor-only consultation notes
│   └── Live consultation timer
│
├── HEALTH ASSISTANT (AI Chatbot)
│   ├── Text + Voice input modes
│   ├── Powered by ElevenLabs Voice API
│   ├── Symptom assessment responses
│   └── Health analytics dashboard
│
├── MEDICAL STORE (ShopNow)
│   ├── Medicine catalog with cart
│   ├── Checkout flow
│   └── Razorpay payment gateway
│
└── DASHBOARDS
    ├── PatientDashboard  — records, predictions, appointments
    ├── DoctorDashboard   — all patients, records, notes
    └── AdminDashboard    — platform management
```

---

# 4. ROLE-BASED ACCESS CONTROL (RBAC)

```
THREE ROLES:
┌──────────────┬───────────────────────────────────────────────────┐
│  user        │ Upload own records, view own records, book video  │
│  (patient)   │ consult, use AI predictions, shop medicines       │
├──────────────┼───────────────────────────────────────────────────┤
│  doctor      │ All patient features + view ALL patients and      │
│              │ their records, add doctor notes, doctor dashboard │
├──────────────┼───────────────────────────────────────────────────┤
│  admin       │ Full platform access, admin dashboard             │
└──────────────┴───────────────────────────────────────────────────┘

HOW IT WORKS IN CODE:

  1. JWT token payload: { id, role }
     → signed at login, expires in 7 days

  2. auth.js middleware (every protected route):
     → verifies JWT signature
     → attaches req.user = { _id, role }

  3. roleCheck.js middleware:
     → roleCheck(['doctor']) → 403 if role not in list

  4. Controller-level checks:
     → if (req.user.role !== 'doctor') → 403
     → if (req.user.role === 'user' && req.user._id !== uid) → 403
```

---

# 5. AUTHENTICATION FLOW

```
LOCAL AUTH:
  POST /api/auth/register
    → validate: name, email, password (min 6 chars)
    → check email not already registered
    → bcrypt.hash(password, salt=12)  ← never stored plain
    → User.create({ name, email, hashedPassword, role })
    → jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' })
    → return { token, user }  ← password field excluded

  POST /api/auth/login
    → User.findOne({ email }).select('+password')
    → bcrypt.compare(candidatePassword, storedHash)
    → if match → return { token, user }

GOOGLE OAUTH:
  POST /api/auth/google
    → client.verifyIdToken(credential, GOOGLE_CLIENT_ID)
    → extract { googleId, email, name, picture }
    → find user by googleId OR email
    → if not found → create new user
    → if found without googleId → link Google to existing account
    → return { token, user }
```

---

# 6. HEALTH RECORDS — UPLOAD & OCR FLOW

```
Patient uploads PDF or image
        │
        ▼
POST /api/records/upload
  → Multer middleware saves to server/uploads/<timestamp>_<filename>
        │
        ▼
recordController.uploadHealthRecord()
  → creates Record in MongoDB:
    { userId, filename, fileType, filePath, text: 'Uploaded file' }
        │
        ▼
OCR via Flask /ocr endpoint:
  ┌──────────────────────────────────────────────┐
  │  If PDF  → PyMuPDF (fitz)                    │
  │    doc = fitz.open(filepath)                 │
  │    for page in doc: text += page.get_text()  │
  │                                              │
  │  If Image → Tesseract OCR                    │
  │    image = Image.open(filepath)              │
  │    image = image.convert('L')  ← grayscale   │
  │    pytesseract.image_to_string(image)        │
  └──────────────────────────────────────────────┘
        │
        ▼
Extracted text returned to frontend

DOCTOR ACCESS:
  GET /api/records/all  (doctor only)
    → finds all users with role='user'
    → for each user, fetches their records
    → returns: [{ user info + records[] }]

  Doctor adds notes:
    Record.doctorNotes.push({ doctorId, note, status: 'active' })
```

---

# 7. AI PREDICTION PIPELINE

```
USER FLOW:
  1. Pay via Razorpay → get 4-digit access code
  2. Enter access code → unlocks AI Predictions page
  3. Select disease domain
  4. Fill in medical form
  5. Get risk score + level

FLASK: POST /predict/<domain>
  → validate_input(domain, data)
  → features = [float(data[field]) for field in DOMAIN_CONFIG[domain]['features']]
  → prediction = models[domain].predict_proba([features])[0][1]
  → risk_level = "high" if prediction > threshold(0.5) else "low"
  → return { domain, risk_score, risk_level, features_used }

5 DISEASE MODELS:
┌──────────────────┬──────────────────────────────────────────────┐
│ diabetes         │ Pregnancies, Glucose, BloodPressure,         │
│                  │ SkinThickness, Insulin, BMI,                 │
│                  │ DiabetesPedigreeFunction, Age  (8 features)  │
├──────────────────┼──────────────────────────────────────────────┤
│ cardiovascular   │ male, age, currentSmoker, cigsPerDay,        │
│                  │ totChol, sysBP, diaBP, BMI,                  │
│                  │ heartRate, glucose  (10 features)            │
├──────────────────┼──────────────────────────────────────────────┤
│ liver            │ Age, Gender, Total_Bilirubin,                │
│                  │ Direct_Bilirubin, Alkaline_Phosphotase,      │
│                  │ Alamine_Aminotransferase,                    │
│                  │ Aspartate_Aminotransferase,                  │
│                  │ Total_Proteins, Albumin,                     │
│                  │ Albumin_and_Globulin_Ratio  (10 features)    │
├──────────────────┼──────────────────────────────────────────────┤
│ kidney           │ age, bp, sg, al, su, bgr, bu, sc, sod,      │
│                  │ pot, hemo, pcv, htn, dm, cad  (15 features)  │
├──────────────────┼──────────────────────────────────────────────┤
│ mentalhealth     │ Age, Gender, family_history,                 │
│                  │ work_interfere, remote_work,                 │
│                  │ tech_company  (6 features)                   │
└──────────────────┴──────────────────────────────────────────────┘

LSTM RISK MODEL: POST /api/ai/predict-risk
  Inputs: age, bloodPressure, cholesterol, bmi, isSmoker, isDiabetic
  → StandardScaler normalizes numerical cols
  → Input tiled 5× → shape (1, 5, 6) for LSTM input format
  → Output: risk score 0.0–1.0
  → Low < 0.3, Medium 0.3–0.6, High > 0.6
```

---

# 8. WEBRTC VIDEO CONSULTATION — HOW IT WORKS

```
WebRTC = Web Real-Time Communication
Peer-to-peer encrypted video/audio directly between browsers.
No video data goes through the server — only signaling does.

SIGNALING FLOW (via Socket.io):

  Doctor opens Room → joins socket room
  Patient opens same Room → joins socket room
  Socket server emits "user:joined" to both
          │
  Doctor clicks "Start Consultation"
  peer.getOffer() → creates SDP offer (codec/media info)
  socket.emit("consultation:start", { offer, to: patientSocketId })
          │
  Patient receives offer → peer.getAnswer(offer)
  socket.emit("consultation:accepted", { ans, to: doctorSocketId })
          │
  Doctor: peer.setLocalDescription(ans)
  ICE candidates exchanged (NAT traversal)
          │
  P2P connection established ← video streams directly between browsers
  myStream.getTracks() → peer.peer.addTrack(track, myStream)
  Remote "track" event fires → setRemoteStream(ev.streams[0])
  ReactPlayer renders both streams

FEATURES DURING CALL:
  Mute/unmute audio toggle
  Turn video on/off toggle
  In-call text chat (via Socket.io, not P2P)
  Doctor-only consultation notes textarea
  Live consultation timer (ms → hh:mm:ss)
  Leave consultation → navigate to dashboard
```

---

# 9. RAZORPAY PAYMENT + ACCESS CODE FLOW

```
User wants AI Predictions
        │
        ▼
Clicks "Pay to Unlock" → Razorpay checkout opens
        │
        ▼
User pays → Razorpay sends:
  razorpay_order_id, razorpay_payment_id, razorpay_signature
        │
        ▼
POST /api/payment/verify
  body = order_id + "|" + payment_id
  expectedSig = HMAC-SHA256(body, RAZORPAY_API_SECRET)
  if expectedSig === razorpay_signature → AUTHENTIC
        │
        ▼
Generate 4-digit access code (Math.random)
Save to MongoDB: { order_id, payment_id, signature, accessCode }
Redirect to /paymentsuccess?accessCode=XXXX
        │
        ▼
User enters code on AI Predictions page
POST /api/payment/verify-code { accessCode }
  → Payment.findOne({ accessCode })
  → if found → { success: true } → unlock predictions
```

---

# 10. DATABASE SCHEMA

```
MongoDB Collections:

users
┌──────────────────────────────────────────────────────┐
│ _id          ObjectId                                 │
│ name         String (max 50)                         │
│ email        String (unique, lowercase)              │
│ password     String (bcrypt hashed, select:false)    │
│ googleId     String (optional, for OAuth)            │
│ role         enum: ['user', 'doctor', 'admin']       │
│ createdAt    Date                                     │
│ updatedAt    Date                                     │
└──────────────────────────────────────────────────────┘

records
┌──────────────────────────────────────────────────────┐
│ _id          ObjectId                                 │
│ userId       ObjectId → ref: User                    │
│ filename     String                                   │
│ fileType     String (MIME type)                      │
│ text         String (OCR extracted or 'Uploaded')    │
│ filePath     String (relative path in uploads/)      │
│ doctorNotes  Array of:                               │
│   ├── doctorId   ObjectId → ref: User                │
│   ├── note       String                              │
│   ├── status     enum: ['active', 'archived']        │
│   └── createdAt  Date                                │
│ createdAt    Date                                     │
└──────────────────────────────────────────────────────┘

payments (RazorPay module)
┌──────────────────────────────────────────────────────┐
│ _id                  ObjectId                         │
│ razorpay_order_id    String                          │
│ razorpay_payment_id  String                          │
│ razorpay_signature   String                          │
│ accessCode           String (4-digit)                │
└──────────────────────────────────────────────────────┘
```

---

# 11. FRONTEND COMPONENT TREE

```
App.jsx (React Router v6)
│
├── / → Home.jsx
├── /login → Login.jsx (local + Google OAuth button)
├── /register → Register.jsx
├── /oauth-success → OAuthSuccess.jsx
│
├── [Protected Routes — requires JWT in Redux store]
│   ├── /dashboard → PatientDashboard.jsx
│   ├── /doctor-dashboard → DoctorDashboard.jsx (doctor only)
│   ├── /admin → AdminDashboard.jsx (admin only)
│   │
│   ├── /health-vault → HealthVault.jsx
│   │   └── HealthRecords.jsx (upload + view)
│   │
│   ├── /predictions → HealthPredictionPage.jsx
│   │   ├── AccessCodeEntryPage.jsx (payment gate)
│   │   ├── HealthDomainSelector.jsx
│   │   ├── DiabetesForm.jsx
│   │   ├── CardiovascularForm.jsx
│   │   ├── KidneyForm.jsx
│   │   ├── LiverForm.jsx
│   │   ├── MentalHealthForm.jsx
│   │   └── ResultsDisplay.jsx
│   │
│   ├── /video → VideoConsultation.jsx
│   │   └── Room.jsx (WebRTC + Socket.io)
│   │
│   ├── /assistant → HealthAssistant.jsx (ElevenLabs AI)
│   └── /shop → ShopNow.jsx → Cart.jsx → Checkout.jsx
│
└── /about, /blog, /careers, /contact, /privacy, /terms

Redux Store (authSlice.js):
  state: { user, token, isAuthenticated }
  actions: setCredentials, logout
```

---

# 12. API ENDPOINTS MAP

```
NODE.JS BACKEND:

AUTH
  POST  /api/auth/register          Local registration
  POST  /api/auth/login             Local login
  POST  /api/auth/google            Google OAuth (token verify)
  GET   /api/auth/google/callback   Google OAuth server-side
  POST  /api/auth/link-google       Link Google to existing account

RECORDS
  POST  /api/records/upload         Upload health record (Multer)
  GET   /api/records/all            All patients + records (doctor only)
  GET   /api/records/:uid           Records for specific user

VIDEO
  GET   /api/video/token            Get video session token

PAYMENT
  POST  /api/payment/checkout       Create Razorpay order
  POST  /api/payment/verify         Verify HMAC signature + generate code
  POST  /api/payment/verify-code    Validate access code

FLASK AI SERVICE:
  GET   /domains                    List available prediction domains
  POST  /predict/<domain>           Run ML prediction (sklearn)
  POST  /api/ai/predict-risk        LSTM risk score
  POST  /ocr                        Extract text from PDF/image
```

---

# 13. SECURITY IMPLEMENTATION

```
1. AUTHENTICATION
   JWT (7-day expiry) → stored in Redux / localStorage
   bcrypt salt rounds = 12 (~250ms per hash, brute-force resistant)
   Password field: select:false → never returned in queries

2. AUTHORIZATION
   Every protected route → verifyToken middleware
   Role checks → roleCheck(['doctor']) middleware
   Patient data isolation → userId match check in controller

3. API SECURITY
   helmet()      → sets secure HTTP headers (XSS, clickjacking, etc.)
   rate limiting → 100 requests per 15 minutes per IP
   CORS          → whitelist only known origins
   Body limit    → 10kb (prevents large payload attacks)

4. PAYMENT SECURITY
   HMAC-SHA256 signature verification (server-side secret)
   Never expose RAZORPAY_API_SECRET to frontend
   Access code system → prevents unauthorized AI access

5. GOOGLE OAUTH
   ID token verified server-side via google-auth-library
   Never trust client-side Google data directly
```

---

# 14. TECH STACK TABLE

```
┌──────────────────────┬──────────────────────────────┬──────────────────┐
│ Layer                │ Technology                   │ Purpose          │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Frontend             │ React.js + Vite              │ UI framework     │
│                      │ Redux Toolkit                │ State management │
│                      │ React Router v6              │ Client routing   │
│                      │ Lucide React                 │ Icons            │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Backend              │ Node.js + Express            │ REST API         │
│                      │ Mongoose                     │ MongoDB ODM      │
│                      │ JWT (jsonwebtoken)           │ Auth tokens      │
│                      │ bcryptjs                     │ Password hashing │
│                      │ Multer                       │ File uploads     │
│                      │ Helmet + rate-limit          │ Security         │
│                      │ Morgan                       │ HTTP logging     │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Real-time            │ Socket.io                    │ WebRTC signaling │
│                      │ WebRTC (browser native API)  │ P2P video/audio  │
│                      │ ReactPlayer                  │ Video rendering  │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ AI / ML              │ Flask + scikit-learn         │ 5 disease models │
│                      │ TensorFlow / Keras LSTM      │ Risk prediction  │
│                      │ Tesseract OCR                │ Image text       │
│                      │ PyMuPDF (fitz)               │ PDF text         │
│                      │ ElevenLabs Voice API         │ Voice assistant  │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Database             │ MongoDB Atlas                │ All data         │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Auth                 │ Google OAuth 2.0             │ Social login     │
│                      │ google-auth-library          │ Token verify     │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Payments             │ Razorpay                     │ Payment gateway  │
├──────────────────────┼──────────────────────────────┼──────────────────┤
│ Hosting              │ Netlify                      │ Frontend         │
│                      │ AWS / Render                 │ Backend          │
└──────────────────────┴──────────────────────────────┴──────────────────┘
```

---

# 15. KEY DESIGN DECISIONS (Interview Questions)

## Q: Why WebRTC instead of Agora/Twilio?
```
WebRTC = P2P, no video data touches the server.
Better privacy for medical consultations (HIPAA-relevant).
Free — no per-minute charges like Agora/Twilio.
Socket.io only handles tiny signaling messages, not video.
```

## Q: Why Flask for AI instead of Node.js?
```
Python has the best ML ecosystem: scikit-learn, TensorFlow, pandas.
Node.js has no equivalent for .pkl model loading or Tesseract OCR.
Flask runs as a separate microservice → Node.js proxies to it.
Microservices pattern: each service does what it's best at.
```

## Q: Why Razorpay access code for AI predictions?
```
Monetization gate: AI predictions are a premium feature.
HMAC-SHA256 signature verification prevents fake payment claims.
4-digit code stored in MongoDB → verified on each use.
```

## Q: Why bcrypt salt=12?
```
Salt rounds = 2^12 = 4096 hash iterations.
~250ms per hash — slow enough to resist brute-force,
fast enough for real users. Industry standard is 10-12.
```

## Q: How does the LSTM model work here?
```
LSTM normally processes time-series sequences.
Here: single reading tiled 5× → shape (1, 5, 6).
This satisfies the LSTM input format for a single snapshot.
Output: risk score 0.0–1.0 → Low/Medium/High.
```

## Q: Why select:false on password field?
```
Mongoose select:false means the password field is NEVER
returned in any query unless you explicitly add .select('+password').
This prevents accidentally leaking hashed passwords in API responses.
```

## Q: What is the microservices pattern here?
```
Node.js backend handles: auth, records, routing, business logic
Flask AI service handles: ML predictions, OCR, LSTM
Socket.io server handles: WebRTC signaling, real-time chat
RazorPay module handles: payment processing

Each service is independently deployable and does one thing well.
```

---

# 16. END-TO-END USER JOURNEY

```
NEW PATIENT:
  1. Visit medixpert.netlify.app
  2. Register (email/password or Google OAuth)
  3. JWT token stored in Redux → logged in as 'user'
  4. Upload lab report PDF → OCR extracts text → saved to MongoDB
  5. Pay via Razorpay → get 4-digit access code
  6. Enter access code → AI Predictions unlocked
  7. Fill Diabetes form → Flask returns risk score + level
  8. Book video consultation → join Room with doctor
  9. WebRTC P2P video call → doctor adds notes to record
  10. Buy medicines from ShopNow → cart → checkout

DOCTOR:
  1. Register with role='doctor'
  2. Login → DoctorDashboard
  3. See all patients and their uploaded records
  4. Join video consultation room
  5. Add notes to patient records during/after call
  6. Use DoctorAssistant AI tool
```

---

# 17. QUICK 60-SECOND SUMMARY FOR INTERVIEW

```
"MediVerse is a full-stack telehealth platform I built with
React, Node.js, MongoDB, and a Python Flask AI microservice.

It has three user roles — patient, doctor, and admin —
enforced by JWT authentication and role-based middleware.

Patients can upload health records (PDFs and images),
which get OCR-processed using Tesseract and PyMuPDF.
They can consult doctors live via WebRTC peer-to-peer
video calls, with Socket.io handling the signaling.

The AI prediction module uses 5 scikit-learn models
trained on medical datasets to predict risk for diabetes,
cardiovascular disease, liver disease, kidney disease,
and mental health. There's also an LSTM model for
general health risk scoring. This feature is gated
behind a Razorpay payment with HMAC signature verification.

The health assistant supports text and voice input
powered by ElevenLabs Voice API.

Deployed on Netlify (frontend), AWS/Render (backend),
MongoDB Atlas (database)."
```

---

*Good luck with your interview!*
