-- ==============================================================================
-- AWPL Helper: Expand Payouts Schema for SP & Milestone Level Bonuses
-- Adds only the essential raw fields: sao_sp, sgo_sp, step, and other_incomes
-- All other metrics (current_week_sp, carry_sp, sales_growth) are computed dynamically
-- ==============================================================================

ALTER TABLE public.payouts
  ADD COLUMN IF NOT EXISTS sao_sp NUMERIC(14, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sgo_sp NUMERIC(14, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS step INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS other_incomes JSONB DEFAULT '{}'::JSONB;

-- Create index on step to quickly filter milestone rank completions
CREATE INDEX IF NOT EXISTS idx_payouts_step ON public.payouts(distributor_id, step) WHERE step > 0;
