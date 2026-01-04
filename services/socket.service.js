import { Server } from 'socket.io'
import { logger } from './logger.service.js'

let gIo = null

export function setupSocketAPI(httpServer) {
  gIo = new Server(httpServer, {
    path: "/socket.io/",
    cors: {
      origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://mistoy-frontend.onrender.com"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["polling", "websocket"]
  })


  

  const chatHistory = {}

  gIo.on('connection', socket => {
    logger.info(`Socket connected [id: ${socket.id}]`)

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected [id: ${socket.id}]`)
    })

    socket.on('set-user-socket', userId => {
      socket.userId = userId
      logger.info(`Socket ${socket.id} assigned to user ${userId}`)
    })

    socket.on('unset-user-socket', () => {
      delete socket.userId
      logger.info(`Socket ${socket.id} user cleared`)
    })

    socket.on('chat-set-topic', topic => {
      if (socket.myTopic === topic) return

      if (socket.myTopic) {
        socket.leave(socket.myTopic)
        logger.info(`Socket ${socket.id} left topic ${socket.myTopic}`)
      }

      socket.join(topic)
      socket.myTopic = topic
      logger.info(`Socket ${socket.id} joined topic ${topic}`)

      if (!chatHistory[topic]) chatHistory[topic] = []

      socket.emit('chat-history', chatHistory[topic])
    })
    socket.on('chat-clear-topic', ({ topic }) => {
    console.log('CLEARING HISTORY FOR TOPIC:', topic)
    chatHistory[topic] = []   

      socket.emit('chat-history', [])
    })

    socket.on('chat-send-msg', msg => {
      const topic = socket.myTopic
      if (!topic) return

      if (!chatHistory[topic]) chatHistory[topic] = []
      chatHistory[topic].push(msg)

      gIo.to(topic).emit('chat-add-msg', msg)
    })
    socket.on('user-typing', data => {
    setTimeout(() => {
        socket.broadcast.emit('user-typing', data)
    }, 300) 
})
  })
}
export { gIo }


export function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label).emit(type, data)
  else gIo.emit(type, data)
}

export async function emitToUser({ type, data, userId }) {
  const socket = await _getUserSocket(userId)
  if (socket) socket.emit(type, data)
}

export async function broadcast({ type, data, room = null, userId }) {
  const excludedSocket = await _getUserSocket(userId)

  if (room && excludedSocket) {
    excludedSocket.broadcast.to(room).emit(type, data)
  } else if (excludedSocket) {
    excludedSocket.broadcast.emit(type, data)
  } else if (room) {
    gIo.to(room).emit(type, data)
  } else {
    gIo.emit(type, data)
  }
}
export function notifyAdminUpdate(msg) {
    if (!gIo) return
    gIo.emit('admin-shop-update', { msg })
}


async function _getUserSocket(userId) {
  const sockets = await gIo.fetchSockets()
  return sockets.find(s => s.userId === userId)
}

console.log('LOADED SOCKET SERVICE')
