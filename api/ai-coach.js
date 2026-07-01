export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, context } = req.body || {};
  const apiKey = process.env.FIREWORKS_API_KEY;

  if (!apiKey) {
    return res.json({ reply: "Keep pushing! You're doing amazing. 💗 I'm your AI coach — powered by AMD MI300X + LLaMA 3.1 70B. Let's smash this workout!" });
  }

  try {
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
        messages: [
          { role: 'system', content: 'You are an elite AI fitness coach for GymHub Women Dubai. Be motivating, concise (1-2 sentences), empowering, and use emojis. You run on AMD MI300X.' },
          { role: 'user', content: message || 'Motivate me!' }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });
    const data = await response.json();
    return res.json({ reply: data.choices?.[0]?.message?.content || 'You\'re a champion! 💪🌸' });
  } catch (err) {
    return res.json({ reply: 'Keep pushing queen! 💗🔥' });
  }
}
