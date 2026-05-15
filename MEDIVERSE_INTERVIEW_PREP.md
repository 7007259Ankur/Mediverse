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
