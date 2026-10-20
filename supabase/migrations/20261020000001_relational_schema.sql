-- ==============================================================================
-- AWPL Helper: Relational Data Model Migration
-- Transitions from monolithic JSON blob to clean relational tables:
-- 1. leaders (Registered AWPL Helper SaaS Users / App Account)
-- 2. distributors (Unified AWPL distributor catalog, shared across downlines)
-- 3. team_memberships (Many-to-Many link between Leaders and Downline Members)
-- 4. payouts (Incremental immutable cheque records, deduplicated by cheque_no)
-- 5. weekly_sp (Weekly cycle production history, deduplicated by closing_date)
-- 6. bonanza_targets (Promotional challenges and trips)
-- ==============================================================================

-- 1. Drop restrictive JSON schema constraint from legacy leaders table
ALTER TABLE IF EXISTS public.leaders DROP CONSTRAINT IF EXISTS leaders_team_schema_chk;

-- Ensure case-insensitive index on leaders.awplid
CREATE UNIQUE INDEX IF NOT EXISTS leaders_awplid_upper_idx ON public.leaders (UPPER(awplid));

-- 2. Create the unified distributors table
-- Represents ANY AWPL member (leaders or monitored downline members).
-- If two leaders monitor the same member, there is only ONE record here.
CREATE TABLE IF NOT EXISTS public.distributors (
  awplid TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  pass TEXT NOT NULL DEFAULT '',
  valid_passwords TEXT[] DEFAULT ARRAY[]::TEXT[],
  current_level INT DEFAULT 0,
  current_level_name TEXT DEFAULT 'Fresher',
  next_level INT,
  next_level_name TEXT,
  next_target_sao NUMERIC(14, 2) DEFAULT 0,
  next_target_sgo NUMERIC(14, 2) DEFAULT 0,
  sao_sp NUMERIC(14, 2) DEFAULT 0,
  sgo_sp NUMERIC(14, 2) DEFAULT 0,
  total_income NUMERIC(14, 2) DEFAULT 0,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'wrong', 'pending')),
  last_mined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive index on distributor awplid
CREATE UNIQUE INDEX IF NOT EXISTS distributors_awplid_upper_idx ON public.distributors (UPPER(awplid));

-- 3. Create Many-to-Many team_memberships bridge table
-- Connects a Leader (paying app user) with downline AWPL distributors
CREATE TABLE IF NOT EXISTS public.team_memberships (
  leader_id UUID NOT NULL REFERENCES public.leaders(id) ON DELETE CASCADE,
  distributor_id TEXT NOT NULL REFERENCES public.distributors(awplid) ON DELETE CASCADE,
  custom_alias TEXT,
  notes TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (leader_id, distributor_id)
);

CREATE INDEX IF NOT EXISTS idx_team_memberships_distributor ON public.team_memberships(distributor_id);
CREATE INDEX IF NOT EXISTS idx_team_memberships_leader ON public.team_memberships(leader_id);

-- 4. Create the incremental payouts table
-- Deduped on (distributor_id, cheque_no). Past payments never change or duplicate.
CREATE TABLE IF NOT EXISTS public.payouts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  distributor_id TEXT NOT NULL REFERENCES public.distributors(awplid) ON DELETE CASCADE,
  cheque_no TEXT NOT NULL,
  cheque_date DATE NOT NULL,
  gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tds_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  admin_charges NUMERIC(12, 2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Paid',
  transaction_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payouts_distributor_cheque_uniq UNIQUE (distributor_id, cheque_no)
);

CREATE INDEX IF NOT EXISTS idx_payouts_distributor_date ON public.payouts(distributor_id, cheque_date DESC);

-- 5. Create weekly_sp cycle history table
CREATE TABLE IF NOT EXISTS public.weekly_sp (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  distributor_id TEXT NOT NULL REFERENCES public.distributors(awplid) ON DELETE CASCADE,
  closing_date DATE NOT NULL,
  sao_sp NUMERIC(14, 2) NOT NULL DEFAULT 0,
  sgo_sp NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total_sp NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT weekly_sp_distributor_date_uniq UNIQUE (distributor_id, closing_date)
);

CREATE INDEX IF NOT EXISTS idx_weekly_sp_distributor_date ON public.weekly_sp(distributor_id, closing_date DESC);

-- 6. Create bonanza_targets table
CREATE TABLE IF NOT EXISTS public.bonanza_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id TEXT NOT NULL REFERENCES public.distributors(awplid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  req_sao NUMERIC(14, 2) DEFAULT 0,
  req_sgo NUMERIC(14, 2) DEFAULT 0,
  achieved_sao NUMERIC(14, 2) DEFAULT 0,
  achieved_sgo NUMERIC(14, 2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bonanza_distributor ON public.bonanza_targets(distributor_id);

-- 7. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_sp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonanza_targets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Leaders can view their team distributors and self" ON public.distributors;
DROP POLICY IF EXISTS "Leaders can view their own team memberships" ON public.team_memberships;
DROP POLICY IF EXISTS "Leaders can insert their own team memberships" ON public.team_memberships;
DROP POLICY IF EXISTS "Leaders can delete their own team memberships" ON public.team_memberships;
DROP POLICY IF EXISTS "Leaders can view team payouts and self" ON public.payouts;
DROP POLICY IF EXISTS "Leaders can view team weekly sp and self" ON public.weekly_sp;
DROP POLICY IF EXISTS "Leaders can view team bonanza and self" ON public.bonanza_targets;

-- Distributors: Leader can view distributors that are in their team OR their own leader awplid
CREATE POLICY "Leaders can view their team distributors and self"
  ON public.distributors
  FOR SELECT
  TO authenticated
  USING (
    awplid IN (
      SELECT distributor_id FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    awplid IN (
      SELECT awplid FROM public.leaders WHERE id = auth.uid()
    )
  );

-- Team memberships: A leader can view and manage only their own team
CREATE POLICY "Leaders can view their own team memberships"
  ON public.team_memberships
  FOR SELECT
  TO authenticated
  USING (leader_id = auth.uid());

CREATE POLICY "Leaders can insert their own team memberships"
  ON public.team_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (leader_id = auth.uid());

CREATE POLICY "Leaders can delete their own team memberships"
  ON public.team_memberships
  FOR DELETE
  TO authenticated
  USING (leader_id = auth.uid());

-- Payouts: Viewable if distributor is in team or is self
CREATE POLICY "Leaders can view team payouts and self"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (
    distributor_id IN (
      SELECT distributor_id FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    distributor_id IN (
      SELECT awplid FROM public.leaders WHERE id = auth.uid()
    )
  );

-- Weekly SP: Viewable if distributor is in team or is self
CREATE POLICY "Leaders can view team weekly sp and self"
  ON public.weekly_sp
  FOR SELECT
  TO authenticated
  USING (
    distributor_id IN (
      SELECT distributor_id FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    distributor_id IN (
      SELECT awplid FROM public.leaders WHERE id = auth.uid()
    )
  );

-- Bonanza targets: Viewable if distributor is in team or is self
CREATE POLICY "Leaders can view team bonanza and self"
  ON public.bonanza_targets
  FOR SELECT
  TO authenticated
  USING (
    distributor_id IN (
      SELECT distributor_id FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    distributor_id IN (
      SELECT awplid FROM public.leaders WHERE id = auth.uid()
    )
  );

-- 8. Stored Procedures / Helper Functions for adding and removing team members

-- Function: Add a member to a leader's team
CREATE OR REPLACE FUNCTION public.add_team_member(
  p_awpl_id TEXT,
  p_awpl_pass TEXT,
  p_name TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_leader_id UUID := auth.uid();
  v_count INT;
  v_allowed INT;
  v_clean_id TEXT := UPPER(TRIM(p_awpl_id));
BEGIN
  IF v_leader_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Capacity check against leader's subscription
  SELECT allowedmemcount INTO v_allowed FROM public.leaders WHERE id = v_leader_id;
  SELECT COUNT(*) INTO v_count FROM public.team_memberships WHERE leader_id = v_leader_id;

  IF v_count >= COALESCE(v_allowed, 5) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Team capacity limit reached. Please upgrade your subscription to add more members.'
    );
  END IF;

  -- 1. Upsert distributor in unified catalog
  INSERT INTO public.distributors (awplid, pass, name, valid_passwords)
  VALUES (v_clean_id, p_awpl_pass, p_name, ARRAY[p_awpl_pass])
  ON CONFLICT (awplid) DO UPDATE
  SET
    valid_passwords = array_append(
      array_remove(public.distributors.valid_passwords, p_awpl_pass),
      p_awpl_pass
    ),
    updated_at = now();

  -- 2. Link in team_memberships
  INSERT INTO public.team_memberships (leader_id, distributor_id)
  VALUES (v_leader_id, v_clean_id)
  ON CONFLICT (leader_id, distributor_id) DO NOTHING;

  -- 3. Update leader memcount cache
  UPDATE public.leaders
  SET memcount = (SELECT COUNT(*) FROM public.team_memberships WHERE leader_id = v_leader_id)
  WHERE id = v_leader_id;

  RETURN jsonb_build_object('success', true, 'awplid', v_clean_id);
END;
$$;

-- Function: Remove a member from a leader's team (does not delete the distributor from DB if other leaders track them)
CREATE OR REPLACE FUNCTION public.remove_team_member(
  p_awpl_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_leader_id UUID := auth.uid();
  v_clean_id TEXT := UPPER(TRIM(p_awpl_id));
BEGIN
  IF v_leader_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete only the membership link for this leader
  DELETE FROM public.team_memberships
  WHERE leader_id = v_leader_id AND distributor_id = v_clean_id;

  -- Update leader's memcount
  UPDATE public.leaders
  SET memcount = (SELECT COUNT(*) FROM public.team_memberships WHERE leader_id = v_leader_id)
  WHERE id = v_leader_id;

  RETURN jsonb_build_object('success', true, 'awplid', v_clean_id);
END;
$$;
