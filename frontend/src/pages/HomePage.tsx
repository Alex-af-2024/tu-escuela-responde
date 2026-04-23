import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  useEscuelas,
  useCarrerasByEscuela,
  useAutoridadesByEscuela,
} from '../hooks/useQueries';
import { searchAutoridades } from '../lib/api';
import type { Autoridad, AutoridadPublica } from '../types/database';

import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import EscuelaList from '../components/EscuelaList';
import CarreraSelector from '../components/CarreraSelector';
import AutoridadCard from '../components/AutoridadCard';
import {
  SkeletonGrid,
  CarreraSelectorSkeleton,
} from '../components/Skeletons';

/**
 * Main public/private page — browse escuelas → carreras → autoridades.
 */
export default function HomePage() {
  const { session } = useAuth();
  const isAuth = !!session;

  // ---- State ----
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);
  const [selectedCarrera, setSelectedCarrera] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // ---- Data hooks ----
  const { data: escuelas, loading: loadingEscuelas } = useEscuelas();
  const { data: carreras, loading: loadingCarreras } = useCarrerasByEscuela(selectedEscuela);
  const { data: autoridades, loading: loadingAutoridades } = useAutoridadesByEscuela(selectedEscuela);

  // ---- Search state (manual fetch since we need debounce) ----
  const [searchResults, setSearchResults] = useState<(Autoridad | AutoridadPublica)[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchChange = async (value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    const { data } = await searchAutoridades(
      {
        search: value,
        idEscuela: selectedEscuela ?? undefined,
        idCarrera: selectedCarrera ?? undefined,
      },
      { isAuthenticated: isAuth },
    );
    setSearchResults(data);
    setSearchLoading(false);
  };

  // ---- Filter autoridades by selected carrera ----
  const filteredAutoridades = useMemo(() => {
    // If searching, use search results
    if (search.trim() && searchResults) return searchResults;

    // If no escuela selected, nothing to show
    if (!autoridades) return null;

    // If a carrera is selected, we still show the same autoridades
    // (autoridades belong to escuela level, not carrera)
    return autoridades;
  }, [autoridades, search, searchResults]);

  // ---- Selected escuela name ----
  const selectedEscuelaName = escuelas?.find(
    (e) => e.id_escuela === selectedEscuela,
  )?.nombre;

  const handleEscuelaSelect = (id: number) => {
    setSelectedEscuela(id === selectedEscuela ? null : id);
    setSelectedCarrera(null);
    setSearch('');
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
            TuEscuelaResponde
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg">
            Encuentra las autoridades de tu escuela. Selecciona una escuela para
            ver su cadena jerárquica.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder={
              selectedEscuelaName
                ? `Buscar en ${selectedEscuelaName}...`
                : 'Buscar autoridad por nombre o cargo...'
            }
          />
        </div>

        {/* ---- Escuelas section ---- */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Escuelas
          </h2>

          {loadingEscuelas ? (
            <SkeletonGrid count={3} type="escuela" />
          ) : escuelas && escuelas.length > 0 ? (
            <EscuelaList
              escuelas={escuelas}
              selectedId={selectedEscuela}
              onSelect={handleEscuelaSelect}
            />
          ) : (
            <p className="text-sm text-gray-600">No se encontraron escuelas.</p>
          )}
        </section>

        {/* ---- Carreras section (visible when escuela selected) ---- */}
        {selectedEscuela && (
          <section className="mb-8 animate-fade-in">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Carreras — {selectedEscuelaName}
            </h2>

            {loadingCarreras ? (
              <CarreraSelectorSkeleton count={4} />
            ) : carreras && carreras.length > 0 ? (
              <CarreraSelector
                carreras={carreras}
                selectedId={selectedCarrera}
                onSelect={setSelectedCarrera}
              />
            ) : (
              <p className="text-sm text-gray-600">Sin carreras registradas.</p>
            )}
          </section>
        )}

        {/* ---- Autoridades section ---- */}
        {(selectedEscuela || (search.trim() && searchResults)) && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {search.trim()
                  ? `Resultados de búsqueda`
                  : `Autoridades — ${selectedEscuelaName}`}
              </h2>

              {filteredAutoridades && (
                <span className="text-xs text-gray-600">
                  {filteredAutoridades.length} resultado{filteredAutoridades.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Auth status badge */}
            {!isAuth && (
              <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg
                            bg-gold-400/5 border border-gold-400/10 text-xs text-gold-400/70">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Inicia sesión para ver correo y teléfono de las autoridades</span>
              </div>
            )}

            {(loadingAutoridades || searchLoading) ? (
              <SkeletonGrid count={4} type="autoridad" />
            ) : filteredAutoridades && filteredAutoridades.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAutoridades.map((a, i) => (
                  <AutoridadCard
                    key={a.id_autoridad}
                    autoridad={a}
                    isAuthenticated={isAuth}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <svg className="w-10 h-10 mx-auto mb-3 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm">No se encontraron autoridades</p>
                {search.trim() && (
                  <p className="text-xs mt-1 text-gray-700">
                    Intenta con otro término de búsqueda
                  </p>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
