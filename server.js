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

app.get("/search", (request, response) => {
  let Sites = [];
  let matches = {};
  if (
    request.query.q.slice(0, 7) == "http://" ||
    request.query.q.slice(0, 8) == "https://"
  ) {
    response.redirect(request.query.q);
  }
  let Sdata = db.get("List-Of-Sites");
  //console.log(Sdata)
  Sites = Object.keys(Sdata);
  let urlsIndexed = [];
  console.log(Sites)
  Sites.forEach(Site => {
    //console.log(Site)
    let s_ = Sdata[Site];
    s_.TAGS.forEach(tag => {
      //console.log(tag)
      //console.log(request.query.q)
      if (
        request.query.q.indexOf(tag.trim()) > 0 &&
        urlsIndexed[urlsIndexed.length - 1] !== s_.url
      ) {
        console.log(s_.URL)
        urlsIndexed.push(s_);
      }
    });
  });
  response.render(__dirname + "/views/search.ejs", {urlsIndexed:urlsIndexed});
});

/*^ that should index all urls with the tag the database was given*/


app.get("/AddSite", (request, response) => {
  response.render(__dirname + "/views/AddSite.ejs");
});

app.get("/submit", (request, response) => {
  let data = db.get("List-Of-Sites");
  data[request.query.name] = {
    TAGS: request.query.tags.split(","),
    URL: request.query.url
  };
  console.log(data)
  db.set("List-Of-Sites", data);
  response.redirect("/")
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
