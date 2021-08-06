const { generateRandomString, isEmailBeingUsed, urlsForUser} = require('./helpers.js');

const express = require("express");
const app = express();
const port = 8080;
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['abcdefghijklmnopqr123456789'],
}));

const urlDatabase = {};
const users = {};

app.get("/urls", (req,res) => {
  const userID = req.session.userID;
  if (!userID) {
    res.status(400).send("Error,you have to log in to have access");
    return;
  }
  const user = users[userID];
  const templateVars = {
    urls: urlsForUser(userID,urlDatabase),
    user
  };

  res.render("urls_index", templateVars);
});

app.post("/urls",(req,res) => {
  res.redirect("/urls/:shortURL");
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  if (!userID) {
    res.status(404).send("Error,you have to log in to have access");
    return;
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req,res) => {
  const userID = req.session.userID;
  const shortURL = generateRandomString(7);
  const longURL = req.body.longURL;

  if (!longURL) {
    res.status(400).send("Error, please enter a valid longURL.");
  } else {
    urlDatabase[shortURL] = {
      longURL,
      userID
    };
  }
  res.redirect("/urls");
});

app.get("/register", (req,res) => {
  const user = null;
  const templateVars = { user };
  res.render("register", templateVars);
});

app.post("/register", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userID = generateRandomString(7);
  
  if (email === "" || password === "") {
    res.status(400).send("Error, the email and password fields are required to register");
    return;
  } else if (isEmailBeingUsed(users, email)) {
    res.status(400).send("Error, email is already in use");
    return;
  } else {
    users[userID] = {
      id: userID,
      email,
      password: hashedPassword
    };
    req.session.userID = userID;
    res.redirect("/login");
  }
});

app.get("/login", (req,res) => {

  const userID = req.session.userID;
  if (userID) {
    return res.redirect("/urls");
  }
  const templateVars = { user: users[userID] };
  res.render("login",templateVars);
});

app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = isEmailBeingUsed(users, email);

  if (!email || !password) {
    res.status(404).send("Error, the email and password fields are required to login");
    return;
  } else if (!user) {
    res.status(404).send("Error, this email isn't registered.");
    return;
  }
  console.log("password ------->", password);
  console.log("user ------>", user);
  if (bcrypt.compare(password, user.password)) {
    req.session.userID = user.id;
    res.redirect("/urls");
  } else {
    res.status(404).send("The password you've entered is incorrect.");
  }
});

app.get("/logout", (req,res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, userID, user };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL; // params => get request => url, post request => form
  const newLongURL = req.body.longURL; // body comes from input content
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const user = users[userID];
  if (!user) {
    res.status(400).send("Error,you have to log in to have access");
  }
  
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



