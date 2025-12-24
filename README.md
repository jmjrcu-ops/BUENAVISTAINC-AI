# Buenavista AI Backend (Vercel)

This is the backend for the Buenavista Services Inc elite website.

It provides three serverless endpoints for Vercel:

- `api/chat`   → floating AI assistant
- `api/quote`  → Smart Quote intake and internal pricing snapshot
- `api/apply`  → Careers application intake

## Environment variables

Set these in your Vercel project:

- `OPENAI_API_KEY`          → Your OpenAI key
- `SMTP_HOST`               → SMTP server host
- `SMTP_PORT`               → SMTP port (e.g. 465 or 587)
- `SMTP_USER`               → SMTP username
- `SMTP_PASS`               → SMTP password
- `SMTP_FROM`               → From address, e.g. `no-reply@buenavistainc.com`

- `BID_RECIPIENTS`          → Comma-separated emails for quote review, e.g.  
                               `billyf75@yahoo.com,jmjrcu@gmail.com,jesusj@buenavistainc.com,camilo@buenavistainc.com`

- `URGENT_SMS_RECIPIENTS`   → Comma-separated phone numbers for urgency 8–10 SMS, e.g.  
                               `+14255212421,+14252468121`

- `CAREERS_RECIPIENTS`      → Comma-separated emails for career applications, e.g.  
                               `jesusj@buenavistainc.com,billy@buenavistainc.com,camilo@buenavistainc.com,ivan.flores@buenavistainc.com`

## Deploying to Vercel

1. Create a new GitHub repo and push these files.
2. In Vercel, click "New Project" → import that repo.
3. Set the environment variables above.
4. Deploy.

Your backend base URL will look like:

    https://YOUR-PROJECT-NAME.vercel.app

Use that as `API_BASE_URL` in your front-end config (`assets/js/config.js`).