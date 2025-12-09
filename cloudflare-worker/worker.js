/**
 * Cloudflare Worker for K.E.R.N.E.L. - Shreyas's AI Chatbot
 * Proxies requests to Groq API
 *
 * Environment Variables Required:
 * - GROQ_API_KEY: Your Groq API key
 * - SYSTEM_PROMPT: The system prompt for the AI (kept private)
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const { message, history = [] } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Build messages for Groq (OpenAI-compatible format)
      const messages = [
        {
          role: 'system',
          content: env.SYSTEM_PROMPT
        }
      ];

      // Add conversation history
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }

      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      // Call Groq API
      const groqResponse = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'qwen/qwen3-32b',
            messages: messages,
            temperature: 0.5,
            max_tokens: 500,
            reasoning_effort: 'none'
          }),
        }
      );

      if (!groqResponse.ok) {
        const error = await groqResponse.text();
        console.error('Groq API error:', error);
        return new Response(JSON.stringify({ error: 'AI service error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const data = await groqResponse.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
