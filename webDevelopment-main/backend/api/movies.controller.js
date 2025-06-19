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

  // Add a new movie (requires title and year)
  static async apiPostMovie(req, res) {
    try {
      const movieData = req.body

      if (!movieData.title || !movieData.year) {
        return res.status(400).json({ error: "Missing required fields: title or year" })
      }

      const result = await MoviesDAO.addMovie(movieData)

      if (!result.acknowledged) {
        return res.status(500).json({ error: "Failed to add movie" })
      }

      res.status(201).json({ message: "Movie added", movieId: result.insertedId })
    } catch (e) {
      console.error(`apiPostMovie error: ${e}`)
      res.status(500).json({ error: e.toString() })
    }
  }
}
