const express = require('express');
const {
  getHomes,
  getHome,
  createHome,
  updateHome,
  deleteHome,
} = require('../controllers/homes');

const router = express.Router();

router.route('/').get(getHomes).post(createHome);

router.route('/:id').get(getHome).put(updateHome).delete(deleteHome);

module.exports = router;
