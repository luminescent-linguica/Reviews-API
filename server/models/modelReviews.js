const pool = require('../db/postgresql');

module.exports = {
  getReviews: (params) => {
    if (params.sort === 'helpful') {
      return pool.query(
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
    }
  },
  getMetadata: (params) =>
    // console.log('getMetadata inoked');
    pool.query('SELECT * FROM Metadata WHERE product_id = $1', [params.product_id])
  ,
};
