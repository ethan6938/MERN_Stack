import dotenv from 'dotenv'
import mongodb from 'mongodb'
import app from './backend/index.js'  // adjust path if needed
import MoviesDAO from './backend/dao/moviesDAO.js'
import ReviewsDAO from './backend/dao/reviewsDAO.js'

dotenv.config()
const app = express();

const port = process.env.PORT || 5000

async function startServer() {
  try {
    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI)
    await client.connect()
    await MoviesDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

startServer()
