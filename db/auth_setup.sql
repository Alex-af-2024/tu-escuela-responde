-- ============================================================
-- TuEscuelaResponde — Supabase Auth Setup Migration
-- Run this in the Supabase Dashboard SQL Editor
-- AFTER the base schema.sql has been applied.
-- ============================================================

-- ============================================================
-- 1. Add auth_uid column to usuario table
-- ============================================================
-- Links each application user to their Supabase Auth identity.

ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS auth_uid UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

COMMENT ON COLUMN usuario.auth_uid IS 'References auth.users(id) — Supabase Auth identity';

-- Create index for fast lookups by auth UID
CREATE INDEX IF NOT EXISTS idx_usuario_auth_uid ON usuario(auth_uid);


-- ============================================================
-- 2. Domain restriction trigger on auth.users
-- ============================================================
-- Rejects any signup whose email does not end with
-- @alumnos.santotomas.cl. This is the server-side enforcement
-- that cannot be bypassed from the client.

CREATE OR REPLACE FUNCTION public.check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email IS NULL OR
       NEW.email NOT LIKE '%@alumnos.santotomas.cl' THEN
        RAISE EXCEPTION 'Solo se permiten correos @alumnos.santotomas.cl';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_email_domain ON auth.users;
CREATE TRIGGER enforce_email_domain
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_email_domain();


-- ============================================================
-- 3. Auto-create usuario row on signup
-- ============================================================
-- When a new user signs up via Supabase Auth, automatically
-- insert a corresponding row in the usuario table with
-- rol = 'estudiante' (hardcoded for security).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuario (
        correo_institucional,
        rol,
        nombre_display,
        auth_uid
    ) VALUES (
        NEW.email,
        'estudiante',
        COALESCE(NEW.raw_user_meta_data->>'nombre_display', split_part(NEW.email, '@', 1)),
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 4. Enable Row Level Security (RLS)
-- ============================================================

ALTER TABLE escuela    ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrera    ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoridad  ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario    ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 5. RLS Policies — usuario
-- ============================================================

-- Users can read their own profile
DROP POLICY IF EXISTS "usuario_select_own" ON usuario;
CREATE POLICY "usuario_select_own"
    ON usuario FOR SELECT
    USING (auth.uid() = auth_uid);

-- Admins can read all user profiles
DROP POLICY IF EXISTS "usuario_select_admin" ON usuario;
CREATE POLICY "usuario_select_admin"
    ON usuario FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuario u
            WHERE u.auth_uid = auth.uid()
              AND u.rol = 'admin'
        )
    );

-- Users can update their own display name
DROP POLICY IF EXISTS "usuario_update_own" ON usuario;
CREATE POLICY "usuario_update_own"
    ON usuario FOR UPDATE
    USING (auth.uid() = auth_uid)
    WITH CHECK (
        auth.uid() = auth_uid
        -- Prevent users from changing their own role
        AND rol = (SELECT u.rol FROM usuario u WHERE u.auth_uid = auth.uid())
    );


-- ============================================================
-- 6. RLS Policies — escuela, carrera, autoridad
-- ============================================================
-- READ policies are defined in rls_policies.sql (public access).
-- Only admin WRITE policies are kept here.

-- Only admins can insert/update/delete schools
DROP POLICY IF EXISTS "escuela_modify_admin" ON escuela;
CREATE POLICY "escuela_modify_admin"
    ON escuela FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM usuario u
            WHERE u.auth_uid = auth.uid()
              AND u.rol = 'admin'
        )
    );

-- Only admins can modify careers
DROP POLICY IF EXISTS "carrera_modify_admin" ON carrera;
CREATE POLICY "carrera_modify_admin"
    ON carrera FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM usuario u
            WHERE u.auth_uid = auth.uid()
              AND u.rol = 'admin'
        )
    );

-- Only admins can modify authorities
DROP POLICY IF EXISTS "autoridad_modify_admin" ON autoridad;
CREATE POLICY "autoridad_modify_admin"
    ON autoridad FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM usuario u
            WHERE u.auth_uid = auth.uid()
              AND u.rol = 'admin'
        )
    );


-- ============================================================
-- 7. Require email verification in Supabase Dashboard
-- ============================================================
-- NOTE: Email verification is configured in the Supabase
-- Dashboard under Authentication → Settings:
--   ✅ Enable email confirmations
--   ✅ Secure email change (double confirmation)
--
-- The frontend checks `user.email_confirmed_at` to ensure
-- the user has verified their email before accessing the app.
