const express = require("express");
const app = express();
const jsoning = require("jsoning");
let ejs = require("ejs");

let db = new jsoning("db.json");


var pages = [];


//********************************************************************************************************************************************************************************************************************************************************************

app.use(express.static("public"));
app.set("view engine", ejs);

function checkHttps(req, res, next){
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps);

app.get("/", (request, response) => {
  response.render(__dirname + "/views/index.ejs");
});

app.get("/s", (request,response) => {
  response.render()
})




const listener = app.listen(process.env.PORT, () => {
  if (!db.has("List-Of-Sites")){
    db.set("List-Of-Sites", []);
  }
});
