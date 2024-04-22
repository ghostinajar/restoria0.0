import { join } from 'node:path';

const setupRoutes = (app, __dirname) => {
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public/index.html'));
  });
};

export default setupRoutes;
