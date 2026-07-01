"""
GymHub Women — AI Coach Backend
AMD Developer Hackathon: ACT II — Track 3 Unicorn
Powered by Fireworks AI API (AMD MI300X GPU cloud)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gymhub")

app = FastAPI(
    title="GymHub Women — AI Coach API",
    description="AMD × Fireworks AI powered personal fitness coach for women",
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
# LLaMA 3.1 70B on AMD MI300X GPU via Fireworks AI
MODEL = "accounts/fireworks/models/llama-v3p1-70b-instruct"


class WorkoutRequest(BaseModel):
    name: str
    goal: str          # "strength" | "fat-loss" | "endurance"
    level: str         # "beginner" | "intermediate" | "advanced"
    energy: int        # 1-5
    cyclePhase: str    # "follicular" | "ovulation" | "luteal" | "menstrual"
    duration: int      # minutes


class CoachMessageRequest(BaseModel):
    userName: str
    exerciseName: str
    muscleGroup: str
    repsCompleted: int
    energyLevel: int


CYCLE_CONTEXT = {
    "follicular": "Her follicular phase (days 1-13): estrogen rising, optimal for high-intensity strength training and building muscle.",
    "ovulation":  "Her ovulation phase (day 14): peak power and strength, ideal for maximum effort and heavy compound movements.",
    "luteal":     "Her luteal phase (days 15-28): progesterone high, focus on moderate intensity, avoid overtraining, prioritize recovery.",
    "menstrual":  "Her menstrual phase (days 1-5): lower energy, focus on gentle movement, yoga flows, and light strength work.",
}


WORKOUT_SYSTEM_PROMPT = """You are the GymHub Women AI Coach — an elite fitness AI running on AMD MI300X GPU hardware via Fireworks AI.

You create highly personalized workout plans for women that are:
1. Cycle-synced (adapted to menstrual cycle phase)
2. Energy-aware (scaled to current energy level 1-5)
3. Goal-focused (strength/fat-loss/endurance)
4. Level-appropriate (beginner/intermediate/advanced)

You MUST respond ONLY with valid JSON. No markdown, no explanation, just JSON.

Output format:
{
  "greeting": "Short personalized message (1 sentence, motivational)",
  "model_info": "AMD MI300X × Fireworks AI LLaMA-3.1-70B",
  "exercises": [
    {
      "name": "Exercise Name",
      "icon": "emoji",
      "muscleGroup": "Muscle Group",
      "reps": 15,
      "sets": 3,
      "rest": 45,
      "tip": "Short form cue (max 8 words)"
    }
  ]
}

Generate exactly 5 exercises. Use fun, empowering exercise names."""


@app.get("/api/health")
async def health():
    return {
        "status": "🟢 online",
        "model": MODEL,
        "infrastructure": "AMD MI300X GPU via Fireworks AI",
        "app": "GymHub Women — AI Coach",
        "hackathon": "AMD Developer Hackathon ACT II — Track 3 Unicorn",
    }


@app.post("/api/generate-workout")
async def generate_workout(req: WorkoutRequest):
    if not FIREWORKS_API_KEY:
        logger.warning("No FIREWORKS_API_KEY set — using fallback")
        return _fallback_workout(req)

    cycle_ctx = CYCLE_CONTEXT.get(req.cyclePhase, "")
    energy_desc = ["very low", "low", "moderate", "high", "peak"][req.energy - 1]

    user_prompt = f"""Create a personalized workout for {req.name}:
- Goal: {req.goal}
- Level: {req.level}
- Energy today: {energy_desc} ({req.energy}/5)
- Session duration: {req.duration} minutes
- Cycle context: {cycle_ctx}

Generate 5 exercises perfectly suited to her profile."""

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{FIREWORKS_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {FIREWORKS_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": WORKOUT_SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 800,
                    "temperature": 0.7,
                    "response_format": {"type": "json_object"},
                },
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            result = json.loads(content)
            logger.info(f"✅ AI workout generated for {req.name} via Fireworks AI AMD GPU")
            return result

    except Exception as e:
        logger.error(f"Fireworks AI error: {e} — using fallback")
        return _fallback_workout(req)


@app.post("/api/ai-coach")
async def ai_coach_message(req: CoachMessageRequest):
    """Real-time AI coaching tip during workout."""
    if not FIREWORKS_API_KEY:
        return _fallback_tip(req)

    prompt = f"""{req.userName} just completed {req.repsCompleted} reps of {req.exerciseName} targeting {req.muscleGroup}. Energy level: {req.energyLevel}/5.

Give her ONE short, powerful coaching message (max 15 words). Be specific, technical, and empowering. Include a relevant emoji."""

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{FIREWORKS_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {FIREWORKS_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": "You are an elite women's fitness coach. Give ultra-concise, powerful coaching cues."},
                        {"role": "user", "content": prompt},
                    ],
                    "max_tokens": 60,
                    "temperature": 0.8,
                },
            )
            response.raise_for_status()
            data = response.json()
            tip = data["choices"][0]["message"]["content"].strip()
            return {"tip": tip, "source": "AMD MI300X × Fireworks AI"}
    except Exception as e:
        logger.error(f"AI coach error: {e}")
        return _fallback_tip(req)


def _fallback_workout(req: WorkoutRequest):
    """Fallback when API key not set (demo mode)."""
    workouts = {
        "strength": [
            {"name": "Power Squat Pulses", "icon": "🦵", "muscleGroup": "Glutes & Quads", "reps": 20, "sets": 3, "rest": 45, "tip": "Drive through heels, chest tall"},
            {"name": "Hip Thrust Holds", "icon": "🍑", "muscleGroup": "Glutes", "reps": 15, "sets": 3, "rest": 45, "tip": "Squeeze glutes at the top"},
            {"name": "Romanian Deadlift", "icon": "🏋️", "muscleGroup": "Hamstrings", "reps": 12, "sets": 3, "rest": 60, "tip": "Hinge at hips, neutral spine"},
            {"name": "Push-Up Holds", "icon": "💪", "muscleGroup": "Chest & Triceps", "reps": 10, "sets": 3, "rest": 45, "tip": "Core tight, elbows 45°"},
            {"name": "Lateral Band Walks", "icon": "🦵", "muscleGroup": "Inner Thighs", "reps": 15, "sets": 3, "rest": 30, "tip": "Toes forward, resist band"},
        ],
        "fat-loss": [
            {"name": "Jump Squats", "icon": "⚡", "muscleGroup": "Full Body", "reps": 20, "sets": 3, "rest": 30, "tip": "Land soft, explode up"},
            {"name": "Burpee Flow", "icon": "🔥", "muscleGroup": "Full Body", "reps": 10, "sets": 3, "rest": 45, "tip": "Fast, controlled, breathe"},
            {"name": "Mountain Climbers", "icon": "🏃", "muscleGroup": "Core & Cardio", "reps": 30, "sets": 3, "rest": 30, "tip": "Hips level, drive knees"},
            {"name": "High Knee Sprints", "icon": "💨", "muscleGroup": "Cardio", "reps": 40, "sets": 3, "rest": 30, "tip": "Pump arms hard"},
            {"name": "Plank to Push-Up", "icon": "🎯", "muscleGroup": "Core & Chest", "reps": 12, "sets": 3, "rest": 45, "tip": "No hip rotation"},
        ],
        "endurance": [
            {"name": "Walking Lunges", "icon": "🚶", "muscleGroup": "Legs", "reps": 20, "sets": 3, "rest": 30, "tip": "Step wide, torso tall"},
            {"name": "Box Step-Ups", "icon": "👟", "muscleGroup": "Glutes & Legs", "reps": 15, "sets": 3, "rest": 30, "tip": "Press heel into box"},
            {"name": "Skater Hops", "icon": "⛸️", "muscleGroup": "Cardio", "reps": 20, "sets": 3, "rest": 30, "tip": "Reach arm across body"},
            {"name": "Side Plank Hip Dips", "icon": "🌊", "muscleGroup": "Core", "reps": 15, "sets": 3, "rest": 30, "tip": "Stack feet, lift hips"},
            {"name": "Pace Runs", "icon": "💨", "muscleGroup": "Cardio", "reps": 30, "sets": 3, "rest": 30, "tip": "Find your rhythm"},
        ],
    }
    exercises = workouts.get(req.goal, workouts["strength"])
    energy_mult = 1.2 if req.energy >= 4 else (0.7 if req.energy <= 2 else 1.0)
    sets = 4 if req.level == "advanced" else (3 if req.level == "intermediate" else 2)
    adjusted = [dict(ex, reps=round(ex["reps"] * energy_mult), sets=sets) for ex in exercises]
    return {
        "greeting": f"Your AI workout is ready, {req.name}! Let's crush it today 💗",
        "model_info": "Demo mode — connect FIREWORKS_API_KEY for AMD GPU inference",
        "exercises": adjusted,
    }


def _fallback_tip(req: CoachMessageRequest):
    tips = [
        f"💪 Amazing form, {req.userName}! Keep that core tight!",
        f"🔥 {req.repsCompleted} reps! Your {req.muscleGroup} is on fire!",
        f"⚡ Power through! You're stronger than you think!",
        f"🎯 Perfect! Feel that {req.muscleGroup} burn — that's growth!",
        f"✨ Incredible effort! Rest 45s then GO again!",
    ]
    import random
    return {"tip": random.choice(tips), "source": "demo-mode"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
