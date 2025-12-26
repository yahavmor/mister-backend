import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'

export const reviewService = {
    add,
    query
}

async function add(review) {
    const reviewToAdd = {
        userId: ObjectId.createFromHexString(review.userId),
        toyId: ObjectId.createFromHexString(review.toyId),
        txt: review.txt
    }

    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)

    return reviewToAdd
}

async function query(filterBy = {}) {
    const criteria = {}

    if (filterBy.toyId) criteria.toyId = ObjectId.createFromHexString(filterBy.toyId)
    if (filterBy.userId) criteria.userId = ObjectId.createFromHexString(filterBy.userId)

    const collection = await dbService.getCollection('review')
    return collection.find(criteria).toArray()
}
