const express = require("express");
const app = express();
const jsoning = require("jsoning");
const fetch = require("node-fetch");
let ejs = require("ejs");

let db = new jsoning(process.cwd() + "/db.json"); // We can interchange with endb for production :D

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
  Sites = Object.keys(Sdata);
  let urlsIndexed = [];
  Sites.forEach(Site => {
    let s_ = Sdata[Site];
    let d_ = s_
    d_.hits = 0
    s_.TAGS.forEach(tag => {
      if (
        request.query.q.indexOf(tag.toLowerCase().trim()) >= 0 
      ) {
        d_.hits++
      }
    });
    if (d_.hits > 0){
        urlsIndexed.push(d_);
    }
  });
  let uris = [];
  response.render(__dirname + "/views/search.ejs", {urlsIndexed:JSON.stringify(urlsIndexed), question:request.query.q});
});

/*^ that should index all urls with the tag the database was given*/


app.get("/AddSite", (request, response) => {
  response.render(__dirname + "/views/AddSite.ejs");
});

app.get("/submit", (request, response) => {
  let data = db.get("List-Of-Sites");
  console.log(request.query.tags)
  data[request.query.name] = {
    TAGS: request.query.tags.toLowerCase().split(","),
    URL: request.query.url
  };
  console.log(data)
  db.set("List-Of-Sites", data);
  response.redirect("/")
});

const listener = app.listen(3000, () => {
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

