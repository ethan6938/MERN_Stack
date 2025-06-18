// Import the Movies Data Access Object (DAO)
import MoviesDAO from '../dao/moviesDAO.js' 

// Define the MoviesController class
export default class MoviesController {

    // Handles GET requests for a list of movies with optional filters and pagination
    static async apiGetMovies(req, res, next) {
        // Set movies per page (default to 20 if not specified)
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20
        
        // Set current page (default to 0 if not specified)
        const page = req.query.page ? parseInt(req.query.page) : 0

        // Set filters based on query parameters (title or rating)
        let filters = {} 
        if (req.query.rated) {            
            filters.rated = req.query.rated
        } else if (req.query.title) {            
            filters.title = req.query.title            
        }

        // Fetch filtered and paginated movie data from DAO
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters,
            page,
            moviesPerPage
        })

        // Format and send JSON response
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        res.json(response) 
    }

    // Handles GET requests for a specific movie by ID
    static async apiGetMovieById(req, res, next) {
        try {
            // Extract ID from request parameters
            let id = req.params.id || {}

            // Get movie by ID from DAO
            let movie = await MoviesDAO.getMovieById(id)

            // If movie not found, respond with 404 error
            if (!movie) { 
                res.status(404).json({ error: "not found" })
                return
            }

            // Respond with movie data
            res.json(movie)
        } catch (e) {
            // Handle and log error
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    // Handles GET requests for available movie ratings
    static async apiGetRatings(req, res, next) {
        try {
            // Get list of ratings from DAO
            let propertyTypes = await MoviesDAO.getRatings()

            // Respond with the list of ratings
            res.json(propertyTypes)
        } catch (e) {
            // Handle and log error
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

}
