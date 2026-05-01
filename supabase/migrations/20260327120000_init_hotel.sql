-- Lemach hotel: catalog, orders, bookings, notifications
-- Run via Supabase CLI (`supabase db push`) or paste in SQL Editor.

create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  image text not null,
  category text not null
);

create table if not exists public.rooms (
  id text primary key,
  name text not null,
  price_per_night integer not null check (price_per_night >= 0),
  image text not null,
  description text not null default ''
);

create table if not exists public.food_orders (
  id uuid primary key,
  status text not null
    check (status in ('awaiting_payment', 'processing_mpesa', 'paid', 'failed', 'cancelled')),
  lines jsonb not null default '[]'::jsonb,
  total_kes integer not null check (total_kes >= 0),
  room_number text not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  receipt_key text not null,
  payment_provider text,
  mpesa jsonb,
  last_error text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.bookings (
  id uuid primary key,
  status text not null
    check (status in ('awaiting_payment', 'processing_mpesa', 'paid', 'failed', 'cancelled')),
  room_id text not null references public.rooms (id),
  room_name text not null,
  price_per_night integer not null,
  nights integer not null check (nights >= 1),
  total_kes integer not null check (total_kes >= 0),
  check_in date not null,
  check_out date not null,
  guests integer not null check (guests >= 1),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  special_requests text not null default '',
  receipt_key text not null,
  payment_provider text,
  mpesa jsonb,
  last_error text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('food_created', 'booking_created', 'food_paid', 'booking_paid')),
  title text not null,
  body text not null,
  entity_id text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists food_orders_created_at_idx on public.food_orders (created_at desc);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists food_orders_mpesa_checkout_idx on public.food_orders ((mpesa ->> 'checkoutRequestId'));
create index if not exists bookings_mpesa_checkout_idx on public.bookings ((mpesa ->> 'checkoutRequestId'));

alter table public.menu_items enable row level security;
alter table public.rooms enable row level security;
alter table public.food_orders enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_notifications enable row level security;

-- Seed rooms
insert into public.rooms (id, name, price_per_night, image, description) values
  (
    'standard',
    'Standard Room',
    4500,
    'https://res.cloudinary.com/dyfnobo9r/image/upload/f_auto,q_auto,w_1200/v1773837496/LEMACHGARDENS12of5621_d09e4v.jpg',
    'Comfortable stay with essentials.'
  ),
  (
    'deluxe',
    '2 Bedroom Deluxe',
    8000,
    'https://res.cloudinary.com/dyfnobo9r/image/upload/f_auto,q_auto,w_1200/v1773839990/LEMACHGARDENS333of562_kjjury.jpg',
    'Spacious deluxe accommodation.'
  ),
  (
    'family',
    'Family Suite',
    10000,
    'https://res.cloudinary.com/dyfnobo9r/image/upload/f_auto,q_auto,w_1200/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg',
    'Ideal for families.'
  )
on conflict (id) do nothing;

-- Seed menu (matches data/menuItems.ts)
insert into public.menu_items (id, name, description, price, image, category) values
  ('breakfast-1', 'Continental Breakfast', 'Fresh pastries, butter, jam, and your choice of coffee or tea', 1200, 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?auto=format&w=900&q=80', 'breakfast'),
  ('breakfast-2', 'Full English Breakfast', 'Eggs, bacon, sausages, baked beans, mushrooms, and toast', 1800, 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&w=900&q=80', 'breakfast'),
  ('lunch-1', 'Grilled Chicken Salad', 'Fresh mixed greens with grilled chicken, cherry tomatoes, and balsamic dressing', 1500, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=900&q=80', 'lunch'),
  ('lunch-2', 'Classic Beef Burger', 'Juicy beef patty with lettuce, tomato, cheese, and special sauce', 1300, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&w=900&q=80', 'lunch'),
  ('lunch-3', 'Pilau Rice', 'Fragrant spiced rice with tender meat and aromatic spices', 1600, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&w=900&q=80', 'lunch'),
  ('dinner-1', 'Grilled Salmon', 'Fresh salmon fillet with seasonal vegetables and lemon butter sauce', 2500, 'https://images.unsplash.com/photo-1467003909585-2f8a72719488?auto=format&w=900&q=80', 'dinner'),
  ('dinner-2', 'Beef Tenderloin', 'Premium beef tenderloin with roasted potatoes and red wine reduction', 3200, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&w=900&q=80', 'dinner'),
  ('dinner-3', 'Nyama Choma', 'Traditional Kenyan grilled meat served with ugali and kachumbari', 2800, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&w=900&q=80', 'dinner'),
  ('dessert-1', 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 800, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&w=900&q=80', 'desserts'),
  ('dessert-2', 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream', 900, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&w=900&q=80', 'desserts'),
  ('beverage-1', 'Fresh Fruit Juice', 'Selection of fresh seasonal fruit juices - mango, passion fruit, or orange', 400, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&w=900&q=80', 'beverages'),
  ('beverage-2', 'Premium Coffee', 'Freshly brewed coffee from local Kenyan beans', 300, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&w=900&q=80', 'beverages')
on conflict (id) do nothing;
