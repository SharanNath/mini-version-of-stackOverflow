const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
//Bringing all the routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const questions = require("./routes/api/question");

const app = express();

//Middleware for body-parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//MongoDB configuration
const db = require("./setup/myurl").mongoURL;

//Connection to database

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Configuration for JWT strategy
require("./strategies/jsonwtStrategies")(passport);

//just for testing purpose
app.get("/", (req, res) => res.send("Hey its running"));
//

//ACTUAL Routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/questions", questions);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running at ${port}`));
