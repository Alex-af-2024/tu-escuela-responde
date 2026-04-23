import type { Autoridad, AutoridadPublica } from '../types/database';

interface AutoridadCardProps {
  autoridad: Autoridad | AutoridadPublica;
  isAuthenticated: boolean;
  /** Stagger index for animation delay */
  index?: number;
}

/**
 * Authority card with hierarchy badge, name, cargo, and
 * contact info (only visible when authenticated).
 */
export default function AutoridadCard({ autoridad, isAuthenticated, index = 0 }: AutoridadCardProps) {
  const hasContactInfo = isAuthenticated && 'correo' in autoridad;
  const a = autoridad as Autoridad; // safe cast for contact field access

  // Hierarchy rank colors
  const rankColors: Record<number, string> = {
    1: 'from-gold-400 to-gold-600',
    2: 'from-blue-400 to-blue-600',
    3: 'from-emerald-400 to-emerald-600',
  };
  const rankGradient = rankColors[autoridad.orden_jerarquico] ?? 'from-gray-400 to-gray-600';

  return (
    <div
      className="rounded-2xl border border-white/5 bg-surface-800
                 hover:border-white/10 hover:bg-surface-700/80
                 transition-all duration-300 p-5 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
    >
      {/* Header: avatar + name + cargo */}
      <div className="flex items-start gap-4">
        {/* Rank avatar */}
        <div className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${rankGradient}
                        flex items-center justify-center text-white font-bold text-lg
                        shadow-lg`}>
          {autoridad.orden_jerarquico}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-100 text-sm leading-snug truncate">
            {autoridad.nombre_completo}
          </h3>
          <p className="text-xs text-gold-400/80 font-medium mt-0.5 truncate">
            {autoridad.cargo}
          </p>
        </div>
      </div>

      {/* Contact info — authenticated only */}
      {hasContactInfo && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5 animate-fade-in">
          {/* Email */}
          <a
            href={`mailto:${a.correo}`}
            className="flex items-center gap-3 text-xs text-gray-400 hover:text-gold-400 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-700 group-hover:bg-gold-400/10
                          flex items-center justify-center transition-colors shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <span className="truncate">{a.correo}</span>
          </a>

          {/* Phone */}
          {a.telefono && (
            <a
              href={`tel:${a.telefono}`}
              className="flex items-center gap-3 text-xs text-gray-400 hover:text-gold-400 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-700 group-hover:bg-gold-400/10
                            flex items-center justify-center transition-colors shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <span>{a.telefono}</span>
            </a>
          )}
        </div>
      )}

      {/* Login prompt for anon users */}
      {!isAuthenticated && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[11px] text-gray-600 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Inicia sesión para ver contacto
          </p>
        </div>
      )}
    </div>
  );
}
