/*
# Lock down profiles column privileges

The first migration created profiles but the security posture shows
authenticated and anon still have table-wide SELECT/INSERT/UPDATE/DELETE
with all columns updatable. This migration narrows those grants so the
`role` column cannot be written by clients via the Data API.

1. Revoke all table-level privileges from anon and authenticated
2. Re-grant only what's needed:
   - authenticated: SELECT (own row via policy), UPDATE (email only)
   - anon: nothing (app requires sign-in)
3. The `role` column is now only writable by the SECURITY DEFINER
   functions (handle_new_user trigger, set_user_role) which run as owner.
*/

REVOKE SELECT, INSERT, UPDATE, DELETE ON profiles FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON profiles FROM authenticated;

GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE (email) ON profiles TO authenticated;
