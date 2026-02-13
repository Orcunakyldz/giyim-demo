-- Add Customer Details to Profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' and column_name='name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' and column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' and column_name='city') THEN
        ALTER TABLE public.profiles ADD COLUMN city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' and column_name='district') THEN
        ALTER TABLE public.profiles ADD COLUMN district TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' and column_name='address') THEN
        ALTER TABLE public.profiles ADD COLUMN address TEXT;
    END IF;
END $$;

-- Update RLS for profiles (Enable users to update their own data)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);
