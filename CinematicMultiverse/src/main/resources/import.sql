INSERT INTO user_entity (id, username, password, nombre, email, enabled, activation_token, created_at)
VALUES (gen_random_uuid(), 'SoyAdmin', '{noop}admin', 'admin', 'admin@admin', true, NULL, NOW());


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
