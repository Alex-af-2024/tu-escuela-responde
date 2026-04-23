-- ============================================================
-- TuEscuelaResponde — Common Queries Reference
-- These are the raw SQL equivalents of the Supabase JS queries
-- in frontend/src/lib/api.ts
-- ============================================================


-- ============================================================
-- 1. Get all escuelas
-- ============================================================

SELECT id_escuela, nombre, descripcion, ubicacion
FROM escuela
ORDER BY nombre ASC;


-- ============================================================
-- 2. Get a single escuela by ID
-- ============================================================

SELECT id_escuela, nombre, descripcion, ubicacion
FROM escuela
WHERE id_escuela = :id_escuela;


-- ============================================================
-- 3. Get carreras by escuela
-- ============================================================

SELECT c.id_carrera, c.nombre, c.id_escuela,
       e.nombre AS escuela_nombre
FROM carrera c
JOIN escuela e ON e.id_escuela = c.id_escuela
WHERE c.id_escuela = :id_escuela
ORDER BY c.nombre ASC;


-- ============================================================
-- 4. Get all carreras (with escuela name)
-- ============================================================

SELECT c.id_carrera, c.nombre, c.id_escuela,
       e.nombre AS escuela_nombre
FROM carrera c
JOIN escuela e ON e.id_escuela = c.id_escuela
ORDER BY e.nombre ASC, c.nombre ASC;


-- ============================================================
-- 5. Get autoridades by escuela (sorted by hierarchy)
-- ============================================================
-- Public users: correo and telefono will be NULL/hidden
-- Authenticated users: all columns returned

SELECT id_autoridad, nombre_completo, cargo,
       correo, telefono,          -- ← only visible if authenticated
       id_escuela, orden_jerarquico, activo
FROM autoridad
WHERE id_escuela = :id_escuela
  AND activo = true
ORDER BY orden_jerarquico ASC;


-- ============================================================
-- 6. Get autoridades by carrera
-- ============================================================
-- Since autoridad belongs to escuela (not carrera directly),
-- we look up the escuela of the given carrera first.

SELECT a.id_autoridad, a.nombre_completo, a.cargo,
       a.correo, a.telefono,
       a.id_escuela, a.orden_jerarquico, a.activo
FROM autoridad a
JOIN carrera c ON c.id_escuela = a.id_escuela
WHERE c.id_carrera = :id_carrera
  AND a.activo = true
ORDER BY a.orden_jerarquico ASC;


-- ============================================================
-- 7. Search autoridades by nombre_completo or cargo
-- ============================================================

SELECT id_autoridad, nombre_completo, cargo,
       correo, telefono,
       id_escuela, orden_jerarquico, activo
FROM autoridad
WHERE activo = true
  AND (
    nombre_completo ILIKE '%' || :search_term || '%'
    OR cargo ILIKE '%' || :search_term || '%'
  )
ORDER BY orden_jerarquico ASC;


-- ============================================================
-- 8. Get autoridades by escuela + search (combined filter)
-- ============================================================

SELECT id_autoridad, nombre_completo, cargo,
       correo, telefono,
       id_escuela, orden_jerarquico, activo
FROM autoridad
WHERE id_escuela = :id_escuela
  AND activo = true
  AND (
    nombre_completo ILIKE '%' || :search_term || '%'
    OR cargo ILIKE '%' || :search_term || '%'
  )
ORDER BY orden_jerarquico ASC;
