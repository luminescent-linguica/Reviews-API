const router = require('express').Router();
const controller = require('./controllers/controlReviews');

router.get('', controller.getRev);
router.get('/meta', controller.getMeta);
// router.post('', controller.postRev);

module.exports = router;
