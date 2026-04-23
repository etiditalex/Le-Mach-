-- Remove legacy Paystack columns now that payment flow is Daraja-only.
alter table if exists public.food_orders
  drop column if exists paystack;

alter table if exists public.bookings
  drop column if exists paystack;
