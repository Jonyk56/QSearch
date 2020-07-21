const express = require("express");
const app = express();
const jsoning = require("jsoning");
const fetch = require("node-fetch");
let ejs = require("ejs");

let db = new jsoning("db.json"); // We can interchange with endb for production :D

var pages = []; //used for regex hits
var urls = {};
var tags = {};
var SiteDatas = {};

//********************************************************************************************************************************************************************************************************************************************************************

app.use(express.static("public"));
app.set("view engine", ejs);

function checkHttps(req, res, next) {
  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.set("partials", "views/partials");

app.all("*", checkHttps);

app.get("/", (request, response) => {
  response.render(__dirname + "/views/index.ejs");
});

app.get("/s", (request, response) => {
  let Sites = [];
  let matches = {};
  if (
    request.query.q.slice(0, 7) == "http://" ||
    request.query.q.slice(0, 8) == "https://"
  ) {
    response.redirect(request.query.q);
  }
  let Sdata = db.get("List-Of-Sites");
  Sites = Object.keys(Sdata);
  Sites.forEach(Site => {
    let s_ = Sdata[Site];
    let curl = s_.URL
    
    
  })
});

app.get("/AddSite", (request, response) => {
  response.render(__dirname + "/views/AddSite.ejs");
});

app.get("/submit", (request, response) => {
  let data = db.get("List-Of-Sites");
  data[request.query.name] = {
    TAGS: request.query.tags.split(","),
    URL: request.query.url
  };
  db.set("List-Of-Sites", data);
});

const listener = app.listen(process.env.PORT, () => {
  if (!db.has("List-Of-Sites")) {
    db.set("List-Of-Sites", {});
  }
  let list = db.get("List-Of-Sites");
  list = Object.entries(list); //Split lists up in a very odd fashion
  for (const [SiteName, SiteData] of list) {
    pages.push(SiteName);
    urls[SiteName] = SiteData.URL;
    tags[SiteName] = SiteData.TAGS;
  }
});
