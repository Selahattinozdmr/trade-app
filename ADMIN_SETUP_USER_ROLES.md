# Admin Setup for user_roles Table

## Database Schema Setup

Your existing table structure:

```sql
CREATE TABLE public.user_roles (
  id uuid references auth.users not null primary key,
  role text not null check (role in ('user', 'admin', 'super_admin')),
  created_at timestamp with time zone default now()
);
```

## Additional Setup (Row Level Security)

Run this SQL in your Supabase SQL editor to add RLS policies:

```sql
-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all user roles" ON public.user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Super admins can update user roles" ON public.user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Super admins can delete user roles" ON public.user_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Function to automatically create user role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user role creation
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
```

## Creating Your First Admin User

### Step 1: Create a regular user

1. Use your sign-up form to create a regular user account
2. Or create one directly in Supabase Dashboard → Authentication → Users

### Step 2: Make the user an admin

Replace `YOUR_USER_ID` with the actual user ID from the auth.users table:

```sql
-- Update user role to admin
UPDATE public.user_roles
SET role = 'admin'
WHERE id = 'YOUR_USER_ID';

-- Or insert if the user doesn't have a role record yet
INSERT INTO public.user_roles (id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (id)
DO UPDATE SET role = 'admin';

-- To make a super admin:
UPDATE public.user_roles
SET role = 'super_admin'
WHERE id = 'YOUR_USER_ID';
```

### Step 3: Test admin access

1. Go to `/admin/sign-in`
2. Sign in with your admin user credentials
3. You should be redirected to `/admin/dashboard`

## Quick Admin Setup Query

If you know the email address, you can use this query to make a user admin:

```sql
-- Make user admin by email
UPDATE public.user_roles
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
);

-- Make user super admin by email
UPDATE public.user_roles
SET role = 'super_admin'
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'superadmin@example.com'
);
```

## Role Hierarchy

- **user**: Regular user (default)
- **admin**: Can access admin dashboard, view/delete users and items
- **super_admin**: Can access admin dashboard, view/delete users and items, and manage other admin roles

That's it! Your admin system is now set up with the `user_roles` table structure and supports both `admin` and `super_admin` roles.
