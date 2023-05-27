const router = require('express').Router();
const controller = require('./controllers/controlReviews');

router.get('', controller.getRev);
router.get('/meta', controller.getMeta)

module.exports = router;
