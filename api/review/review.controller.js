import { reviewService } from './review.service.js'

export async function addReview(req, res) {
    try {
        console.log('REVIEW BODY:', req.body)   // ⭐ תוסיף את זה
        const review = req.body
        const savedReview = await reviewService.add(review)
        res.json(savedReview)
    } catch (err) {
        console.log('ERROR IN addReview:', err) // ⭐ וגם את זה
        res.status(500).send('Failed to add review')
    }
}


export async function getReviews(req, res) {
    try {
        const filterBy = req.query
        const reviews = await reviewService.query(filterBy)
        res.json(reviews)
    } catch (err) {
        res.status(500).send('Failed to get reviews')
    }
}
