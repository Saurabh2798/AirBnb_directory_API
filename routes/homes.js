const express = require('express');
const {
  getHomes,
  getHome,
  createHome,
  updateHome,
  deleteHome,
} = require('../controllers/homes');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.route('/').get(getHomes).post(protect, createHome);

router.route('/:id').get(getHome).put(protect, updateHome).delete(protect, deleteHome);

module.exports = router;
