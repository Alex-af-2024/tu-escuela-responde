-- ============================================================
-- TuEscuelaResponde - Sample Seed Data
-- Run AFTER schema.sql
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Escuelas
-- ============================================================

INSERT INTO escuelas (nombre, descripcion, ubicacion) VALUES
    ('Escuela de Ingeniería',
     'Escuela dedicada a las disciplinas de ingeniería y tecnología.',
     'Edificio A, Campus Central, Av. Universidad 1000'),
    ('Escuela de Ciencias de la Salud',
     'Formación de profesionales en el área de la salud.',
     'Edificio B, Campus Norte, Av. Salud 200'),
    ('Escuela de Ciencias Sociales',
     'Programas académicos en humanidades y ciencias sociales.',
     'Edificio C, Campus Central, Av. Universidad 1000');

-- ============================================================
-- 2. Carreras
-- ============================================================

-- Escuela de Ingeniería (id_escuela = 1)
INSERT INTO carreras (nombre, id_escuela) VALUES
    ('Ingeniería en Informática', 1),
    ('Ingeniería Civil',          1),
    ('Ingeniería Industrial',     1),
    ('Ingeniería Electrónica',    1);

-- Escuela de Ciencias de la Salud (id_escuela = 2)
INSERT INTO carreras (nombre, id_escuela) VALUES
    ('Medicina',                  2),
    ('Enfermería',                2),
    ('Kinesiología',              2);

-- Escuela de Ciencias Sociales (id_escuela = 3)
INSERT INTO carreras (nombre, id_escuela) VALUES
    ('Psicología',                3),
    ('Trabajo Social',            3),
    ('Derecho',                   3);


-- ============================================================
-- 3. Autoridades
-- ============================================================

-- Escuela de Ingeniería
INSERT INTO autoridades (nombre_completo, cargo, correo, telefono, id_escuela, orden_jerarquico) VALUES
    ('Dr. Roberto Méndez Silva',      'Director de Escuela',           'rmendez@institucion.cl',   '+56 9 1234 5678', 1, 1),
    ('Mg. Carla Fuentes Rojas',       'Subdirectora Académica',        'cfuentes@institucion.cl',  '+56 9 2345 6789', 1, 2),
    ('Ing. Felipe Araya Torres',      'Jefe de Carrera',               'faraya@institucion.cl',    '+56 9 3456 7890', 1, 3),
    ('Ing. Daniela Cortés Vargas',    'Coordinadora de Prácticas',     'dcortes@institucion.cl',   '+56 9 4567 8901', 1, 4);

-- Escuela de Ciencias de la Salud
INSERT INTO autoridades (nombre_completo, cargo, correo, telefono, id_escuela, orden_jerarquico) VALUES
    ('Dra. Patricia Molina Gómez',    'Directora de Escuela',          'pmolina@institucion.cl',   '+56 9 5678 9012', 2, 1),
    ('Dr. Andrés Soto Bravo',         'Subdirector Académico',         'asoto@institucion.cl',     '+56 9 6789 0123', 2, 2),
    ('Enf. María José Pizarro Díaz',  'Secretaria Académica',          'mjpizarro@institucion.cl', '+56 9 7890 1234', 2, 3);

-- Escuela de Ciencias Sociales
INSERT INTO autoridades (nombre_completo, cargo, correo, telefono, id_escuela, orden_jerarquico) VALUES
    ('Mg. Josefina Reyes Lagos',      'Directora de Escuela',          'jreyes@institucion.cl',    '+56 9 8901 2345', 3, 1),
    ('Dr. Álvaro Henríquez Peña',     'Subdirector Académico',         'ahenriquez@institucion.cl', '+56 9 9012 3456', 3, 2),
    ('Ps. Valentina Cárdenas Muñoz',  'Jefa de Carrera',               'vcardenas@institucion.cl', '+56 9 0123 4567', 3, 3),
    ('Abog. Sebastián Opazo Ruiz',    'Coordinador de Prácticas',      'sopazo@institucion.cl',    '+56 9 1234 0000', 3, 4);

-- ============================================================
-- 4. Usuarios
-- ============================================================

INSERT INTO usuarios (correo_institucional, rol, nombre_display) VALUES
    ('admin@institucion.cl',      'admin',      'Administrador General'),
    ('estudiante1@mail.inst.cl',  'estudiante', 'María González'),
    ('estudiante2@mail.inst.cl',  'estudiante', 'Carlos Pérez'),
    ('estudiante3@mail.inst.cl',  'estudiante', 'Ana Belén Ríos'),
    ('rmendez@institucion.cl',    'autoridad',  'Dr. Roberto Méndez Silva'),
    ('pmolina@institucion.cl',    'autoridad',  'Dra. Patricia Molina Gómez');

COMMIT;
