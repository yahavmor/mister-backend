import express from 'express'
import { addReview, getReviews, removeReview } from './review.controller.js'

export const reviewRoutes = express.Router()

reviewRoutes.get('/', getReviews)
reviewRoutes.post('/', addReview)
reviewRoutes.delete('/:id', removeReview)   