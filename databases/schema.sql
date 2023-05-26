DROP TABLE IF EXISTS ReviewsPhotos;
DROP TABLE IF EXISTS CharacteristicsReviews;
DROP TABLE IF EXISTS Characteristics;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS CharacteristicsMetaData;
DROP TABLE IF EXISTS Metadata;
DROP FUNCTION IF EXISTS metadata_update();

CREATE TABLE IF NOT EXISTS Reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  date BIGINT,
  summary VARCHAR(1000),
  body VARCHAR(1000),
  recommend BOOLEAN DEFAULT FALSE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR(50),
  reviewer_email VARCHAR(50),
  response VARCHAR(1000) DEFAULT NULL,
  helpfulness INTEGER
);

CREATE TABLE IF NOT EXISTS Characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS CharacteristicsReviews (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  characteristic_id INTEGER,
  value INTEGER
);

CREATE TABLE IF NOT EXISTS CharacteristicsMetaData (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  product_id INTEGER,
  name VARCHAR(10),
  value INTEGER
);

CREATE TABLE IF NOT EXISTS ReviewsPhotos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES Reviews (review_id),
  link VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS Metadata (
  product_id INTEGER PRIMARY KEY,
  one_rating INTEGER,
  two_rating INTEGER,
  three_rating INTEGER,
  four_rating INTEGER,
  five_rating INTEGER,
  recommend_true INTEGER,
  recommend_false INTEGER,
  size INTEGER DEFAULT 0,
  width INTEGER DEFAULT 0,
  comfort INTEGER DEFAULT 0,
  quality INTEGER DEFAULT 0,
  length INTEGER DEFAULT 0,
  fit INTEGER DEFAULT 0
);

COPY Reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/aitzeng/HackReactor/rfp2303-system-design-capstone/Anthonys-Reviews-API/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY Characteristics (id, product_id, name)
FROM '/home/aitzeng/HackReactor/rfp2303-system-design-capstone/Anthonys-Reviews-API/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY CharacteristicsReviews (id, review_id, characteristic_id, value)
FROM '/home/aitzeng/HackReactor/rfp2303-system-design-capstone/Anthonys-Reviews-API/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY ReviewsPhotos (id, review_id, link)
FROM '/home/aitzeng/HackReactor/rfp2303-system-design-capstone/Anthonys-Reviews-API/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

-- Seed CharacteristicsMetaData
INSERT INTO CharacteristicsMetaData (review_id, product_id, name, value)
SELECT
  CharacteristicsReviews.review_id,
  Characteristics.product_id,
  Characteristics.name,
  CharacteristicsReviews.value
FROM
  CharacteristicsReviews
JOIN
  Characteristics ON CharacteristicsReviews.characteristic_id = Characteristics.id;

-- Seed Metadata
INSERT INTO Metadata (product_id, one_rating, two_rating, three_rating, four_rating, five_rating, recommend_true, recommend_false)
SELECT
  product_id, COUNT(*) FILTER (WHERE rating = 1) AS one_rating, COUNT(*) FILTER (WHERE rating = 2) AS two_rating, COUNT(*) FILTER (WHERE rating = 3) AS three_rating, COUNT(*) FILTER (WHERE rating = 4) AS four_rating, COUNT(*) FILTER (WHERE rating = 5) AS five_rating, COUNT(*) FILTER (WHERE recommend = 'TRUE') AS recommend_true, COUNT(*) FILTER (WHERE recommend = 'FALSE') AS recommend_false
FROM Reviews
GROUP BY
  product_id;

UPDATE Metadata
SET
  size = subquery.size,
  width = subquery.width,
  comfort = subquery.comfort,
  quality = subquery.quality,
  length = subquery.length,
  fit = subquery.fit
FROM (
  SELECT
    product_id,
    AVG(value) FILTER (WHERE name = 'Size') AS size,
    AVG(value) FILTER (WHERE name = 'Width') AS width,
    AVG(value) FILTER (WHERE name = 'Comfort') AS comfort,
    AVG(value) FILTER (WHERE name = 'Quality') AS quality,
    AVG(value) FILTER (WHERE name = 'Length') AS length,
    AVG(value) FILTER (WHERE name = 'Fit') AS fit
  FROM
    CharacteristicsMetaData
  GROUP BY
    product_id
) AS subquery
WHERE
  Metadata.product_id = subquery.product_id;

CREATE FUNCTION metadata_update()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
-- Update Metadata table with distinct product_id
  INSERT INTO Metadata (product_id)
  SELECT DISTINCT product_id
  FROM Reviews
  ON CONFLICT (product_id) DO NOTHING;
  -- Update one_rating column
  UPDATE Metadata p
  SET one_rating = subquery.one_rating
  FROM (
    SELECT product_id, COUNT(*) FILTER (WHERE rating = 1) AS one_rating
    FROM Reviews
    GROUP BY product_id
  ) AS subquery
  WHERE p.product_id = subquery.product_id;
  RETURN NULL;
END;
$$;

CREATE TRIGGER metadata_update_trigger
AFTER INSERT ON Reviews
FOR EACH ROW
EXECUTE FUNCTION metadata_update();