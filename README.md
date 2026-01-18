# BuenaVista AI Backend (Vercel)

Serverless backend for BuenaVista Services Inc.

## Endpoints

POST /api/chat  
POST /api/quote  
POST /api/apply  

## Environment Variables (Vercel)

OPENAI_API_KEY  
SMTP_HOST  
SMTP_PORT  
SMTP_USER  
SMTP_PASS  
SMTP_FROM  

## Notes

- Clients NEVER see pricing
- All pricing is internal only
- Region-based email routing enabled
- Medical & emergency work auto-escalates