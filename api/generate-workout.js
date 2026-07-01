export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goals, fitnessLevel, cyclePhase, duration } = req.body || {};
  const apiKey = process.env.FIREWORKS_API_KEY;

  if (!apiKey) {
    // Fallback workout if no API key
    return res.json(getFallbackWorkout(goals, fitnessLevel));
  }

  try {
    const prompt = `You are an elite AI personal trainer for GymHub Women — a luxury women-only fitness capsule in Dubai.
Generate a personalized ${duration || 45}-minute workout for:
- Goal: ${goals || 'Build Strength'}
- Fitness Level: ${fitnessLevel || 'Intermediate'}
- Cycle Phase: ${cyclePhase || 'follicular'}

Return JSON with this exact structure:
{
  "workoutName": "...",
  "duration": ${duration || 45},
  "exercises": [
    {"name": "...", "sets": 3, "reps": "12", "rest": 60, "muscleGroup": "...", "tip": "..."}
  ],
  "warmup": ["...", "..."],
  "cooldown": ["...", "..."],
  "motivationalMessage": "..."
}`;

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const workout = JSON.parse(jsonMatch[0]);
      return res.json(workout);
    }
    return res.json(getFallbackWorkout(goals, fitnessLevel));
  } catch (err) {
    console.error('Fireworks AI error:', err);
    return res.json(getFallbackWorkout(goals, fitnessLevel));
  }
}

function getFallbackWorkout(goals, level) {
  return {
    workoutName: goals === 'Fat Loss' ? 'Dubai Burn Circuit' : goals === 'Endurance' ? 'Endurance Power Flow' : 'GymHub Power Session',
    duration: 45,
    exercises: [
      { name: 'Sumo Squat', sets: 4, reps: '12', rest: 60, muscleGroup: 'Glutes', tip: 'Drive through your heels' },
      { name: 'Hip Thrust', sets: 3, reps: '15', rest: 60, muscleGroup: 'Glutes', tip: 'Squeeze at the top' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: 90, muscleGroup: 'Hamstrings', tip: 'Keep back flat' },
      { name: 'Lateral Raises', sets: 3, reps: '15', rest: 45, muscleGroup: 'Shoulders', tip: 'Control the descent' },
      { name: 'Plank Hold', sets: 3, reps: '45sec', rest: 30, muscleGroup: 'Core', tip: 'Breathe steadily' }
    ],
    warmup: ['5 min light cardio', 'Hip circles x 10', 'Leg swings x 10 each side'],
    cooldown: ['Child\'s pose 60s', 'Hip flexor stretch 30s each', 'Hamstring stretch 30s each'],
    motivationalMessage: 'You are unstoppable, queen! 💪🌸 Dubai\'s elite are training right now — let\'s go!'
  };
}
