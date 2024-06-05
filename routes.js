import passport from 'passport';
import bcrypt from 'bcrypt';
import User from './model/classes/User.js';
import validCommandWords from './constants/validCommandWords.js';
import logger from './logger.js';
import isValidName from './util/isValidName.js';
import checkDuplicateName from './model/classes/checkDuplicateName.js'
import Name from './model/classes/Name.js'; 

const setupRoutes = (app, __dirname) => {

  app.get('/', (req, res, next) => {
    res.render('index');
  });   

  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  app.get('/game_terminal', isAuthenticated, (req, res, next) => {
    res.render('game_terminal', { validCommandWords: validCommandWords });
  });

  app.get('/login', (req, res, next) => {
    res.render('login');
  });

  app.post('/login/password', passport.authenticate('local', {
    successRedirect: '/game_terminal',
    failureRedirect: '/login'
  }));

  app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  app.get('/register', (req, res, next) => {
    res.render('register');
  });

  app.post('/register', async function(req, res, next) {
    try {
      const { username, password } = req.body;

      // Verify username and password exist
      if (!username || !password) {
        return res.status(400).send('Username and password are required');
      };

      // Validate username string
      if (!isValidName(username)) {
        return res.status(400).send('Username must only contain letters and have a maximum length of 18 characters');
      }

      // Validate password strength
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).send('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      }

      // Prevent duplicate usernames
      const nameIsTaken = await checkDuplicateName(username);
      if (nameIsTaken) {
        return res.status(400).send(`That name is taken.`);
      };
      const nameToRegister = new Name({ name: username.toLowerCase() });
      await nameToRegister.save();
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const lowercased = req.body.username.toLowerCase();
      const newUser = new User({
        displayName: req.body.username,
        username: lowercased,
        password: hashedPassword,
        salt: salt,
        location: JSON.parse(process.env.WORLD_RECALL),
      });

      await newUser.save();
      logger.info(`User Registered: ${newUser.username}`);

      const sessionUser = {
        _id: newUser._id,
        username: newUser.username
      };
      //logger.debug(`sessionUser: ${JSON.stringify(sessionUser)}`)

      req.login(sessionUser, function(err) {
        if (err) { return next(err); }
        res.redirect('/game_terminal');
      });

    } catch (err) {
      logger.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
};

export default setupRoutes;