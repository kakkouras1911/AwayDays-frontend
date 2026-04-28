import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const login = (data) => API.post('/auth/login', data)
export const signup = (data) => API.post('/auth/signup', data)

// Stadiums
export const getStadiums = () => API.get('/stadiums')
export const getStadiumById = (id) => API.get(`/stadiums/${id}`)
export const getStadiumsByCountry = (country) => API.get(`/stadiums/country/${country}`)

// Reviews
export const createReview = (data) => API.post('/reviews', data)
export const createReviewWithPhotos = (data) => API.post('/reviews/with-photos', data)
export const getReviewById = (id) => API.get(`/reviews/${id}`)
export const getReviewsByStadium = (stadiumId) => API.get(`/reviews/stadium/${stadiumId}`)
export const getReviewsByUser = (userId) => API.get(`/reviews/user/${userId}`)
export const deleteReview = (id) => API.delete(`/reviews/${id}`)

// Comments
export const addComment = (reviewId, data) => API.post(`/comments/review/${reviewId}`, data)
export const getCommentsByReview = (reviewId) => API.get(`/comments/review/${reviewId}`)
export const deleteComment = (id) => API.delete(`/comments/${id}`)

// Likes
export const likeReview = (reviewId) => API.post(`/likes/review/${reviewId}`)
export const unlikeReview = (reviewId) => API.delete(`/likes/review/${reviewId}`)
export const getLikes = (reviewId) => API.get(`/likes/review/${reviewId}`)