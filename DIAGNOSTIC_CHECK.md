# Diagnostic Steps for Subscription Data Not Storing

## Issue
Subscription data is not being stored in the `users` and `subscriptions` tables after checkout.

## Possible Causes & Solutions

### 1. **Webhook Not Configured or Not Receiving Events**
- **Check**: Go to Stripe Dashboard → Developers → Webhooks
- **Verify**: Webhook endpoint is set to: `https://your-domain.com/api/webhook`
- **Verify**: Events enabled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Action**: If webhook is missing, create it and copy the webhook secret to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 2. **Webhook Secret Not Set**
- **Check**: Verify `STRIPE_WEBHOOK_SECRET` is in your `.env.local` file
- **Action**: Copy the webhook signing secret from Stripe Dashboard → Webhooks → Your webhook → Signing secret

### 3. **Subscriptions Table Not Created**
- **Check**: Go to Supabase Dashboard → Table Editor
- **Verify**: `subscriptions` table exists with these columns:
  - `id` (uuid)
  - `user_id` (uuid)
  - `stripe_subscription_id` (text)
  - `stripe_customer_id` (text)
  - `plan` (text)
  - `subscription_status` (text)
  - `current_period_end` (bigint)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
- **Action**: If table doesn't exist, run `supabase-subscriptions-schema.sql` in Supabase SQL Editor

### 4. **Service Role Key Not Set**
- **Check**: Verify `SUPABASE_SERVICE_ROLE_KEY` is in your `.env.local` file
- **Action**: Copy from Supabase Dashboard → Settings → API → service_role key (secret)

### 5. **RLS Policies Blocking**
- **Check**: The webhook uses service role key which bypasses RLS, but verify:
  - `users` table has RLS enabled but service role bypasses it
  - `subscriptions` table has RLS enabled but service role bypasses it
- **Action**: Service role key should bypass RLS automatically

### 6. **Check Recent Webhook Events**
- **Check**: Go to Stripe Dashboard → Developers → Webhooks → Your webhook → Recent events
- **Look for**: `checkout.session.completed` events
- **Check**: If events show "Failed" or errors, click to see error details

### 7. **Check Application Logs**
- **Check**: Look at your application logs (Vercel/Netlify logs or local console)
- **Look for**: Error messages from webhook or check-session routes
- **Common errors**:
  - "No userId in metadata" - Checkout session metadata not set correctly
  - "No subscription ID found" - Subscription not created in Stripe
  - Database connection errors

### 8. **Manual Test - Check Session Route**
After completing checkout, the success page calls `/api/check-session?session_id=xxx`
- **Check**: Open browser DevTools → Network tab
- **Look for**: Request to `/api/check-session`
- **Check**: Response status and any error messages

### 9. **Verify Metadata in Checkout Session**
- **Check**: In Stripe Dashboard → Payments → Checkout Sessions → Your session
- **Verify**: Metadata contains:
  - `userId`: User's Supabase UUID
  - `email`: User's email
- **Action**: If metadata is missing, check `app/api/checkout/route.ts` to ensure metadata is set

## Quick Fix Steps

1. **Verify Environment Variables**:
   ```bash
   # Check these are set in .env.local:
   STRIPE_SECRET_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

2. **Test Webhook Locally** (if using Stripe CLI):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

3. **Manually Trigger Check-Session**:
   - After checkout, copy the session_id from the URL
   - Call: `GET /api/check-session?session_id=cs_test_...`
   - Check response and logs

4. **Check Database Directly**:
   - Go to Supabase Dashboard → Table Editor
   - Check `users` table for your user ID
   - Check `subscriptions` table for subscription records

## Updated Code
The `check-session` route has been updated to also create subscription records in the `subscriptions` table. This ensures data is stored even if the webhook fails.
