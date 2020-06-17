const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Home = require('../models/Home');
const Review = require('../models/Review');

// @desc        Get reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/homes/:homeId/reviews
// access       Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if(req.params.homeId) {
        const reviews = await Review.find({home: req.params.homeId});

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc        Get a single review
// @route       GET /api/v1/reviews/:id
// access       Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'home',
        select: 'name neighbourhood'
    });

    if(!review) {
        return next(
            new ErrorResponse(`No review found with id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc      Add review
// @route     POST /api/v1/homes/:homeId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.home = req.params.homeId;
    req.body.user = req.user.id;
  
    const home = await Home.findById(req.params.homeId);
  
    if (!home) {
      return next(
        new ErrorResponse(
          `No home with the id of ${req.params.homeId}`,
          404
        )
      );
    }
  
    const review = await Review.create(req.body);
  
    res.status(201).json({
      success: true,
      data: review
    });
  });

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  
    let review = await Review.findById(req.params.id);
  
    if (!review) {
      return next(
        new ErrorResponse(
          `No review with the id of ${req.params.review}`,
          404
        )
      );
    }

    // Make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
              `Not authorized to update review`,
              401
            )
          );
    }
  
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
  
    res.status(200).json({
      success: true,
      data: review
    });
  });

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
  
    if (!review) {
      return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
      );
    }
  
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }
  
    await review.remove();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });