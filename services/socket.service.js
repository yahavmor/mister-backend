import { Server } from 'socket.io'
import { logger } from './logger.service.js'

let gIo = null

export function setupSocketAPI(httpServer) {
  gIo = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://mistoy-frontend.onrender.com'
      ],
      credentials: true
    }
  })

  // שמירת היסטוריה לפי topic
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

    // שינוי topic
    socket.on('chat-set-topic', topic => {
      if (socket.myTopic === topic) return

      if (socket.myTopic) {
        socket.leave(socket.myTopic)
        logger.info(`Socket ${socket.id} left topic ${socket.myTopic}`)
      }

      socket.join(topic)
      socket.myTopic = topic
      logger.info(`Socket ${socket.id} joined topic ${topic}`)

      // אם אין היסטוריה — ניצור מערך ריק
      if (!chatHistory[topic]) chatHistory[topic] = []

      // שולחים למשתמש את ההיסטוריה
      socket.emit('chat-history', chatHistory[topic])
    })
    socket.on('chat-clear-topic', ({ topic }) => {
    console.log('CLEARING HISTORY FOR TOPIC:', topic)
    chatHistory[topic] = []   // מוחק את כל ההודעות של החדר

      // שולח היסטוריה ריקה רק למי שביקש
      socket.emit('chat-history', [])
    })

    // קבלת הודעה חדשה
    socket.on('chat-send-msg', msg => {
      const topic = socket.myTopic
      if (!topic) return

      // שמירה בהיסטוריה
      if (!chatHistory[topic]) chatHistory[topic] = []
      chatHistory[topic].push(msg)

      // שידור לכל מי שבחדר
      gIo.to(topic).emit('chat-add-msg', msg)
    })
  })
}



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

async function _getUserSocket(userId) {
  const sockets = await gIo.fetchSockets()
  return sockets.find(s => s.userId === userId)
}

console.log('LOADED SOCKET SERVICE')
