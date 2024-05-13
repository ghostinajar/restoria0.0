import isValidCommand from './utils/isValidCommand.js';

const setupSocket = (io) => {
    io.on('connection', (socket) => {
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }
      const user = socket.request.session.passport.user;
      console.log(`a user connected: ${user.username}`);
      socket.on('chat message', (msg) => {
        if(isValidCommand(msg))
        {io.emit('chat message', msg);}
        else {
          io.emit('chat message', 'Invalid command', user.username);
        };
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  };
  
  export default setupSocket;
  