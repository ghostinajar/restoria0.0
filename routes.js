// routes
import Bug from "./model/classes/Bug.js";
import passport from "passport";
import validCommandWords from "./constants/validCommandWords.js";
import HELP from "./constants/HELP.js";
import logger from "./logger.js";
import createUser from "./util/createUser.js";
import formatDate from "./util/formatDate.js";


const setupRoutes = (app, __dirname) => {
  app.get("/", (req, res, next) => {
    const cheatsheet = HELP.CHEATSHEET;
    res.render("index", { cheatsheet: cheatsheet });
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
    const cheatsheet = HELP.CHEATSHEET;
    res.render("login", { cheatsheet: cheatsheet });
  });

  app.get("/updates", async (req, res, next) => {
    try {
      // Get fixed bugs (updates)
      const fixedBugs = await Bug.find(
        { isFixed: true },
        { date: 1, description: 1, _id: 0 }
      ).sort({ date: -1 });

      // Format updates same way as updates.ts
      const formattedUpdates = fixedBugs.map((bug) => ({
        date: formatDate(bug.date),
        content: bug.description
      }));

      // Get unfixed bugs
      const unfixedBugs = await Bug.find(
        { isFixed: false, isValid: true },
        { description: 1, _id: 0 }
      ).sort({ date: 1 });

      // Map to just the descriptions
      const bugDescriptions = unfixedBugs.map(bug => bug.description);

      res.render("updates", { 
        updates: formattedUpdates, 
        bugs: bugDescriptions 
      });
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/login/password",
    passport.authenticate("local", {
      successRedirect: "/game_terminal",
      failureRedirect: "/",
    })
  );

  app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  app.get("/register", (req, res, next) => {
    const cheatsheet = HELP.CHEATSHEET;
    res.render("register", { cheatsheet: cheatsheet });
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

      // handle createUser failure
      if (newUser.content) {
        logger.error(`createUser rejected for reason: ${newUser.content}}`);
        return res.status(400).render("register", {
          cheatsheet: HELP.CHEATSHEET,
          errorMessage: newUser.content, 
        });
      }

      if (!newUser) {
        logger.error(
          `routes couldn't create user with ${JSON.stringify(userData)}`
        );
        return res.status(400).render("register", {
          cheatsheet: HELP.CHEATSHEET,
          errorMessage: `Sorry, we couldn't create your account. We logged the error and will investigate it.` 
        });
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

      req.login(sessionUser, function (err) {
        if (err) {
          logger.error(`Error in req.login: ${err.message}`);
          return next(err);
        }
        res.redirect("/game_terminal");
      });
    } catch (err) {
      logger.error(err);
      res.status(500).send("Internal server error");
    }
  });
};

export default setupRoutes;
