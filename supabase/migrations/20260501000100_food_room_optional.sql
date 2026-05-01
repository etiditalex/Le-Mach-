-- Make food order room number optional (nullable).
alter table public.food_orders alter column room_number drop not null;

