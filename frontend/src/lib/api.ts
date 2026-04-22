/* ============================================================
   TuEscuelaResponde — Supabase API Service Layer
   ============================================================
   All data-fetching logic lives here. Components import these
   functions instead of calling supabase directly.

   Each function mirrors a query in db/queries.sql.
   ============================================================ */

import { supabase } from './supabase';
import type {
  Escuela,
  Carrera,
  CarreraConEscuela,
  Autoridad,
  AutoridadPublica,
  AutoridadFilters,
} from '../types/database';

/* ------------------------------------------------------------------ */
/*  Escuelas                                                           */
/* ------------------------------------------------------------------ */

/**
 * Get all escuelas, sorted alphabetically.
 *
 * Works for both public (anon) and authenticated users.
 *
 * @example
 * const { data, error } = await getEscuelas();
 */
export async function getEscuelas() {
  return supabase
    .from('escuela')
    .select('id_escuela, nombre, descripcion, ubicacion')
    .order('nombre', { ascending: true })
    .returns<Escuela[]>();
}

/**
 * Get a single escuela by its ID.
 *
 * @example
 * const { data, error } = await getEscuelaById(1);
 */
export async function getEscuelaById(idEscuela: number) {
  return supabase
    .from('escuela')
    .select('id_escuela, nombre, descripcion, ubicacion')
    .eq('id_escuela', idEscuela)
    .single<Escuela>();
}

/* ------------------------------------------------------------------ */
/*  Carreras                                                           */
/* ------------------------------------------------------------------ */

/**
 * Get carreras for a specific escuela, sorted alphabetically.
 *
 * @example
 * const { data, error } = await getCarrerasByEscuela(1);
 * // → [{ id_carrera: 1, nombre: "Ingeniería en Informática", escuela: { nombre: "Escuela de Ingeniería" } }]
 */
export async function getCarrerasByEscuela(idEscuela: number) {
  return supabase
    .from('carrera')
    .select('id_carrera, nombre, id_escuela, escuela(nombre)')
    .eq('id_escuela', idEscuela)
    .order('nombre', { ascending: true })
    .returns<CarreraConEscuela[]>();
}

/**
 * Get all carreras across all escuelas, sorted by escuela then name.
 *
 * @example
 * const { data, error } = await getAllCarreras();
 */
export async function getAllCarreras() {
  return supabase
    .from('carrera')
    .select('id_carrera, nombre, id_escuela, escuela(nombre)')
    .order('id_escuela', { ascending: true })
    .order('nombre', { ascending: true })
    .returns<CarreraConEscuela[]>();
}

/* ------------------------------------------------------------------ */
/*  Autoridades                                                        */
/* ------------------------------------------------------------------ */

// ---- Column sets ----
// Authenticated users see all columns; public users get the safe subset.

const AUTORIDAD_COLUMNS_FULL =
  'id_autoridad, nombre_completo, cargo, correo, telefono, id_escuela, orden_jerarquico, activo';

const AUTORIDAD_COLUMNS_PUBLIC =
  'id_autoridad, nombre_completo, cargo, id_escuela, orden_jerarquico, activo';

/**
 * Get autoridades by escuela, sorted by hierarchy.
 *
 * If the user is authenticated, `correo` and `telefono` are included.
 * If not, those columns are hidden by column-level privileges.
 *
 * @example
 * const { data, error } = await getAutoridadesByEscuela(1);
 */
export async function getAutoridadesByEscuela(
  idEscuela: number,
  options: { includeInactive?: boolean; isAuthenticated?: boolean } = {},
) {
  const { includeInactive = false, isAuthenticated = false } = options;
  const columns = isAuthenticated ? AUTORIDAD_COLUMNS_FULL : AUTORIDAD_COLUMNS_PUBLIC;

  let query = supabase
    .from('autoridad')
    .select(columns)
    .eq('id_escuela', idEscuela)
    .order('orden_jerarquico', { ascending: true });

  if (!includeInactive) {
    query = query.eq('activo', true);
  }

  return query.returns<Autoridad[] | AutoridadPublica[]>();
}

/**
 * Get autoridades by carrera.
 *
 * Since autoridad belongs to escuela (not carrera), this first
 * resolves the carrera's escuela, then queries autoridades for it.
 *
 * @example
 * const { data, error } = await getAutoridadesByCarrera(1);
 */
export async function getAutoridadesByCarrera(
  idCarrera: number,
  options: { isAuthenticated?: boolean } = {},
) {
  // Step 1: Get the escuela ID for this carrera
  const { data: carrera, error: carreraError } = await supabase
    .from('carrera')
    .select('id_escuela')
    .eq('id_carrera', idCarrera)
    .single<Pick<Carrera, 'id_escuela'>>();

  if (carreraError || !carrera) {
    return { data: null, error: carreraError };
  }

  // Step 2: Get autoridades for that escuela
  return getAutoridadesByEscuela(carrera.id_escuela, options);
}

/**
 * Search autoridades by nombre_completo or cargo.
 *
 * Supports optional filters for escuela and active-only.
 *
 * @example
 * // Search across all escuelas
 * const { data } = await searchAutoridades({ search: 'Director' });
 *
 * // Search within a specific escuela
 * const { data } = await searchAutoridades({ search: 'Roberto', idEscuela: 1 });
 *
 * // By carrera (resolves to escuela)
 * const { data } = await searchAutoridades({ search: 'Jefe', idCarrera: 2 });
 */
export async function searchAutoridades(
  filters: AutoridadFilters,
  options: { isAuthenticated?: boolean } = {},
) {
  const {
    idEscuela,
    idCarrera,
    search,
    activoOnly = true,
  } = filters;
  const { isAuthenticated = false } = options;

  // If filtering by carrera, resolve its escuela first
  let resolvedEscuelaId = idEscuela;
  if (idCarrera && !resolvedEscuelaId) {
    const { data: carrera } = await supabase
      .from('carrera')
      .select('id_escuela')
      .eq('id_carrera', idCarrera)
      .single<Pick<Carrera, 'id_escuela'>>();

    if (carrera) {
      resolvedEscuelaId = carrera.id_escuela;
    }
  }

  const columns = isAuthenticated ? AUTORIDAD_COLUMNS_FULL : AUTORIDAD_COLUMNS_PUBLIC;

  let query = supabase
    .from('autoridad')
    .select(columns)
    .order('orden_jerarquico', { ascending: true });

  // Apply filters
  if (resolvedEscuelaId) {
    query = query.eq('id_escuela', resolvedEscuelaId);
  }

  if (activoOnly) {
    query = query.eq('activo', true);
  }

  if (search && search.trim()) {
    // Supabase ILIKE: search in nombre_completo OR cargo
    query = query.or(
      `nombre_completo.ilike.%${search.trim()}%,cargo.ilike.%${search.trim()}%`,
    );
  }

  return query.returns<Autoridad[] | AutoridadPublica[]>();
}

/**
 * Get a single autoridad by ID.
 *
 * @example
 * const { data, error } = await getAutoridadById(3);
 */
export async function getAutoridadById(
  idAutoridad: number,
  options: { isAuthenticated?: boolean } = {},
) {
  const { isAuthenticated = false } = options;
  const columns = isAuthenticated ? AUTORIDAD_COLUMNS_FULL : AUTORIDAD_COLUMNS_PUBLIC;

  return supabase
    .from('autoridad')
    .select(columns)
    .eq('id_autoridad', idAutoridad)
    .single<Autoridad | AutoridadPublica>();
}
