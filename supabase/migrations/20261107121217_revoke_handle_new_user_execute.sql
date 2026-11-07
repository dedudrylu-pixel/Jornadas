/*
# Revoke execute on handle_new_user from authenticated

The trigger function handle_new_user() is SECURITY DEFINER and should
only fire via the auth.users INSERT trigger — never via the REST API.
The default PUBLIC grant meant authenticated could call it as an RPC.
Revoke EXECUTE from authenticated so only the trigger (running as owner)
invokes it.

set_user_role() remains executable by authenticated: it is intentionally
an RPC that performs its own admin authorization check internally.
*/

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM authenticated;
