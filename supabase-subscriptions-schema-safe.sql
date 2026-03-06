-- Supabase Database Schema for Subscriptions Table (Safe Version)
-- Run this SQL in your Supabase SQL Editor to support multiple subscriptions per user
-- This version checks for existing table and adds missing columns if needed

-- First, check if table exists and create it if it doesn't
DO $$
BEGIN
  -- Create table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriptions') THEN
    CREATE TABLE subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      stripe_subscription_id TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT NOT NULL,
      plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
      subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
      current_period_end BIGINT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    RAISE NOTICE 'Table subscriptions created';
  ELSE
    RAISE NOTICE 'Table subscriptions already exists';
    
    -- Add missing columns if table exists but columns are missing
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'subscription_status') THEN
      ALTER TABLE subscriptions ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due'));
      RAISE NOTICE 'Added subscription_status column';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'current_period_end') THEN
      ALTER TABLE subscriptions ADD COLUMN current_period_end BIGINT;
      RAISE NOTICE 'Added current_period_end column';
    END IF;
  END IF;
END $$;

-- Create indexes for faster lookups (drop first to avoid conflicts)
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_stripe_subscription_id;
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_status;

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(subscription_status);

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can read own subscriptions" ON subscriptions;

-- Create policy: Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions" ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Ensure the update_updated_at_column function exists (from users table migration)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
