# Environment Variables Checklist

## Required Environment Variables

Make sure your `.env.local` file has ALL of these variables:

### Supabase Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGc... (anon/public key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role key - SECRET!)
```

### Stripe Variables
```bash
STRIPE_SECRET_KEY=sk_test_... or sk_live_... (secret key, NOT publishable)
STRIPE_WEBHOOK_SECRET=whsec_... (webhook signing secret)
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_... (monthly plan price ID)
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_... (yearly plan price ID)
```

## How to Get These Values

### Supabase Keys:
1. Go to: Supabase Dashboard → Your Project → Settings → API
2. **Project URL** → Copy to `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public** key → Copy to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. **service_role** key (secret) → Copy to `SUPABASE_SERVICE_ROLE_KEY` ⚠️ KEEP SECRET!

### Stripe Keys:
1. Go to: Stripe Dashboard → Developers → API keys
2. **Secret key** (starts with `sk_test_` or `sk_live_`) → Copy to `STRIPE_SECRET_KEY`
3. **Publishable key** (starts with `pk_test_` or `pk_live_`) → Not needed for backend

### Stripe Webhook Secret:
1. Go to: Stripe Dashboard → Developers → Webhooks
2. Click on your webhook (or create one)
3. Click "Reveal" next to "Signing secret"
4. Copy to `STRIPE_WEBHOOK_SECRET`

### Stripe Price IDs:
1. Go to: Stripe Dashboard → Products
2. Click on your Monthly product → Copy the Price ID (starts with `price_`)
3. Click on your Yearly product → Copy the Price ID (starts with `price_`)

## Verification

After setting up your `.env.local` file:

1. **Restart your dev server** (important!):
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```

2. **Test the database connection**:
   Visit: `http://localhost:3000/api/test-db`
   
   Should return: `{ "success": true, ... }`

3. **Check console logs** when subscribing:
   - Look for: `✅ Service client created successfully`
   - Look for: `✅ Upserted user data`
   - Look for: `✅ Verification successful`

## Common Issues

### Issue: "STRIPE_SECRET_KEY is not set"
- **Fix**: Make sure `STRIPE_SECRET_KEY` is in `.env.local` (not `.env`)
- **Fix**: Restart dev server after adding

### Issue: "SUPABASE_SERVICE_ROLE_KEY is not set"
- **Fix**: Copy the **service_role** key (not anon key) from Supabase
- **Fix**: Make sure it starts with `eyJ` (JWT token)
- **Fix**: Restart dev server after adding

### Issue: "STRIPE_WEBHOOK_SECRET is not configured"
- **Fix**: Create webhook in Stripe Dashboard first
- **Fix**: Copy the signing secret (starts with `whsec_`)
- **Fix**: Restart dev server after adding

### Issue: Data not storing
- **Check**: Run `/api/test-db` to verify database connection
- **Check**: Check browser console and server logs for errors
- **Check**: Verify webhook is receiving events in Stripe Dashboard
