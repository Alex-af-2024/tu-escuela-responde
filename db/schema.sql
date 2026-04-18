-- ============================================================
-- TuEscuelaResponde - PostgreSQL Database Schema
-- Created: 2026-04-18
-- ============================================================

-- Enable UUID extension (optional, using SERIAL for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

CREATE TYPE rol_usuario AS ENUM ('admin', 'estudiante', 'autoridad');

-- ============================================================
-- 2. TABLE: escuela
-- ============================================================
-- Central entity representing each school/institution.

CREATE TABLE escuela (
    id_escuela    SERIAL       PRIMARY KEY,
    nombre        VARCHAR(200) NOT NULL UNIQUE,
    descripcion   TEXT,
    ubicacion     VARCHAR(300),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  escuela IS 'Schools or academic institutions';
COMMENT ON COLUMN escuela.nombre IS 'Official name of the school';
COMMENT ON COLUMN escuela.ubicacion IS 'Physical address or location description';

-- ============================================================
-- 3. TABLE: carrera
-- ============================================================
-- Academic programs belonging to a school. (1 escuela → N carrera)

CREATE TABLE carrera (
    id_carrera    SERIAL       PRIMARY KEY,
    nombre        VARCHAR(200) NOT NULL,
    id_escuela    INTEGER      NOT NULL
                               REFERENCES escuela(id_escuela)
                               ON DELETE CASCADE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- A school cannot have duplicate career names
    CONSTRAINT uq_carrera_por_escuela UNIQUE (id_escuela, nombre)
);

CREATE INDEX idx_carrera_escuela ON carrera(id_escuela);

COMMENT ON TABLE  carrera IS 'Academic programs (careers) offered by a school';
COMMENT ON COLUMN carrera.nombre IS 'Name of the academic program';



-- ============================================================
-- 4. TABLE: autoridad
-- ============================================================
-- People holding authority positions within a school.
-- (1 escuela → N autoridad)
-- Ordered by orden_jerarquico (1 = highest rank).

CREATE TABLE autoridad (
    id_autoridad      SERIAL       PRIMARY KEY,
    nombre_completo   VARCHAR(250) NOT NULL,
    cargo             VARCHAR(150) NOT NULL,
    correo            VARCHAR(200) NOT NULL,
    telefono          VARCHAR(30),
    id_escuela        INTEGER      NOT NULL
                                   REFERENCES escuela(id_escuela)
                                   ON DELETE CASCADE,
    orden_jerarquico  SMALLINT     NOT NULL DEFAULT 0
                                   CHECK (orden_jerarquico >= 0),
    activo            BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- Hierarchical order must be unique within the same school
    CONSTRAINT uq_orden_por_escuela UNIQUE (id_escuela, orden_jerarquico)
);

CREATE INDEX idx_autoridad_escuela       ON autoridad(id_escuela);
CREATE INDEX idx_autoridad_jerarquia     ON autoridad(id_escuela, orden_jerarquico);

COMMENT ON TABLE  autoridad IS 'School authorities/leaders ordered by hierarchy';
COMMENT ON COLUMN autoridad.orden_jerarquico IS '1 = highest rank; lower numbers appear first';

-- ============================================================
-- 5. TABLE: usuario
-- ============================================================
-- Application users authenticated via institutional email.

CREATE TABLE usuario (
    id_usuario            SERIAL        PRIMARY KEY,
    correo_institucional  VARCHAR(200)  NOT NULL UNIQUE,
    rol                   rol_usuario   NOT NULL DEFAULT 'estudiante',
    nombre_display        VARCHAR(200),
    activo                BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuario_rol ON usuario(rol);

COMMENT ON TABLE  usuario IS 'Registered application users';
COMMENT ON COLUMN usuario.correo_institucional IS 'Institutional email used for authentication';

-- ============================================================
-- 6. TRIGGER: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_escuela
    BEFORE UPDATE ON escuela
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_carrera
    BEFORE UPDATE ON carrera
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_autoridad
    BEFORE UPDATE ON autoridad
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_usuario
    BEFORE UPDATE ON usuario
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

COMMIT;
