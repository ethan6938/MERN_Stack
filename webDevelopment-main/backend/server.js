// Import necessary modules
import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'

// Create the server
const app = express()

// Enable CORS for cross-origin requests
app.use(cors())

// Parse incoming JSON requests
app.use(express.json())

// Route all /api/v1/movies requests to the movies router
app.use("https://mern-stack-ofpi.vercel.app/api/v1/movies", movies)

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ error: "not found" })
})

// Export the app for use elsewhere
export default app
