-- Editable marketing snippets (admin CMS)

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists site_content_slug_idx on public.site_content (slug);

alter table public.site_content enable row level security;

insert into public.site_content (slug, title, body) values
  ('tagline_home', 'Homepage tagline', 'Luxury hotel and accommodations in Kilifi County, Kenya.'),
  ('footer_note', 'Footer note', 'Thank you for choosing Lemach Hotel.')
on conflict (slug) do nothing;
