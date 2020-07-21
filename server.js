const express = require("express");
const app = express();

let ejs = require("ejs");

app.use(express.static("public"));
app.set("view engine", ejs);
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render(__dirname + "/views/index.ejs");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
