// Import necessary modules and controllers
import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js' 

// Get access to the Express router
const router = express.Router() 

// Route to get all movies
router.route('/').get(MoviesController.apiGetMovies)

// Route to get a specific movie by ID and its details
router.route("/id/:id").get(MoviesController.apiGetMovieById)

// Route to get a list of available movie ratings
router.route("/ratings").get(MoviesController.apiGetRatings)

// CRUD routes for movie reviews
router
    .route("/review")
    .post(ReviewsController.apiPostReview)     // Create a new review
    .put(ReviewsController.apiUpdateReview)    // Update an existing review
    .delete(ReviewsController.apiDeleteReview) // Delete a review

// Export the router to be used in other parts of the app
export default router
