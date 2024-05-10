import { join } from 'node:path';

const setupRoutes = (app, __dirname) => {
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public/index.html'));
  });

  app.get('/game_terminal', (req, res) => {
    res.sendFile(join(__dirname, 'public/game_terminal.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(join(__dirname, 'public/login.html'));
  });

  app.get('/register', (req, res) => {
    res.sendFile(join(__dirname, 'public/register.html'));
  });
  
};

export default setupRoutes;
