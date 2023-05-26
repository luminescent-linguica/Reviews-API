const modelReviews = require('../models/modelReviews');

module.exports = {
  get: (req, res) => {
    const params = {
      sort: req.query.sort,
      product_id: req.query.product_id,
      page: 1,
      count: req.query.count,
    };
    modelReviews.getReviews(params)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
