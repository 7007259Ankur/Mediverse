// server/video-socket.js
const setupVideoSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🎥 Video Socket connected:', socket.id);

    socket.on('room:join', ({ email, room }) => {
      socket.join(room);
      console.log(`📥 ${email} joined room ${room}`);
      socket.to(room).emit('user:joined', { email, id: socket.id });
    });

    socket.on('user:call', ({ to, offer }) => {
      socket.to(to).emit('incomming:call', { from: socket.id, offer });
    });

    socket.on('call:accepted', ({ to, ans }) => {
      socket.to(to).emit('call:accepted', { from: socket.id, ans });
    });

    socket.on('peer:nego:needed', ({ to, offer }) => {
      socket.to(to).emit('peer:nego:needed', { from: socket.id, offer });
    });

    socket.on('peer:nego:done', ({ to, ans }) => {
      socket.to(to).emit('peer:nego:final', { from: socket.id, ans });
    });

    socket.on('disconnect', () => {
      console.log('🔌 Video Socket disconnected:', socket.id);
    });
  });
  

  console.log('✅ Socket.IO video server initialized');
};

module.exports = setupVideoSocket;