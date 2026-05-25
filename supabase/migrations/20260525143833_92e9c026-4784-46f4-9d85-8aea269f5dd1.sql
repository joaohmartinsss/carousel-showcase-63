
CREATE TABLE public.offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  images TEXT[] NOT NULL DEFAULT '{}'::text[],
  cta_url TEXT,
  cta_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view offerings" ON public.offerings FOR SELECT USING (true);
CREATE POLICY "Admins can insert offerings" ON public.offerings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update offerings" ON public.offerings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete offerings" ON public.offerings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_offerings_updated_at
BEFORE UPDATE ON public.offerings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.offerings (slug, title, tagline, description, sections, cta_url, cta_label, sort_order) VALUES
(
  'brand-sprints',
  'Brand Sprints',
  'Brand design in 4 weeks.',
  'A focused 4-week sprint to take a brand from strategy to a fully usable system. Instead of a long branding process, it''s a structured engagement designed for clarity, speed, and real-world application.',
  '[
    {"heading":"Week 1 — Strategy","body":"Review of existing materials (brand positioning, messaging, internal docs) followed by a Brand Strategy Workshop (2h–4h) with key stakeholders. We align on positioning, audience, and brand direction — creating a clear foundation for all creative work."},
    {"heading":"Week 2 — Exploration","body":"Presentation of 3 distinct logo and visual directions. Each direction reflects a clear strategic approach. We review the directions together on a Concept Presentation by the end of Week 2 and select one path forward."},
    {"heading":"Week 3 — Design","body":"Refinement and development of the selected direction into a cohesive visual system. By the end of Week 3, a final brand direction is presented for approval."},
    {"heading":"Week 4 — Finalization","body":"Delivery of a complete brand system, including: logo suite, typography and color system, graphic language and visual assets. Applications: stationery, pitch and sales deck concepts, website concept (key screens), employee merch, social media concepts. Deliverables: a short, practical brand book and full asset package."},
    {"heading":"Outcome","body":"A brand that is clear, distinctive, and ready to be used by your team and external partners — from internal execution to agencies and vendors."},
    {"heading":"Investment","body":"$5,000 USD — 50% upfront to initiate the project, 50% upon final delivery."}
  ]'::jsonb,
  'https://cal.com',
  'Book a call',
  1
),
(
  'inner-circle',
  'Inner Circle',
  'Ongoing design support, on a monthly retainer.',
  'Ongoing design support tailored to your brand through a flexible monthly retainer. Consistent creative execution, strategic input, and direct collaboration.',
  '[
    {"heading":"Branding","body":"Visual Identity Extensions, Illustration, Brand Refresh, Brand Guidelines, Asset Creation. Branding work within the retainer focuses on continuing and expanding an existing identity — not building one from scratch. Logo design and full brand concepts are available as a separate engagement."},
    {"heading":"Print","body":"Event Collateral, Booth Design, Stationery, Packaging, Merch."},
    {"heading":"Marketing","body":"Social Media Visuals, Templates, Ad Design Visuals, Resource Thumbnails, Presentations."},
    {"heading":"Editorial","body":"Ebooks, Guides, Reports, Brochures, Infographics."},
    {"heading":"Web Content","body":"Website Sections, Graphics, Visual Content and Concepts. Web content is included, but scoped to visuals: website sections, hero concepts, graphics, and specific images. Full website builds, user journeys, UX flows, and information architecture are outside the scope."},
    {"heading":"Not included","body":"3D modeling, animated graphics (GIFs, etc.), video production, complex packaging, extensive print design (magazines, books, etc.), Adobe InDesign documents, copywriting, or full website builds (UX, user journeys, information architecture)."},
    {"heading":"Investment","body":"$3,700/mo — for consistent, focused design support. 1 active task at a time (sequential delivery for steady focus). Unlimited requests and revisions. Standard turnaround."},
    {"heading":"Pause or cancel anytime","body":"Billing runs on 31-day cycles. Pause mid-cycle and your remaining days are saved. Cancel anytime — you''re only charged for the days you used."},
    {"heading":"How it works","body":"No new tools to learn. I plug into the communication and project management apps your team already uses. Every active request gets a daily progress update. Timelines are set at the start of each task. All design is presented in Figma."}
  ]'::jsonb,
  'https://cal.com',
  'Book a call',
  2
);
