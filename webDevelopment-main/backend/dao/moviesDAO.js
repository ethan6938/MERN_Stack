// Import MongoDB and extract ObjectId to query by document ID
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

// Declare a variable to store the movies collection
let movies 

// Define the MoviesDAO class to handle database operations
export default class MoviesDAO { 

    // Connect to the database and set the movies collection
    static async injectDB(conn) { 
        if (movies) { 
            return // If already connected, do nothing
        }
        try { 
            // Connect to the specific database and collection
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('movies')
        } catch (e) {
            console.error(`Unable to connect in MoviesDAO: ${e}`)
        }
    }

    // Get a movie by its ID and include its reviews using aggregation
    static async getMovieById(id) {        
        try {                    
            // Use aggregation pipeline to match movie and lookup related reviews                             
            return await movies.aggregate([
                {   // Match the movie with the specified ObjectId
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {   // Lookup reviews where movie_id matches the movie _id
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }       
            ]).next() // Return the resulting document
        } catch (e) {
            console.error(`Something went wrong in getMovieById: ${e}`)
            throw e
        }
    }

    // Get a list of movies with optional filters and pagination
    static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20, // Limit to 20 movies per page by default
    } = {}) {
        let query 
        // Set query based on filters: title or rated
        if (filters) { 
            if ("title" in filters) { 
                query = { $text: { $search: filters['title'] } }
            } else if ("rated" in filters) { 
                query = { "rated": { $eq: filters['rated'] } } 
            }                                
        }

        let cursor 
        try {
            // Run the query with pagination
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page) 

            // Convert cursor to array of movies
            const moviesList = await cursor.toArray()

            // Count total matching documents
            const totalNumMovies = await movies.countDocuments(query)

            // Return results
            return { moviesList, totalNumMovies }
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    // Get a list of distinct movie ratings
    static async getRatings() {
        let ratings = []
        try {
            // Use distinct to fetch all unique values of "rated"
            ratings = await movies.distinct("rated") 
            return ratings
        } catch (e) {
            console.error(`Unable to get ratings, ${e}`)
            return ratings
        }
    }

}
