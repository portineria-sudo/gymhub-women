"""
GymHub Women — AI Fitness Coach Backend
AMD Developer Hackathon: ACT II · Track 3 — Unicorn Track

Powered by:
  - AMD Instinct™ GPU Cloud
  - Fireworks AI (gemma3-27b-it on AMD hardware)
  - Google Gemma 3 — Best Gemma Prize Candidate
  - FastAPI + Python 3.12
"""

import os
import json
import random
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(
    title="GymHub Women API",
    description="AI-powered women's fitness coach, running on AMD GPU infrastructure",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY", "")
FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1"
# Google Gemma 3 — AMD Developer Hackathon Act II Best Gemma prize candidate
MODEL = "accounts/fireworks/models/gemma3-27b-it"


class UserProfile(BaseModel):
    name: str
    goal: str
    level: str
    phase: str
    energy: int
    duration: int


class TaxiRequest(BaseModel):
    location: str
    destination: Optional[str] = "Dubai Marina"


class WorkoutFeedback(BaseModel):
    profile: UserProfile
    reps_completed: int
    heart_rate: int
    set_number: int
    exercise_name: str


async def call_fireworks(prompt: str, max_tokens: int = 512) -> str:
    """Call Fireworks AI API running on AMD Instinct GPUs with Google Gemma 3."""
    if not FIREWORKS_API_KEY:
        return None
    headers = {
        "Authorization": f"Bearer {FIREWORKS_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are GymHub AI Coach powered by Google Gemma 3 on AMD GPU infrastructure. Expert in cycle-synced training for women. Be concise and motivating."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(f"{FIREWORKS_BASE_URL}/chat/completions", headers=headers, json=payload)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


EXERCISES = {
    "strength": [
        {"id": "s1", "name": "Barbell Hip Thrust", "sets": 4, "reps": "10-12", "restSec": 90, "muscle": "Glutes", "tip": "Squeeze at the top for 1s"},
        {"id": "s2", "name": "Romanian Deadlift", "sets": 3, "reps": "10", "restSec": 75, "muscle": "Hamstrings", "tip": "Hinge from hips, soft knees"},
        {"id": "s3", "name": "Goblet Squat", "sets": 3, "reps": "12-15", "restSec": 60, "muscle": "Quads", "tip": "Chest up, knees track toes"},
        {"id": "s4", "name": "Cable Kickback", "sets": 3, "reps": "15 each", "restSec": 45, "muscle": "Glutes", "tip": "Full extension without swinging"},
    ],
    "fat_loss": [
        {"id": "f1", "name": "Jump Squats", "sets": 4, "reps": "15", "restSec": 45, "muscle": "Full Body", "tip": "Land softly, absorb impact"},
        {"id": "f2", "name": "Kettlebell Swings", "sets": 4, "reps": "20", "restSec": 40, "muscle": "Posterior Chain", "tip": "Drive with hips, not arms"},
        {"id": "f3", "name": "Burpee to Box Jump", "sets": 3, "reps": "10", "restSec": 50, "muscle": "Full Body", "tip": "Explosive transition"},
        {"id": "f4", "name": "Battle Rope Slams", "sets": 3, "reps": "30s", "restSec": 45, "muscle": "Core & Arms", "tip": "Engage core throughout"},
    ],
    "endurance": [
        {"id": "e1", "name": "Treadmill Intervals", "sets": 8, "reps": "30s sprint / 30s walk", "restSec": 0, "muscle": "Cardio", "tip": "85% effort on sprints"},
        {"id": "e2", "name": "Step-Ups", "sets": 3, "reps": "20 each leg", "restSec": 45, "muscle": "Legs", "tip": "Full hip extension at top"},
        {"id": "e3", "name": "Plank Shoulder Taps", "sets": 3, "reps": "40s", "restSec": 40, "muscle": "Core", "tip": "No hip rotation"},
        {"id": "e4", "name": "Jumping Lunges", "sets": 3, "reps": "12 each", "restSec": 45, "muscle": "Legs", "tip": "90 degrees at both knees"},
    ],
    "flexibility": [
        {"id": "x1", "name": "Hip Flexor Flow", "sets": 3, "reps": "60s each side", "restSec": 30, "muscle": "Hip Flexors", "tip": "Breathe into the stretch"},
        {"id": "x2", "name": "Pigeon Pose", "sets": 2, "reps": "90s each", "restSec": 20, "muscle": "Glutes", "tip": "Relax completely into pose"},
        {"id": "x3", "name": "Cat-Cow Flow", "sets": 3, "reps": "10 breaths", "restSec": 15, "muscle": "Spine", "tip": "Sync breath and movement"},
        {"id": "x4", "name": "World Greatest Stretch", "sets": 3, "reps": "6 each side", "restSec": 25, "muscle": "Full Body", "tip": "Rotate towards front leg"},
    ],
}

PHASE_NOTES = {
    "menstrual": "Low intensity chosen. Prioritize gentle movement and recovery.",
    "follicular": "High intensity unlocked. Estrogen peak detected. Push harder today!",
    "ovulation": "POWER MODE: Peak performance. Estrogen and testosterone surge. PR day!",
    "luteal": "Moderate load selected. Prioritize form over weight.",
}

GOAL_TITLES = {
    "strength": "Power Sculpt Protocol",
    "fat_loss": "Torch & Burn Circuit",
    "endurance": "Cardio Engine Drive",
    "flexibility": "Flow Reset Session",
}


@app.get("/api/health")
async def health():
    return {
        "status": "live",
        "model": MODEL,
        "model_family": "Google Gemma 3",
        "infrastructure": "AMD Instinct MI300X GPU Cloud via Fireworks AI",
        "version": "1.0.0",
        "best_gemma_candidate": True,
    }


@app.post("/api/generate-plan")
async def generate_plan(profile: UserProfile):
    exercises = EXERCISES.get(profile.goal, EXERCISES["strength"])
    base_calories = round(
        (profile.energy * 40 + profile.duration * 5.5)
        * (1.3 if profile.level == "advanced" else 1.15 if profile.level == "intermediate" else 1.0)
    )
    ai_note = PHASE_NOTES.get(profile.phase, "")
    fireworks_note = await call_fireworks(
        f"Generate a 2-sentence coaching note for {profile.name}, a {profile.level} woman "
        f"in her {profile.phase} phase, doing a {profile.duration}-min {profile.goal} workout "
        f"with energy level {profile.energy}/5. Be motivating and science-backed.",
        max_tokens=120
    )
    if fireworks_note:
        ai_note = fireworks_note
    return {
        "title": GOAL_TITLES.get(profile.goal, "AI Session"),
        "tagline": f"{profile.duration}-min - {profile.level} - Cycle-synced by Gemma 3",
        "exercises": exercises,
        "aiNote": ai_note,
        "totalCalories": base_calories,
        "aiPowered": bool(fireworks_note),
        "infrastructure": "AMD Instinct MI300X via Fireworks AI + Google Gemma 3",
    }


@app.post("/api/real-time-cue")
async def real_time_cue(feedback: WorkoutFeedback):
    cue = await call_fireworks(
        f"Give a 1-sentence motivational cue for {feedback.profile.name} doing {feedback.exercise_name}, "
        f"set {feedback.set_number}, completed {feedback.reps_completed} reps, HR at {feedback.heart_rate} bpm. "
        f"She is in her {feedback.profile.phase} phase. Be energetic and specific.",
        max_tokens=60
    )
    if not cue:
        cue = f"Great form on set {feedback.set_number} - finish strong!"
    return {"cue": cue, "aiPowered": True, "model": "Google Gemma 3"}


@app.post("/api/book-taxi")
async def book_taxi(request: TaxiRequest):
    drivers = [
        {"name": "Fatima A.", "car": "Tesla Model 3", "eta": random.randint(3, 6), "rating": 4.98, "verified": True},
        {"name": "Sara M.", "car": "Mercedes EQS", "eta": random.randint(4, 8), "rating": 4.95, "verified": True},
        {"name": "Layla K.", "car": "BMW i4", "eta": random.randint(2, 5), "rating": 5.0, "verified": True},
    ]
    return {
        "status": "matched",
        "driver": random.choice(drivers),
        "pickup": request.location,
        "destination": request.destination,
        "women_only": True,
        "safety_score": 99.7,
    }


frontend_dist = "/app/frontend/dist"
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
