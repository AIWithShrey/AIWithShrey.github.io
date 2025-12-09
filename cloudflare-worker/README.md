# AI Chatbot Cloudflare Worker Setup

This Cloudflare Worker powers the AI chatbot in Shreyas's portfolio terminal. It proxies requests to Google's Gemini API while keeping the API key secure.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
- A [Google AI Studio](https://aistudio.google.com/) account for Gemini API key
- Node.js installed locally

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the API key (keep it secret!)

### 2. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 3. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate.

### 4. Deploy the Worker

Navigate to the cloudflare-worker directory and deploy:

```bash
cd cloudflare-worker
wrangler deploy
```

You'll see output like:
```
Deployed shreyas-ai-chatbot (https://shreyas-ai-chatbot.YOUR_SUBDOMAIN.workers.dev)
```

**Copy this URL** - you'll need it for the next step.

### 5. Add Secrets

```bash
# Add your Gemini API key
wrangler secret put GEMINI_API_KEY

# Add your system prompt (from SYSTEM_PROMPT.txt)
wrangler secret put SYSTEM_PROMPT
```

When prompted, paste your Gemini API key and system prompt respectively.

**Note:** The `SYSTEM_PROMPT.txt` file is gitignored and won't be committed. Keep it private!

### 6. Update the Website

Edit `_includes/terminal.html` and update the `AI_API_URL` with your Worker URL:

```javascript
const AI_API_URL = 'https://shreyas-ai-chatbot.YOUR_SUBDOMAIN.workers.dev';
```

Replace `YOUR_SUBDOMAIN` with your actual Cloudflare Workers subdomain.

### 7. Test It

1. Run `bundle exec jekyll serve` locally
2. Open http://localhost:4000
3. In the terminal, type: `ask What does Shreyas work on?`

## Usage

Once deployed, users can interact with the AI in the terminal:

```
ask What projects has Shreyas built?
ask Tell me about his certifications
ask What skills does Shreyas have?
chat Is Shreyas available for collaboration?
```

## Customization

### Updating the AI's Knowledge

Edit the `SYSTEM_PROMPT` in `worker.js` to update what the AI knows about you.

### Rate Limiting (Optional)

For additional security, you can add rate limiting in the Cloudflare dashboard:
1. Go to Workers & Pages → your worker
2. Settings → Triggers → Add Rate Limiting Rule

## Troubleshooting

### "AI service unavailable" error

1. Check if the Worker is deployed: `wrangler tail` to see logs
2. Verify the API key is set: `wrangler secret list`
3. Check CORS: Ensure your domain is allowed

### Slow responses

Gemini API can take 1-3 seconds. The terminal shows "AI is thinking..." during this time.

### API Errors

Check the Worker logs:
```bash
wrangler tail
```

## Cost

- **Cloudflare Workers**: Free tier includes 100,000 requests/day
- **Gemini API**: Free tier includes generous usage limits

## Files

- `worker.js` - The Cloudflare Worker code
- `wrangler.toml` - Worker configuration
