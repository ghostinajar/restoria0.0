import isValidCommand from './utils/isValidCommand.js';

const setupSocket = (io) => {
    io.on('connection', (socket) => {
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }
      const user = socket.request.session.passport.user;
      console.log(`User connected: ${user.username}`);
      socket.on('user command', (msg) => {
        if(!isValidCommand(msg))
        {socket.emit('room echo', 'Invalid command');
          return;
        }
        io.emit('room echo', msg);
      });
      socket.on('disconnect', () => {
        console.log(`User connected: ${user.username}`);
      });
    });
  };
  
  export default setupSocket;
  