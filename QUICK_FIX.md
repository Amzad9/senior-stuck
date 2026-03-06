# Quick Fix: Data Not Storing in Database

## Current Status ✅
- Database connection: **WORKING** ✅
- All environment variables: **SET** ✅ (except webhook secret)
- Table access: **WORKING** ✅

## The Issue
Data should be storing via the `check-session` route when users return from Stripe, but it's not working.

## Immediate Steps to Fix

### Step 1: Add Webhook Secret (Optional but Recommended)

**For Local Development (Easiest):**

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   
4. Copy the `whsec_...` secret shown in terminal

5. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

6. Restart dev server

**OR For Production:**

1. Go to Stripe Dashboard → Webhooks
2. Create webhook endpoint: `https://your-domain.com/api/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy signing secret
5. Add to `.env.local` and restart

### Step 2: Test the Flow

1. **Complete a test subscription**
2. **Check browser console** for:
   - `🔍 Calling check-session API...`
   - `✅ Upserted successfully`
   - `✅ Verification successful`

3. **Check server logs** for:
   - `📤 Upserting data`
   - `✅ Upserted successfully`
   - Any error messages

4. **Check Supabase**:
   - Go to Table Editor → `users` table
   - Should see a new row with subscription data

### Step 3: Debug if Still Not Working

If data still not storing, check:

1. **Is check-session being called?**
   - Open browser DevTools → Network tab
   - Complete subscription
   - Look for request to `/api/check-session`
   - Check response status and body

2. **Are there errors in console?**
   - Check browser console
   - Check server terminal logs
   - Look for any red error messages

3. **Is userId in metadata?**
   - Check checkout route sets `metadata.userId`
   - Check session metadata contains userId

## Expected Flow

1. User clicks "Subscribe" → Creates checkout session with `metadata.userId`
2. User completes payment → Redirected to `/success?session_id=xxx`
3. Success page calls `/api/check-session?session_id=xxx`
4. Check-session route:
   - Retrieves session from Stripe
   - Gets userId from metadata
   - Gets subscription details
   - Stores in `users` table
   - Returns success

## If Still Not Working

Share:
1. Browser console errors
2. Server terminal logs
3. Network tab response from `/api/check-session`
4. Any error messages you see
