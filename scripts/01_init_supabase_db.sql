-- This script is for initializing the Supabase database.
-- Since authentication is removed, this script will only contain
-- a placeholder comment. If you add other data models later,
-- you can add their table creation statements here.

-- No tables are created for user authentication in this version.

-- Create a table for public profiles
-- create table profiles (
--   id uuid references auth.users on delete cascade not null primary key,
--   updated_at timestamp with time zone,
--   full_name text,
--   avatar_url text,
--   website text,
--   -- Add any other profile fields you need
--   constraint username_length check (char_length(full_name) >= 3)
-- );

-- Set up Row Level Security (RLS)
-- -- Enable RLS on the profiles table
-- alter table profiles enable row level security;

-- -- Create policy for authenticated users to view their own profile
-- create policy "Public profiles are viewable by authenticated users only."
--   on profiles for select using (auth.role() = 'authenticated');

-- -- Create policy for authenticated users to insert their own profile
-- create policy "Users can insert their own profile."
--   on profiles for insert with check (auth.uid() = id);

-- -- Create policy for authenticated users to update their own profile
-- create policy "Users can update own profile."
--   on profiles for update using (auth.uid() = id);

-- -- This trigger automatically creates a profile entry when a new user signs up
-- create function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.profiles (id, full_name, avatar_url)
--   values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- -- create trigger on_auth_user_created
-- --   after insert on auth.users
-- --   for each row execute procedure public.handle_new_user();

-- Optional: Add a function to update user email in auth.users table if needed
-- This is typically handled by Supabase's auth system directly, but if you need a custom flow:
-- create function public.update_user_email(new_email text)
-- returns void as $$
-- begin
--   update auth.users
--   set email = new_email
--   where id = auth.uid();
-- end;
-- $$ language plpgsql security definer;
