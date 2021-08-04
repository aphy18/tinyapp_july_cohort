const express = require("express");
const app = express();
const port = 8080;
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const generateRandomString = length => {
  let r = Math.random().toString(36).substring(length);
  return r;
};

const urlDatabase = {
  "b2xVn2": {
    longURL:"http://www.lighthouselabs.ca"
  },
  "9sm5xK": {
    longURL:"http://www.google.com"
  }
};

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.post("/urls",(req,res) => {
  res.redirect("/urls/:shortURL");
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req,res) => {
  const shortURL = generateRandomString(7);
  const longURL = req.body.longURL;

  if (!longURL) {
    res.status(400).send("Error, please enter a valid longURL.");
  } else {
    urlDatabase[shortURL] = {
      longURL,
    };
    console.log(urlDatabase);
  }
  res.redirect("/urls");
});

app.post("/login", (req,res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie("username",req.body.username);
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  console.log("get: shortURL",shortURL);
  console.log(longURL);
  const templateVars = { shortURL, longURL, username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL; // params => get request => url, post request => form
  const newLongURL = req.body.longURL; // body comes from input content
  console.log('req-params:',shortURL);
  console.log('longURL', newLongURL);
  urlDatabase[shortURL].longURL = newLongURL;
  console.log('updated urldatabase',urlDatabase);
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



