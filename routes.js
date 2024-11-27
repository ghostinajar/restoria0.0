// routes
import passport from "passport";
import validCommandWords from "./constants/validCommandWords.js";
import logger from "./logger.js";
import createUser from "./commands/createUser.js";
import worldEmitter from "./model/classes/WorldEmitter.js";

const setupRoutes = (app, __dirname) => {
  app.get("/", (req, res, next) => {
    res.render("index");
  });

  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  };

  app.get("/game_terminal", isAuthenticated, (req, res, next) => {
    res.render("game_terminal", { validCommandWords: validCommandWords });
  });

  app.get("/login", (req, res, next) => {
    res.render("login");
  });

  app.post("/login/password", passport.authenticate("local", {
      successRedirect: "/game_terminal",
      failureRedirect: "/",
  }));

  app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  app.get("/register", (req, res, next) => {
    res.render("register");
  });

  app.post("/register", async function (req, res, next) {
    try {
      const userData = {
        username: req.body.name.toLowerCase(),
        name: req.body.name,
        password: req.body.password,
        pronouns: req.body.pronouns,
        job: req.body.job,
      };
      if (!userData) {
        logger.error(
          `routes couldn't collect userData from req.body: ${JSON.stringify(
            req.body
          )}`
        );
        return;
      }

      const newUser = await createUser(userData);
      if (newUser.content) {
        logger.error(`createUser rejected for reason: ${newUser.content}}`);
        worldEmitter.emit(`message`, newUser);
        return;
      }
      logger.debug(`routes got newUser: ${JSON.stringify(newUser)}`);
      if (!newUser) {
        logger.error(
          `routes couldn't create user with ${JSON.stringify(userData)}`
        );
        return;
      }
      const sessionUser = {
        _id: newUser._id,
        username: newUser.username,
      };
      if (!sessionUser) {
        logger.error(
          `routes couldn't create sessionUser with ${JSON.stringify(userData)}`
        );
        return;
      }
      logger.debug(`routes made sessionUser: ${JSON.stringify(sessionUser)}`);

      req.login(sessionUser, function (err) {
        if (err) {
          logger.error(`Error in req.login: ${err.message}`)
          return next(err);}
        res.redirect("/game_terminal");
      });
    } catch (err) {
      logger.error(err);
      res.status(500).send("Internal server error");
    }
  });
};

export default setupRoutes;
