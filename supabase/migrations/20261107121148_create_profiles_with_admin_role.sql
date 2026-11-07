/*
# Create profiles table with protected admin role

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users) — one profile per auth user
  - `email` (text, unique) — mirrors the auth email for lookups
  - `role` (text, default 'member') — 'member' or 'admin'; PROTECTED column
  - `created_at` (timestamptz) — when the profile was created

2. Security — RLS
- RLS enabled on `profiles`.
- Each authenticated user can SELECT and UPDATE their own profile row.
- No user can INSERT a profile directly — profiles are created server-side
  by a trigger on auth.users (handle_new_user).

3. Security — Column-level privileges
- The `role` column is revoked from `authenticated` so users cannot
  self-promote via the Data API. Only the SECURITY DEFINER functions
  (trigger + set_user_role) can write it, running as the table owner.

4. SECURITY DEFINER functions
- `handle_new_user()` — fires AFTER INSERT on auth.users. Creates the
  matching profile row. If the new user's email is the designated
  bootstrap admin (dedudrylu@gmail.com), sets role to 'admin';
  otherwise 'member'. Email comparison is case-insensitive.
- `set_user_role(p_user uuid, p_role text)` — allows an existing admin
  to change another user's role. Checks auth.uid() is an admin. Validates
  p_role against an allowlist. EXECUTE revoked from anon.

5. Bootstrap admin
- The first admin is established automatically when
  dedudrylu@gmail.com signs up. After that, only an admin can grant
  admin to others via set_user_role.

6. Grants
- authenticated: SELECT (own row), UPDATE (own row, non-role columns only)
- service_role: full CRUD (for edge functions if needed)
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE (email) ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO service_role;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- No INSERT policy: profiles are created only by the handle_new_user trigger.

-- Trigger: create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN lower(NEW.email) = 'dedudrylu@gmail.com' THEN 'admin'
      ELSE 'member'
    END
  );
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM PUBLIC, anon;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Admin-only function to change a user's role
CREATE OR REPLACE FUNCTION set_user_role(p_user uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_role NOT IN ('member', 'admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  UPDATE profiles SET role = p_role WHERE id = p_user;
END;
$$;

REVOKE EXECUTE ON FUNCTION set_user_role(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION set_user_role(uuid, text) TO authenticated;
