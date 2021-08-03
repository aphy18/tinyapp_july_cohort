const express = require("express");
const app = express();
const port = 8080;
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls",(req,res) => {
  res.redirect("/urls/:shortURL");
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase };
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

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const shortURL = req.params.shortURL;
  console.log(longURL);
  const templateVars = { shortURL, longURL};
  res.render("urls_show", templateVars);
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



