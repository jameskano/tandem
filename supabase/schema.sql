-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create couples table
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memberships table
CREATE TABLE memberships (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, couple_id)
);

-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration INTEGER, -- in minutes
  cost TEXT CHECK (cost IN ('free', 'low', 'medium', 'high')),
  location TEXT CHECK (location IN ('home', 'outdoor', 'indoor', 'travel')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  end_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  activity_id UUID REFERENCES activities(id),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target INTEGER NOT NULL CHECK (target > 0),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0),
  unit TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moments table
CREATE TABLE moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_devices table for push notifications
CREATE TABLE user_devices (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, fcm_token)
);

-- Create indexes for better performance
CREATE INDEX idx_plans_couple_id ON plans(couple_id);
CREATE INDEX idx_plans_start_ts ON plans(start_ts);
CREATE INDEX idx_goals_couple_id ON goals(couple_id);
CREATE INDEX idx_moments_couple_id ON moments(couple_id);
CREATE INDEX idx_moments_created_at ON moments(created_at);
CREATE INDEX idx_memberships_couple_id ON memberships(couple_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Couples can be read by members
CREATE POLICY "Couples readable by members" ON couples
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = couples.id AND user_id = auth.uid()
    )
  );

-- Memberships are readable by the user
CREATE POLICY "Memberships readable by user" ON memberships
  FOR SELECT USING (user_id = auth.uid());

-- Plans are readable by couple members
CREATE POLICY "Plans readable by couple members" ON plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = plans.couple_id AND user_id = auth.uid()
    )
  );

-- Plans are writable by couple members
CREATE POLICY "Plans writable by couple members" ON plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = plans.couple_id AND user_id = auth.uid()
    )
  );

-- Goals are readable by couple members
CREATE POLICY "Goals readable by couple members" ON goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = goals.couple_id AND user_id = auth.uid()
    )
  );

-- Goals are writable by couple members
CREATE POLICY "Goals writable by couple members" ON goals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = goals.couple_id AND user_id = auth.uid()
    )
  );

-- Moments are readable by couple members
CREATE POLICY "Moments readable by couple members" ON moments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = moments.couple_id AND user_id = auth.uid()
    )
  );

-- Moments are writable by couple members
CREATE POLICY "Moments writable by couple members" ON moments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE couple_id = moments.couple_id AND user_id = auth.uid()
    )
  );

-- User devices are readable/writable by the user
CREATE POLICY "User devices readable by user" ON user_devices
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "User devices writable by user" ON user_devices
  FOR ALL USING (user_id = auth.uid());

-- Create storage bucket for moments
INSERT INTO storage.buckets (id, name, public) VALUES ('moments', 'moments', true);

-- Storage policies for moments bucket
CREATE POLICY "Moments are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'moments');

CREATE POLICY "Authenticated users can upload moments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'moments' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their moments" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'moments' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their moments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'moments' AND 
    auth.role() = 'authenticated'
  );
