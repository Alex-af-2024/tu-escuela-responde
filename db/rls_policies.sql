-- ============================================================
-- TuEscuelaResponde — RLS Policies Migration
-- Run this in the Supabase Dashboard SQL Editor
-- AFTER auth_setup.sql has been applied.
--
-- Purpose: Update RLS policies per new requirements:
--   • escuela & carrera  → publicly readable (anon + auth)
--   • autoridad          → publicly readable at row level,
--                           but correo & telefono ONLY for
--                           authenticated users (column-level)
--   • usuario            → unchanged (own profile only)
-- ============================================================


-- ============================================================
-- 1. DROP existing policies that need to change
-- ============================================================
-- (Safe: DROP IF EXISTS prevents errors if run twice)

DROP POLICY IF EXISTS "escuela_select_authenticated"   ON escuela;
DROP POLICY IF EXISTS "carrera_select_authenticated"    ON carrera;
DROP POLICY IF EXISTS "autoridad_select_authenticated"  ON autoridad;


-- ============================================================
-- 2. PUBLIC READ — escuela (anon + authenticated)
-- ============================================================
-- Any visitor (logged in or not) can browse schools.

CREATE POLICY "escuela_select_public"
    ON escuela FOR SELECT
    USING (true);

COMMENT ON POLICY "escuela_select_public" ON escuela IS
    'Public: anyone can read school listings';


-- ============================================================
-- 3. PUBLIC READ — carrera (anon + authenticated)
-- ============================================================
-- Any visitor can browse academic programs.

CREATE POLICY "carrera_select_public"
    ON carrera FOR SELECT
    USING (true);

COMMENT ON POLICY "carrera_select_public" ON carrera IS
    'Public: anyone can read career listings';


-- ============================================================
-- 4. PUBLIC READ — autoridad rows (anon + authenticated)
-- ============================================================
-- Everyone can see authority rows (nombre, cargo, escuela, etc.)
-- but sensitive columns are controlled at the column level below.

CREATE POLICY "autoridad_select_public"
    ON autoridad FOR SELECT
    USING (true);

COMMENT ON POLICY "autoridad_select_public" ON autoridad IS
    'Public: anyone can see authority names and positions. Sensitive columns (correo, telefono) are protected via column-level privileges.';


-- ============================================================
-- 5. COLUMN-LEVEL PRIVILEGES — autoridad
-- ============================================================
-- PostgreSQL supports GRANT/REVOKE on individual columns.
-- Supabase PostgREST respects these: when anon queries the
-- table, correo & telefono will simply not appear in results.
--
-- Step A: REVOKE full-table SELECT from anon (if previously granted)
-- Step B: GRANT SELECT on non-sensitive columns to anon
-- Step C: GRANT SELECT on ALL columns to authenticated

-- Revoke any existing blanket permission
REVOKE SELECT ON autoridad FROM anon;

-- Grant anon access to non-sensitive columns only
GRANT SELECT (
    id_autoridad,
    nombre_completo,
    cargo,
    id_escuela,
    orden_jerarquico,
    activo,
    created_at,
    updated_at
) ON autoridad TO anon;

-- Authenticated users can see everything including contact info
GRANT SELECT ON autoridad TO authenticated;


-- ============================================================
-- 6. Ensure escuela & carrera are fully readable by anon
-- ============================================================
-- (PostgREST needs SELECT privilege on the table for anon)

GRANT SELECT ON escuela TO anon;
GRANT SELECT ON carrera TO anon;

-- Authenticated users also need full access
GRANT SELECT ON escuela TO authenticated;
GRANT SELECT ON carrera TO authenticated;


-- ============================================================
-- 7. PUBLIC VIEW — autoridad_publica (convenience)
-- ============================================================
-- Optional view for frontend use: always safe, never exposes
-- contact details regardless of who queries it.

CREATE OR REPLACE VIEW autoridad_publica AS
SELECT
    id_autoridad,
    nombre_completo,
    cargo,
    id_escuela,
    orden_jerarquico,
    activo,
    created_at,
    updated_at
FROM autoridad
WHERE activo = true
ORDER BY id_escuela, orden_jerarquico;

COMMENT ON VIEW autoridad_publica IS
    'Public-safe view of authorities — excludes correo and telefono';

-- Both roles can read the view
GRANT SELECT ON autoridad_publica TO anon;
GRANT SELECT ON autoridad_publica TO authenticated;


-- ============================================================
-- 8. EXISTING ADMIN POLICIES — kept unchanged
-- ============================================================
-- The following admin write policies from auth_setup.sql remain:
--   • escuela_modify_admin (INSERT/UPDATE/DELETE for admins)
--   • carrera_modify_admin  (INSERT/UPDATE/DELETE for admins)
--   • autoridad_modify_admin (INSERT/UPDATE/DELETE for admins)
--   • usuario_select_own / usuario_select_admin / usuario_update_own
--
-- No changes needed for those.


-- ============================================================
-- DONE ✅
-- ============================================================
-- Summary of access matrix:
--
-- ┌──────────────┬───────────────────┬──────────────────────┐
-- │ Resource      │ anon (public)     │ authenticated        │
-- ├──────────────┼───────────────────┼──────────────────────┤
-- │ escuela      │ ✅ SELECT *       │ ✅ SELECT *          │
-- │ carrera      │ ✅ SELECT *       │ ✅ SELECT *          │
-- │ autoridad    │ ✅ SELECT (basic) │ ✅ SELECT * (+ correo│
-- │              │    NO correo      │    + telefono)        │
-- │              │    NO telefono    │                      │
-- │ usuario      │ ❌ No access      │ ✅ Own profile only  │
-- └──────────────┴───────────────────┴──────────────────────┘
