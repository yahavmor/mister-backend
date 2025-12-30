import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getUser, getUsers, deleteUser, updateUser, getUserMsgs, addUser } from './user.controller.js'

export const userRoutes = express.Router()


userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUser)
userRoutes.get('/:id/msgs', getUserMsgs)

userRoutes.put('/:id', requireAdmin, updateUser)
userRoutes.post('/', requireAdmin, addUser)


userRoutes.delete('/:id', requireAdmin, deleteUser)
