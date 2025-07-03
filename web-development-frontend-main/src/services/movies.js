import axios from "axios";

const BASE_URL = "https://mern-stack-ofpi.vercel.app/api/v1/movies";

class MovieDataService {
    getAll(page = 0) {
        return axios.get(`https://mern-stack-ofpi.vercel.app/api/v1/movies?page=${page}`);
    }

    get(id) {
        return axios.get(`https://mern-stack-ofpi.vercel.app/api/v1/movies/id/${id}`);
    }

    // Removed duplicate 'find' and merged logic into one
    find(query, by = "title", page = 0, rating = "") {
        return axios.get(
            `https://mern-stack-ofpi.vercel.app/api/v1/movies${by}=${query}&page=${page}&rating=${rating}`
        );
    }

    createReview(data) {
        return axios.post("https://mern-stack-ofpi.vercel.app/api/v1/movies/review", data);
    }

    updateReview(data) {
        return axios.put("https://mern-stack-ofpi.vercel.app/api/v1/movies/review", data);
    }

    deleteReview(id, userId) {
        return axios.delete("https://mern-stack-ofpi.vercel.app/api/v1/movies",review ,{
            data: { review_id: id, user_id: userId },
        });
    }

    getRatings() {
        return axios.get("https://mern-stack-ofpi.vercel.app/api/v1/movies/ratings");
    }
}

const movieDataService = new MovieDataService();

export default movieDataService;
