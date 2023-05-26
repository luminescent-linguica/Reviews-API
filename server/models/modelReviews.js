const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'SDC',
  user: 'postgres',
});

client.connect()
  .then(() => {
    console.log('connected!');
  })
  .catch((err) => {
    console.log('connection error:', err);
  });

module.exports = {
  getReviews: (params) => {
    if (params.sort === 'helpful') {
      return client.query('SELECT * FROM Reviews WHERE product_id = $1 ORDER BY helpfulness_count DESC LIMIT $2', [params.product_id, params.count]);
    }
    if (params.sort === 'newest') {
      return client.query('SELECT * FROM Reviews WHERE product_id = $1 ORDER BY date DESC LIMIT $2', [params.product_id, params.count]);
    }
  },
};
