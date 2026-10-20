-- ==============================================================================
-- Deduplicate bonanza_targets & add UNIQUE (distributor_id, name) constraint
-- Ensures each distributor only has ONE record per bonanza challenge,
-- updating the existing row on every sync rather than creating duplicate history.
-- ==============================================================================

-- 1. Remove duplicate entries, keeping the most recently updated one
DELETE FROM public.bonanza_targets a
USING public.bonanza_targets b
WHERE a.updated_at < b.updated_at
  AND a.distributor_id = b.distributor_id
  AND a.name = b.name;

-- Fallback deduplication if updated_at timestamps are identical
DELETE FROM public.bonanza_targets a
USING public.bonanza_targets b
WHERE a.id < b.id
  AND a.distributor_id = b.distributor_id
  AND a.name = b.name;

-- 2. Add unique constraint on (distributor_id, name)
ALTER TABLE public.bonanza_targets
DROP CONSTRAINT IF EXISTS bonanza_targets_distributor_name_uniq;

ALTER TABLE public.bonanza_targets
ADD CONSTRAINT bonanza_targets_distributor_name_uniq UNIQUE (distributor_id, name);
