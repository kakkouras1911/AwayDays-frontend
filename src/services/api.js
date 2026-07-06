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
export const createStadium = (stadium) => API.post('/stadiums', stadium)

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

export const updateReview = (id, data) => API.put(`/reviews/${id}`, data)
export const getRecentReviews = () => API.get('/reviews/recent')

export const updateStadiumCoverImage = (id, imageUrl) => 
  API.patch(`/stadiums/${id}/cover-image`, { coverImageUrl: imageUrl })

export const getUserProfile = (id) => API.get(`/users/${id}`)
export const updateBio = (id, bio) => API.patch(`/users/${id}/bio`, { bio })
export const uploadAvatar = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post(`/users/${id}/avatar`, formData)
}

// Author Applications
export const applyForAuthor = (formData) => API.post('/author-applications/apply', formData)
export const getUserApplications = (userId) => API.get(`/author-applications/user/${userId}`)
export const getPendingApplications = () => API.get('/author-applications/pending')
export const getAllApplications = () => API.get('/author-applications/all')
export const approveApplication = (id) => API.patch(`/author-applications/${id}/approve`)
export const rejectApplication = (id, adminNote) => API.patch(`/author-applications/${id}/reject`, { adminNote })

// Articles
export const getArticles = () => API.get('/articles')
export const getArticleById = (id) => API.get(`/articles/${id}`)
export const getArticlesByAuthor = (authorId) => API.get(`/articles/author/${authorId}`)
export const createArticle = (formData) => API.post('/articles', formData)
export const publishArticle = (id) => API.patch(`/articles/${id}/publish`)
export const deleteArticle = (id) => API.delete(`/articles/${id}`)

// Bucket List
export const getBucketList = (userId) => API.get(`/bucket-list/${userId}`)
export const addToBucketList = (userId, stadiumId) => API.post(`/bucket-list/${userId}/${stadiumId}`)
export const removeFromBucketList = (userId, stadiumId) => API.delete(`/bucket-list/${userId}/${stadiumId}`)
export const checkBucketList = (userId, stadiumId) => API.get(`/bucket-list/${userId}/${stadiumId}/check`)

export const getAllProducts = () => API.get('/shop/products/all')
export const createProduct = (product) => API.post('/shop/products', product)
export const updateProduct = (id, product) => API.put(`/shop/products/${id}`, product)
export const deleteProduct = (id) => API.delete(`/shop/products/${id}`)
export const toggleProduct = (id) => API.patch(`/shop/products/${id}/toggle`) 