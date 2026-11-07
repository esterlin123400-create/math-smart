-- ========================================================
-- Math Smart Platform: Complete Supabase Database Schema
-- منصة الرياضيات الذكية - مخطط قاعدة البيانات الشامل
-- ========================================================

-- 1. Create Profiles Table (حسابات الطلاب والمعلمين والمشرفين)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text not null,
  role text not null check (role in ('student', 'teacher', 'supervisor', 'admin')) default 'student',
  grade text default 'الصف السادس الابتدائي',
  school text default 'مدرسة رواد المعرفة',
  avatar_url text default '/assets/avatar_fahad_hero.svg',
  xp integer default 100,
  level integer default 1,
  streak integer default 1,
  accuracy numeric(5,2) default 95.0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Allow public read of profiles"
  on public.profiles for select
  using (true);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow users to insert their profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. Create Quiz Results Table (نتائج الاختبارات والتقييم الذكي)
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  exam_title text not null,
  grade text default 'الصف السادس الابتدائي',
  score integer not null,
  total_questions integer not null,
  correct_answers integer not null,
  earned_xp integer default 0,
  duration text,
  ai_feedback jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.quiz_results enable row level security;

create policy "Students can view their own quiz results"
  on public.quiz_results for select
  using (auth.uid() = student_id or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'supervisor')
  ));

create policy "Students can insert their quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = student_id);

-- 3. Create Badges Table (أوسمة وشارات الإنجاز للطالب)
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  badge_name text not null,
  badge_icon text not null,
  badge_desc text,
  earned_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.badges enable row level security;

create policy "Anyone can view badges"
  on public.badges for select
  using (true);

create policy "System or owner can manage badges"
  on public.badges for insert
  with check (auth.uid() = profile_id);

-- 4. Create Challenge Rooms Table (حلبة التحدي المباشر)
create table if not exists public.challenge_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  host_id uuid references public.profiles(id) on delete set null,
  guest_id uuid references public.profiles(id) on delete set null,
  topic text default 'العمليات على الدوال والمعادلات',
  grade text default 'الصف السادس الابتدائي',
  host_score integer default 0,
  guest_score integer default 0,
  status text check (status in ('waiting', 'in_progress', 'completed')) default 'waiting',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.challenge_rooms enable row level security;

create policy "Anyone can view and join active challenge rooms"
  on public.challenge_rooms for select
  using (true);

create policy "Authenticated users can create challenge rooms"
  on public.challenge_rooms for insert
  with check (auth.role() = 'authenticated');

create policy "Participants can update challenge room state"
  on public.challenge_rooms for update
  using (auth.uid() = host_id or auth.uid() = guest_id);

-- 5. Automatic User Profile Trigger on Sign Up
-- يقوم بإنشاء ملف تعريف تلقائي للمستخدم فور تسجيله عبر Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, grade, school, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'grade', 'الصف السادس الابتدائي'),
    coalesce(new.raw_user_meta_data->>'school', 'مدرسة رواد المعرفة'),
    coalesce(new.raw_user_meta_data->>'avatar_url', '/assets/avatar_fahad_hero.svg')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime for Live Challenge Arena (تفعيل الوقت الفعلي لحلبة التحدي)
alter publication supabase_realtime add table public.challenge_rooms;
alter publication supabase_realtime add table public.quiz_results;

