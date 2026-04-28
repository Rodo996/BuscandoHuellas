DELIMITER //

CREATE PROCEDURE sp_crear_publicacion(
  IN p_name             VARCHAR(100),
  IN p_breed_id         INT,
  IN p_is_mixed_breed   BOOLEAN,
  IN p_sex              ENUM('Male','Female'),
  IN p_size             ENUM('Extra Small', 'Small','Medium','Large','Giant'),
  IN p_has_tail         BOOLEAN,
  IN p_distinctive_features TEXT,
  IN p_zip_code         VARCHAR(10),
  IN p_street           VARCHAR(255),
  IN p_lat              DECIMAL(9,6),
  IN p_lng              DECIMAL(9,6),
  IN p_user_id          INT,
  IN p_type             ENUM('Lost','Spotted','Sheltered'),
  OUT p_post_id         INT,
  OUT p_pet_id   INT
)
BEGIN
  DECLARE v_pet_id      INT;
  DECLARE v_location_id INT;
  DECLARE exit handler FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

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

  COMMIT;
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