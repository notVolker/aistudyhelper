export const summarizeText = async (text) => {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Glade'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [
          {
            role: 'user',
            content: `You are an expert study assistant. Please summarize the following study notes in a clear, concise way. Focus on the main concepts and key points.

Study Notes:
${text}

Summary:`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to generate summary');
    }

    const summary = data.choices[0].message.content;
    return summary;

  } catch (error) {
    console.error('Detailed error:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
};