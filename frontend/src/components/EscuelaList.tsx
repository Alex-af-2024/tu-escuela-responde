import type { Escuela } from '../types/database';

interface EscuelaListProps {
  escuelas: Escuela[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/**
 * Grid of school cards. The selected card gets a gold accent border.
 */
export default function EscuelaList({ escuelas, selectedId, onSelect }: EscuelaListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {escuelas.map((escuela, i) => (
        <button
          key={escuela.id_escuela}
          id={`escuela-card-${escuela.id_escuela}`}
          onClick={() => onSelect(escuela.id_escuela)}
          className={`group text-left rounded-2xl border p-5
                      transition-all duration-300 animate-slide-up
                      ${
                        selectedId === escuela.id_escuela
                          ? 'border-gold-400/60 bg-gold-400/8 shadow-[0_0_24px_rgba(212,168,67,0.1)]'
                          : 'border-white/5 bg-surface-800 hover:border-white/10 hover:bg-surface-700'
                      }`}
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
        >
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3
                          transition-colors duration-300
                          ${
                            selectedId === escuela.id_escuela
                              ? 'gradient-gold text-surface-900'
                              : 'bg-surface-700 text-gray-400 group-hover:text-gold-400'
                          }`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3L2 9l10 6 10-6-10-6z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 13l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Name */}
          <h3 className={`font-semibold text-sm leading-tight mb-1.5 transition-colors
                          ${selectedId === escuela.id_escuela ? 'text-gold-300' : 'text-gray-100'}`}>
            {escuela.nombre}
          </h3>

          {/* Description */}
          {escuela.descripcion && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {escuela.descripcion}
            </p>
          )}

          {/* Location */}
          {escuela.ubicacion && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="truncate">{escuela.ubicacion}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
