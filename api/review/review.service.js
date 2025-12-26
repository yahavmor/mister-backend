import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'

export const reviewService = {
    query,
    add,
    remove,
    getById
}

async function query(filterBy = {}) {
    const criteria = {}

    if (filterBy.toyId) criteria.toyId = ObjectId.createFromHexString(filterBy.toyId)
    if (filterBy.userId) criteria.userId = ObjectId.createFromHexString(filterBy.userId)

    const collection = await dbService.getCollection('review')

    const reviews = await collection.aggregate([
        { $match: criteria },

        {
            $lookup: {
                from: 'user',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },

        {
            $lookup: {
                from: 'toy',
                localField: 'toyId',
                foreignField: '_id',
                as: 'toy'
            }
        },
        { $unwind: '$toy' },

        {
            $project: {
                txt: 1,
                user: {
                    _id: '$user._id',
                    fullname: '$user.fullname'
                },
            toy: {
                _id: '$toy._id',
                name: '$toy.name',
                price: '$toy.price',
                imgUrl: '$toy.imgUrl'  
            }

            }
        }
    ]).toArray()

    return reviews
}

async function add(review) {
    const reviewToAdd = {
        txt: review.txt,
        toyId: ObjectId.createFromHexString(review.toyId),
        userId: ObjectId.createFromHexString(review.userId)
    }

    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)
    return reviewToAdd
}

async function remove(reviewId) {
    const collection = await dbService.getCollection('review')
    await collection.deleteOne({ _id: ObjectId.createFromHexString(reviewId) })
}
async function getById(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        const review = await collection.findOne({ _id: ObjectId.createFromHexString(reviewId) })
        return review
    } catch (err) {
        console.log('Failed to get review by id', err)
        throw err
    }
}

