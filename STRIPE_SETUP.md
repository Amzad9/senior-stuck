# Stripe Integration Setup Guide

This guide will help you set up Stripe payment integration for the PDF product.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed

## Installation Steps

### 1. Install Dependencies

Run the following command to install Stripe packages:

```bash
npm install stripe @stripe/stripe-js
```

### 2. Get Your Stripe Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - For testing, use the test keys (start with `pk_test_` and `sk_test_`)
   - For production, use the live keys (start with `pk_live_` and `sk_live_`)

### 3. Create a Product and Price in Stripe

1. Go to **Products** in your Stripe Dashboard
2. Click **+ Add product**
3. Fill in the product details:
   - **Name**: Premium PDF Guide (or your product name)
   - **Description**: Your product description
   - **Pricing**: Set the price (e.g., $29.99)
   - **Billing**: One-time
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

### 4. Set Up Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
NEXT_PUBLIC_STRIPE_PRICE_ID=price_your_price_id_here
```

Replace the placeholder values with your actual Stripe keys and price ID.

### 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your product section on the page
3. Click the "Buy Now" button
4. Use Stripe's test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

## Production Setup

When you're ready to go live:

1. Switch to **Live mode** in your Stripe Dashboard
2. Get your live API keys
3. Update your `.env.local` with live keys:
   ```env
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   NEXT_PUBLIC_STRIPE_PRICE_ID=price_your_live_price_id
   ```

4. Deploy your application
5. Make sure to set these environment variables in your hosting platform (Vercel, Netlify, etc.)

## Important Notes

- Never commit your `.env.local` file to version control
- The secret key should only be used on the server side (API routes)
- The publishable key is safe to use in client-side code
- Always test thoroughly in test mode before going live

## Troubleshooting

- **"Stripe failed to load"**: Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- **"Price ID is not configured"**: Make sure `NEXT_PUBLIC_STRIPE_PRICE_ID` is set in your environment variables
- **Checkout session creation fails**: Verify your `STRIPE_SECRET_KEY` is correct and has the right permissions

## Support

For Stripe-specific issues, refer to:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
