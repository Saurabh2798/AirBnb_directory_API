const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Home = require('../models/Home');

// @desc        Get all homes
// @route       GET /api/v1/homes
// access       Public
exports.getHomes = asyncHandler(async (req, res, next) => {
  let query;

  // copy query
  const reqQuery = { ...req.query };

  // fields to exclude finding in the db
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // loop over the fields and exclude them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operatore ($gt, $lt, etc.)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // find resource
  query = Home.find(JSON.parse(queryStr));

  // select specific fields to show
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Home.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // execute query
  const homes = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: homes.length,
    pagination,
    data: homes,
  });
});

// @desc        Get a single home
// @route       GET /api/v1/homes/:id
// access       Public
exports.getHome = asyncHandler(async (req, res, next) => {
  const home = await Home.findById(req.params.id);
  if (!home) {
    return next(
      new ErrorResponse(`Resource not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: home });
});

// @desc        Create a new home
// @route       POST /api/v1/homes
// access       Private
exports.createHome = asyncHandler(async (req, res, next) => {
  const home = await Home.create(req.body);
  res.status(201).json({ success: true, data: home });
});

// @desc        Update a home
// @route       PUT /api/v1/homes/:id
// access       Private
exports.updateHome = asyncHandler(async (req, res, next) => {
  const home = await Home.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!home) {
    return next(
      new ErrorResponse(`Home not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: home });
});

// @desc        Delete a home
// @route       DELETE /api/v1/homes/:id
// access       Private
exports.deleteHome = asyncHandler(async (req, res, next) => {
  const home = await Home.findById(req.params.id);

  if (!home) {
    return next(
      new ErrorResponse(`Home not found with id: ${req.params.id}`, 404)
    );
  }

  home.remove();

  res.status(200).json({ success: true, data: {} });
});
