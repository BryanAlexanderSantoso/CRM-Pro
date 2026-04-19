-- Drop tables if they exist
drop table if exists public.activity_logs;
drop table if exists public.tasks;
drop table if exists public.sales;
drop table if exists public.customers;
drop table if exists public.profiles;

-- Create Profiles Table (for RBAC)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    role text check (role in ('admin', 'manager', 'sales')) default 'sales',
    full_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Customers Table
create table public.customers (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text,
    phone text,
    company text,
    status text check (status in ('lead', 'prospect', 'customer')) default 'lead',
    lead_score integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Sales Table
create table public.sales (
    id uuid default gen_random_uuid() primary key,
    customer_id uuid references public.customers(id) on delete cascade not null,
    product_name text not null,
    amount numeric(10, 2) not null default 0,
    status text check (status in ('pending', 'completed', 'cancelled')) default 'pending',
    date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Tasks Table
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    due_date timestamp with time zone not null,
    status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
    customer_id uuid references public.customers(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Activity Logs Table
create table public.activity_logs (
    id uuid default gen_random_uuid() primary key,
    action text not null,
    entity text not null,
    entity_id uuid,
    details text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_logs enable row level security;

-- Create policies for Authenticated users to have full access (Simplified for development)
create policy "Allow full access to authenticated users for profiles" on public.profiles for all to authenticated using (true) with check (true);
create policy "Allow full access to authenticated users for customers" on public.customers for all to authenticated using (true) with check (true);
create policy "Allow full access to authenticated users for sales" on public.sales for all to authenticated using (true) with check (true);
create policy "Allow full access to authenticated users for tasks" on public.tasks for all to authenticated using (true) with check (true);
create policy "Allow full access to authenticated users for activity_logs" on public.activity_logs for all to authenticated using (true) with check (true);

-- Insert dummy data (Optional)
insert into public.customers (name, email, phone, company, status, lead_score) values 
('John Doe', 'john@example.com', '123456789', 'Acme Corp', 'customer', 95),
('Jane Smith', 'jane@example.com', '987654321', 'Globex', 'prospect', 60);

insert into public.sales (customer_id, product_name, amount, status) 
select id, 'Premium Subscription', 500.00, 'completed' from public.customers limit 1;

insert into public.tasks (title, description, due_date, status) values
('Call John Doe', 'Discuss contract renewal', now() + interval '1 day', 'todo');

insert into public.activity_logs (action, entity, details) values
('created', 'system', 'CRM System Initialized');
