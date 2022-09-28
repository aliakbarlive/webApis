class SocketInit {
  constructor(io) {
    this.socketIo = io;
    this.socketIo.on('connection', (socket) => {
      socket.join(socket.userId);
    });
    SocketInit._instance = this;
  }
  static get() {
    return SocketInit._instance;
  }
  emit(event, data) {
    this.socketIo.emit(event, data);
  }
  privateMessage(to, event, data) {
    this.socketIo.to(to).emit(event, data);
  }
  getConnectedUsers() {
    const users = [];
    for (let [id, socket] of this.socketIo.of('/').sockets) {
      users.push({
        socketId: id,
        userId: socket.userId,
        user: socket.user,
      });
    }
    return users;
  }
}

module.exports = SocketInit;
