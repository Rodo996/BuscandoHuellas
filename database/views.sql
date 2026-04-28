CREATE VIEW vw_posts_completos AS
SELECT
  p.post_id,
  p.type,
  p.status,
  p.created_at,
  pt.name        AS pet_name,
  pt.sex,
  pt.size,
  pt.has_tail,
  pt.is_mixed_breed,
  b.breed_name,
  s.species_name,
  l.street,
  l.zip_code,
  l.lat,
  l.lng,
  u.name         AS owner_name,
  u.email        AS owner_email,
  i.storage_url  AS imagen_url
FROM Posts p
JOIN Pets        pt ON p.pet_id      = pt.pet_id
JOIN Breeds      b  ON pt.breed_id   = b.breed_id
JOIN Species     s  ON b.species_id  = s.species_id
JOIN Locations   l  ON p.location_id = l.location_id
JOIN Users       u  ON p.user_id     = u.user_id
LEFT JOIN Images i  ON p.post_id     = i.post_id AND i.type = 'post';