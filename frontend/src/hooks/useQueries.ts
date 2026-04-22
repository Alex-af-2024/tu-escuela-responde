/* ============================================================
   TuEscuelaResponde — React Hooks for Data Fetching
   ============================================================
   Convenient hooks that wrap the API functions with loading
   and error state management.
   ============================================================ */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getEscuelas,
  getCarrerasByEscuela,
  getAutoridadesByEscuela,
  getAutoridadesByCarrera,
  searchAutoridades,
} from '../lib/api';
import type {
  Escuela,
  CarreraConEscuela,
  Autoridad,
  AutoridadPublica,
  AutoridadFilters,
} from '../types/database';

/* ---- Generic result shape ---- */

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/* ------------------------------------------------------------------ */
/*  useEscuelas                                                        */
/* ------------------------------------------------------------------ */

/**
 * Fetches all escuelas on mount.
 *
 * @example
 * function EscuelaList() {
 *   const { data: escuelas, loading, error } = useEscuelas();
 *
 *   if (loading) return <p>Cargando...</p>;
 *   if (error)   return <p>Error: {error}</p>;
 *
 *   return (
 *     <ul>
 *       {escuelas?.map(e => (
 *         <li key={e.id_escuela}>{e.nombre}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 */
export function useEscuelas(): QueryResult<Escuela[]> {
  const [data, setData] = useState<Escuela[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await getEscuelas();
    setData(result);
    setError(err?.message ?? null);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/* ------------------------------------------------------------------ */
/*  useCarrerasByEscuela                                               */
/* ------------------------------------------------------------------ */

/**
 * Fetches carreras for a given escuela. Re-fetches when idEscuela changes.
 *
 * @example
 * function CarreraList({ idEscuela }: { idEscuela: number }) {
 *   const { data: carreras, loading } = useCarrerasByEscuela(idEscuela);
 *
 *   return (
 *     <ul>
 *       {carreras?.map(c => (
 *         <li key={c.id_carrera}>{c.nombre}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 */
export function useCarrerasByEscuela(
  idEscuela: number | null,
): QueryResult<CarreraConEscuela[]> {
  const [data, setData] = useState<CarreraConEscuela[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (idEscuela === null) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await getCarrerasByEscuela(idEscuela);
    setData(result);
    setError(err?.message ?? null);
    setLoading(false);
  }, [idEscuela]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/* ------------------------------------------------------------------ */
/*  useAutoridadesByEscuela                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetches autoridades for a given escuela, sorted by hierarchy.
 * Automatically detects if the user is authenticated to include
 * contact info (correo, telefono).
 *
 * @example
 * function AutoridadGrid({ idEscuela }: { idEscuela: number }) {
 *   const { data: autoridades, loading } = useAutoridadesByEscuela(idEscuela);
 *
 *   return (
 *     <div>
 *       {autoridades?.map(a => (
 *         <div key={a.id_autoridad}>
 *           <h3>{a.nombre_completo}</h3>
 *           <p>{a.cargo}</p>
 *           {'correo' in a && <p>📧 {a.correo}</p>}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useAutoridadesByEscuela(
  idEscuela: number | null,
): QueryResult<(Autoridad | AutoridadPublica)[]> {
  const { session } = useAuth();
  const [data, setData] = useState<(Autoridad | AutoridadPublica)[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (idEscuela === null) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await getAutoridadesByEscuela(
      idEscuela,
      { isAuthenticated: !!session },
    );
    setData(result);
    setError(err?.message ?? null);
    setLoading(false);
  }, [idEscuela, session]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/* ------------------------------------------------------------------ */
/*  useAutoridadesByCarrera                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetches autoridades for the escuela that a carrera belongs to.
 *
 * @example
 * const { data } = useAutoridadesByCarrera(3); // Kinesiología → Ciencias de la Salud
 */
export function useAutoridadesByCarrera(
  idCarrera: number | null,
): QueryResult<(Autoridad | AutoridadPublica)[]> {
  const { session } = useAuth();
  const [data, setData] = useState<(Autoridad | AutoridadPublica)[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (idCarrera === null) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await getAutoridadesByCarrera(
      idCarrera,
      { isAuthenticated: !!session },
    );
    setData(result);
    setError(err?.message ?? null);
    setLoading(false);
  }, [idCarrera, session]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/* ------------------------------------------------------------------ */
/*  useSearchAutoridades                                               */
/* ------------------------------------------------------------------ */

/**
 * Search autoridades by nombre_completo or cargo, with optional
 * escuela/carrera filtering. The search is debounce-friendly:
 * pass the filters object and call refetch when the user input changes.
 *
 * @example
 * function AutoridadSearch() {
 *   const [search, setSearch] = useState('');
 *   const { data, loading } = useSearchAutoridades({ search });
 *
 *   return (
 *     <div>
 *       <input value={search} onChange={e => setSearch(e.target.value)} />
 *       {data?.map(a => <p key={a.id_autoridad}>{a.nombre_completo}</p>)}
 *     </div>
 *   );
 * }
 */
export function useSearchAutoridades(
  filters: AutoridadFilters,
): QueryResult<(Autoridad | AutoridadPublica)[]> {
  const { session } = useAuth();
  const [data, setData] = useState<(Autoridad | AutoridadPublica)[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await searchAutoridades(
      filters,
      { isAuthenticated: !!session },
    );
    setData(result);
    setError(err?.message ?? null);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.idEscuela, filters.idCarrera, filters.search, filters.activoOnly, session]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
