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

const isEmailBeingUsed =  (users, email) => {
  for (let id in users) {
    if (email === users[id].email) {
      return users[id];
    }
  }
  return false;
};


const urlDatabase = {
  "b2xVn2": {
    longURL:"http://www.lighthouselabs.ca"
  },
  "9sm5xK": {
    longURL:"http://www.google.com"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

console.log("testing function",isEmailBeingUsed(users,"user2@example.com"));

app.get("/urls", (req,res) => {
  const userID = req.cookies["userID"];
  const user = users[userID];
  if (!user) {
    return res.redirect("/login");
  }
  const templateVars = { urls: urlDatabase, user: userID, email: user.email };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.post("/urls",(req,res) => {
  res.redirect("/urls/:shortURL");
});

app.get("/urls/new", (req, res) => {
  const user = req.cookies["userID"];
  const email = req.cookies["email"];
  const templateVars = { urls: urlDatabase, users: users, user: user, email};
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

app.get("/register", (req,res) => {
  const user = req.cookies["userID"];
  const email = req.cookies["email"];
  const templateVars = { urls: urlDatabase, users, user, email };
  res.render("register", templateVars);
});

app.post("/register", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString(7);

  if (email === "" || password === "") {
    return res.status(400).send("Error, the email and password fields are required to register");
  } else if (isEmailBeingUsed(users, email)) {
    return res.status(400).send("Error, email is already in use");
  } else {
    users[userID] = {
      id: userID,
      email,
      password
    };
    console.log('-----------', users);
    res.cookie("userID", userID);
    res.cookie("email", email);
    res.redirect("/urls");
  }
 
});

app.get("/login", (req,res) => {
  const user = req.cookies["userID"];
  if (user) {
    return res.redirect("/urls");
  }
  // const email = req.cookies["email"];
  // const templateVars = { urls: urlDatabase, users, user, email };
  res.render("login");
});

app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = isEmailBeingUsed(users, email);
  console.log('------------o', users);
  console.log('------------>', user);
 
  if (!email || !password) {
    return res.status(404).send("Error, the email and password fields are required to login");
  } else if (!user) {
    return res.status(404).send("Error, this email isn't registered.");
  }
  
  res.cookie("userID", user.id);
  res.redirect("/urls");
 
});

app.get("/logout", (req,res) => {
  res.clearCookie("userID", users.userID);
  res.clearCookie("email", users.email);
  console.log("users-email",users.email);
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  const user = req.cookies["userID"];
  const email = req.cookies["email"];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  console.log("get: shortURL",shortURL);
  console.log(longURL);
  const templateVars = { shortURL, longURL, users, user, email };
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



