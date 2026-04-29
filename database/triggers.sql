DELIMITER //

CREATE TRIGGER trg_post_status_change
AFTER UPDATE ON Posts
FOR EACH ROW
BEGIN
  IF OLD.status <> NEW.status THEN
    CALL sp_registrar_cambio_status(NEW.post_id, OLD.status, NEW.status);
  END IF;
END//

DELIMITER ;