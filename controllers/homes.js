const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Home = require('../models/Home');

// @desc        Get all homes
// @route       GET /api/v1/homes
// access       Public
exports.getHomes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
