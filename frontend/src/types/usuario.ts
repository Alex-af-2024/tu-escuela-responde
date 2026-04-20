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
