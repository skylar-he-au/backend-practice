const { createLogger } = require('../utils/logger');
const logger = createLogger(__filename);
const Movie = require('../models/movie-model')


const getAllMovies = async (req, res) => {
    logger.info('Geting all movies', { payload: { query: req.query } });
    const { keyword, sort, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (keyword) {
        filters.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
        ]
    }

    const sortOption = {};
    if (sort === 'rating') {
        sortOption = { averageRating: 1 }
    } else if (sort === 'rating') {
        sortOption = { averageRating: -1 }
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    const movies = await Movie.find(filters)
        .sort(sortOption)
        .skip(startIndex)
        .limit(limit)
        .exec();

    logger.debug('Movie returned successfully', { payload: { count: filteredMovies.length } });
    res.json(movies);
};

const addMovie = async (req, res) => {
    const { title, description, types } = req.body;

    // new Movie
    const movie = await Movie.create({ title, description, types });
    res.status(201).json(movie);
};

const getMovieById = async (req, res) => {
    const movie = await Movie.findById(req.params.id).exec()
    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        })
    }
    res.json(movie);
};

const updateMovieById = async (req, res) => {
    const { title, description, types } = req.body;
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { title, description, types },
        { new: true, runValidators: true }
    ).exec();
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie)
};

const deleteMovieById = async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id).exec();
    if (!movies) {
        res.status(404).json({
            message: "Movie not found",
        });
        return;
    }

    res.sendStatus(204);
};

const getReviewsByMovieId = async(req, res) => {
    const movie = await Movie.findById(req.params.id).select('reviews').exec();
    if (!movies) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }
    res.json(movies.reviews);
};

const addReviewByMovieId = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        res.status(404).json({
            message: "Movie not found",
        });
        return;
    }

    movie.review.push({ content, rating });
    // movie.averageRating = movie.reviews.length ? +(
    //     movie.reviews.reduce((sum, current) => sum + current.rating, 0) /
    //     movie.reviews.length
    // ).toFixed(2) : 0;
    await movie.save();
    res.status(201).json(movies.reviews[movie.reviews.length - 1]);
}

module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    updateMovieById,
    deleteMovieById,
    getReviewsByMovieId,
    addReviewByMovieId,
}