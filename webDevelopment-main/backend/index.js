import app from '../server.js';
import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'  // adjust relative paths if needed
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/movies", movies);

// Catch-all 404
app.use('*', (req, res) => {
  res.status(404).json({ error: "not found" });
});

async function main() {
  const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);
  const port = process.env.PORT || 5000;

  try {
    await client.connect();
    await MoviesDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);

