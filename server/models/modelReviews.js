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
  getMetadata: (params) => pool.query('SELECT * FROM Metadata WHERE product_id = $1', [params.product_id]),
  postReview: (params) => pool.query('INSERT INTO Reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7)', [params.product_id, params.rating, params.summary, params.body, params.recommend, params.name, params.email]),
  putHelpful: (params) => pool.query('UPDATE Reviews SET helpfulness = helpfulness+1 WHERE review_id = $1', [params.review_id]),
  putReport: (params) => pool.query('UPDATE Reviews SET reported = TRUE WHERE review_id = $1', [params.review_id])
};
