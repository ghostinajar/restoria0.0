import passport from 'passport';
import bcrypt from 'bcrypt';
import User from './model/User.js';

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
    res.render('game_terminal', { userName: req.username });
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

      // Check for missing username or password
      if (!username || !password) {
        return res.status(400).send('Username and password are required');
      };
      
      // Validate the password strength
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).send('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      }

      // Check for existing user
      const existingUser = await User.findOne({ username  });
      if (existingUser) {
        console.log('Username already exists');
        return res.status(400).send(`Error creating user.`);
      };
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        salt: salt
      });

      await newUser.save();

      const user = {
        id: newUser._id,
        username: newUser.username
      };

      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/game_terminal');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
};

export default setupRoutes;
