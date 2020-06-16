const express = require('express');
const {
  getHomes,
  getHome,
  createHome,
  updateHome,
  deleteHome,
} = require('../controllers/homes');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(getHomes).post(protect, authorize('publisher', 'admin'), createHome);

router.route('/:id').get(getHome).put(protect, authorize('publisher', 'admin'), updateHome).delete(protect, authorize('publisher', 'admin'), deleteHome);

module.exports = router;
