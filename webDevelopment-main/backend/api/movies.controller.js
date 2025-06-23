import MoviesDAO from '../dao/moviesDAO.js'

export default class MoviesController {
  // Get a paginated list of movies, with optional filters (title, rated)
  static async apiGetMovies(req, res) {
    const moviesPerPage = parseInt(req.query.moviesPerPage) || 20
    const page = parseInt(req.query.page) || 0

    const filters = {}
    if (req.query.rated) filters.rated = req.query.rated
    if (req.query.title) filters.title = req.query.title

    try {
      const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({ filters, page, moviesPerPage })
      res.json({
        movies: moviesList,
        page,
        filters,
        entries_per_page: moviesPerPage,
        total_results: totalNumMovies,
      })
    } catch (e) {
      console.error(`apiGetMovies error: ${e}`)
      res.status(500).json({ error: e.toString() })
    }
  }

  // Get a single movie by its ID
  static async apiGetMovieById(req, res) {
    try {
      const id = req.params.id
      const movie = await MoviesDAO.getMovieById(id)

      if (!movie) return res.status(404).json({ error: "Movie not found" })

      res.json(movie)
    } catch (e) {
      console.error(`apiGetMovieById error: ${e}`)
      res.status(500).json({ error: e.toString() })
    }
  }

  // Get all unique movie ratings
  static async apiGetRatings(req, res) {
    try {
      const ratings = await MoviesDAO.getRatings()
      res.json(ratings)
    } catch (e) {
      console.error(`apiGetRatings error: ${e}`)
      res.status(500).json({ error: e.toString() })
    }
  }

  static async apiPostMovie(req, res, next) {
    console.log("apiPostMovie called", req.body);
    try {
        const movieData = req.body;
        const insertResult = await MoviesDAO.addMovie(movieData);
        if (insertResult.insertedId) {
            res.status(201).json({ status: "success", insertedId: insertResult.insertedId });
        } else {
            res.status(500).json({ error: "Failed to insert movie" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
}
