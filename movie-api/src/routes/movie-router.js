const { Router } = require("express");
const { getAllMovies, addMovie, getMovieById, updateMovieById, deleteMovieById, getReviewsByMovieId, addReviewByMovieId } = require("../controllers/movie-controller");

const movieRouter = Router()

movieRouter.get('/', getAllMovies);

movieRouter.post('/', addMovie);

movieRouter.get('/:id', getMovieById);

movieRouter.put('/:id', updateMovieById);

movieRouter.delete('/:id', deleteMovieById);

movieRouter.get('/:id/reviews', getReviewsByMovieId);

movieRouter.post('/:id/reviews', addReviewByMovieId);

module.exports = movieRouter;