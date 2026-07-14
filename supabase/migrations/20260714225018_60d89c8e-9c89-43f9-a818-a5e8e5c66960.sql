
-- Restrict public bucket listing: only admins can list files via API (public URLs still work)
DROP POLICY IF EXISTS "Project images are publicly accessible" ON storage.objects;
CREATE POLICY "Admins can list project images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

-- Revoke direct RPC access to SECURITY DEFINER has_role from anon/authenticated
-- RLS policies invoke it via a wrapper in a non-exposed schema
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
