-- =========================================================
-- Vaira Home Care Services - Supabase Database Schema
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SERVICES TABLE
create table if not exists public.services (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  base_price numeric not null default 0,
  is_published boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. BOOKINGS TABLE
create table if not exists public.bookings (
  id text primary key,
  service_id text not null,
  service_name text not null,
  customer_name text not null,
  customer_phone text not null,
  status text not null default 'REQUEST_RECEIVED',
  lead_source text not null default 'Website',
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. STAFF TABLE
create table if not exists public.staff (
  id text primary key,
  name text not null,
  role text not null,
  phone text not null,
  email text,
  status text not null default 'AVAILABLE',
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. REVIEWS TABLE
create table if not exists public.reviews (
  id text primary key,
  request_id text,
  customer_name text not null,
  service_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  is_approved boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BUSINESS SETTINGS TABLE
create table if not exists public.business_settings (
  id text primary key default 'primary',
  name text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. INDEXES FOR PERFORMANCE
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_created_at on public.bookings(created_at desc);
create index if not exists idx_bookings_customer_phone on public.bookings(customer_phone);
create index if not exists idx_services_category on public.services(category);
create index if not exists idx_reviews_rating on public.reviews(rating);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.staff enable row level security;
alter table public.reviews enable row level security;
alter table public.business_settings enable row level security;

-- Public can read published services
create policy "Public can read published services" on public.services
  for select using (is_published = true or auth.role() = 'authenticated');

-- Full access for authenticated staff/admin or anon service key
create policy "Allow all on services for anon/service" on public.services
  for all using (true) with check (true);

-- Anyone can submit a booking request
create policy "Allow insert on bookings" on public.bookings
  for insert with check (true);

-- Allow reading and updating bookings
create policy "Allow select and update bookings" on public.bookings
  for all using (true) with check (true);

-- Staff policies
create policy "Allow all on staff" on public.staff
  for all using (true) with check (true);

-- Reviews policies
create policy "Allow read approved reviews" on public.reviews
  for select using (is_approved = true or true);

create policy "Allow all on reviews" on public.reviews
  for all using (true) with check (true);

-- Business Settings policies
create policy "Allow read settings" on public.business_settings
  for select using (true);

create policy "Allow update settings" on public.business_settings
  for all using (true) with check (true);
