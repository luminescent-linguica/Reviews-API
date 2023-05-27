const router = require('express').Router();
const controller = require('./controllers/controlReviews');

router.get('', controller.get);

module.exports = router;
