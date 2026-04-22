/* ============================================================
   TypeScript types for all database tables.
   Matches schema.sql + auth_setup.sql column definitions.
   ============================================================ */

/* ---- Escuela ---- */

export interface Escuela {
  id_escuela: number;
  nombre: string;
  descripcion: string | null;
  ubicacion: string | null;
  created_at: string;
  updated_at: string;
}

/* ---- Carrera ---- */

export interface Carrera {
  id_carrera: number;
  nombre: string;
  id_escuela: number;
  created_at: string;
  updated_at: string;
}

/** Carrera with its parent escuela name (via join) */
export interface CarreraConEscuela extends Carrera {
  escuela: Pick<Escuela, 'nombre'>;
}

/* ---- Autoridad ---- */

export interface Autoridad {
  id_autoridad: number;
  nombre_completo: string;
  cargo: string;
  correo: string;
  telefono: string | null;
  id_escuela: number;
  orden_jerarquico: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Public-safe autoridad — correo & telefono are absent.
 * This is what anon users get due to column-level privileges.
 */
export type AutoridadPublica = Omit<Autoridad, 'correo' | 'telefono'>;

/* ---- Usuario ---- */

export type RolUsuario = 'admin' | 'estudiante' | 'autoridad';

export interface Usuario {
  id_usuario: number;
  correo_institucional: string;
  rol: RolUsuario;
  nombre_display: string | null;
  activo: boolean;
  auth_uid: string;
  created_at: string;
  updated_at: string;
}

/* ---- Query parameter types ---- */

export interface AutoridadFilters {
  /** Filter by escuela */
  idEscuela?: number;
  /** Filter by carrera (resolves to its escuela) */
  idCarrera?: number;
  /** Search by nombre_completo or cargo */
  search?: string;
  /** Only return active autoridades (default: true) */
  activoOnly?: boolean;
}
