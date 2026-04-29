DELIMITER //

CREATE PROCEDURE sp_crear_publicacion(
  IN p_name             VARCHAR(100),
  IN p_breed_id         INT,
  IN p_is_mixed_breed   BOOLEAN,
  IN p_sex              ENUM('Male','Female'),
  IN p_size             ENUM('Extra Small','Small','Medium','Large','Giant'),
  IN p_has_tail         BOOLEAN,
  IN p_distinctive_features TEXT,
  IN p_zip_code         VARCHAR(10),
  IN p_street           VARCHAR(255),
  IN p_lat              DECIMAL(9,6),
  IN p_lng              DECIMAL(9,6),
  IN p_user_id          INT,
  IN p_type             ENUM('Lost','Spotted','Sheltered'),
  OUT p_post_id         INT,
  OUT p_pet_id          INT
)
BEGIN
  DECLARE v_pet_id      INT;
  DECLARE v_location_id INT;

  INSERT INTO Pets (breed_id, name, is_mixed_breed, sex, size, has_tail, distinctive_features)
  VALUES (p_breed_id, p_name, p_is_mixed_breed, p_sex, p_size, p_has_tail, p_distinctive_features);
  SET v_pet_id = LAST_INSERT_ID();
  SET p_pet_id = v_pet_id;

  INSERT INTO Locations (zip_code, street, lat, lng)
  VALUES (p_zip_code, p_street, p_lat, p_lng);
  SET v_location_id = LAST_INSERT_ID();

  INSERT INTO Posts (user_id, pet_id, location_id, type)
  VALUES (p_user_id, v_pet_id, v_location_id, p_type);
  SET p_post_id = LAST_INSERT_ID();

END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_cerrar_caso(
  IN p_post_id   INT,
  IN p_user_id   INT
)
BEGIN
  DECLARE exit handler FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

    UPDATE Posts
    SET status = 'Closed', closed_at = NOW()
    WHERE post_id = p_post_id AND user_id = p_user_id;

    IF ROW_COUNT() = 0 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Post no encontrado o sin permiso';
    END IF;

  COMMIT;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_registrar_cambio_status(
  IN p_post_id    INT,
  IN p_old_status VARCHAR(50),
  IN p_new_status VARCHAR(50)
)
BEGIN
  INSERT INTO Post_Status_History (post_id, old_status, new_status)
  VALUES (p_post_id, p_old_status, p_new_status);
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_buscar_coincidencias(IN p_post_id INT)
BEGIN
  DECLARE v_species_id  INT;
  DECLARE v_breed_id    INT;
  DECLARE v_sex         VARCHAR(10);
  DECLARE v_size        VARCHAR(20);
  DECLARE v_type        VARCHAR(20);
  DECLARE v_user_id     INT;
  DECLARE v_pet_id      INT;

  -- Obtener datos del post nuevo
  SELECT
    s.species_id, pt.breed_id, pt.sex, pt.size,
    p.type, p.user_id, pt.pet_id
  INTO
    v_species_id, v_breed_id, v_sex, v_size,
    v_type, v_user_id, v_pet_id
  FROM Posts p
  JOIN Pets     pt ON p.pet_id      = pt.pet_id
  JOIN Breeds   b  ON pt.breed_id   = b.breed_id
  JOIN Species  s  ON b.species_id  = s.species_id
  WHERE p.post_id = p_post_id;

  -- Insertar notificación para cada post similar de tipo opuesto
  INSERT INTO Notifications (user_id, type, content)
  SELECT DISTINCT
    p2.user_id,
    'post',
    CONCAT(
      'Posible coincidencia con tu publicación: se reportó una mascota similar (',
      pt2.name, ') que podría coincidir con la tuya.'
    )
  FROM Posts p2
  JOIN Pets     pt2 ON p2.pet_id    = pt2.pet_id
  JOIN Breeds   b2  ON pt2.breed_id = b2.breed_id
  JOIN Species  s2  ON b2.species_id = s2.species_id
  WHERE
    p2.post_id   <> p_post_id
    AND p2.status = 'Active'
    AND p2.user_id <> v_user_id
    -- Tipo opuesto
    AND (
      (v_type = 'Lost' AND p2.type IN ('Spotted', 'Sheltered'))
      OR
      (v_type IN ('Spotted', 'Sheltered') AND p2.type = 'Lost')
    )
    -- Misma especie
    AND s2.species_id = v_species_id
    -- Mismo sexo
    AND pt2.sex = v_sex
    -- Mismo tamaño
    AND pt2.size = v_size
    -- Al menos un color en común
    AND EXISTS (
      SELECT 1
      FROM Pet_Colors pc1
      JOIN Pet_Colors pc2 ON pc1.color_id = pc2.color_id
      WHERE pc1.pet_id = v_pet_id
        AND pc2.pet_id = pt2.pet_id
    );

END//

DELIMITER ;