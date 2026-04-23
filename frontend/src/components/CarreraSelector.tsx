import type { CarreraConEscuela } from '../types/database';

interface CarreraSelectorProps {
  carreras: CarreraConEscuela[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

/**
 * Horizontal scrollable pill selector for careers.
 * "Todas" option clears the filter.
 */
export default function CarreraSelector({ carreras, selectedId, onSelect }: CarreraSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
      {/* "All" pill */}
      <button
        id="carrera-all"
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-200
                    ${
                      selectedId === null
                        ? 'gradient-gold text-surface-900 shadow-[0_2px_8px_rgba(212,168,67,0.3)]'
                        : 'bg-surface-700 text-gray-400 hover:text-gray-200 hover:bg-surface-600'
                    }`}
      >
        Todas
      </button>

      {carreras.map((carrera) => (
        <button
          key={carrera.id_carrera}
          id={`carrera-pill-${carrera.id_carrera}`}
          onClick={() => onSelect(carrera.id_carrera)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-200
                      ${
                        selectedId === carrera.id_carrera
                          ? 'gradient-gold text-surface-900 shadow-[0_2px_8px_rgba(212,168,67,0.3)]'
                          : 'bg-surface-700 text-gray-400 hover:text-gray-200 hover:bg-surface-600'
                      }`}
        >
          {carrera.nombre}
        </button>
      ))}
    </div>
  );
}
