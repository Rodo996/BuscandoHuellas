CREATE VIEW vw_posts_completos AS
SELECT
  p.post_id,
  p.type,
  p.status,
  p.date,
  p.contact_name,
  p.contact_email,
  p.contact_phone,
  pt.name              AS pet_name,
  pt.sex,
  CASE pt.sex
    WHEN 'Male'   THEN 'Macho'
    WHEN 'Female' THEN 'Hembra'
    ELSE pt.sex
  END                  AS sex_name,
  pt.size,
  pt.has_tail,
  pt.is_mixed_breed    AS is_mix,
  pt.distinctive_features,
  b.breed_name,
  s.species_name,
  l.street,
  l.lat,
  l.lng,
  z.zip_code,
  z.municipality,
  u.user_id            AS owner_id,
  u.name               AS owner_name,
  i.storage_url        AS image_url
FROM Posts p
JOIN Pets      pt ON p.pet_id      = pt.pet_id
JOIN Breeds    b  ON pt.breed_id   = b.breed_id
JOIN Species   s  ON b.species_id  = s.species_id
JOIN Locations l  ON p.location_id = l.location_id
JOIN Zip_Codes z  ON l.zip_code    = z.zip_code
JOIN Users     u  ON p.user_id     = u.user_id
LEFT JOIN Images i ON i.post_id    = p.post_id AND i.type = 'post';