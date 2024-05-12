import isValidCommand from './utils/isValidCommand.js';

const setupSocket = (io) => {
    io.on('connection', (socket) => {
      console.log(`a user connected`);
      socket.on('chat message', (msg) => {
        if(isValidCommand(msg))
        {io.emit('chat message', msg)};
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  };
  
  export default setupSocket;
  