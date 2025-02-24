INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'SoyAdmin', '{noop}admin', 'admin', 'admin@admin', true, NULL, NOW());

INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'user', '{noop}1', 'user', 'user@user', true, NULL, NOW());


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
INSERT INTO usuario_roles (usuario_id, roles) SELECT id, 1 FROM user_entity WHERE username = 'user';
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
VALUES (gen_random_uuid(), 'Vengadores: EndGame',
        ' después de los eventos de Avengers: Infinity War, Endgame presenta un universo devastado por las acciones de Thanos, el Titán Loco. Los Vengadores, junto con sus aliados, se reúnen para intentar deshacer las acciones de Thanos y restaurar el orden en el universo, sin importar las consecuencias.',
        9.5, 'https://pics.filmaffinity.com/Vengadores_Endgame-135478227-large.jpg', 181, 2019),
       (gen_random_uuid(), 'El Padrino',
        'La historia de la familia Corleone, una de las más poderosas en el mundo de la mafia.', 9.2,
        'https://pics.filmaffinity.com/El_Padrino-100849256-large.jpg', 175, 1972),
       (gen_random_uuid(), 'Pulp Fiction',
        'Varias historias entrelazadas de crimen, venganza y redención en Los Ángeles.', 8.9,
        'https://pics.filmaffinity.com/Pulp_Fiction-132456789-large.jpg', 154, 1994),
       (gen_random_uuid(), 'Forrest Gump',
        'Un hombre con un coeficiente intelectual bajo se convierte en testigo de momentos clave de la historia de EE.UU.',
        8.8, 'https://pics.filmaffinity.com/Forrest_Gump-145678789-large.jpg', 142, 1994),
       (gen_random_uuid(), 'Matrix',
        'Un hacker descubre la verdad sobre la realidad y su papel en la lucha contra las máquinas.', 8.7,
        'https://pics.filmaffinity.com/Matrix-187456789-large.jpg', 136, 1999),
       (gen_random_uuid(), 'Interestelar',
        'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.',
        8.6, 'https://pics.filmaffinity.com/Interestelar-167456789-large.jpg', 169, 2014),
       (gen_random_uuid(), 'Gladiador', 'Un general romano traicionado busca venganza como gladiador en la arena.',
        8.5, 'https://pics.filmaffinity.com/Gladiador-198456789-large.jpg', 155, 2000),
       (gen_random_uuid(), 'Titanic', 'Historia de amor entre Jack y Rose a bordo del trágico Titanic.', 8.4,
        'https://pics.filmaffinity.com/Titanic-132456789-large.jpg', 195, 1997),
       (gen_random_uuid(), 'El Señor de los Anillos: El Retorno del Rey',
        'La última batalla de la Tierra Media contra Sauron.', 9.0,
        'https://pics.filmaffinity.com/El_Senor_de_los_Anillos_El_Retorno_del_Rey-19456789-large.jpg', 201, 2003),
       (gen_random_uuid(), 'Inception',
        'Un ladrón con la habilidad de infiltrarse en los sueños realiza un último gran trabajo.', 8.8,
        'https://pics.filmaffinity.com/Inception-19456789-large.jpg', 148, 2010),
       (gen_random_uuid(), 'El Silencio de los Inocentes',
        'Un detective recurre a un brillante y perturbador asesino para capturar a otro criminal.', 8.6,
        'https://pics.filmaffinity.com/El_Silencio_de_los_Inocentes-187456789-large.jpg', 118, 1991),
       (gen_random_uuid(), 'Los Increíbles',
        'Una familia de superhéroes debe salir del retiro para salvar al mundo.', 8.0,
        'https://pics.filmaffinity.com/Los_Increibles-165478789-large.jpg', 115, 2004),
       (gen_random_uuid(), 'Toy Story', 'Los juguetes de Andy cobran vida cuando no hay humanos alrededor.', 8.3,
        'https://pics.filmaffinity.com/Toy_Story-123456789-large.jpg', 81, 1995),
       (gen_random_uuid(), 'Spider-Man: No Way Home',
        'Spider-Man enfrenta las consecuencias de su identidad revelada y multiversos abiertos.', 8.5,
        'https://pics.filmaffinity.com/Spider_Man_No_Way_Home-198456789-large.jpg', 148, 2021),
       (gen_random_uuid(), 'Avatar',
        'Un soldado parapléjico viaja a Pandora y se une a los Na’vi en su lucha por la supervivencia.', 7.9,
        'https://pics.filmaffinity.com/Avatar-123456789-large.jpg', 162, 2009),
       (gen_random_uuid(), 'Deadpool',
        'Un mercenario con habilidades regenerativas busca venganza con mucho humor negro.', 8.0,
        'https://pics.filmaffinity.com/Deadpool-167456789-large.jpg', 108, 2016),
       (gen_random_uuid(), 'Coco',
        'Un niño viaja al mundo de los muertos para descubrir la verdad sobre su familia.', 8.4,
        'https://pics.filmaffinity.com/Coco-154678789-large.jpg', 105, 2017),
       (gen_random_uuid(), 'La La Land', 'Un músico y una actriz intentan perseguir sus sueños en Los Ángeles.',
        8.1, 'https://pics.filmaffinity.com/La_La_Land-154678789-large.jpg', 128, 2016),
       (gen_random_uuid(), 'Joker', 'Historia de origen del icónico villano de Batman.', 8.4,
        'https://pics.filmaffinity.com/Joker-132456789-large.jpg', 122, 2019),
       (gen_random_uuid(), 'Shrek', 'Un ogro y un burro intentan rescatar a una princesa con un secreto.', 8.0,
        'https://pics.filmaffinity.com/Shrek-132456789-large.jpg', 90, 2001),
       (gen_random_uuid(), 'Mad Max: Fury Road',
        'En un mundo postapocalíptico, una mujer y un prisionero rebelde intentan escapar de un tirano.', 8.1,
        'https://pics.filmaffinity.com/Mad_Max_Fury_Road-132456789-large.jpg', 120, 2015),
       (gen_random_uuid(), 'El Exorcista',
        'Una niña es poseída por una entidad demoníaca y su madre busca ayuda en un exorcista.', 8.1,
        'https://pics.filmaffinity.com/El_Exorcista-132456789-large.jpg', 122, 1973),
       (gen_random_uuid(), 'Jurassic Park',
        'Científicos crean un parque con dinosaurios clonados, pero todo sale mal.', 8.2,
        'https://pics.filmaffinity.com/Jurassic_Park-132456789-large.jpg', 127, 1993),
       (gen_random_uuid(), 'Django Unchained',
        'Un esclavo liberado se convierte en cazarrecompensas y busca venganza.', 8.4,
        'https://pics.filmaffinity.com/Django_Unchained-132456789-large.jpg', 165, 2012),
       (gen_random_uuid(), 'El Gran Hotel Budapest',
        'Un conserje y su joven aprendiz se ven envueltos en un misterio en un lujoso hotel europeo.', 8.1,
        'https://pics.filmaffinity.com/El_Gran_Hotel_Budapest-123456789-large.jpg', 99, 2014),
       (gen_random_uuid(), 'Whiplash',
        'Un joven baterista de jazz lucha contra su exigente maestro en busca de la grandeza.', 8.5,
        'https://pics.filmaffinity.com/Whiplash-123456789-large.jpg', 107, 2014),
       (gen_random_uuid(), 'El Lobo de Wall Street', 'La vida de un ambicioso corredor de bolsa en Nueva York.',
        8.2, 'https://pics.filmaffinity.com/El_Lobo_de_Wall_Street-123456789-large.jpg', 180, 2013),
       (gen_random_uuid(), 'Parasite',
        'Una familia pobre se infiltra en la vida de una familia rica con consecuencias inesperadas.', 8.6,
        'https://pics.filmaffinity.com/Parasite-123456789-large.jpg', 132, 2019),
       (gen_random_uuid(), 'El Irlandés', 'Un asesino a sueldo cuenta su historia dentro de la mafia.', 7.8,
        'https://pics.filmaffinity.com/El_Irlandes-123456789-large.jpg', 209, 2019),
       (gen_random_uuid(), 'Blade Runner 2049',
        'Un nuevo blade runner descubre un secreto que podría cambiar la sociedad.', 8.0,
        'https://pics.filmaffinity.com/Blade_Runner_2049-123456789-large.jpg', 164, 2017),
       (gen_random_uuid(), 'Guardianes de la Galaxia',
        'Un grupo de marginados espaciales lucha por salvar la galaxia.', 8.0,
        'https://pics.filmaffinity.com/Guardianes_de_la_Galaxia-123456789-large.jpg', 121, 2014),
       (gen_random_uuid(), 'Logan',
        'Los últimos días de Wolverine en un mundo donde los mutantes casi han desaparecido.', 8.1,
        'https://pics.filmaffinity.com/Logan-123456789-large.jpg', 137, 2017),
       (gen_random_uuid(), 'John Wick', 'Un exasesino regresa al mundo del crimen tras el asesinato de su perro.',
        7.9, 'https://pics.filmaffinity.com/John_Wick-123456789-large.jpg', 101, 2014),
       (gen_random_uuid(), 'It (Eso)',
        'Un grupo de niños enfrenta a un ente malvado que toma la forma de un payaso.', 7.3,
        'https://pics.filmaffinity.com/It-123456789-large.jpg', 135, 2017),
       (gen_random_uuid(), 'El Conjuro',
        'Dos investigadores paranormales intentan salvar a una familia de una entidad demoníaca.', 7.5,
        'https://pics.filmaffinity.com/El_Conjuro-123456789-large.jpg', 112, 2013),
       (gen_random_uuid(), 'Hereditary',
        'Una familia comienza a experimentar eventos aterradores tras la muerte de su abuela.', 7.3,
        'https://pics.filmaffinity.com/Hereditary-123456789-large.jpg', 127, 2018),
       (gen_random_uuid(), 'Inside Out', 'Las emociones de una niña intentan guiarla en su nueva vida.', 8.1,
        'https://pics.filmaffinity.com/Inside_Out-123456789-large.jpg', 95, 2015),
       (gen_random_uuid(), 'Soul', 'Un músico de jazz busca su propósito en la vida después de un accidente.', 8.0,
        'https://pics.filmaffinity.com/Soul-123456789-large.jpg', 101, 2020),
       (gen_random_uuid(), 'El Viaje de Chihiro',
        'Una niña queda atrapada en un mundo de espíritus y debe encontrar el camino de regreso.', 8.6,
        'https://pics.filmaffinity.com/El_Viaje_de_Chihiro-123456789-large.jpg', 125, 2001),
       (gen_random_uuid(), 'Akira', 'En un futuro distópico, un joven obtiene poderes psíquicos incontrolables.',
        8.0, 'https://pics.filmaffinity.com/Akira-123456789-large.jpg', 124, 1988),
       (gen_random_uuid(), 'Your Name', 'Dos jóvenes que nunca se han visto intercambian cuerpos misteriosamente.',
        8.4, 'https://pics.filmaffinity.com/Your_Name-123456789-large.jpg', 106, 2016),
       (gen_random_uuid(), 'Evangelion: 3.0+1.0 Thrice Upon a Time',
        'El final de la épica saga de mechas y existencialismo.', 8.1,
        'https://pics.filmaffinity.com/Evangelion_Thrice_Upon_A_Time-123456789-large.jpg', 155, 2021);



INSERT INTO pelicula_genero (pelicula_id, genero)
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Vengadores: EndGame'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Vengadores: EndGame'
UNION ALL
SELECT id, 'FANTASIA' FROM pelicula WHERE titulo = 'Vengadores: EndGame'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'El Padrino'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'El Padrino'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'Pulp Fiction'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Pulp Fiction'
UNION ALL
SELECT id, 'ROMANCE' FROM pelicula WHERE titulo = 'Forrest Gump'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Forrest Gump'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Matrix'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Matrix'
UNION ALL
SELECT id, 'AVENTURA' FROM pelicula WHERE titulo = 'Interestelar'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Interestelar'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Interestelar'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Gladiador'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Gladiador'
UNION ALL
SELECT id, 'ROMANCE' FROM pelicula WHERE titulo = 'Titanic'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Titanic'
UNION ALL
SELECT id, 'FANTASIA' FROM pelicula WHERE titulo = 'El Señor de los Anillos: El Retorno del Rey'
UNION ALL
SELECT id, 'AVENTURA' FROM pelicula WHERE titulo = 'El Señor de los Anillos: El Retorno del Rey'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Inception'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Inception'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'El Silencio de los Inocentes'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'El Silencio de los Inocentes'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'Los Increíbles'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Los Increíbles'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'Toy Story'
UNION ALL
SELECT id, 'AVENTURA' FROM pelicula WHERE titulo = 'Toy Story'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Spider-Man: No Way Home'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Spider-Man: No Way Home'
UNION ALL
SELECT id, 'AVENTURA' FROM pelicula WHERE titulo = 'Avatar'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Avatar'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Deadpool'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'Deadpool'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'Coco'
UNION ALL
SELECT id, 'FANTASIA' FROM pelicula WHERE titulo = 'Coco'
UNION ALL
SELECT id, 'ROMANCE' FROM pelicula WHERE titulo = 'La La Land'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'La La Land'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'Joker'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Joker'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'Shrek'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'Shrek'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Mad Max: Fury Road'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Mad Max: Fury Road'
UNION ALL
SELECT id, 'TERROR' FROM pelicula WHERE titulo = 'El Exorcista'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'El Exorcista'
UNION ALL
SELECT id, 'AVENTURA' FROM pelicula WHERE titulo = 'Jurassic Park'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Jurassic Park'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'Django Unchained'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Django Unchained'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'El Gran Hotel Budapest'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Whiplash'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'Whiplash'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'El Lobo de Wall Street'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'El Lobo de Wall Street'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Parasite'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'Parasite'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'El Irlandés'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'El Irlandés'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Blade Runner 2049'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Blade Runner 2049'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Guardianes de la Galaxia'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Guardianes de la Galaxia'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Logan'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Logan'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'John Wick'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'John Wick'
UNION ALL
SELECT id, 'TERROR' FROM pelicula WHERE titulo = 'It (Eso)'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'It (Eso)'
UNION ALL
SELECT id, 'TERROR' FROM pelicula WHERE titulo = 'El Conjuro'
UNION ALL
SELECT id, 'CRIMEN' FROM pelicula WHERE titulo = 'El Conjuro'
UNION ALL
SELECT id, 'TERROR' FROM pelicula WHERE titulo = 'Hereditary'
UNION ALL
SELECT id, 'DRAMA' FROM pelicula WHERE titulo = 'Hereditary'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'Inside Out'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'Inside Out'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'Soul'
UNION ALL
SELECT id, 'COMEDIA' FROM pelicula WHERE titulo = 'Soul'
UNION ALL
SELECT id, 'ANIMACION' FROM pelicula WHERE titulo = 'El Viaje de Chihiro'
UNION ALL
SELECT id, 'FANTASIA' FROM pelicula WHERE titulo = 'El Viaje de Chihiro'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Akira'
UNION ALL
SELECT id, 'ACCION' FROM pelicula WHERE titulo = 'Akira'
UNION ALL
SELECT id, 'ROMANCE' FROM pelicula WHERE titulo = 'Your Name'
UNION ALL
SELECT id, 'FANTASIA' FROM pelicula WHERE titulo = 'Your Name'
UNION ALL
SELECT id, 'ANIME' FROM pelicula WHERE titulo = 'Evangelion: 3.0+1.0 Thrice Upon a Time'
UNION ALL
SELECT id, 'CIENCIA_FICCION' FROM pelicula WHERE titulo = 'Evangelion: 3.0+1.0 Thrice Upon a Time';


INSERT INTO resenia (id, pelicula_id, usuario_id, comentario, fecha_publicacion, puntuacion, is_edit)
VALUES
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Vengadores: EndGame'), (SELECT id FROM user_entity WHERE username = 'SoyAdmin'), 'Una película increíble, la mejor de la saga. Los Vengadores luchando por el destino del universo, con efectos impresionantes y personajes icónicos. ¡Un espectáculo!', '2024-01-15', 9, false),  -- Vengadores: Endgame
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'El Padrino'), (SELECT id FROM user_entity WHERE username = 'SoyAdmin'), 'El Padrino es una obra maestra del cine. La trama, los personajes y la dirección son de otro nivel. Sin duda, un clásico que siempre será recordado.', '2024-01-20', 10, false),  -- El Padrino
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Pulp Fiction'),  (SELECT id FROM user_entity WHERE username = 'user'), 'Pulp Fiction tiene una narrativa única y personajes memorables. Aunque no es para todos, su estilo es irrepetible.', '2024-02-10', 8, false),  -- Pulp Fiction
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Forrest Gump'),  (SELECT id FROM user_entity WHERE username = 'user'), 'Una historia conmovedora, llena de emoción y con una actuación estelar de Tom Hanks. Forrest Gump es un clásico que te hace reflexionar sobre la vida.', '2024-02-12', 10, false),  -- Forrest Gump
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Matrix'), (SELECT id FROM user_entity WHERE username = 'user'), 'Matrix cambió la ciencia ficción para siempre. La acción es brutal y la filosofía detrás de la trama es profunda. Definitivamente una película para ver más de una vez.', '2024-02-15', 9, false),  -- Matrix
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Interestelar'),  (SELECT id FROM user_entity WHERE username = 'ElAdmin'), 'Interstellar es una obra visualmente impresionante, aunque la trama a veces se vuelve confusa. A pesar de eso, es una experiencia que te deja pensando.', '2024-02-18', 8, false),  -- Interestelar
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Gladiador'), (SELECT id FROM user_entity WHERE username = 'ElAdmin'), 'Gladiador es una mezcla perfecta de acción y drama. Las escenas de combate son épicas y la historia de venganza te atrapa desde el principio.', '2024-02-20', 9, false),  -- Gladiador
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Titanic'),   (SELECT id FROM user_entity WHERE username = 'CarlosGomez92'), 'Titanic es una película que combina romance y tragedia de manera impecable. A pesar de ser una historia conocida, siempre conmueve.', '2024-02-22', 8, false),  -- Titanic
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'El Señor de los Anillos: El Retorno del Rey'),  (SELECT id FROM user_entity WHERE username = 'LauraMartinez'), 'El Señor de los Anillos: El Retorno del Rey es el cierre perfecto para una saga épica. Con batallas impresionantes y personajes que has llegado a querer, es una obra maestra de la fantasía.', '2024-02-25', 10, false),  -- El Señor de los Anillos: El Retorno del Rey
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'Inception'), (SELECT id FROM user_entity WHERE username = 'AndresLopez'), 'Una trama que te hace cuestionar la realidad, muy bien hecha.', '2024-03-25', 9, false),
    (gen_random_uuid(), (SELECT id FROM pelicula WHERE titulo = 'El Silencio de los Inocentes'),  (SELECT id FROM user_entity WHERE username = 'SoyAdmin'), 'Un thriller psicológico increíble, con una actuación sobresaliente.', '2024-03-28', 9, false);
