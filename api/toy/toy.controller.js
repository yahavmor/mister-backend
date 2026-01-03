import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'
import { notifyAdminUpdate } from '../../services/socket.service.js'


export async function getToys(req, res) {
    try {
        const filterBy = {
            name: req.query.name || '',
            price: req.query.price || '',
            labels: req.query.labels ? req.query.labels.split(',') : [],
            inStock: req.query.inStock === 'true'
        }

        const toys = await toyService.query(filterBy)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}


export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req

    try {
        const toy = req.body
        toy.owner = loggedinUser
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
        notifyAdminUpdate(`Admin added a new toy: ${addedToy._id}`)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = { ...req.body, _id: req.params.id }
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
        notifyAdminUpdate(`Admin updated toy: ${updatedToy.name}`)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        const deletedCount = await toyService.remove(toyId)
        res.send(`${deletedCount} toys removed`)
        notifyAdminUpdate(`Admin removed toy: ${toyId}`)

    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}
        
export async function addToyMsg(req, res) {
    try {
        const { toyId } = req.params
        const msg = req.body

        msg.by = {
            _id: req.loggedinUser._id,
            fullname: req.loggedinUser.fullname
        }

        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.send(savedMsg)    
    } catch (err) {
        console.log('Failed to add message', err)
        res.status(500).send({ err: 'Failed to add message' })
    }
}





export async function removeToyMsg(req, res) {
    try {
        const { toyId, msgId } = req.params

        const removed = await toyService.removeToyMsg(toyId, msgId)
        res.send({ msg: 'Message removed', removed })
        notifyAdminUpdate(`Admin removed a message from the toy (id: ${toyId})`)
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}

