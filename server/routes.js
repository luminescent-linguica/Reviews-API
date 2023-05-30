const router = require('express').Router();
const controller = require('./controllers/controlReviews');

router.get('', controller.getRev);
router.get('/meta', controller.getMeta);
router.post('', controller.postRev);
router.put('/:review_id/helpful', controller.putHelpful);
router.put('/:review_id/report', controller.putReport);

module.exports = router;
