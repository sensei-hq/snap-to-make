alter table snap.scenes enable row level security;
-- P1: no policies => anon/authenticated denied; server uses service_role (bypasses RLS). Kavach policies land in P2.
