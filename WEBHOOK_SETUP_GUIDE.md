# Stripe Webhook Setup Guide

## Current Status
✅ Database connection: **WORKING**
✅ All other environment variables: **SET**
❌ STRIPE_WEBHOOK_SECRET: **MISSING**

## Why Webhook Secret is Important

The webhook secret is used to verify that webhook events are actually coming from Stripe (security). Without it:
- ❌ Webhook route will reject all events
- ✅ Check-session route will still work (backup method)

## How to Get STRIPE_WEBHOOK_SECRET

### Option 1: Set Up Webhook (Recommended)

1. **Go to Stripe Dashboard**:
   - https://dashboard.stripe.com/test/webhooks (for test mode)
   - or https://dashboard.stripe.com/webhooks (for live mode)

2. **Click "Add endpoint"**

3. **Enter your webhook URL**:
   - **Local development**: Use Stripe CLI (see Option 2 below)
   - **Production**: `https://your-domain.com/api/webhook`

4. **Select events to listen to**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

5. **Click "Add endpoint"**

6. **Copy the Signing secret**:
   - Click on your webhook
   - Click "Reveal" next to "Signing secret"
   - Copy the value (starts with `whsec_`)

7. **Add to `.env.local`**:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

8. **Restart your dev server**

### Option 2: Use Stripe CLI (For Local Development)

1. **Install Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. **Copy the webhook signing secret** (shown in terminal, starts with `whsec_`)

5. **Add to `.env.local`**:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

6. **Restart your dev server**

## Current Workaround

Even without the webhook secret, data should still be stored via the **check-session route** when users return from Stripe checkout. This happens automatically on the success page.

## Testing

After setting up the webhook secret:

1. **Test webhook** (if using Stripe CLI):
   ```bash
   stripe trigger checkout.session.completed
   ```

2. **Complete a test subscription** and check:
   - Console logs for webhook events
   - Supabase `users` table for new data

3. **Check Stripe Dashboard** → Webhooks → Recent events:
   - Should show successful events (green checkmark)
   - Click on events to see response details

## Troubleshooting

### Webhook events showing as "Failed"
- Check your webhook URL is correct
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check server logs for error messages

### Webhook not receiving events
- Verify webhook is enabled in Stripe Dashboard
- Check webhook URL is accessible (not localhost for production)
- Use Stripe CLI for local development

### Data still not storing
- Check `/api/test-db` - should return success
- Check console logs for errors
- Verify `check-session` route is being called (check success page logs)
