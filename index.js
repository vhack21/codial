const express = require("express");

const app = express();

const port = 8000;
//use express router

const db = require("./config/mongoose");

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.static("./assets"));

app.use("/", require("./routes/index"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server: ${err}`);
  }
  console.log(`Running on port:${port}`);
});
