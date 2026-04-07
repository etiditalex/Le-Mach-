-- Expand allowed categories for admin-managed bar brands
alter table if exists public.bar_brands
drop constraint if exists bar_brands_category_check;

alter table if exists public.bar_brands
add constraint bar_brands_category_check
check (
  category in (
    'wines',
    'cans',
    'beers',
    'whiskey',
    'vodka',
    'shots',
    'tequila',
    'rum-spirits',
    'creams-liqueurs'
  )
);
