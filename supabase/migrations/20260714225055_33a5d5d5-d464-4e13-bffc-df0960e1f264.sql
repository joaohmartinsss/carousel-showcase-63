
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- Recreate policies to reference private.has_role instead of public.has_role
-- offerings
DROP POLICY IF EXISTS "Admins can insert offerings" ON public.offerings;
DROP POLICY IF EXISTS "Admins can update offerings" ON public.offerings;
DROP POLICY IF EXISTS "Admins can delete offerings" ON public.offerings;
CREATE POLICY "Admins can insert offerings" ON public.offerings FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update offerings" ON public.offerings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete offerings" ON public.offerings FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- projects table policies (recreate any using public.has_role)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
    FROM pg_policies
    WHERE (qual LIKE '%has_role%' OR with_check LIKE '%has_role%')
      AND NOT (schemaname='public' AND tablename='offerings')
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Recreate storage.objects admin policies + restricted listing
CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update project images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "Admins can list project images" ON storage.objects;
CREATE POLICY "Admins can list project images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'project-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Recreate projects table policies (admin full access + public read)
CREATE POLICY "Projects are publicly readable"
  ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles admin management
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Now drop the public.has_role function (it's no longer referenced)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
