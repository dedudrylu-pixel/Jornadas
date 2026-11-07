/*
# Admin dashboard RPC functions

1. New Functions
- `get_all_profiles()` — SECURITY DEFINER, callable by authenticated.
  Returns all rows from profiles (id, email, role, created_at) but only
  if the caller (auth.uid()) is an admin. Non-admins get an exception.
  Bypasses RLS so admins can see every user; internal auth check blocks
  ordinary users.

- `get_admin_stats()` — SECURITY DEFINER, callable by authenticated.
  Returns a single row with total_users and total_admins counts.
  Same admin authorization check.

2. Security
- Both functions derive the caller from auth.uid() (never a parameter).
- Both SET search_path = public.
- EXECUTE revoked from PUBLIC and anon; granted to authenticated.
- Non-admin callers receive 'Not authorized' exception.
*/

CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles p_chk WHERE p_chk.id = auth.uid() AND p_chk.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY SELECT p.id, p.email, p.role, p.created_at FROM profiles p
    ORDER BY p.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_all_profiles() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_all_profiles() TO authenticated;

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_users bigint,
  total_admins bigint
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles p_chk WHERE p_chk.id = auth.uid() AND p_chk.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
    SELECT
      count(*)::bigint AS total_users,
      count(*) FILTER (WHERE p_chk.role = 'admin')::bigint AS total_admins
    FROM profiles p_chk;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_admin_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
