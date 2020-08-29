const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const flash = require("express-flash");
const expressSanitizer = require("express-sanitizer");

require("./Config/db");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(expressSanitizer());
app.use(morgan("dev"));
app.use(flash());
app.use(
  require("express-session")({
    secret: "FGUHODHFGODFIGJODFGOIJRFGOIRJG",
    resave: false,
    saveUninitialized: false,
  })
);
//these are session authentification middleware for passport
require("./Config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", ".ejs");
app.use(express.static("public"));

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./Routes/index.js"));
app.use("/users", require("./Routes/user.js"));
app.use("/blog", require("./Routes/blog.js"));

//? Common error handler
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(require("./Handlers/Error"));

app.listen(3000, () => {
  console.log("you are now active on the port 3000");
});
