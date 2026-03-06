# How to Get STRIPE_WEBHOOK_SECRET

## Important: Webhook Secret is NOT in API Keys!

The webhook secret is **NOT** in the API Keys section. You need to:
1. Create a webhook endpoint first
2. Then you'll get the signing secret

## Step-by-Step Guide

### Step 1: Go to Webhooks Section

1. Go to **Stripe Dashboard**: https://dashboard.stripe.com
2. Click **"Developers"** in the left sidebar
3. Click **"Webhooks"** (NOT "API keys")

### Step 2: Create Webhook Endpoint

1. Click **"Add endpoint"** button (top right)
2. **For Local Development** (if testing locally):
   - You need to use **Stripe CLI** (see Option A below)
   - OR use a tool like **ngrok** to expose localhost
   
3. **For Production** (when deployed):
   - Enter your webhook URL: `https://your-domain.com/api/webhook`
   - Example: `https://seniorsstuck.com/api/webhook`

### Step 3: Select Events

Select these events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

### Step 4: Get the Signing Secret

1. After creating the endpoint, click on it
2. You'll see a section called **"Signing secret"**
3. Click **"Reveal"** or **"Click to reveal"**
4. Copy the secret (starts with `whsec_`)

### Step 5: Add to .env.local

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 6: Restart Dev Server

```bash
# Stop server (Ctrl+C) and restart:
npm run dev
```

---

## Option A: Use Stripe CLI (Easiest for Local Development)

If you're testing locally, use Stripe CLI instead of creating a webhook in dashboard:

### 1. Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows/Linux:**
Download from: https://stripe.com/docs/stripe-cli

### 2. Login

```bash
stripe login
```

This will open a browser to authenticate.

### 3. Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 4. Copy the Webhook Secret

The terminal will show something like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy that `whsec_...` value!**

### 5. Add to .env.local

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 6. Keep Stripe CLI Running

Keep the `stripe listen` command running in a separate terminal while developing.

### 7. Restart Dev Server

In another terminal:
```bash
npm run dev
```

---

## Option B: Use ngrok (Alternative for Local Development)

If you don't want to use Stripe CLI:

1. **Install ngrok**: https://ngrok.com/download
2. **Expose localhost**:
   ```bash
   ngrok http 3000
   ```
3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)
4. **Create webhook in Stripe Dashboard**:
   - URL: `https://abc123.ngrok.io/api/webhook`
5. **Get signing secret** from webhook settings
6. **Add to .env.local**

---

## Quick Test

After setting up, test with:

```bash
# If using Stripe CLI:
stripe trigger checkout.session.completed
```

Or complete a test subscription and check:
- Stripe Dashboard → Webhooks → Recent events
- Should show successful events (green checkmark)

---

## Summary

**The webhook secret is NOT in API Keys!**

✅ **Correct location**: Developers → Webhooks → Your webhook → Signing secret  
❌ **Wrong location**: Developers → API keys

**For local development**: Use Stripe CLI (easiest)  
**For production**: Create webhook endpoint in dashboard with your production URL
