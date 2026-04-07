-- Add category support for bar brands (admin-managed)
alter table if exists public.bar_brands
add column if not exists category text;

update public.bar_brands
set category = 'wines'
where category is null or btrim(category) = '';

alter table if exists public.bar_brands
alter column category set default 'wines';

alter table if exists public.bar_brands
alter column category set not null;

alter table if exists public.bar_brands
drop constraint if exists bar_brands_category_check;

alter table if exists public.bar_brands
add constraint bar_brands_category_check
check (category in ('wines', 'cans', 'beers', 'whiskey', 'vodka'));
