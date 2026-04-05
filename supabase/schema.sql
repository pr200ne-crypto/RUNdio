-- RUNdio Database Schema & RLS Policies

-- 1. Enable RLS
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Table (User Metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

-- 3. Routes Table (Planned Routes)
CREATE TABLE IF NOT EXISTS public.routes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  distance_meters integer NOT NULL,
  coordinates jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Sessions Table (Running History)
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  route_id uuid REFERENCES public.routes,
  distance_meters integer NOT NULL,
  duration_seconds integer NOT NULL,
  poi_id text,
  created_at timestamptz DEFAULT now()
);

-- 5. RLS Policies

-- Profiles: Users can only read/write their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Routes: Users can only read/write their own routes
CREATE POLICY "Users can view own routes" ON public.routes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routes" ON public.routes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sessions: Users can only read/write their own sessions
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
