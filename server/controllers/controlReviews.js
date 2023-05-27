const modelReviews = require('../models/modelReviews');

module.exports = {
  getRev: (req, res) => {
    const params = {
      sort: req.query.sort,
      product_id: req.query.product_id,
      page: 1,
      count: req.query.count,
    };
    modelReviews.getReviews(params)
      .then((result) => {
        const obj = {};
        obj.product = params.product_id;
        obj.page = 1;
        obj.count = params.count;
        obj.results = result.rows;
        res.status(200).send(obj);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
  getMeta: (req, res) => {
    const params = { product_id: req.query.product_id };
    modelReviews.getMetadata(params)
      .then((result) => {
        const metadata = result.rows[0];
        const obj = {};
        const rating = {};
        const recommended = {};
        const characteristics = {
          Size: { value: 0 },
          Width: { value: 0 },
          Comfort: { value: 0 },
          Quality: { value: 0 },
          Length: { value: 0 },
          Fit: { value: 0 },
        };
        obj.product_id = metadata.product_id;
        rating['1'] = metadata.one_rating;
        rating['2'] = metadata.two_rating;
        rating['3'] = metadata.three_rating;
        rating['4'] = metadata.four_rating;
        rating['5'] = metadata.five_rating;

        recommended['0'] = metadata.recommend_true;
        recommended['1'] = metadata.recommend_false;

        characteristics.Size.value = metadata.size;
        characteristics.Width.value = metadata.width;
        characteristics.Comfort.value = metadata.comfort;
        characteristics.Quality.value = metadata.quality;
        characteristics.Length.value = metadata.length;
        characteristics.Fit.value = metadata.fit;

        obj.ratings = rating;
        obj.recommended = recommended;
        obj.characteristics = characteristics;

        res.status(200).send(obj);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
  // postRev: (req, res) => {
  //   console.log(req.body);
  // },
};
