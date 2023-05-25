DROP TABLE IF EXISTS ReviewsPhotos;
DROP TABLE IF EXISTS CharacteristicsReviews;
DROP TABLE IF EXISTS Characteristics;
DROP TABLE IF EXISTS Reviews;

CREATE TABLE Reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  date DATE,
  summary VARCHAR(60),
  body VARCHAR(1000),
  recommend BOOLEAN DEFAULT FALSE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR(25),
  reviewer_email VARCHAR(25),
  response VARCHAR(1000) DEFAULT NULL,
  helpfulness INTEGER
);

CREATE TABLE Characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR(10)
);

CREATE TABLE CharacteristicsReviews (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  characteristic_id INTEGER,
  value INTEGER
);

CREATE TABLE ReviewsPhotos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  link VARCHAR(1000)
);

COPY Reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM 'C:\Users\Anthony\Desktop\SDC\reviews.csv'
DELIMITER ','
CSV HEADER;
