import { reviewService } from './review.service.js'

export async function addReview(req, res) {
    try {
        const review = req.body
        const savedReview = await reviewService.add(review)
        res.json(savedReview)
    } catch (err) {
        console.log('ERROR IN addReview:', err) 
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


export async function removeReview(req, res) {
    try {
        const { id } = req.params

        const review = await reviewService.getById(id)

        if (!review) {
            console.log(" review not found")
            return res.status(404).send({ err: "Review not found" })
        }

        await reviewService.remove(id)

        res.send({ msg: "Review deleted" })
    } catch (err) {
        console.log(" ERROR in removeReview:", err)
        res.status(500).send({ err: "Failed to delete review" })
    }
}



