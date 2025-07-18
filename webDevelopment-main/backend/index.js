import express from 'express';
import cors from 'cors';
import movies from './api/movies.route.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';

dotenv.config();

const app = express(); // Initialize app here

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
  const client = new mongodb.MongoClient("mongodb+srv://ethan:nO3H7fVE29DvMM6s@cluster0.3gl5fbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
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

export default app;