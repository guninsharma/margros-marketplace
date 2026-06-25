-- Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Reusable updated_at Trigger Function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. Table: restaurants
create table public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  locality text not null,
  full_address text,
  city text default 'Bengaluru',
  cuisine_type text[],
  category text,
  phone text,
  email text,
  google_maps_url text,
  rating numeric(2,1),
  review_count integer,
  is_verified boolean default false,
  verification_notes text,
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Table: staff
create table public.staff (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  photo_url text,
  department text not null,
  role_title text,
  experience_years integer,
  locality text not null,
  city text default 'Bengaluru',
  languages text[],
  salary_expectation integer,
  mobile text,
  type text,
  agency_name text,
  is_verified boolean default false,
  is_available boolean default true,
  verification_notes text,
  source_platform text,
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Table: vendors
create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  category_group text not null,
  category text not null,
  description text,
  locality text not null,
  city text default 'Bengaluru',
  phone text,
  email text,
  whatsapp text,
  contact_person_name text,
  is_verified boolean default false,
  verification_notes text,
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Table: contact_logs
create table public.contact_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_type text not null,
  listing_id uuid not null,
  contacted_at timestamptz default now()
);

-- 5. Table: profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'owner',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Triggers for updated_at
create trigger handle_updated_at before update on public.restaurants
  for each row execute procedure public.set_updated_at();

create trigger handle_updated_at before update on public.staff
  for each row execute procedure public.set_updated_at();

create trigger handle_updated_at before update on public.vendors
  for each row execute procedure public.set_updated_at();

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Trigger for Auto-Creating Profiles on Auth User Creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'owner'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Similarity Match Functions for Vector Search
create or replace function public.match_staff (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  full_name text,
  photo_url text,
  department text,
  role_title text,
  experience_years integer,
  locality text,
  is_verified boolean,
  similarity float
)
language sql stable
as $$
  select
    staff.id,
    staff.full_name,
    staff.photo_url,
    staff.department,
    staff.role_title,
    staff.experience_years,
    staff.locality,
    staff.is_verified,
    1 - (staff.embedding <=> query_embedding) as similarity
  from public.staff
  where staff.is_available = true
    and 1 - (staff.embedding <=> query_embedding) > match_threshold
  order by staff.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.match_vendors (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  business_name text,
  category_group text,
  category text,
  description text,
  locality text,
  is_verified boolean,
  similarity float
)
language sql stable
as $$
  select
    vendors.id,
    vendors.business_name,
    vendors.category_group,
    vendors.category,
    vendors.description,
    vendors.locality,
    vendors.is_verified,
    1 - (vendors.embedding <=> query_embedding) as similarity
  from public.vendors
  where 1 - (vendors.embedding <=> query_embedding) > match_threshold
  order by vendors.embedding <=> query_embedding
  limit match_count;
$$;

-- Enable Row Level Security (RLS) on all tables
alter table public.restaurants enable row level security;
alter table public.staff enable row level security;
alter table public.vendors enable row level security;
alter table public.contact_logs enable row level security;
alter table public.profiles enable row level security;

-- RLS Policies
create policy "Allow public read access" on public.restaurants for select using (true);
create policy "Allow public read access" on public.staff for select using (true);
create policy "Allow public read access" on public.vendors for select using (true);

create policy "Allow authenticated users to insert their own logs" on public.contact_logs
  for insert with check (auth.uid() = user_id);

create policy "Allow users to view their own logs" on public.contact_logs
  for select using (auth.uid() = user_id);

create policy "Allow users to view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Indexes
create index idx_restaurants_locality on public.restaurants (locality);
create index idx_restaurants_cuisine_type on public.restaurants using gin (cuisine_type);
create index idx_restaurants_category on public.restaurants (category);

create index idx_staff_locality on public.staff (locality);
create index idx_staff_department on public.staff (department);
create index idx_staff_type on public.staff (type);
create index idx_staff_is_available on public.staff (is_available);

create index idx_vendors_locality on public.vendors (locality);
create index idx_vendors_category_group on public.vendors (category_group);
create index idx_vendors_category on public.vendors (category);

create index idx_contact_logs_user_id on public.contact_logs (user_id);
create index idx_contact_logs_listing_id on public.contact_logs (listing_id);
create index idx_contact_logs_user_listing on public.contact_logs (user_id, listing_id);
