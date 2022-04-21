const express = require("express");

const cookieParser = require("cookie-parser");

const sassMiddleware = require("node-sass-middleware");

const app = express();

const port = 8000;
//use express router

const expressLayouts = require("express-ejs-layouts");

const db = require("./config/mongoose");

const session = require("express-session");

const passport = require("passport");

const passportLocal = require("./config/passport-local-strategy");

const MongoStore = require("connect-mongo")(session);

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "codial",
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongodb setup");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server: ${err}`);
  }
  console.log(`Running on port:${port}`);
});
