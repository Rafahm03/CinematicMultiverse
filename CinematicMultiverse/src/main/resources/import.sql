INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'SoyAdmin', '{noop}admin', 'admin', 'admin@admin', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'ElAdmin', '{noop}1234', 'admin', 'admin1@admin', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'CarlosGomez92', '{noop}pass123', 'Carlos Gómez', 'carlos.gomez92@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'LauraMartinez', '{noop}securePass', 'Laura Martínez', 'laura.martinez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'AndresLopez', '{noop}password1', 'Andrés López', 'andres.lopez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'SofiaRivas', '{noop}sofiaPass', 'Sofía Rivas', 'sofia.rivas@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'DavidFernandez', '{noop}david123', 'David Fernández', 'david.fernandez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'MartaPerez', '{noop}martaPass', 'Marta Pérez', 'marta.perez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'PabloRamirez', '{noop}pabloPass', 'Pablo Ramírez', 'pablo.ramirez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'ElenaGomez', '{noop}elenaSecure', 'Elena Gómez', 'elena.gomez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'JavierOrtega', '{noop}javierPass', 'Javier Ortega', 'javier.ortega@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'NataliaRuiz', '{noop}nataliaPass', 'Natalia Ruiz', 'natalia.ruiz@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'FernandoSanchez', '{noop}fernando123', 'Fernando Sánchez', 'fernando.sanchez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'PatriciaLopez', '{noop}patriciaPass', 'Patricia López', 'patricia.lopez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'AlejandroGarcia', '{noop}alePass', 'Alejandro García', 'alejandro.garcia@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'BeatrizMartin', '{noop}beaPass', 'Beatriz Martín', 'beatriz.martin@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'VictorHernandez', '{noop}victorPass', 'Víctor Hernández', 'victor.hernandez@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'ClaraDiaz', '{noop}clara123', 'Clara Díaz', 'clara.diaz@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'RaulTorres', '{noop}raulPass', 'Raúl Torres', 'raul.torres@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'SilviaMorales', '{noop}silviaPass', 'Silvia Morales', 'silvia.morales@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'AlbertoVega', '{noop}albertoPass', 'Alberto Vega', 'alberto.vega@example.com', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'EstherCano', '{noop}estherPass', 'Esther Cano', 'esther.cano@example.com', true, NULL, NOW());


INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 0 FROM user_entity WHERE username = 'SoyAdmin';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 0 FROM user_entity WHERE username = 'ElAdmin';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'CarlosGomez92';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'LauraMartinez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'AndresLopez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'SofiaRivas';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'DavidFernandez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'MartaPerez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'PabloRamirez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'ElenaGomez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'JavierOrtega';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'NataliaRuiz';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'FernandoSanchez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'PatriciaLopez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'AlejandroGarcia';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'BeatrizMartin';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'VictorHernandez';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'ClaraDiaz';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'RaulTorres';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'SilviaMorales';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'AlbertoVega';
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'EstherCano';


INSERT INTO pelicula (id, titulo, sinopsis, puntuacion, imagen, duracion, anio)
VALUES (nextval('pelicula_seq'), 'Vengadores: EndGame',
        ' después de los eventos de Avengers: Infinity War, Endgame presenta un universo devastado por las acciones de Thanos, el Titán Loco. Los Vengadores, junto con sus aliados, se reúnen para intentar deshacer las acciones de Thanos y restaurar el orden en el universo, sin importar las consecuencias.',
        9.5, 'https://pics.filmaffinity.com/Vengadores_Endgame-135478227-large.jpg', 181, 2019),
       (nextval('pelicula_seq'), 'El Padrino',
        'La historia de la familia Corleone, una de las más poderosas en el mundo de la mafia.', 9.2,
        'https://pics.filmaffinity.com/El_Padrino-100849256-large.jpg', 175, 1972),
       (nextval('pelicula_seq'), 'El caballero oscuro',
        'Batman enfrenta a su mayor enemigo, el Joker, quien sume a Gotham en el caos.', 9.0,
        'https://pics.filmaffinity.com/El_Caballero_Oscuro-123456789-large.jpg', 152, 2008),
       (nextval('pelicula_seq'), 'Pulp Fiction',
        'Varias historias entrelazadas de crimen, venganza y redención en Los Ángeles.', 8.9,
        'https://pics.filmaffinity.com/Pulp_Fiction-132456789-large.jpg', 154, 1994),
       (nextval('pelicula_seq'), 'Forrest Gump',
        'Un hombre con un coeficiente intelectual bajo se convierte en testigo de momentos clave de la historia de EE.UU.',
        8.8, 'https://pics.filmaffinity.com/Forrest_Gump-145678789-large.jpg', 142, 1994),
       (nextval('pelicula_seq'), 'Matrix',
        'Un hacker descubre la verdad sobre la realidad y su papel en la lucha contra las máquinas.', 8.7,
        'https://pics.filmaffinity.com/Matrix-187456789-large.jpg', 136, 1999),
       (nextval('pelicula_seq'), 'Interestelar',
        'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.',
        8.6, 'https://pics.filmaffinity.com/Interestelar-167456789-large.jpg', 169, 2014),
       (nextval('pelicula_seq'), 'Gladiador', 'Un general romano traicionado busca venganza como gladiador en la arena.',
        8.5, 'https://pics.filmaffinity.com/Gladiador-198456789-large.jpg', 155, 2000),
       (nextval('pelicula_seq'), 'Titanic', 'Historia de amor entre Jack y Rose a bordo del trágico Titanic.', 8.4,
        'https://pics.filmaffinity.com/Titanic-132456789-large.jpg', 195, 1997),
       (nextval('pelicula_seq'), 'El Señor de los Anillos: El Retorno del Rey',
        'La última batalla de la Tierra Media contra Sauron.', 9.0,
        'https://pics.filmaffinity.com/El_Senor_de_los_Anillos_El_Retorno_del_Rey-19456789-large.jpg', 201, 2003),
       (nextval('pelicula_seq'), 'Inception',
        'Un ladrón con la habilidad de infiltrarse en los sueños realiza un último gran trabajo.', 8.8,
        'https://pics.filmaffinity.com/Inception-19456789-large.jpg', 148, 2010),
       (nextval('pelicula_seq'), 'El Silencio de los Inocentes',
        'Un detective recurre a un brillante y perturbador asesino para capturar a otro criminal.', 8.6,
        'https://pics.filmaffinity.com/El_Silencio_de_los_Inocentes-187456789-large.jpg', 118, 1991),
       (nextval('pelicula_seq'), 'Los Increíbles',
        'Una familia de superhéroes debe salir del retiro para salvar al mundo.', 8.0,
        'https://pics.filmaffinity.com/Los_Increibles-165478789-large.jpg', 115, 2004),
       (nextval('pelicula_seq'), 'Toy Story', 'Los juguetes de Andy cobran vida cuando no hay humanos alrededor.', 8.3,
        'https://pics.filmaffinity.com/Toy_Story-123456789-large.jpg', 81, 1995),
       (nextval('pelicula_seq'), 'Spider-Man: No Way Home',
        'Spider-Man enfrenta las consecuencias de su identidad revelada y multiversos abiertos.', 8.5,
        'https://pics.filmaffinity.com/Spider_Man_No_Way_Home-198456789-large.jpg', 148, 2021),
       (nextval('pelicula_seq'), 'Avatar',
        'Un soldado parapléjico viaja a Pandora y se une a los Na’vi en su lucha por la supervivencia.', 7.9,
        'https://pics.filmaffinity.com/Avatar-123456789-large.jpg', 162, 2009),
       (nextval('pelicula_seq'), 'Deadpool',
        'Un mercenario con habilidades regenerativas busca venganza con mucho humor negro.', 8.0,
        'https://pics.filmaffinity.com/Deadpool-167456789-large.jpg', 108, 2016),
       (nextval('pelicula_seq'), 'Coco',
        'Un niño viaja al mundo de los muertos para descubrir la verdad sobre su familia.', 8.4,
        'https://pics.filmaffinity.com/Coco-154678789-large.jpg', 105, 2017),
       (nextval('pelicula_seq'), 'La La Land', 'Un músico y una actriz intentan perseguir sus sueños en Los Ángeles.',
        8.1, 'https://pics.filmaffinity.com/La_La_Land-154678789-large.jpg', 128, 2016),
       (nextval('pelicula_seq'), 'Joker', 'Historia de origen del icónico villano de Batman.', 8.4,
        'https://pics.filmaffinity.com/Joker-132456789-large.jpg', 122, 2019),
       (nextval('pelicula_seq'), 'Shrek', 'Un ogro y un burro intentan rescatar a una princesa con un secreto.', 8.0,
        'https://pics.filmaffinity.com/Shrek-132456789-large.jpg', 90, 2001),
       (nextval('pelicula_seq'), 'Mad Max: Fury Road',
        'En un mundo postapocalíptico, una mujer y un prisionero rebelde intentan escapar de un tirano.', 8.1,
        'https://pics.filmaffinity.com/Mad_Max_Fury_Road-132456789-large.jpg', 120, 2015),
       (nextval('pelicula_seq'), 'El Exorcista',
        'Una niña es poseída por una entidad demoníaca y su madre busca ayuda en un exorcista.', 8.1,
        'https://pics.filmaffinity.com/El_Exorcista-132456789-large.jpg', 122, 1973),
       (nextval('pelicula_seq'), 'Jurassic Park',
        'Científicos crean un parque con dinosaurios clonados, pero todo sale mal.', 8.2,
        'https://pics.filmaffinity.com/Jurassic_Park-132456789-large.jpg', 127, 1993),
       (nextval('pelicula_seq'), 'Django Unchained',
        'Un esclavo liberado se convierte en cazarrecompensas y busca venganza.', 8.4,
        'https://pics.filmaffinity.com/Django_Unchained-132456789-large.jpg', 165, 2012),
       (nextval('pelicula_seq'), 'El Gran Hotel Budapest',
        'Un conserje y su joven aprendiz se ven envueltos en un misterio en un lujoso hotel europeo.', 8.1,
        'https://pics.filmaffinity.com/El_Gran_Hotel_Budapest-123456789-large.jpg', 99, 2014),
       (nextval('pelicula_seq'), 'Whiplash',
        'Un joven baterista de jazz lucha contra su exigente maestro en busca de la grandeza.', 8.5,
        'https://pics.filmaffinity.com/Whiplash-123456789-large.jpg', 107, 2014),
       (nextval('pelicula_seq'), 'El Lobo de Wall Street', 'La vida de un ambicioso corredor de bolsa en Nueva York.',
        8.2, 'https://pics.filmaffinity.com/El_Lobo_de_Wall_Street-123456789-large.jpg', 180, 2013),
       (nextval('pelicula_seq'), 'Parasite',
        'Una familia pobre se infiltra en la vida de una familia rica con consecuencias inesperadas.', 8.6,
        'https://pics.filmaffinity.com/Parasite-123456789-large.jpg', 132, 2019),
       (nextval('pelicula_seq'), 'El Irlandés', 'Un asesino a sueldo cuenta su historia dentro de la mafia.', 7.8,
        'https://pics.filmaffinity.com/El_Irlandes-123456789-large.jpg', 209, 2019),
       (nextval('pelicula_seq'), 'Blade Runner 2049',
        'Un nuevo blade runner descubre un secreto que podría cambiar la sociedad.', 8.0,
        'https://pics.filmaffinity.com/Blade_Runner_2049-123456789-large.jpg', 164, 2017),
       (nextval('pelicula_seq'), 'Guardianes de la Galaxia',
        'Un grupo de marginados espaciales lucha por salvar la galaxia.', 8.0,
        'https://pics.filmaffinity.com/Guardianes_de_la_Galaxia-123456789-large.jpg', 121, 2014),
       (nextval('pelicula_seq'), 'Logan',
        'Los últimos días de Wolverine en un mundo donde los mutantes casi han desaparecido.', 8.1,
        'https://pics.filmaffinity.com/Logan-123456789-large.jpg', 137, 2017),
       (nextval('pelicula_seq'), 'John Wick', 'Un exasesino regresa al mundo del crimen tras el asesinato de su perro.',
        7.9, 'https://pics.filmaffinity.com/John_Wick-123456789-large.jpg', 101, 2014),
       (nextval('pelicula_seq'), 'It (Eso)',
        'Un grupo de niños enfrenta a un ente malvado que toma la forma de un payaso.', 7.3,
        'https://pics.filmaffinity.com/It-123456789-large.jpg', 135, 2017),
       (nextval('pelicula_seq'), 'El Conjuro',
        'Dos investigadores paranormales intentan salvar a una familia de una entidad demoníaca.', 7.5,
        'https://pics.filmaffinity.com/El_Conjuro-123456789-large.jpg', 112, 2013),
       (nextval('pelicula_seq'), 'Hereditary',
        'Una familia comienza a experimentar eventos aterradores tras la muerte de su abuela.', 7.3,
        'https://pics.filmaffinity.com/Hereditary-123456789-large.jpg', 127, 2018),
       (nextval('pelicula_seq'), 'Inside Out', 'Las emociones de una niña intentan guiarla en su nueva vida.', 8.1,
        'https://pics.filmaffinity.com/Inside_Out-123456789-large.jpg', 95, 2015),
       (nextval('pelicula_seq'), 'Soul', 'Un músico de jazz busca su propósito en la vida después de un accidente.', 8.0,
        'https://pics.filmaffinity.com/Soul-123456789-large.jpg', 101, 2020),
       (nextval('pelicula_seq'), 'El Viaje de Chihiro',
        'Una niña queda atrapada en un mundo de espíritus y debe encontrar el camino de regreso.', 8.6,
        'https://pics.filmaffinity.com/El_Viaje_de_Chihiro-123456789-large.jpg', 125, 2001),
       (nextval('pelicula_seq'), 'Akira', 'En un futuro distópico, un joven obtiene poderes psíquicos incontrolables.',
        8.0, 'https://pics.filmaffinity.com/Akira-123456789-large.jpg', 124, 1988),
       (nextval('pelicula_seq'), 'Your Name', 'Dos jóvenes que nunca se han visto intercambian cuerpos misteriosamente.',
        8.4, 'https://pics.filmaffinity.com/Your_Name-123456789-large.jpg', 106, 2016),
       (nextval('pelicula_seq'), 'Evangelion: 3.0+1.0 Thrice Upon a Time',
        'El final de la épica saga de mechas y existencialismo.', 8.1,
        'https://pics.filmaffinity.com/Evangelion_Thrice_Upon_A_Time-123456789-large.jpg', 155, 2021);


INSERT INTO pelicula_genero (pelicula_id, genero)
VALUES (1, 'ACCION'),           -- Vengadores: Endgame - Acción
    (1, 'FANTASIA'),         -- Vengadores: Endgame - Fantasía
    (1, 'CIENCIA_FICCION'),  -- Vengadores: Endgame - Ciencia ficción
    (51, 'CRIMEN'),           -- El Padrino - Crimen
    (51, 'DRAMA'),            -- El Padrino - Drama
    (101, 'ACCION'),           -- El Caballero Oscuro - Acción
    (101, 'CRIMEN'),           -- El Caballero Oscuro - Crimen
    (101, 'DRAMA'),            -- El Caballero Oscuro - Drama
    (151, 'CRIMEN'),           -- Pulp Fiction - Crimen
    (151, 'DRAMA'),            -- Pulp Fiction - Drama
    (151, 'COMEDIA'),          -- Pulp Fiction - Comedia
    (201, 'DRAMA'),            -- Forrest Gump - Drama
    (201, 'ROMANCE'),          -- Forrest Gump - Romance
    (251, 'CIENCIA_FICCION'),  -- Matrix - Ciencia ficción
    (251, 'ACCION'),           -- Matrix - Acción
    (301, 'CIENCIA_FICCION'),  -- Interestelar - Ciencia ficción
    (301, 'ACCION'),           -- Interestelar - Acción
    (351, 'ACCION'),           -- Gladiador - Acción
    (351, 'DRAMA'),            -- Gladiador - Drama
    (401, 'ROMANCE'),          -- Titanic - Romance
    (401, 'DRAMA'),            -- Titanic - Drama
    (451, 'AVENTURA'),        -- El Señor de los Anillos: El Retorno del Rey - Aventura
    (451, 'ACCION'),          -- El Señor de los Anillos: El Retorno del Rey - Acción
    (451, 'FANTASIA'),        -- El Señor de los Anillos: El Retorno del Rey - Fantasía
    (501, 'CIENCIA_FICCION'), -- Inception - Ciencia ficción
    (501, 'ACCION'),          -- Inception - Acción
    (501, 'DRAMA'),           -- Inception - Drama
    (551, 'CRIMEN'),          -- El Silencio de los Inocentes - Crimen
    (551, 'DRAMA'),           -- El Silencio de los Inocentes - Drama
    (551, 'CRIMEN'),          -- El Silencio de los Inocentes - Crimen
    (601, 'COMEDIA'),         -- Los Increíbles - Comedia
    (601, 'ACCION'),          -- Los Increíbles - Acción
    (601, 'FANTASIA'),        -- Los Increíbles - Fantasía
    (651, 'COMEDIA'),         -- Toy Story - Comedia
    (651, 'FANTASIA'),        -- Toy Story - Fantasía
    (701, 'ACCION'),          -- Spider-Man: No Way Home - Acción
    (701, 'FANTASIA'),        -- Spider-Man: No Way Home - Fantasía
    (751, 'CIENCIA_FICCION'), -- Avatar - Ciencia ficción
    (751, 'ACCION'),          -- Avatar - Acción
    (801, 'ACCION'),          -- Deadpool - Acción
    (801, 'COMEDIA'),         -- Deadpool - Comedia
    (851, 'ROMANCE'),         -- Coco - Romance
    (851, 'FANTASIA'),        -- Coco - Fantasía
    (901, 'COMEDIA'),         -- La La Land - Comedia
    (901, 'ROMANCE'),         -- La La Land - Romance
    (951, 'CRIMEN'),          -- Joker - Crimen
    (951, 'DRAMA'),           -- Joker - Drama
    (951, 'COMEDIA'),         -- Joker - Comedia
    (1001, 'COMEDIA'),         -- Shrek - Comedia
    (1001, 'FANTASIA'),        -- Shrek - Fantasía
    (1051, 'ACCION'),          -- Mad Max: Fury Road - Acción
    (1051, 'CIENCIA_FICCION'), -- Mad Max: Fury Road - Ciencia ficción
    (1051, 'CRIMEN'),          -- Mad Max: Fury Road - Crimen
    (1101, 'TERROR'),          -- El Exorcista - Terror
    (1101, 'CRIMEN'),          -- El Exorcista - Crimen
    (1151, 'CIENCIA_FICCION'), -- Jurassic Park - Ciencia ficción
    (1151, 'ACCION'),          -- Jurassic Park - Acción
    (1201, 'ACCION'),          -- Django Unchained - Acción
    (1201, 'CRIMEN'),          -- Django Unchained - Crimen
    (1251, 'FANTASIA'),        -- El Gran Hotel Budapest - Fantasía
    (1251, 'DRAMA'),           -- El Gran Hotel Budapest - Drama
    (1301, 'COMEDIA'),         -- Whiplash - Comedia
    (1301, 'DRAMA'),           -- Whiplash - Drama
    (1351, 'DRAMA'),           -- El Lobo de Wall Street - Drama
    (1351, 'CRIMEN'),          -- El Lobo de Wall Street - Crimen
    (1401, 'DRAMA'),           -- Parasite - Drama
    (1401, 'CRIMEN'),          -- Parasite - Crimen
    (1451, 'DRAMA'),           -- El Irlandés - Drama
    (1451, 'CRIMEN'),          -- El Irlandés - Crimen
    (1501, 'CIENCIA_FICCION'), -- Blade Runner 2049 - Ciencia ficción
    (1501, 'ACCION'),          -- Blade Runner 2049 - Acción
    (1551, 'ACCION'),          -- Guardianes de la Galaxia - Acción
    (1551, 'CIENCIA_FICCION'), -- Guardianes de la Galaxia - Ciencia ficción
    (1601, 'ACCION'),          -- Logan - Acción
    (1601, 'DRAMA'),           -- Logan - Drama
    (1651, 'ACCION'),          -- John Wick - Acción
    (1701, 'TERROR'),          -- It (Eso) - Terror
    (1751, 'CRIMEN'),          -- El Conjuro - Crimen
    (1751, 'TERROR'),          -- El Conjuro - Terror
    (1801, 'TERROR'),          -- Hereditary - Terror
    (1801, 'DRAMA'),           -- Hereditary - Drama
    (1851, 'COMEDIA'),         -- Inside Out - Comedia
    (1851, 'ROMANCE'),         -- Inside Out - Romance
    (1901, 'FANTASIA'),        -- Soul - Fantasía
    (1901, 'COMEDIA'),         -- Soul - Comedia
    (1951, 'FANTASIA'),        -- El Viaje de Chihiro - Fantasía
    (1951, 'CIENCIA_FICCION'), -- El Viaje de Chihiro - Ciencia ficción
    (2001, 'CIENCIA_FICCION'), -- Akira - Ciencia ficción
    (2001, 'ACCION'),          -- Akira - Acción
    (2051, 'FANTASIA'),        -- Your Name - Fantasía
    (2051, 'ROMANCE'),         -- Your Name - Romance
    (2101, 'CIENCIA_FICCION'), -- Evangelion: 3.0+1.0 Thrice Upon a Time - Ciencia ficción
    (2101, 'FANTASIA'),        -- Evangelion: 3.0+1.0 Thrice Upon a Time - Fantasía
    (2101, 'ACCION');          -- Evangelion: 3.0+1.0 Thrice Upon a Time - Acción
