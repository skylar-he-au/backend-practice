const { createLogger } = require('../utils/logger');

const logger = createLogger(__filename);
let nextMovieId = 2;
let nextReviewId = 3;

const movies = [
    {
        id: 1,
        title: "Inception",
        description: "A skilled thief steals secrets from dreams",
        types: ["Sci-Fi"],
        averageRating: 4.5,
        reviews: [
            { id: 1, content: "Amazing movie!", rating: 5 },
            { id: 2, content: "Great visuals.", rating: 4 },
        ],
    },
];


const getAllMovies = (req, res) => {
    logger.info('Geting all movies', { payload: { query: req.query } });
    const { keyword, sort, page = 1, limit = 10 } = req.query;

    let filteredMovies = [...movies];
    if (keyword) {
        filteredMovies = filteredMovies.filter(
            (m) =>
                m.title.toLowerCase().includes(keyword.toLowerCase()) ||
                m.description.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    if (sort === 'rating') {
        filteredMovies.sort((a, b) => a.averageRating - b.averageRating)
    } else if (sort === 'rating') {
        filteredMovies.sort((a, b) => b.averageRating - a.averageRating)
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginateMovie = filteredMovies.slice(startIndex, endIndex)

    logger.debug('Movie returned successfully', { payload: { count: filteredMovies.length } });
    res.json(paginateMovie);
};

const addMovie = (req, res) => {
    const { title, description, types } = req.body;
    if (!title || !description || !Array.isArray(types) || types.length === 0) {
        return res.status(400).json({
            message: "All fields must be required and types must be a non-empty array"
        });
    }

    const newMovie = {
        id: nextMovieId++,
        title,
        description,
        types,
        averageRating: 0,
        reviews: [],
    };
    movies.unshift(newMovie);
    res.status(201).json("add success!");
};

const getMovieById = (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id))
    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        })
    }
    res.json(movie);
};

const updateMovieById = (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    const { title, description, types } = req.body;

    if (title) {
        movie.title = title;
    }
    if (description) {
        movie.description = description;
    }
    if (types) {
        if (!Array.isArray(types) || types.length !== 0) {
            return res.status(400).json({ message: "types mest be a non-empty array" })
        }
        movie.types = types;
    }

    res.status(200).json(movie)
};

const deleteMovieById = (req, res) => {
    const index = movies.findIndex(m => m.id === parseInt(req.params.id))

    if (!movies[index]) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    movies.splice(index, 1);

    res.sendStatus(204);
};

const getReviewsByMovieId = (req, res) => {
    const index = movies.findIndex(m => m.id === parseInt(req.params.id));
    if (!movies[index]) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }
    res.json(movies[index].reviews)
};

const addReviewByMovieId = (req, res) => {
    const index = movies.findIndex(m => m.id === parseInt(req.params.id));
    if (!movies[index]) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    const { content, rating } = req.body;
    if (!content || typeof rating !== "number" || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "content and numeric rating required. Rating must be between 1 and 5 (inc.)" });
    }

    movies[index].reviews.push({
        id: nextReviewId++,
        content,
        rating,
    })

    movies[index].averageRating = movies[index].reviews.length ? +(
        movies[index].reviews.reduce((sum, current) => sum + current.rating, 0) /
        movies[index].reviews.length
    ).toFixed(2) : 0;
    res.status(201).json(movies[index].reviews);
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