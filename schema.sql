CREATE Table Reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  summary VARCHAR(60),
  recommend BOOLEAN DEFAULT FALSE,
  response VARCHAR(1000) DEFAULT null,
  body VARCHAR(1000),
  date DATE,
  reviewer_name VARCHAR(25),
  reviwer_email VARCHAR(25),
  helpfulness INTEGER,
  reported BOOLEAN DEFAULT FALSE

);

CREATE TABLE CharacteristicsReviews (
  id serial PRIMARY KEY,
  review_id INTEGER REFERENCES Reviews (id),
  characteristic_id INTEGER REFERENCES Characteristics(id),
  value INTEGER,
);

CREATE TABLE Characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES Reviews(product_id),
  attributes VARCHAR(10)
);

CREATE TABLE ReviewsPhotos (
  id serial PRIMARY KEY,
  review_id INTEGER REFERENCES Reviews (id),
  link VARCHAR(1000)
);

-- CREATE TABLE ProductTable (
--   id SERIAL PRIMARY KEY,
--   product_id INTEGER REFERENCES Reviews(product_id)
--   One INTEGER avg(Reviews Rating with Product_id )
-- ) average may have to be done with a query