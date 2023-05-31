const pool = require('../db/postgresql');

module.exports = {
  getReviews: (params) => {
    if (params.sort === 'helpful') {
      return pool.query(
        // 'EXPLAIN SELECT * FROM Reviews WHERE product_id = $1', [params.product_id],--
        `SELECT Reviews.*, jsonB_agg(DISTINCT jsonb_build_object('id', ph.id, 'url', ph.url)) AS photos
        FROM Reviews
        LEFT JOIN ReviewsPhotos ph ON Reviews.review_id = ph.review_id
        WHERE product_id = $1 GROUP BY reviews.review_id
        ORDER BY helpfulness DESC LIMIT $2`,
        [params.product_id, params.count],
      );
    } if (params.sort === 'newest') {
      return pool.query(
        `SELECT Reviews.*, jsonB_agg(DISTINCT jsonb_build_object('id', ph.id, 'url', ph.url)) AS photos
        FROM Reviews
        LEFT JOIN ReviewsPhotos ph ON Reviews.review_id = ph.review_id
        WHERE product_id = $1 GROUP BY reviews.review_id
        ORDER BY date DESC LIMIT $2`,
        [params.product_id, params.count],
      );
    } if (params.sort === 'relevant') {
      return pool.query(
        `SELECT Reviews.*, jsonB_agg(DISTINCT jsonb_build_object('id', ph.id, 'url', ph.url)) AS photos
        FROM Reviews
        LEFT JOIN ReviewsPhotos ph ON Reviews.review_id = ph.review_id
        WHERE product_id = $1 GROUP BY reviews.review_id
        ORDER BY helpfulness DESC, date DESC LIMIT $2`,
        [params.product_id, params.count],
      );
    }
  },
  getMetadata: (params) => {
    return pool.query(`SELECT
  product_id,
  json_build_object(
      '1', md.one_rating,
      '2', md.two_rating,
      '3', md.three_rating,
      '4', md.four_rating,
      '5', md.five_rating
  ) AS ratings,
  json_build_object(
      '0', md.recommend_true,
      '1', md.recommend_false
  ) AS recommended,
  json_build_object(
      'Size', json_build_object('value', md.size),
      'Width', json_build_object('value', md.width),
      'Comfort', json_build_object('value', md.comfort),
      'Quality', json_build_object('value', md.quality),
      'Length', json_build_object('value', md.length),
      'Fit', json_build_object('value', md.fit)
  ) AS characteristics
FROM
  Metadata AS md
WHERE
  product_id = $1`, [params.product_id] );
  },
  // getMetadata: (params) => pool.query('SELECT * FROM Metadata WHERE product_id = $1', [params.product_id]),
  postReview: (params) => {
    return pool.query('INSERT INTO Reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7)', [params.product_id, params.rating, params.summary, params.body, params.recommend, params.name, params.email]);
  },
  putHelpful: (params) => {
    return pool.query('UPDATE Reviews SET helpfulness = helpfulness+1 WHERE review_id = $1', [params.review_id]);
  },
  putReport: (params) => {
    return pool.query('UPDATE Reviews SET reported = TRUE WHERE review_id = $1', [params.review_id]);
  }
};
