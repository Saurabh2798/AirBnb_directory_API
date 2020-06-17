const express = require('express');
const {
  getHomes,
  getHome,
  createHome,
  updateHome,
  deleteHome,
} = require('../controllers/homes');

const Home = require('../models/Home');

// include other resource routers
const reviewRouter = require('./reviews');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// re-route into other resource routers
router.use('/:homeId/reviews', reviewRouter);

router.route('/').get(advancedResults(Home), getHomes).post(protect, authorize('publisher', 'admin'), createHome);

router.route('/:id').get(getHome).put(protect, authorize('publisher', 'admin'), updateHome).delete(protect, authorize('publisher', 'admin'), deleteHome);

module.exports = router;
