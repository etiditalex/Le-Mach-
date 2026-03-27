-- Alcohol / bar brands for Bar & Restaurant page (admin-managed, images in Storage)

create table if not exists public.bar_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists bar_brands_sort_idx on public.bar_brands (sort_order, name);

alter table public.bar_brands enable row level security;

-- Storage bucket for uploaded brand photos (public read; uploads via service role API)
insert into storage.buckets (id, name, public, file_size_limit)
values ('bar-brands', 'bar-brands', true, 5242880)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;
