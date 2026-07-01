# 💗 GymHub Women — AI-Powered Private Fitness Capsule

> **AMD Developer Hackathon: ACT II — Track 3 Unicorn** · July 6–11, 2026

[![AMD MI300X](https://img.shields.io/badge/AMD-MI300X%20GPU-ED1C24?style=for-the-badge&logo=amd)](https://developer.amd.com)
[![Fireworks AI](https://img.shields.io/badge/Fireworks%20AI-LLaMA%203.1%2070B-FF6B35?style=for-the-badge)](https://fireworks.ai)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)](https://docker.com)

---

## 🌟 What is GymHub Women?

**GymHub Women** is the world's first AI-powered **private fitness capsule** designed exclusively for women — launched in Dubai, UAE.

Each GymHub capsule is a **2m × 2m × 2.5m private pod** containing:
- 🪞 **Instagram Selfie Mirror** — full-height LED ring light, story-mode width
- 🤖 **AI Body Sculpt Coach** — holographic body scan, 4-week transformation predictions
- 🏋️ **Smart Gym Equipment** — cyber-futuristic resistance machines
- 🚿 **Luxury Rain Shower** — neon rose, vapor, spa experience
- 📺 **27" AI Touchscreen** — 3D muscle map, live workout guidance
- 🔒 **Total Privacy Pod** — camera-free zone, women only

### 🎯 The Problem We Solve

In Dubai and across the GCC, **67% of women avoid public gyms** due to:
- Lack of privacy and comfort
- Judgment from others
- Inconvenient locations
- No personalization

**GymHub Women = private + AI-powered + on-demand.**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   GymHub Women App                   │
├──────────────────────┬──────────────────────────────┤
│    Frontend (React)  │    Backend (FastAPI + Python) │
│    Nginx :3000       │    Uvicorn :8000              │
│                      │                               │
│  ┌─────────────┐     │  ┌──────────────────────┐    │
│  │ AI Coach UI │────▶│  │  Fireworks AI API    │    │
│  │ Workout     │     │  │  LLaMA 3.1 70B       │    │
│  │ Sessions    │     │  │  AMD MI300X GPU      │    │
│  │ Capsule     │     │  └──────────────────────┘    │
│  │ Explorer    │     │                               │
│  │ Taxi Book   │     │  POST /api/generate-workout  │
│  └─────────────┘     │  POST /api/ai-coach          │
└──────────────────────┴──────────────────────────────┘
```

### AMD × Fireworks AI Integration

The AI Coach backend runs **LLaMA 3.1 70B** on **AMD MI300X GPU** hardware via Fireworks AI:

1. **`POST /api/generate-workout`** — Takes user profile (goal, fitness level, energy, menstrual cycle phase) → generates a fully personalized 5-exercise workout via LLM inference
2. **`POST /api/ai-coach`** — Real-time coaching tips after each exercise set, powered by AMD GPU inference

**Why AMD MI300X?**
- 192GB HBM3 memory → perfect for large LLM inference
- Fireworks AI hosts LLaMA 3.1 70B on AMD hardware at blazing speed
- <300ms inference latency for real-time coaching feedback

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Fireworks AI API key ([get FREE credits at fireworks.ai](https://fireworks.ai))

### 1. Clone & Configure

```bash
git clone https://github.com/your-username/gymhub-women.git
cd gymhub-women

# Set your Fireworks AI API key
cp .env.example .env
# Edit .env and add your FIREWORKS_API_KEY
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

🎉 App running at: **http://localhost:3000**
📡 API docs at: **http://localhost:8000/docs**

### 3. Test the AI API

```bash
# Health check
curl http://localhost:8000/api/health

# Generate a workout
curl -X POST http://localhost:8000/api/generate-workout \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Irina",
    "goal": "strength",
    "level": "intermediate",
    "energy": 4,
    "cyclePhase": "follicular",
    "duration": 30
  }'
```

---

## 📱 App Features

### User Journey

```
Welcome → Band Pairing → Onboarding → AI Generating → Workout Session → Post-Workout
```

| Screen | What Happens |
|--------|-------------|
| 🌸 **Welcome** | Dark neon-pink hero, GymHub branding |
| 📡 **Band Pairing** | Bluetooth fitness band connection (rep tracking) |
| 🎯 **Onboarding** | Goal, level, energy (1–5), cycle phase, duration |
| 🧠 **AI Generating** | AMD MI300X + Fireworks AI generates personalized plan |
| 💪 **Workout Session** | Live reps with band alerts + AI coaching tips |
| 🎊 **Post-Workout** | Stats + FREE first class + FREE taxi to nearest capsule |

### AI-Powered Features

- **Cycle-Synced Workouts** — workout intensity adapts to follicular/ovulation/luteal/menstrual phase
- **Energy-Aware** — rep count and sets adjust to daily energy level (1–5)
- **Real-Time Rep Alerts** — Bluetooth band triggers vibration + audio at target reps
- **Live AI Tips** — LLaMA 3.1 70B generates coaching cues after each set
- **Muscle Heatmap** — animated SVG body showing activated muscles per exercise

### GymHub Capsule Explorer

Tap the capsule card during workout → full cinematic presentation of:
- 6 capsule systems with AI-generated futuristic images
- 🌸 **YOGA BONUS** — book a free session with Angela L. from Venice, Italy 🇮🇹
- Dubai taxi booking flow (real-time driver confirmation animation)
- **FREE first class** + **FREE taxi** to nearest GymHub capsule

---

## 📊 Real Traction (Not Just a Hackathon Project)

| Metric | Value |
|--------|-------|
| 📱 Instagram followers | **15,800** |
| 📋 Waitlist | **450+ women** |
| 💰 Seed round target | **EUR 500,000** |
| 🏆 Accelerators | Hub71 · in5 · TiE MENA |
| 🌍 Launch market | Dubai, UAE |
| 🏗️ Competitors in market | **0** |
| 💎 Customer LTV | AED 3,200 (~$870) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI Inference** | Fireworks AI API — LLaMA 3.1 70B on AMD MI300X |
| **Frontend** | React 19 + TypeScript |
| **Backend** | FastAPI + Python 3.12 |
| **Styling** | Tailwind CSS v4 + DaisyUI v5 |
| **Container** | Docker + Nginx |
| **Bluetooth** | Web Bluetooth API (fitness band integration) |

---

## 📁 Project Structure

```
gymhub-women/
├── 📄 index.html              # App entry point
├── 📦 bundle.js               # Compiled React app
├── 🎨 styles.css              # Neon-pink dark theme
├── 🐳 Dockerfile              # Frontend container (nginx)
├── 🐳 docker-compose.yml      # Full stack orchestration
├── ⚙️  nginx.conf              # Reverse proxy + API routing
├── 📖 README.md               # This file
├── 🖼️  *.png                   # AI-generated images
│
├── components/
│   ├── Welcome.tsx            # Landing screen
│   ├── BandPairing.tsx        # Bluetooth band setup
│   ├── Onboarding.tsx         # User profile & goals
│   ├── AIGenerating.tsx       # AMD × Fireworks AI screen ⭐
│   ├── WorkoutSession.tsx     # Live workout + rep tracking
│   ├── PostWorkout.tsx        # Results + capsule CTA
│   ├── CapsuleExplainer.tsx   # Cinematic capsule tour
│   ├── MuscleMap.tsx          # Animated SVG muscle heatmap
│   └── ExerciseDemo.tsx       # Exercise animation library
│
└── backend/
    ├── main.py                # FastAPI + Fireworks AI ⭐
    ├── requirements.txt
    └── Dockerfile
```

---

## 🎯 Why GymHub Women Wins Track 3 (Unicorn Track)

**Track 3 is about real startup potential + AMD innovation.** GymHub Women delivers both:

### ✅ AMD Infrastructure — Real Usage
- Backend calls Fireworks AI API (AMD MI300X GPU cloud) for every workout
- LLaMA 3.1 70B processes cycle phase + energy data → personalized fitness plans
- Real-time inference (<300ms) for live coaching tips during workouts

### ✅ Genuine Market Opportunity
- Dubai's wellness market: **$2.4B** and growing 12% YoY
- Zero direct competitors for women-only AI fitness pods in GCC
- Physical infrastructure + AI software = defensible moat

### ✅ Technical Completeness
- Full working demo (frontend + backend containerized)
- Bluetooth hardware integration
- AI-personalized workouts (not just a chatbot)
- Real booking flow (taxi + class)

### ✅ Traction & Credibility
- 450+ waitlist before launch
- Top-tier accelerator backing (Hub71, in5, TiE MENA)
- Real founder, real vision, real numbers

---

## 👩‍💻 Team

**Irina Kopitova** — Founder & CEO, GymHub Women  
📧 irina.kopitova1410@gmail.com  
📱 Instagram: [@gymhubwomen](https://instagram.com/gymhubwomen)  
🌐 Dubai, UAE

---

## 📜 License

MIT License — Built with 💗 for the AMD Developer Hackathon ACT II

---

*"Every woman deserves a private space to transform herself. AI makes it personal. AMD makes it fast."*
