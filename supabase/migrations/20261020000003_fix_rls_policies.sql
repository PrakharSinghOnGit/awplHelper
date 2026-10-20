-- ==============================================================================
-- AWPL Helper: Fix Case-Insensitive RLS Policies & Enable Insert/Update
-- Resolves: "new row violates row-level security policy for table 'distributors'"
-- And ensures case-insensitive matching between leaders, distributors, and child tables
-- ==============================================================================

-- 1. Ensure leaders awplid is uppercase
UPDATE public.leaders SET awplid = UPPER(TRIM(awplid)) WHERE awplid IS NOT NULL;
UPDATE public.distributors SET awplid = UPPER(TRIM(awplid)) WHERE awplid IS NOT NULL;
UPDATE public.payouts SET distributor_id = UPPER(TRIM(distributor_id)) WHERE distributor_id IS NOT NULL;
UPDATE public.weekly_sp SET distributor_id = UPPER(TRIM(distributor_id)) WHERE distributor_id IS NOT NULL;
UPDATE public.bonanza_targets SET distributor_id = UPPER(TRIM(distributor_id)) WHERE distributor_id IS NOT NULL;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Leaders can view their team distributors and self" ON public.distributors;
DROP POLICY IF EXISTS "Leaders can insert and update distributors" ON public.distributors;
DROP POLICY IF EXISTS "Leaders can view team payouts and self" ON public.payouts;
DROP POLICY IF EXISTS "Leaders can insert and update payouts" ON public.payouts;
DROP POLICY IF EXISTS "Leaders can view team weekly sp and self" ON public.weekly_sp;
DROP POLICY IF EXISTS "Leaders can insert and update weekly_sp" ON public.weekly_sp;
DROP POLICY IF EXISTS "Leaders can view team bonanza and self" ON public.bonanza_targets;
DROP POLICY IF EXISTS "Leaders can insert and update bonanza_targets" ON public.bonanza_targets;

-- 3. Distributors Table Policies (Case-insensitive matching)
CREATE POLICY "Leaders can view their team distributors and self"
  ON public.distributors
  FOR SELECT
  TO authenticated
  USING (
    UPPER(awplid) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(awplid) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

CREATE POLICY "Leaders can insert and update distributors"
  ON public.distributors
  FOR ALL
  TO authenticated
  USING (
    UPPER(awplid) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(awplid) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    UPPER(awplid) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(awplid) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

-- 4. Payouts Table Policies (Case-insensitive matching)
CREATE POLICY "Leaders can view team payouts and self"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

CREATE POLICY "Leaders can insert and update payouts"
  ON public.payouts
  FOR ALL
  TO authenticated
  USING (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

-- 5. Weekly SP Table Policies (Case-insensitive matching)
CREATE POLICY "Leaders can view team weekly sp and self"
  ON public.weekly_sp
  FOR SELECT
  TO authenticated
  USING (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

CREATE POLICY "Leaders can insert and update weekly_sp"
  ON public.weekly_sp
  FOR ALL
  TO authenticated
  USING (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

-- 6. Bonanza Targets Table Policies (Case-insensitive matching)
CREATE POLICY "Leaders can view team bonanza and self"
  ON public.bonanza_targets
  FOR SELECT
  TO authenticated
  USING (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );

CREATE POLICY "Leaders can insert and update bonanza_targets"
  ON public.bonanza_targets
  FOR ALL
  TO authenticated
  USING (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    UPPER(distributor_id) IN (
      SELECT UPPER(distributor_id) FROM public.team_memberships WHERE leader_id = auth.uid()
    )
    OR
    UPPER(distributor_id) IN (
      SELECT UPPER(awplid) FROM public.leaders WHERE id = auth.uid()
    )
  );
